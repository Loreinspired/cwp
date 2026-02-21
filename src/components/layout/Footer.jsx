import React from 'react';
import { Link } from 'react-router-dom';
import NewsletterSignup from '../features/NewsletterSignup';

const COLS = [
    {
        heading: 'Firm',
        links: [
            { label: 'About', to: '/about' },
            { label: 'Services', to: '/services' },
            { label: 'Network', to: '/network' },
            { label: 'Contact', to: '/contact' },
        ],
    },
    {
        heading: 'Alliance',
        links: [
            { label: 'Clearwater Partners (HQ)', to: '/network/clearwater-partners' },
            { label: 'Temidayo Akeredolu & Co.', to: '/network/temidayo-akeredolu' },
        ],
    },
    {
        heading: 'Precedent',
        links: [
            { label: 'All Articles', to: '/precedent' },
            { label: 'For Startups', to: '/precedent/for/startup' },
            { label: 'For Small Business', to: '/precedent/for/small-business' },
            { label: 'For Corporations', to: '/precedent/for/corporate' },
            { label: 'For Individuals', to: '/precedent/for/individual' },
        ],
    },
    {
        heading: 'Contact',
        links: [
            { label: 'Intelligence Desk', to: '/contact' },
            { label: 'New Matter Enquiry', to: '/contact' },
            { label: '66 Bank Road, Ado-Ekiti, Ekiti State', to: '#' },
            { label: 'Ado-Ekiti, Nigeria', to: '#' },
            { label: 'intelligence@cwplegal.africa', to: 'mailto:intelligence@cwplegal.africa' },
        ],
    },
];

export default function Footer() {
    return (
        <>
            {/* Newsletter Band — sitewide capture */}
            <NewsletterSignup />

            <footer
                style={{
                    background: 'var(--cwp-ink)',
                    borderTop: '1px solid var(--cwp-border)',
                    padding: '64px 40px 40px',
                }}
            >
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {/* Top grid */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '48px',
                            marginBottom: '64px',
                        }}
                        className="footer-grid"
                    >
                        {COLS.map(({ heading, links }) => (
                            <div key={heading}>
                                <p
                                    style={{
                                        fontSize: '9px',
                                        fontWeight: 700,
                                        letterSpacing: '0.25em',
                                        textTransform: 'uppercase',
                                        color: 'var(--cwp-accent)',
                                        marginBottom: '20px',
                                    }}
                                >
                                    {heading}
                                </p>
                                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {links.map(({ label, to }) => (
                                        <li key={label}>
                                            <Link
                                                to={to}
                                                style={{
                                                    fontSize: '11px',
                                                    color: 'var(--cwp-muted)',
                                                    letterSpacing: '0.02em',
                                                    transition: 'color 0.2s',
                                                    lineHeight: '1.4',
                                                    textDecoration: 'none',
                                                }}
                                                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--cwp-white)')}
                                                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--cwp-muted)')}
                                            >
                                                {label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Bottom bar */}
                    <div
                        style={{
                            borderTop: '1px solid var(--cwp-border)',
                            paddingTop: '24px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '12px',
                        }}
                    >
                        <span style={{ fontSize: '10px', color: 'var(--cwp-muted)', letterSpacing: '0.08em' }}>
                            © {new Date().getFullYear()} Clearwater Partners. All rights reserved.
                        </span>
                        <span style={{ fontSize: '10px', color: 'var(--cwp-border)', letterSpacing: '0.08em' }}>
                            CWP Alliance Network · Ado-Ekiti · Abuja · Ikoyi
                        </span>
                    </div>
                </div>

                <style>{`
          @media (max-width: 900px) {
            .footer-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
          @media (max-width: 500px) {
            .footer-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
            </footer>
        </>
    );
}
