import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Returns the theme that should be active right now based purely on local time.
 * Dark: 18:00 – 05:59  |  Light: 06:00 – 17:59
 */
function getAutoTheme() {
    const hour = new Date().getHours();
    return hour >= 18 || hour < 6 ? 'dark' : 'light';
}

/**
 * Returns the timestamp (ms) of the LAST threshold (6am or 6pm) that has passed.
 * Used to determine whether a stored override is still valid.
 */
function lastThresholdMs() {
    const now = new Date();
    const hour = now.getHours();
    const base = new Date(now);
    base.setSeconds(0);
    base.setMilliseconds(0);
    base.setMinutes(0);

    if (hour >= 18) {
        base.setHours(18); // threshold was 6 PM today
    } else if (hour >= 6) {
        base.setHours(6);  // threshold was 6 AM today
    } else {
        // It's between midnight and 5:59am — last threshold was 6 PM yesterday
        base.setDate(base.getDate() - 1);
        base.setHours(18);
    }
    return base.getTime();
}

const STORAGE_KEY = 'cwp_theme_override';

function loadOverride() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const { theme, setAt } = JSON.parse(raw);
        // Discard the override if it was set before the last natural threshold
        if (setAt < lastThresholdMs()) {
            localStorage.removeItem(STORAGE_KEY);
            return null;
        }
        return theme;
    } catch {
        return null;
    }
}

function saveOverride(theme) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme, setAt: Date.now() }));
}

function clearOverride() {
    localStorage.removeItem(STORAGE_KEY);
}

// ─── Context ────────────────────────────────────────────────────────────────

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const [override, setOverride] = useState(() => loadOverride());
    const theme = override ?? getAutoTheme();
    const isOverridden = override !== null;

    // Apply data-theme to <html> whenever theme changes
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    // Poll every minute so the theme auto-switches at 6am/6pm even without a page reload
    useEffect(() => {
        const id = setInterval(() => {
            // If an override exists but has now expired, clear it
            const storedOverride = loadOverride();
            setOverride(storedOverride);
        }, 60_000);
        return () => clearInterval(id);
    }, []);

    const toggleTheme = useCallback(() => {
        const next = theme === 'dark' ? 'light' : 'dark';
        saveOverride(next);
        setOverride(next);
    }, [theme]);

    const resetToAuto = useCallback(() => {
        clearOverride();
        setOverride(null);
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, isOverridden, toggleTheme, resetToAuto }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
    return ctx;
}
