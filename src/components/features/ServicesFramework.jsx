import React, { useState } from 'react';
import SectionLabel from '../ui/SectionLabel';

const SERVICES = [
    {
        id: 'corporate',
        label: 'Corporate Advisory',
        headline: 'Structuring the Entities That Drive Commerce',
        description:
            'We advise founders, boards, and institutional investors on company formation, governance, share structures, and all stages of corporate lifecycle from incorporation to regulatory wind-down. Our corporate practice operates at the intersection of commercial law and strategic business judgment.',
        capabilities: [
            'Company incorporation and constitution drafting',
            'Shareholders agreement and board governance frameworks',
            'Joint venture structuring and management agreements',
            'Beneficial ownership compliance and CAC filings',
            "Directors' duties and corporate liability advisory",
        ],
    },
    {
        id: 'capital-markets',
        label: 'Capital Markets',
        headline: 'From Private Placement to Public Offering',
        description:
            'Clearwater Partners advises issuers, sponsors, and investors across the full capital markets spectrum. Our practice covers equity and debt transactions, regulatory coordination with the SEC and the Exchange, and the full suite of offer documentation and verification.',
        capabilities: [
            'SEC registration and offer document preparation',
            'Private placement memoranda (PPM) and term sheets',
            'Rights issues and book-build coordination',
            'Bond structuring and trustee arrangements',
            'Post-listing compliance and continuing obligations',
        ],
    },
    {
        id: 'ma',
        label: 'M&A',
        headline: 'Acquisitions Structured for Regulatory Reality',
        description:
            'Successful M&A in multi-regulatory environments requires sequencing. We lead buy-side and sell-side mandates, managing the full process from due diligence to regulatory clearance, across sectors and across borders.',
        capabilities: [
            'Buy-side and sell-side transaction management',
            'Due diligence (legal, regulatory, and title)',
            'Sale and purchase agreements (SPA) and conditions precedent',
            'Regulatory filing and competition authority coordination',
            'Post-acquisition integration and SPA completion mechanics',
        ],
    },
    {
        id: 'regulatory',
        label: 'Regulatory Compliance',
        headline: 'Navigating the Regulatory Stack',
        description:
            'We advise on the full spectrum of Nigerian and regional regulatory compliance obligations — from FIRS transfer pricing and NDPA data protection to CBN licensing and sector-specific regulatory engagements across banking, fintech, energy, and media.',
        capabilities: [
            'Transfer pricing documentation and FIRS engagement',
            'NDPA data protection compliance and DPIAs',
            'CBN and SEC licence applications and renewals',
            'FRCN, NCC, NERC, and sector-specific regulatory advisory',
            'AML/CFT framework design and board compliance training',
        ],
    },
    {
        id: 'disputes',
        label: 'Dispute Resolution',
        headline: 'Representation Where It Matters',
        description:
            'Our litigation and arbitration practice spans commercial disputes, regulatory enforcement actions, and real property matters. We operate in federal and state High Courts, the Court of Appeal, and institutional arbitration forums including the LCA and ICC.',
        capabilities: [
            'Commercial litigation in federal and state High Courts',
            'Institutional arbitration (LCA, ICC, ICSID)',
            'Pre-dispute strategy and settlement negotiation',
            'Regulatory enforcement response and FIRS audit management',
            'Injunctive relief and urgent applications',
        ],
    },
];

export default function ServicesFramework({ teaser = false }) {
    const [active, setActive] = useState('corporate');
    const visible = teaser ? SERVICES.slice(0, 3) : SERVICES;
    const current = SERVICES.find(s => s.id === active);

    return (
        <div>
            {/* Tab bar */}
            <div
                style={{
                    display: 'flex',
                    borderBottom: '1px solid var(--cwp-border)',
                    marginBottom: '40px',
                    overflowX: 'auto',
                    scrollbarWidth: 'none',
                }}
                className="services-tabs"
            >
                {visible.map(s => (
                    <button
                        key={s.id}
                        onClick={() => setActive(s.id)}
                        style={{
                            padding: '14px 20px',
                            fontSize: '10px',
                            fontWeight: 600,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: active === s.id ? 'var(--cwp-white)' : 'var(--cwp-muted)',
                            background: 'none',
                            border: 'none',
                            borderBottom: active === s.id ? '2px solid var(--cwp-accent)' : '2px solid transparent',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'color 0.2s',
                            marginBottom: '-1px',
                        }}
                    >
                        {s.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            {current && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }} className="services-content">
                    <div>
                        <SectionLabel light style={{ display: 'block', marginBottom: '12px' }}>{current.label}</SectionLabel>
                        <h3
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: 'clamp(20px, 2.5vw, 28px)',
                                fontWeight: 400,
                                fontStyle: 'italic',
                                color: 'var(--cwp-white)',
                                lineHeight: 1.3,
                                marginBottom: '20px',
                            }}
                        >
                            {current.headline}
                        </h3>
                        <p style={{ fontSize: '13px', color: 'var(--cwp-muted)', lineHeight: 1.8 }}>{current.description}</p>
                    </div>
                    <div>
                        <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--cwp-accent)', marginBottom: '20px' }}>
                            Capabilities
                        </p>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0' }}>
                            {current.capabilities.map((cap, i) => (
                                <li
                                    key={i}
                                    style={{
                                        padding: '12px 0',
                                        borderBottom: '1px solid var(--cwp-border)',
                                        fontSize: '12px',
                                        color: 'var(--cwp-text)',
                                        lineHeight: '1.5',
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '10px',
                                    }}
                                >
                                    <span style={{ color: 'var(--cwp-accent)', fontSize: '10px', marginTop: '3px', flexShrink: 0 }}>—</span>
                                    {cap}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            <style>{`
        .services-tabs::-webkit-scrollbar { display: none; }
        @media (max-width: 700px) {
          .services-content { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </div>
    );
}
