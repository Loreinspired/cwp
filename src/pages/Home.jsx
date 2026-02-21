import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Mail, MessageSquare } from 'lucide-react';
import SectionLabel from '../components/ui/SectionLabel';
import Button from '../components/ui/Button';
import CWIIntake from '../components/features/CWIIntake';
import ServicesFramework from '../components/features/ServicesFramework';
import PrecedentGrid from '../components/features/PrecedentGrid';
import GridDots from '../components/ui/GridDots';
import NewsletterSignup from '../components/features/NewsletterSignup';
import { personas } from '../data/personas';

// ─── Ticker ──────────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
    'Corporate Advisory',
    'Capital Markets',
    'Mergers & Acquisitions',
    'Regulatory Compliance',
    'Dispute Resolution',
    'CAMA 2020 Advisory',
    'CBN & SEC Licensing',
    'FIRS Engagement',
    'LCA · ICC Arbitration',
    'Ado-Ekiti · Abuja · Lagos Island',
];

function Ticker() {
    return (
        <div style={{
            overflow: 'hidden',
            borderTop: '1px solid var(--cwp-border)',
            borderBottom: '1px solid var(--cwp-border)',
            padding: '10px 0',
            marginBottom: '48px',
            position: 'relative',
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        }}>
            <div className="cwp-ticker-track">
                {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                    <span key={i} style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '20px',
                        paddingRight: '20px',
                        fontSize: '9px',
                        fontWeight: 700,
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: 'var(--cwp-muted)',
                        whiteSpace: 'nowrap',
                    }}>
                        {item}
                        <span style={{ color: 'var(--cwp-accent)', fontSize: '6px' }}>◆</span>
                    </span>
                ))}
            </div>
        </div>
    );
}

// ─── Trust Bar ───────────────────────────────────────────────────────────────
const TRUST_ITEMS = [
    { label: 'Nigerian Bar Association', sub: 'Member' },
    { label: 'NICArb · ICC', sub: 'Arbitration Practice' },
    { label: 'CBN · SEC Advisory', sub: 'Regulatory Practice' },
    { label: 'LSE · BL, Nigerian Law School', sub: 'Academic Credentials' },
    { label: 'NDPC Registered', sub: 'Data Protection' },
];

function TrustBar() {
    return (
        <div style={{
            background: 'var(--cwp-ink)',
            borderTop: '1px solid var(--cwp-border)',
            borderBottom: '1px solid var(--cwp-border)',
            padding: '24px 48px',
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '32px',
                flexWrap: 'wrap',
            }} className="trust-bar-inner">
                {TRUST_ITEMS.map(({ label, sub }) => (
                    <div key={label} style={{ textAlign: 'center', flex: '1 1 160px' }}>
                        <p style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            color: 'var(--cwp-text)',
                            letterSpacing: '0.03em',
                            marginBottom: '3px',
                        }}>{label}</p>
                        <p style={{
                            fontSize: '9px',
                            color: 'var(--cwp-muted)',
                            letterSpacing: '0.14em',
                            textTransform: 'uppercase',
                        }}>{sub}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Why CWP ─────────────────────────────────────────────────────────────────
const WHY_ITEMS = [
    {
        number: '01',
        title: 'Principal-Led',
        body: 'Every mandate is led by a partner. Not delegated to a junior team you never meet. You deal with the decision-maker from day one.',
    },
    {
        number: '02',
        title: 'No Volume Model',
        body: 'We are deliberately small. We take fewer matters so we can serve each one properly. Depth over breadth — always.',
    },
    {
        number: '03',
        title: 'Alliance Network',
        body: 'Multi-city coverage across Nigeria through the Clearwater Network. One relationship, coordinated across Ado-Ekiti, Abuja, Lagos Island, and beyond.',
    },
];

function WhyCWP() {
    return (
        <section style={{
            padding: '96px 48px',
            borderTop: '1px solid var(--cwp-border)',
            background: 'var(--cwp-void)',
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: '56px' }}>
                    <SectionLabel style={{ display: 'block', marginBottom: '12px' }}>Why Clearwater</SectionLabel>
                    <h2 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 'clamp(24px, 3.5vw, 42px)',
                        fontWeight: 400,
                        color: 'var(--cwp-white)',
                        lineHeight: 1.2,
                        maxWidth: '560px',
                    }}>
                        A firm built for the things that actually matter.
                    </h2>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1px',
                    background: 'var(--cwp-border)',
                }} className="why-grid">
                    {WHY_ITEMS.map(({ number, title, body }) => (
                        <div key={number} style={{
                            background: 'var(--cwp-void)',
                            padding: '40px 36px 36px',
                            borderTop: '2px solid var(--cwp-accent)',
                            transition: 'background 0.2s',
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--cwp-surface)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--cwp-void)'}
                        >
                            <span style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: '40px',
                                fontWeight: 400,
                                color: 'var(--cwp-raised)',
                                display: 'block',
                                lineHeight: 1,
                                marginBottom: '20px',
                            }}>{number}</span>
                            <h3 style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: '20px',
                                fontWeight: 400,
                                color: 'var(--cwp-white)',
                                marginBottom: '14px',
                                lineHeight: 1.3,
                            }}>{title}</h3>
                            <p style={{ fontSize: '13px', color: 'var(--cwp-muted)', lineHeight: 1.8 }}>{body}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ─── Mobile Sticky CTA ───────────────────────────────────────────────────────
