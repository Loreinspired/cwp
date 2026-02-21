import React from 'react';
import SectionLabel from '../components/ui/SectionLabel';
import AllianceNetwork from '../components/features/AllianceNetwork';
import AlumniGrid from '../components/features/AlumniGrid';

const AFFILIATE_UNITS = [
    {
        name: 'Wise Council',
        founder: 'Amaka Eze',
        focus: 'Startup & SME Advisory',
        location: 'Nigeria',
        description:
            "Startup and SME advisory — co-founder structures, fundraising legal support, and employment law. Independently run under the Clearwater brand.",
        tag: 'Clearwater Unit',
    },
];

export default function Network() {
    return (
        <div style={{ paddingTop: '64px', background: 'var(--cwp-void)' }}>
            {/* Page header */}
            <section
                style={{
                    padding: '80px 48px 60px',
                    borderBottom: '1px solid var(--cwp-border)',
                    background: 'var(--cwp-ink)',
                    maxWidth: '100%',
                }}
            >
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <SectionLabel style={{ display: 'block', marginBottom: '16px' }}>The Clearwater Network</SectionLabel>
                    <h1
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 'clamp(32px, 5vw, 64px)',
                            fontWeight: 400,
                            color: 'var(--cwp-white)',
                            lineHeight: 1.1,
                            maxWidth: '680px',
                            marginBottom: '20px',
                        }}
                    >
                        Independent Firms.<br /><em>One Network.</em>
                    </h1>
                    <p style={{ fontSize: '14px', color: 'var(--cwp-muted)', maxWidth: '600px', lineHeight: 1.8 }}>
                        The Clearwater Network is a unified professional brand under which independent lawyers and practices operate autonomously — introducing themselves, and being introduced, as practitioners of Clearwater. One standard. Independently run.
                    </p>
                </div>
            </section>

            {/* Alliance Grid */}
            <section style={{ padding: '64px 48px', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: '32px' }}>
                    <p
                        style={{
                            fontSize: '9px',
                            fontWeight: 700,
                            letterSpacing: '0.25em',
                            textTransform: 'uppercase',
                            color: 'var(--cwp-accent)',
                            marginBottom: '8px',
                        }}
                    >
                        Alliance Nodes
                    </p>
                    <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--cwp-muted)' }}>
                        5 Active Firms · Nigeria-Wide Coverage
                    </p>
                </div>
                <AllianceNetwork />
            </section>

            {/* Alliance model explanation */}
            <section style={{ padding: '64px 48px', borderTop: '1px solid var(--cwp-border)', background: 'var(--cwp-ink)' }}>
                <div
                    style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px' }}
                    className="network-model-grid"
                >
                    <div>
                        <SectionLabel light style={{ display: 'block', marginBottom: '16px' }}>The Network Model</SectionLabel>
                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 400, color: 'var(--cwp-white)', marginBottom: '20px', lineHeight: 1.3 }}>
                            One Brand.
                            <br /><em>Independent Practitioners.</em>
                        </h2>
                        <p style={{ fontSize: '13px', color: 'var(--cwp-muted)', lineHeight: 1.85 }}>
                            Each practitioner runs independently — their own clients, management, and fees — while presenting as a practitioner of Clearwater.
                        </p>
                    </div>
                    <div>
                        <SectionLabel light style={{ display: 'block', marginBottom: '16px' }}>How to Engage</SectionLabel>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0' }}>
                            {[
                                'Contact the Intelligence Desk with your matter type and jurisdiction.',
                                'We identify the right Clearwater practitioner for your matter.',
                                'A formal engagement letter is issued — clear scope, clear fees.',
                                'Where matters span multiple areas, practitioners coordinate under one relationship.',
                            ].map((item, i) => (
                                <li
                                    key={i}
                                    style={{
                                        padding: '16px 0',
                                        borderBottom: '1px solid var(--cwp-border)',
                                        display: 'flex',
                                        gap: '16px',
                                        fontSize: '13px',
                                        color: 'var(--cwp-muted)',
                                        lineHeight: 1.6,
                                    }}
                                >
                                    <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--cwp-accent)', minWidth: '18px', marginTop: '2px' }}>
                                        0{i + 1}
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Clearwater Units */}
            <section style={{ padding: '80px 48px', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ borderBottom: '1px solid var(--cwp-border)', paddingBottom: '24px', marginBottom: '0' }}>
                    <p
                        style={{
                            fontSize: '9px',
                            fontWeight: 700,
                            letterSpacing: '0.25em',
                            textTransform: 'uppercase',
                            color: 'var(--cwp-accent)',
                            marginBottom: '10px',
                        }}
                    >
                        Clearwater Units
                    </p>
                    <h2
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 'clamp(20px, 2.5vw, 30px)',
                            fontWeight: 400,
                            color: 'var(--cwp-white)',
                            lineHeight: 1.2,
                            maxWidth: '560px',
                        }}
                    >
                        Independent Practitioners.
                        <em> One Unified Brand.</em>
                    </h2>
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                        gap: '1px',
                        background: 'var(--cwp-border)',
                        border: '1px solid var(--cwp-border)',
                    }}
                >
                    {AFFILIATE_UNITS.map((unit) => (
                        <div
                            key={unit.name}
                            style={{
                                background: 'var(--cwp-void)',
                                padding: '40px 36px',
                                transition: 'background 0.15s',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--cwp-surface)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--cwp-void)')}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                <h3
                                    style={{
                                        fontFamily: "'Playfair Display', serif",
                                        fontSize: '22px',
                                        fontWeight: 400,
                                        color: 'var(--cwp-white)',
                                    }}
                                >
                                    {unit.name}
                                </h3>
                                <span
                                    style={{
                                        fontSize: '8px',
                                        fontWeight: 700,
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                        color: 'var(--cwp-accent)',
                                        border: '1px solid rgba(212,168,83,0.3)',
                                        padding: '4px 10px',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {unit.tag}
                                </span>
                            </div>
                            <p style={{ fontSize: '10px', color: 'var(--cwp-accent)', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '4px' }}>
                                {unit.focus}
                            </p>
                            <p style={{ fontSize: '11px', color: 'var(--cwp-muted)', letterSpacing: '0.05em', marginBottom: '20px' }}>
                                {unit.location} · Founded by {unit.founder}
                            </p>
                            <p
                                style={{
                                    fontSize: '13px',
                                    color: 'var(--cwp-muted)',
                                    lineHeight: 1.75,
                                    borderTop: '1px solid var(--cwp-border)',
                                    paddingTop: '20px',
                                }}
                            >
                                {unit.description}
                            </p>
                        </div>
                    ))}
                    {/* Placeholder slot */}
                    <div
                        style={{
                            background: 'var(--cwp-void)',
                            padding: '40px 36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '200px',
                            border: '1px dashed var(--cwp-border)',
                        }}
                    >
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--cwp-muted)', marginBottom: '8px' }}>
                                Interested in affiliation?
                            </p>
                            <a
                                href="/contact"
                                style={{ fontSize: '12px', color: 'var(--cwp-accent)', textDecoration: 'none', fontWeight: 600 }}
                            >
                                Contact us →
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Alumni */}
            <section style={{ padding: '0 48px 80px', maxWidth: '1200px', margin: '0 auto' }}>
                <AlumniGrid />
            </section>

            <style>{`
        @media (max-width: 700px) { 
          .network-model-grid { grid-template-columns: 1fr !important; }
          div[style*="padding: '64px 48px'"], section[style*="padding: '80px 48px'"] { padding-left: 24px !important; padding-right: 24px !important; }
        }
      `}</style>
        </div>
    );
}
