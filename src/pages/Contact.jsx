import React, { useState } from 'react';
import { CheckCircle, Loader } from 'lucide-react';
import SectionLabel from '../components/ui/SectionLabel';
import Button from '../components/ui/Button';

const MATTER_TYPES = [
    'Corporate Advisory',
    'Capital Markets',
    'Mergers & Acquisitions',
    'Regulatory Compliance',
    'Dispute Resolution',
    'Other',
];

export default function Contact() {
    const [form, setForm] = useState({ name: '', org: '', email: '', matter: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [sending, setSending] = useState(false);

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async e => {
        e.preventDefault();
        setSending(true);
        // Simulate a brief delay (actual form submission would go to a backend or Formspree)
        await new Promise(r => setTimeout(r, 1200));
        setSending(false);
        setSubmitted(true);
    };

    const inputStyle = {
        width: '100%',
        background: 'var(--cwp-raised)',
        border: '1px solid var(--cwp-border)',
        color: 'var(--cwp-text)',
        padding: '13px 16px',
        fontSize: '13px',
        outline: 'none',
        display: 'block',
    };

    return (
        <div style={{ paddingTop: '64px' }}>
            {/* Header */}
            <section style={{ padding: '80px 40px 60px', borderBottom: '1px solid var(--cwp-border)', background: 'var(--cwp-ink)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <SectionLabel style={{ display: 'block', marginBottom: '16px' }}>Intelligence Desk</SectionLabel>
                    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 400, color: 'var(--cwp-white)', lineHeight: 1.1, maxWidth: '640px', marginBottom: '20px' }}>
                        New Matter Enquiry
                    </h1>
                    <p style={{ fontSize: '14px', color: 'var(--cwp-muted)', maxWidth: '480px', lineHeight: 1.8 }}>
                        Complete the form below to submit a new matter enquiry. All submissions are treated as confidential and reviewed by a partner within two business days.
                    </p>
                </div>
            </section>

            {/* Form + Office grid */}
            <section style={{ padding: '64px 40px', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '80px' }} className="contact-grid">
                    {/* Form */}
                    {submitted ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', padding: '48px', background: 'var(--cwp-surface)', border: '1px solid var(--cwp-border)' }}>
                            <CheckCircle size={32} style={{ color: 'var(--cwp-accent)' }} />
                            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: 'var(--cwp-white)', fontWeight: 400 }}>Enquiry Received</h2>
                            <p style={{ fontSize: '13px', color: 'var(--cwp-muted)', lineHeight: 1.75 }}>
                                Thank you, {form.name}. A member of the firm will be in contact at <strong style={{ color: 'var(--cwp-text)' }}>{form.email}</strong> within two business days.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-row">
                                <div>
                                    <label style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--cwp-muted)', display: 'block', marginBottom: '8px' }}>Full Name *</label>
                                    <input name="name" required value={form.name} onChange={handleChange} placeholder="Alexandra Okonkwo" style={inputStyle} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--cwp-muted)', display: 'block', marginBottom: '8px' }}>Organisation</label>
                                    <input name="org" value={form.org} onChange={handleChange} placeholder="Acme Capital Ltd." style={inputStyle} />
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--cwp-muted)', display: 'block', marginBottom: '8px' }}>Work Email *</label>
                                <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@organisation.com" style={inputStyle} />
                            </div>

                            <div>
                                <label style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--cwp-muted)', display: 'block', marginBottom: '8px' }}>Matter Type</label>
                                <select name="matter" value={form.matter} onChange={handleChange} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                                    <option value="">Select a practice area</option>
                                    {MATTER_TYPES.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>

                            <div>
                                <label style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--cwp-muted)', display: 'block', marginBottom: '8px' }}>Brief Description *</label>
                                <textarea
                                    name="message"
                                    required
                                    rows={5}
                                    value={form.message}
                                    onChange={handleChange}
                                    placeholder="Briefly describe your matter — the more context you provide, the better we can prepare for our initial call."
                                    style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.7' }}
                                />
                            </div>

                            <div>
                                <Button type="submit" disabled={sending} variant="primary">
                                    {sending ? <><Loader size={13} style={{ animation: 'spin 1s linear infinite' }} /> Submitting…</> : 'Submit Enquiry'}
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* Office info */}
                    <div>
                        <div style={{ padding: '32px', background: 'var(--cwp-surface)', border: '1px solid var(--cwp-border)', marginBottom: '24px' }}>
                            <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--cwp-accent)', marginBottom: '16px' }}>
                                Contact
                            </p>
                            {[
                                ['Email', 'intelligence@cwplegal.africa'],
                                ['Business Hours', 'Mon – Fri, 8:00 – 18:00 WAT'],
                            ].map(([label, val]) => (
                                <div key={label} style={{ paddingBottom: '12px', marginBottom: '12px', borderBottom: '1px solid var(--cwp-border)' }}>
                                    <p style={{ fontSize: '9px', color: 'var(--cwp-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>{label}</p>
                                    <p style={{ fontSize: '12px', color: 'var(--cwp-text)' }}>{val}</p>
                                </div>
                            ))}
                        </div>

                        <div style={{ padding: '24px', background: 'var(--cwp-ink)', border: '1px solid var(--cwp-border)' }}>
                            <p style={{ fontSize: '11px', color: 'var(--cwp-muted)', lineHeight: 1.7 }}>
                                All communications submitted through this form are treated as strictly confidential. Submission does not create an attorney-client relationship.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus, textarea:focus, select:focus { border-color: var(--cwp-accent) !important; }
        input::placeholder, textarea::placeholder { color: var(--cwp-border); }
        @media (max-width: 900px) { .contact-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 560px) { .form-row { grid-template-columns: 1fr !important; } }
      `}</style>
        </div>
    );
}
