import React from 'react';
import { Link } from 'react-router-dom';
import AllianceNetwork from '../components/features/AllianceNetwork';
import AlumniGrid from '../components/features/AlumniGrid';

const VALUES = [
    {
        number: '01',
        title: 'Rigour, not ego.',
        body: 'The best legal advice is not necessarily the most impressive-sounding. We are trained to call it as it is — including when the answer is not what a client wants to hear. That honesty is the whole value.',
    },
    {
        number: '02',
        title: 'We invest in the people here.',
        body: 'Junior lawyers at Clearwater are given real mandates, real responsibility, and real access to senior-level thinking from day one. We do not believe in building careers through proximity to busy-work.',
    },
    {
        number: '03',
        title: 'The long game.',
        body: 'We measure success in decades, not deal counts. The relationships we build with clients, with the network, and with the lawyers who pass through this firm are designed to compound over time.',
    },
    {
        number: '04',
        title: 'Association as currency.',
        body: 'Clearwater Partners alumni lead legal departments, found their own practices, and serve at the most consequential organisations on the continent. The badge travels. We protect what it means.',
    },
];

const TEAM = [
    {
        initials: 'MP',
        name: 'Managing Partner',
        title: 'Senior Partner',
        focus: 'Corporate Advisory · Capital Markets',
        bio: "Leads the firm's principal client relationships and oversees all capital markets mandates. Called to the Nigerian Bar. LLM, London School of Economics.",
        gradient: 'linear-gradient(135deg, #1a1a1a 0%, #2a2218 100%)',
    },
    {
        initials: 'SP',
        name: 'Senior Associate',
        title: 'Disputes & Regulatory',
        focus: 'Litigation · Arbitration · FIRS',
        bio: 'Represents clients in commercial litigation and institutional arbitration (LCA, ICC). Previously at the Federal Ministry of Justice.',
        gradient: 'linear-gradient(135deg, #181820 0%, #221a2a 100%)',
    },
    {
        initials: 'SA',
        name: 'Associate',
        title: 'Corporate & M&A',
        focus: 'M&A · Startup Advisory · ESOP',
        bio: 'Advises founders and institutional investors on transactions from seed stage through exit. Background in investment banking.',
        gradient: 'linear-gradient(135deg, #181a18 0%, #1a2218 100%)',
    },
];

const TIMELINE = [
    { year: '2018', event: 'Firm Founded', detail: 'Clearwater Partners established in Ado-Ekiti, Ekiti State.' },
    { year: '2020', event: 'First Alliance', detail: 'Temidayo Akeredolu & Co. joins the Clearwater Network.' },
    { year: '2022', event: 'Network Expanded', detail: 'Multi-city coverage formalised across Ekiti, Abuja, and Port Harcourt.' },
    { year: '2024', event: 'West Africa', detail: 'Alliance network extended to serve cross-border mandates across West Africa.' },
];

