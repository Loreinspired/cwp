import React from 'react';
import SectionLabel from '../components/ui/SectionLabel';
import ServicesFramework from '../components/features/ServicesFramework';

export default function Services() {
    return (
        <div style={{ paddingTop: '64px' }}>
            {/* Page header */}
            <section
                style={{
                    padding: '80px 40px 60px',
                    borderBottom: '1px solid var(--cwp-border)',
                    background: 'var(--cwp-ink)',
                }}
            >
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <SectionLabel style={{ display: 'block', marginBottom: '16px' }}>Practice Areas</SectionLabel>
                    <h1
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 'clamp(32px, 5vw, 64px)',
                            fontWeight: 400,
                            color: 'var(--cwp-white)',
                            lineHeight: 1.1,
                            maxWidth: '640px',
                            marginBottom: '20px',
                        }}
                    >
                        What We Do
                    </h1>
                    <p style={{ fontSize: '14px', color: 'var(--cwp-muted)', maxWidth: '560px', lineHeight: 1.8 }}>
                        Clearwater Partners operates across five integrated practice areas, each anchored in deep Nigerian commercial law expertise and delivered through our alliance network across Nigeria and West Africa.
                    </p>
                </div>
            </section>

            {/* Services */}
            <section style={{ padding: '64px 40px', maxWidth: '1200px', margin: '0 auto' }}>
                <ServicesFramework />
            </section>

            {/* CTA */}
            <section
                style={{
                    padding: '64px 40px',
                    borderTop: '1px solid var(--cwp-border)',
                    background: 'var(--cwp-ink)',
                    textAlign: 'center',
                }}
            >
                <div style={{ maxWidth: '560px', margin: '0 auto' }}>
                    <h2
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '28px',
                            fontWeight: 400,
                            fontStyle: 'italic',
                            color: 'var(--cwp-white)',
                            marginBottom: '16px',
                        }}
                    >
                        Have a matter in mind?
                    </h2>
                    <p style={{ fontSize: '13px', color: 'var(--cwp-muted)', lineHeight: 1.7, marginBottom: '28px' }}>
                        Submit a preliminary inquiry through the Intelligence Desk or contact us directly.
                    </p>
                    <a
                        href="/contact"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '13px 28px',
                            fontSize: '11px',
                            fontWeight: 700,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            background: 'var(--cwp-white)',
                            color: 'var(--cwp-void)',
                            textDecoration: 'none',
                        }}
                    >
                        Intelligence Desk
                    </a>
                </div>
            </section>
        </div>
    );
}
