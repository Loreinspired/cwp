import React, { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
    const location = useLocation();
    const mainRef = useRef(null);

    // ── Page fade-in on route change ──────────────────────────────────────
    useEffect(() => {
        const el = mainRef.current;
        if (!el) return;
        // Re-trigger the page-enter animation on every route change
        el.classList.remove('cwp-page');
        // Force reflow so the class removal takes effect
        void el.offsetHeight;
        el.classList.add('cwp-page');

        // Scroll to top on route change
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [location.pathname]);

    // ── Scroll-reveal (IntersectionObserver) ─────────────────────────────
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target); // animate once only
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );

        // Small delay so route change renders first
        const timer = setTimeout(() => {
            const els = document.querySelectorAll('.cwp-reveal');
            els.forEach((el) => observer.observe(el));
        }, 50);

        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, [location.pathname]);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main ref={mainRef} style={{ flex: 1 }} className="cwp-page">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
