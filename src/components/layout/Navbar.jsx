import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const NAV_LINKS = [
    { label: 'About', to: '/about' },
    { label: 'Services', to: '/services' },
    { label: 'Network', to: '/network' },
    { label: 'Precedent', to: '/precedent' },
    { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const { theme, isOverridden, toggleTheme } = useTheme();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close menu on route change
    useEffect(() => setMenuOpen(false), [location.pathname]);

    const isDark = theme === 'dark';

    return (
        <>
            <nav
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 100,
                    padding: '0 40px',
                    height: '64px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: scrolled ? 'var(--cwp-nav-bg)' : 'transparent',
                    borderBottom: scrolled ? '1px solid var(--cwp-border)' : '1px solid transparent',
                    backdropFilter: scrolled ? 'blur(16px)' : 'none',
                    transition: 'all 0.35s ease',
                }}
            >
                {/* Logo */}
                <Link
                    to="/"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        textDecoration: 'none',
                    }}
                >
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <rect x="0" y="0" width="28" height="28" fill="none" stroke="var(--cwp-white)" strokeWidth="1.5" />
                        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="var(--cwp-white)" fontSize="10" fontWeight="700" fontFamily="Inter, sans-serif" letterSpacing="0.05em">CWP</text>
                    </svg>
                    <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--cwp-white)' }}>
                        Clearwater Partners
                    </span>
                </Link>

                {/* Desktop Links */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="desktop-nav">
                    {NAV_LINKS.map(({ label, to }) => {
                        const active = location.pathname.startsWith(to);
                        return (
                            <Link
                                key={to}
                                to={to}
                                style={{
                                    fontSize: '10px',
                                    fontWeight: 600,
                                    letterSpacing: '0.18em',
                                    textTransform: 'uppercase',
                                    color: active ? 'var(--cwp-white)' : 'var(--cwp-muted)',
                                    borderLeft: active ? '2px solid var(--cwp-accent)' : '2px solid transparent',
                                    paddingLeft: '8px',
                                    transition: 'color 0.2s, border-color 0.2s',
                                }}
                            >
                                {label}
                            </Link>
                        );
                    })}

                    {/* Theme toggle */}
                    <button
                        onClick={toggleTheme}
                        title={isDark ? 'Switch to day mode' : 'Switch to night mode'}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            color: isOverridden ? 'var(--cwp-accent)' : 'var(--cwp-muted)',
                            padding: '4px',
                            transition: 'color 0.2s',
                            position: 'relative',
                        }}
                    >
                        {isDark ? <Sun size={15} /> : <Moon size={15} />}
                        {isOverridden && (
                            <span style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: '5px',
                                height: '5px',
                                borderRadius: '50%',
                                background: 'var(--cwp-accent)',
                            }} />
                        )}
                    </button>

                    <Link
                        to="/contact"
                        style={{
                            fontSize: '9px',
                            fontWeight: 700,
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            padding: '8px 18px',
                            background: 'var(--cwp-white)',
                            color: 'var(--cwp-void)',
                            transition: 'opacity 0.2s',
                        }}
                    >
                        Intelligence Desk
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setMenuOpen(o => !o)}
                    className="mobile-toggle"
                    style={{ color: 'var(--cwp-white)', padding: '4px' }}
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                >
                    {menuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </nav>

            {/* Mobile Drawer */}
            <div
                style={{
                    position: 'fixed',
                    top: '64px',
                    left: 0,
                    right: 0,
                    background: 'var(--cwp-ink)',
                    borderBottom: '1px solid var(--cwp-border)',
                    zIndex: 99,
                    transform: menuOpen ? 'translateY(0)' : 'translateY(-110%)',
                    transition: 'transform 0.3s ease',
                    padding: '24px 40px 32px',
                }}
            >
                {NAV_LINKS.map(({ label, to }) => (
                    <Link
                        key={to}
                        to={to}
                        style={{
                            display: 'block',
                            padding: '14px 0',
                            fontSize: '12px',
                            fontWeight: 600,
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            color: location.pathname.startsWith(to) ? 'var(--cwp-white)' : 'var(--cwp-muted)',
                            borderBottom: '1px solid var(--cwp-border)',
                        }}
                    >
                        {label}
                    </Link>
                ))}

                {/* Mobile theme toggle */}
                <button
                    onClick={toggleTheme}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginTop: '20px',
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'var(--cwp-muted)',
                    }}
                >
                    {isDark ? <Sun size={14} /> : <Moon size={14} />}
                    {isDark ? 'Day mode' : 'Night mode'}
                    {isOverridden && (
                        <span style={{
                            fontSize: '9px',
                            letterSpacing: '0.1em',
                            color: 'var(--cwp-accent)',
                            marginLeft: '4px',
                        }}>
                            (manual)
                        </span>
                    )}
                </button>
            </div>

            <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-toggle { display: none !important; }
        }
      `}</style>
        </>
    );
}
