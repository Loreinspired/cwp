import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const NAV_LINKS = [
    { label: 'About', to: '/about' },
    { label: 'Services', to: '/services' },
    { label: 'Network', to: '/network' },
    { label: 'Precedent', to: '/precedent' },
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
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                    <svg width="36" height="34" viewBox="0 0 40 38" fill="none" style={{ flexShrink: 0 }}>
                        <path d="M18 5 C18 5 7 5 7 13.5 C7 22 18 22 18 17" stroke="var(--cwp-white)" strokeWidth="3" strokeLinecap="round" />
                        <path d="M15.5 17 L19 29 L23 18.5 L27 29 L30.5 17" stroke="var(--cwp-white)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M30.5 6 L30.5 20" stroke="var(--cwp-white)" strokeWidth="3" strokeLinecap="round" />
                        <path d="M30.5 6 C30.5 6 38.5 6 38.5 13 C38.5 20 30.5 20 30.5 20" stroke="var(--cwp-white)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
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

                    <button
                        onClick={toggleTheme}
                        title={isDark ? 'Switch to day mode' : 'Switch to night mode'}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '5px',
                            color: isOverridden ? 'var(--cwp-accent)' : 'var(--cwp-muted)',
                            padding: '4px', transition: 'color 0.2s', position: 'relative',
                        }}
                    >
                        {isDark ? <Sun size={15} /> : <Moon size={15} />}
                        {isOverridden && <span style={{ position: 'absolute', top: 0, right: 0, width: '5px', height: '5px', borderRadius: '50%', background: 'var(--cwp-accent)' }} />}
                    </button>

                    {/* Primary CTA with Hover Swap */}
                    <Link
                        to="/contact"
                        className="contact-cta"
                        style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'var(--cwp-white)',
                            color: 'var(--cwp-void)',
                            borderRadius: '2px',
                            textDecoration: 'none',
                            overflow: 'hidden',
                            width: '150px', 
                            height: '36px'
                        }}
                    >
                        <span className="cta-text-primary" style={{
                            position: 'absolute',
                            fontSize: '9px',
                            fontWeight: 700,
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            transition: 'transform 0.3s ease, opacity 0.3s ease',
                        }}>
                            Contact
                        </span>
                        <span className="cta-text-hover" style={{
                            position: 'absolute',
                            fontSize: '8px',
                            fontWeight: 700,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: 'var(--cwp-void)',
                            transform: 'translateY(20px)',
                            opacity: 0,
                            transition: 'transform 0.3s ease, opacity 0.3s ease',
                            textAlign: 'center',
                            lineHeight: '1.2'
                        }}>
                            Powered by<br />CWI SLM
                        </span>
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
                    top: '64px', left: 0, right: 0,
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
                            display: 'block', padding: '14px 0', fontSize: '12px', fontWeight: 600,
                            letterSpacing: '0.18em', textTransform: 'uppercase',
                            color: location.pathname.startsWith(to) ? 'var(--cwp-white)' : 'var(--cwp-muted)',
                            borderBottom: '1px solid var(--cwp-border)',
                        }}
                    >
                        {label}
                    </Link>
                ))}
                
                {/* Mobile CTA (Explicit text since hover doesn't work) */}
                <Link
                    to="/contact"
                    style={{
                        display: 'block', padding: '14px 0', fontSize: '12px', fontWeight: 600,
                        letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--cwp-accent)',
                        borderBottom: '1px solid var(--cwp-border)',
                    }}
                >
                    Contact (CWI Desk)
                </Link>

                <button
                    onClick={toggleTheme}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px',
                        fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em',
                        textTransform: 'uppercase', color: 'var(--cwp-muted)',
                    }}
                >
                    {isDark ? <Sun size={14} /> : <Moon size={14} />}
                    {isDark ? 'Day mode' : 'Night mode'}
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

                /* Desktop Hover Animation Logic */
                .contact-cta:hover .cta-text-primary {
                    transform: translateY(-20px);
                    opacity: 0;
                }
                .contact-cta:hover .cta-text-hover {
                    transform: translateY(0);
                    opacity: 1;
                }
            `}</style>
        </>
    );
}
