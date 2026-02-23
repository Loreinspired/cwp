import React, { useState } from 'react';
import { CheckCircle, Loader, ChevronDown, ChevronUp } from 'lucide-react';
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
    const [showFallback, setShowFallback] = useState(false);

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async e => {
        e.preventDefault();
        setSending(true);
        await new Promise(r => setTimeout(r, 1200)); // Simulated API delay
        setSending(false);
        setSubmitted(true);
    };

    const inputStyle = {
        width: '100%',
        background: 'var(--cwp-raised)',
        border: '1px solid var(--cwp-border)',
        color: 'var(--cwp-text)',
        padding: '14px 16px',
        fontSize: '13px',
        outline: 'none',
        display: 'block',
        boxSizing: 'border-box',
    };

    const labelStyle = {
        fontSize: '10px',
        fontWeight: 700,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'var(--cwp-muted)',
        display: 'block',
        marginBottom: '8px',
    };

    return (
        <div style={{ paddingTop: '64px', background: 'var(--cwp-void)', minHeight: '100vh' }}>
            {/* ── Header ─────────────────────────────────────────────────── */}
            <section style={{
                padding: '72px 48px 56px',
                borderBottom: '1px solid var(--cwp-border)',
                background: 'var(--cwp-ink)',
                textAlign: 'center'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <SectionLabel style={{ display: 'inline-block', marginBottom: '24px' }}>Clearwater Intelligence</SectionLabel>
                    <h1 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 'clamp(32px, 5vw, 54px)',
                        fontWeight: 400,
                        color: 'var(--cwp-white)',
                        lineHeight: 1.1,
                        marginBottom: '20px',
                    }}>
                        Instant Principal-Led<br />
                        <em style={{ color: 'var(--cwp-accent)' }}>Guidance.</em>
                    </h1>
                    <p style={{ fontSize: '15px', color: 'var(--cwp-muted)', lineHeight: 1.8, maxWidth: '600px', margin: '0 auto' }}>
                        Describe your commercial matter below. The AI will ask focused questions, drill into the facts, and deliver a Nigerian-law-grounded preliminary analysis.
                    </p>
                </div>
            </section>

            {/* ── Main Interface (CWI Front & Center) ────────────────────── */}
            <section style={{ maxWidth: '900px', margin: '0 auto', padding: '64px 24px' }}>
                
                {/* The AI Desk takes 100% of the primary layout */}
                <div style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                    <CWIIntake /> 
                </div>

                {/* ── The Escape Hatch ───────────────────────────────────── */}
                <div style={{ marginTop: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button 
                        onClick={() => setShowFallback(!showFallback)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--cwp-muted)',
                            fontSize: '11px',
                            fontWeight: 600,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 24px',
                            transition: 'color 0.2s',
                        }}
                        onMouseOver={e => e.currentTarget.style.color = 'var(--cwp-text)'}
                        onMouseOut={e => e.currentTarget.style.color = 'var(--cwp-muted)'}
                    >
                        Administrative inquiry or prefer a standard message?
                        {showFallback ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    {/* Traditional Form Container */}
                    <div style={{
                        width: '100%',
                        maxWidth: '600px',
                        overflow: 'hidden',
                        transition: 'max-height 0.4s ease, opacity 0.4s ease, margin-top 0.4s ease',
                        maxHeight: showFallback ? '1200px' : '0',
                        opacity: showFallback ? 1 : 0,
                        marginTop: showFallback ? '32px' : '0',
                    }}>
                        <div style={{
                            background: 'var(--cwp-ink)',
                            padding: '48px 40px',
                            border: '1px solid var(--cwp-border)',
                        }}>
                            <h2 style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: '24px',
                                fontWeight: 400,
                                color: 'var(--cwp-white)',
                                marginBottom: '24px',
                            }}>
                                Traditional Enquiry
                            </h2>

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
                                        We will review your submission and contact you at <strong style={{ color: 'var(--cwp-text)' }}>{form.email}</strong> within two business days.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div>
                                        <label style={labelStyle}>Full Name *</label>
                                        <input name="name" required value={form.name} onChange={handleChange} placeholder="e.g. Alexandra Okonkwo" style={inputStyle} />
                                    </div>

                                    <div>
                                        <label style={labelStyle}>Email Address *</label>
                                        <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@organisation.com" style={inputStyle} />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="form-grid">
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
                                                <option value="">Select practice area</option>
                                                {MATTER_TYPES.map(m => <option key={m} value={m}>{m}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label style={labelStyle}>Brief Description *</label>
                                        <textarea
                                            name="message"
                                            required
                                            rows={5}
                                            value={form.message}
                                            onChange={handleChange}
                                            placeholder="Provide the necessary administrative details or brief overview."
                                            style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.7' }}
                                        />
                                    </div>

                                    <div style={{ marginTop: '8px' }}>
                                        <Button type="submit" disabled={sending} variant="primary" style={{ width: '100%', justifyContent: 'center' }}>
                                            {sending
                                                ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite', marginRight: '8px' }} /> Submitting…</>
                                                : 'Submit Enquiry'}
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                input:focus, textarea:focus, select:focus { border-color: var(--cwp-accent) !important; }
                input::placeholder, textarea::placeholder { color: var(--cwp-border); }
                @media (max-width: 600px) {
                  .form-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
}