function MobileStickyCTA() {
    return (
        <div className="mobile-cta-bar" style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 90,
            display: 'none',
            borderTop: '1px solid var(--cwp-border)',
            background: 'var(--cwp-ink)',
        }}>
            <a href="tel:+2340000000000" style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '12px 8px',
                gap: '4px',
                color: 'var(--cwp-muted)',
                borderRight: '1px solid var(--cwp-border)',
                textDecoration: 'none',
            }}>
                <Phone size={16} />
                <span style={{ fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Call</span>
            </a>
            <a href="mailto:intelligence@cwplegal.africa" style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '12px 8px',
                gap: '4px',
                color: 'var(--cwp-muted)',
                borderRight: '1px solid var(--cwp-border)',
                textDecoration: 'none',
            }}>
                <Mail size={16} />
                <span style={{ fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Email</span>
            </a>
            <Link to="/contact" style={{
                flex: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 8px',
                gap: '4px',
                background: 'var(--cwp-accent)',
                color: 'var(--cwp-void)',
                textDecoration: 'none',
            }}>
                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    Enquire Now
                </span>
            </Link>
        </div>
    );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function Home() {
    return (
        <div>
            {/* ── Hero ───────────────────────────────────────────────────── */}
            <section style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                padding: '120px 48px 60px',
                position: 'relative',
                overflow: 'hidden',
                background: 'var(--cwp-void)',
            }}>
                {/* Background image */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80&auto=format&fit=crop')`,
                    backgroundSize: 'cover', backgroundPosition: 'center 40%',
                    opacity: 0.06, pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, transparent 60%, var(--cwp-void) 100%)',
                    pointerEvents: 'none',
                }} />
                <div style={{ position: 'absolute', top: 0, left: '48px', width: '1px', height: '48px', background: 'var(--cwp-accent)' }} />

                <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }} className="hero-grid">

                    {/* Left — Headline + trust */}
                    <div>
                        <SectionLabel style={{ display: 'block', marginBottom: '24px' }}>
                            Ekiti · Abuja · Ikoyi · Nigeria
                        </SectionLabel>
                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 'clamp(36px, 5.5vw, 80px)',
                            fontWeight: 400,
                            color: 'var(--cwp-white)',
                            lineHeight: 1.05,
                            letterSpacing: '-0.02em',
                            marginBottom: '28px',
                        }}>
                            Commercial Law<br />
                            <em style={{ color: 'var(--cwp-accent)' }}>for institutions</em><br />
                            that move markets.
                        </h1>
                        <p style={{ fontSize: '14px', color: 'var(--cwp-muted)', lineHeight: 1.8, marginBottom: '36px', maxWidth: '380px' }}>
                            Describe your matter. Get a substantive preliminary analysis in seconds — then engage us formally.
                        </p>

                        {/* Compact stat bar */}
                        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', paddingTop: '28px', borderTop: '1px solid var(--cwp-border)' }}>
                            {[
                                { value: '4+', label: 'Alliance Nodes' },
                                { value: '₦bn+', label: 'Transactions Advised' },
                                { value: '2018', label: 'Est.' },
                            ].map(({ value, label }) => (
                                <div key={label}>
                                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 700, color: 'var(--cwp-white)', lineHeight: 1 }}>{value}</p>
                                    <p style={{ fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--cwp-muted)', marginTop: '4px' }}>{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — CWI Intake (hero mode) */}
                    <div style={{
                        background: 'var(--cwp-ink)',
                        border: '1px solid var(--cwp-border)',
                        borderLeft: '3px solid var(--cwp-accent)',
                        padding: '40px',
                        position: 'relative',
                    }}>
                        <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--cwp-accent)', marginBottom: '8px' }}>
                            CWI · Clearwater Intelligence
                        </p>
                        <p style={{ fontSize: '13px', color: 'var(--cwp-muted)', marginBottom: '28px', lineHeight: 1.6 }}>
                            Describe your matter. Get a preliminary legal analysis instantly — no commitment required.
                        </p>
                        <CWIIntake heroMode />
                    </div>
                </div>
            </section>

            {/* ── Ticker ─────────────────────────────────────────────────── */}
            <Ticker />

            {/* ── Trust Bar ──────────────────────────────────────────────── */}
            <TrustBar />


            {/* ── Why CWP ────────────────────────────────────────────────── */}
            <WhyCWP />

            {/* ── Services Teaser ────────────────────────────────────────── */}
            <section style={{
                padding: '96px 48px',
                borderTop: '1px solid var(--cwp-border)',
                background: 'var(--cwp-ink)',
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <SectionLabel light style={{ display: 'block', marginBottom: '10px' }}>Practice Areas</SectionLabel>
                            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 400, color: 'var(--cwp-white)' }}>
                                What We Do
                            </h2>
                        </div>
                        <Link to="/services" style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--cwp-accent)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            All 5 Practice Areas <ArrowRight size={12} />
                        </Link>
                    </div>
                    <ServicesFramework teaser />
                </div>
            </section>

            {/* ── Precedent Teaser ───────────────────────────────────────── */}
            <section style={{ padding: '96px 48px', borderTop: '1px solid var(--cwp-border)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <SectionLabel style={{ display: 'block', marginBottom: '10px' }}>Research &amp; Insight</SectionLabel>
                            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 400, color: 'var(--cwp-white)' }}>
                                Precedent
                            </h2>
                        </div>
                        <Link to="/precedent" style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--cwp-accent)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            All Articles <ArrowRight size={12} />
                        </Link>
                    </div>
                    <PrecedentGrid teaser />

                    {/* Persona shortcuts */}
                    <div style={{ marginTop: '48px', borderTop: '1px solid var(--cwp-border)', paddingTop: '32px' }}>
                        <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--cwp-muted)', marginBottom: '16px' }}>
                            Read by your situation:
                        </p>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {personas.map((p) => (
                                <Link
                                    key={p.slug}
                                    to={`/precedent/for/${p.slug}`}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                                        padding: '10px 18px', border: '1px solid var(--cwp-border)',
                                        fontSize: '11px', fontWeight: 600, color: 'var(--cwp-muted)',
                                        transition: 'all 0.15s',
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--cwp-accent)'; e.currentTarget.style.color = 'var(--cwp-white)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--cwp-border)'; e.currentTarget.style.color = 'var(--cwp-muted)'; }}
                                >
                                    <span>{p.icon}</span> {p.prompt}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Newsletter ─────────────────────────────────────────────── */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 48px 80px' }}>
                <NewsletterSignup variant="compact" />
            </div>

            {/* ── Mobile Sticky CTA ──────────────────────────────────────── */}
            <MobileStickyCTA />

            <style>{`
        @keyframes cwp-ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .cwp-ticker-track {
          display: inline-flex;
          animation: cwp-ticker 28s linear infinite;
          will-change: transform;
        }
        .cwp-ticker-track:hover { animation-play-state: paused; }

        @media (max-width: 768px) {
          .mobile-cta-bar { display: flex !important; }
          body { padding-bottom: 60px; }
          .trust-bar-inner { justify-content: center !important; }
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
        @media (max-width: 600px) {
          .why-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </div>
    );
}