export default function About() {
    return (
        <main style={{ background: 'var(--cwp-void)', minHeight: '100vh', paddingBottom: '100px' }}>

            {/* ── HERO WITH IMAGE ─────────────────────────────────────────── */}
            <section style={{ position: 'relative', overflow: 'hidden', paddingTop: '64px' }}>
                {/* Background image */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url('https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=1600&q=80&auto=format&fit=crop')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center 40%',
                    opacity: 0.1,
                }} />
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, var(--cwp-void) 0%, transparent 30%, transparent 70%, var(--cwp-void) 100%)',
                }} />

                <div style={{
                    position: 'relative',
                    borderBottom: '1px solid var(--cwp-border)',
                    padding: '80px 48px 80px',
                    maxWidth: '1200px',
                    margin: '0 auto',
                }}>
                    <p style={{
                        fontSize: '9px', fontWeight: 700, letterSpacing: '0.25em',
                        textTransform: 'uppercase', color: 'var(--cwp-accent)', marginBottom: '32px',
                    }}>
                        About — Who We Are
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }} className="about-hero-grid">
                        <div>
                            <h1 style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: 'clamp(30px, 4vw, 56px)',
                                fontWeight: 400,
                                color: 'var(--cwp-white)',
                                lineHeight: 1.1,
                                marginBottom: '32px',
                            }}>
                                A firm built on the belief that rigorous legal thinking is a competitive advantage.
                            </h1>
                            <Link
                                to="/contact"
                                style={{
                                    display: 'inline-block', padding: '16px 28px',
                                    background: 'var(--cwp-accent)', color: 'var(--cwp-void)',
                                    fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em',
                                    textTransform: 'uppercase', textDecoration: 'none',
                                    transition: 'opacity 0.15s',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                            >
                                Brief Us
                            </Link>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <p style={{ fontSize: '15px', color: 'var(--cwp-muted)', lineHeight: 1.8, maxWidth: '420px' }}>
                                Small by design. Every client relationship is principal-led. We operate on judgment, not volume.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── TIMELINE ────────────────────────────────────────────────── */}
            <section style={{
                borderBottom: '1px solid var(--cwp-border)',
                padding: '80px 48px',
                background: 'var(--cwp-ink)',
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <p style={{
                        fontSize: '9px', fontWeight: 700, letterSpacing: '0.25em',
                        textTransform: 'uppercase', color: 'var(--cwp-accent)', marginBottom: '48px',
                    }}>
                        Our History
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--cwp-border)' }} className="timeline-grid">
                        {TIMELINE.map(({ year, event, detail }, i) => (
                            <div key={year} style={{
                                background: 'var(--cwp-ink)',
                                padding: '32px 28px',
                                borderTop: i === 0 ? '2px solid var(--cwp-accent)' : '2px solid transparent',
                                transition: 'border-color 0.2s, background 0.2s',
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderTopColor = 'var(--cwp-accent)';
                                    e.currentTarget.style.background = 'var(--cwp-surface)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderTopColor = i === 0 ? 'var(--cwp-accent)' : 'transparent';
                                    e.currentTarget.style.background = 'var(--cwp-ink)';
                                }}
                            >
                                <p style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: '40px', fontWeight: 700, color: 'var(--cwp-white)',
                                    lineHeight: 1, marginBottom: '12px',
                                }}>{year}</p>
                                <p style={{
                                    fontSize: '12px', fontWeight: 700, color: 'var(--cwp-accent)',
                                    letterSpacing: '0.08em', marginBottom: '10px',
                                }}>{event}</p>
                                <p style={{ fontSize: '12px', color: 'var(--cwp-muted)', lineHeight: 1.7 }}>{detail}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── VALUES ──────────────────────────────────────────────────── */}
            <section style={{ borderBottom: '1px solid var(--cwp-border)', padding: '80px 48px', maxWidth: '1200px', margin: '0 auto' }}>
                <p style={{
                    fontSize: '9px', fontWeight: 700, letterSpacing: '0.25em',
                    textTransform: 'uppercase', color: 'var(--cwp-accent)', marginBottom: '48px',
                }}>
                    What We Stand For
                </p>
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1px', background: 'var(--cwp-border)', border: '1px solid var(--cwp-border)',
                }} className="values-grid">
                    {VALUES.map((v) => (
                        <div key={v.number} style={{
                            background: 'var(--cwp-void)', padding: '40px', transition: 'background 0.15s',
                        }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--cwp-surface)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--cwp-void)')}
                        >
                            <span style={{
                                fontFamily: "'Playfair Display', serif", fontSize: '48px',
                                fontWeight: 400, color: 'var(--cwp-raised)', display: 'block',
                                marginBottom: '16px', lineHeight: 1,
                            }}>
                                {v.number}
                            </span>
                            <h3 style={{
                                fontFamily: "'Playfair Display', serif", fontSize: '20px',
                                fontWeight: 400, fontStyle: 'italic', color: 'var(--cwp-white)',
                                marginBottom: '16px', lineHeight: 1.3,
                            }}>
                                {v.title}
                            </h3>
                            <p style={{ fontSize: '13px', color: 'var(--cwp-muted)', lineHeight: 1.8 }}>{v.body}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── TEAM ────────────────────────────────────────────────────── */}
            <section style={{ padding: '80px 48px', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
                    <p style={{
                        fontSize: '9px', fontWeight: 700, letterSpacing: '0.25em',
                        textTransform: 'uppercase', color: 'var(--cwp-accent)',
                    }}>
                        The Team
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--cwp-muted)', fontStyle: 'italic' }}>
                        Every client relationship is partner-led.
                    </p>
                </div>

                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '24px',
                }}>
                    {TEAM.map((member) => (
                        <div key={member.initials} style={{
                            background: 'var(--cwp-surface)',
                            border: '1px solid var(--cwp-border)',
                            overflow: 'hidden',
                            transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            {/* Photo placeholder */}
                            <div style={{
                                height: '200px',
                                background: member.gradient,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderBottom: '1px solid var(--cwp-border)',
                                position: 'relative',
                            }}>
                                <span style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: '52px', fontWeight: 400,
                                    color: 'var(--cwp-accent)', opacity: 0.6,
                                    letterSpacing: '0.1em',
                                }}>
                                    {member.initials}
                                </span>
                                <div style={{
                                    position: 'absolute', bottom: '12px', right: '12px',
                                    fontSize: '9px', color: 'var(--cwp-muted)',
                                    letterSpacing: '0.1em', textTransform: 'uppercase',
                                }}>
                                    Photo TBC
                                </div>
                            </div>

                            {/* Info */}
                            <div style={{ padding: '28px' }}>
                                <h3 style={{
                                    fontFamily: "'Playfair Display', serif", fontSize: '18px',
                                    fontWeight: 400, color: 'var(--cwp-white)', marginBottom: '4px',
                                }}>{member.name}</h3>
                                <p style={{ fontSize: '11px', color: 'var(--cwp-accent)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '6px' }}>
                                    {member.title}
                                </p>
                                <p style={{ fontSize: '10px', color: 'var(--cwp-muted)', letterSpacing: '0.05em', marginBottom: '20px' }}>
                                    {member.focus}
                                </p>
                                <p style={{ fontSize: '12px', color: 'var(--cwp-muted)', lineHeight: 1.75, borderTop: '1px solid var(--cwp-border)', paddingTop: '16px' }}>
                                    {member.bio}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── ALLIANCE NETWORK ─────────────────────────────────────── */}
            <section style={{ borderTop: '1px solid var(--cwp-border)', padding: '80px 48px', background: 'var(--cwp-ink)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <p style={{
                                fontSize: '9px', fontWeight: 700, letterSpacing: '0.25em',
                                textTransform: 'uppercase', color: 'var(--cwp-accent)', marginBottom: '12px',
                            }}>
                                The Clearwater Network
                            </p>
                            <h2 style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: 'clamp(22px, 3vw, 36px)',
                                fontWeight: 400,
                                color: 'var(--cwp-white)',
                                lineHeight: 1.2,
                                maxWidth: '480px',
                            }}>
                                One relationship. Coordinated across Nigeria.
                            </h2>
                        </div>
                        <p style={{ fontSize: '13px', color: 'var(--cwp-muted)', maxWidth: '340px', lineHeight: 1.75 }}>
                            Alliance firms within the Clearwater Network operate as a unified counsel platform — sharing mandates, referrals, and institutional knowledge across jurisdictions.
                        </p>
                    </div>
                    <AllianceNetwork />
                </div>
            </section>

            {/* ── ALUMNI GRID ──────────────────────────────────────────────── */}
            <section style={{ borderTop: '1px solid var(--cwp-border)', padding: '80px 48px', maxWidth: '1200px', margin: '0 auto' }}>
                <AlumniGrid />
            </section>

            <style>{`
        @media (max-width: 800px) {
          .about-hero-grid, .badge-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .values-grid, .timeline-grid { grid-template-columns: 1fr !important; }
          .badge-grid > div:first-child { border-right: none !important; padding-right: 0 !important; border-bottom: 1px solid var(--cwp-border); padding-bottom: 32px; }
          main section { padding-left: 24px !important; padding-right: 24px !important; }
        }
      `}</style>
        </main>
    );
}
