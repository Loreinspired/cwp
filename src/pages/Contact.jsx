import React, { useState } from 'react';
import { CheckCircle, Loader } from 'lucide-react';
import SectionLabel from '../components/ui/SectionLabel';
import Button from '../components/ui/Button';
import CWIIntake from '../components/features/CWIIntake';

const CLIENT_TYPES = [
    'Individual / Personal Matter',
    'Sole Proprietor / Small Business',
    'SME / Startup',
    'Corporate Entity',
    'Institutional / Government',
];

const MATTER_TYPES = [
    'Corporate Advisory',
    'Capital Markets',
    'Mergers & Acquisitions',
    'Regulatory Compliance',
    'Dispute Resolution',
    'Other',
];

export default function Contact() {
    const [form, setForm] = useState({ name: '', email: '', clientType: '', matter: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [sending, setSending] = useState(false);

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async e => {
        e.preventDefault();
        setSending(true);
        await new Promise(r => setTimeout(r, 1200));
        setSending(false);
        setSubmitted(true);
    };

    const inputStyle = {
        width: '100%',
        background: 'var(--cwp-raised)',
        border: '1px solid var(--cwp-border)',
        color: 'var(--cwp-text)',
        padding: '12px 14px',
        fontSize: '13px',
        outline: 'none',
        display: 'block',
        boxSizing: 'border-box',
    };

    const labelStyle = {
        fontSize: '9px',
        fontWeight: 700,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'var(--cwp-muted)',
        display: 'block',
        marginBottom: '7px',
    };

    return (
        <div style={{ paddingTop: '64px' }}>
            {/* ── Header ─────────────────────────────────────────────────── */}
            <section style={{
                padding: '72px 48px 56px',
                borderBottom: '1px solid var(--cwp-border)',
                background: 'var(--cwp-ink)',
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <SectionLabel style={{ display: 'block', marginBottom: '16px' }}>Intelligence Desk</SectionLabel>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'end' }} className="contact-header-grid">
                        <div>
                            <h1 style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: 'clamp(28px, 4vw, 54px)',
                                fontWeight: 400,
                                color: 'var(--cwp-white)',
                                lineHeight: 1.1,
                                marginBottom: '0',
                            }}>
                                How would you like<br />
                                <em style={{ color: 'var(--cwp-accent)' }}>to engage?</em>
                            </h1>
                        </div>
                        <p style={{ fontSize: '14px', color: 'var(--cwp-muted)', lineHeight: 1.8 }}>
                            Get an instant structured analysis through Clearwater Intelligence, or submit a written enquiry for partner review within two business days.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── Path Labels ────────────────────────────────────────────── */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 48px',
                display: 'grid',
                gridTemplateColumns: '1fr 400px',
                gap: '1px',
            }} className="contact-label-grid">
                <div style={{
                    borderBottom: '2px solid var(--cwp-accent)',
                    padding: '20px 0 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                }}>
                    <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--cwp-accent)' }}>
                        Path A — Primary
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--cwp-muted)' }}>
                        Instant Digital Desk · Powered by CWI
                    </span>
                </div>
                <div style={{
                    borderBottom: '1px solid var(--cwp-border)',
                    padding: '20px 0 14px',
                    paddingLeft: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                }}>
                    <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--cwp-muted)' }}>
                        Path B — Traditional
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--cwp-border)' }}>
                        Written Enquiry
                    </span>
                </div>
            </div>

            {/* ── Split Layout ────────────────────────────────────────────── */}
            <section style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 48px 80px',
                display: 'grid',
                gridTemplateColumns: '1fr 400px',
                gap: '1px',
                background: 'var(--cwp-border)',
            }} className="contact-split-grid">

                {/* LEFT: CWI Instant Desk */}
                <div style={{ background: 'var(--cwp-void)', padding: '48px 48px 48px 0' }}>
                    <p style={{
                        fontSize: '9px',
                        fontWeight: 700,
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: 'var(--cwp-accent)',
                        marginBottom: '10px',
                    }}>
                        CWI · Clearwater Intelligence
                    </p>
                    <h2 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 'clamp(20px, 2.5vw, 30px)',
                        fontWeight: 400,
                        color: 'var(--cwp-white)',
                        marginBottom: '12px',
                        lineHeight: 1.2,
                    }}>
                        Describe your matter. Get structured analysis instantly.
                    </h2>
                    <p style={{ fontSize: '13px', color: 'var(--cwp-muted)', lineHeight: 1.7, marginBottom: '28px' }}>
                        The AI will ask one or two focused questions, then deliver a Nigerian-law-grounded preliminary analysis with key issues, applicable statutes, and recommended next steps.
                    </p>
                    <CWIIntake />
                </div>

                {/* RIGHT: Traditional Enquiry */}
                <div style={{
                    background: 'var(--cwp-ink)',
                    padding: '48px 40px',
                    borderLeft: '1px solid var(--cwp-border)',
                }}>
                    <p style={{
                        fontSize: '9px',
                        fontWeight: 700,
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: 'var(--cwp-muted)',
                        marginBottom: '10px',
                    }}>
                        Traditional Enquiry
                    </p>
                    <h2 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '20px',
                        fontWeight: 400,
                        color: 'var(--cwp-white)',
                        marginBottom: '8px',
                        lineHeight: 1.3,
                    }}>
                        Prefer a written brief?
                    </h2>
                    <p style={{ fontSize: '12px', color: 'var(--cwp-muted)', lineHeight: 1.7, marginBottom: '28px' }}>
                        Reviewed by a partner within two business days.
                    </p>

                    {submitted ? (
                        <div style={{
                            padding: '32px 24px',
                            background: 'var(--cwp-surface)',
                            border: '1px solid var(--cwp-border)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                        }}>
                            <CheckCircle size={24} style={{ color: 'var(--cwp-accent)' }} />
                            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: 'var(--cwp-white)', fontWeight: 400 }}>
                                Enquiry Received
                            </h3>
                            <p style={{ fontSize: '12px', color: 'var(--cwp-muted)', lineHeight: 1.75 }}>
                                We'll be in contact at <strong style={{ color: 'var(--cwp-text)' }}>{form.email}</strong> within two business days.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>Full Name *</label>
                                <input name="name" required value={form.name} onChange={handleChange} placeholder="Alexandra Okonkwo" style={inputStyle} />
                            </div>

                            <div>
                                <label style={labelStyle}>Email Address *</label>
                                <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@organisation.com" style={inputStyle} />
                            </div>

                            <div>
                                <label style={labelStyle}>Client Type</label>
                                <select name="clientType" value={form.clientType} onChange={handleChange} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                                    <option value="">Select your situation</option>
                                    {CLIENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>

                            <div>
                                <label style={labelStyle}>Matter Type</label>
                                <select name="matter" value={form.matter} onChange={handleChange} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                                    <option value="">Select a practice area</option>
                                    {MATTER_TYPES.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>

                            <div>
                                <label style={labelStyle}>Brief Description *</label>
                                <textarea
                                    name="message"
                                    required
                                    rows={4}
                                    value={form.message}
                                    onChange={handleChange}
                                    placeholder="Briefly describe your matter."
                                    style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.7' }}
                                />
                            </div>

                            <div>
                                <Button type="submit" disabled={sending} variant="primary">
                                    {sending
                                        ? <><Loader size={13} style={{ animation: 'spin 1s linear infinite' }} /> Submitting…</>
                                        : 'Submit Enquiry'}
                                </Button>
                            </div>
                        </form>
                    )}

                    <div style={{ marginTop: '24px', padding: '16px', background: 'var(--cwp-void)', border: '1px solid var(--cwp-border)' }}>
                        <p style={{ fontSize: '11px', color: 'var(--cwp-muted)', lineHeight: 1.7 }}>
                            All submissions are treated as strictly confidential. Submission does not create an attorney-client relationship.
                        </p>
                    </div>
                </div>
            </section>

            <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus, textarea:focus, select:focus { border-color: var(--cwp-accent) !important; }
        input::placeholder, textarea::placeholder { color: var(--cwp-border); }
        @media (max-width: 900px) {
          .contact-split-grid, .contact-label-grid, .contact-header-grid {
            grid-template-columns: 1fr !important;
            background: none !important;
          }
          .contact-split-grid > div:last-child { border-left: none !important; padding-left: 0 !important; }
          .contact-split-grid > div:first-child { padding-right: 0 !important; }
          .contact-label-grid > div:last-child { padding-left: 0 !important; }
        }
      `}</style>
        </div>
    );
}
