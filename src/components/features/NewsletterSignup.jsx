import React, { useState } from 'react';

export default function NewsletterSignup({ variant = 'banner' }) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle | submitting | success | error

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;
        setStatus('submitting');
        try {
            const res = await fetch('https://formspree.io/f/mqeddogz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({ email }),
            });
            if (res.ok) {
                setStatus('success');
                setEmail('');
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    const isCompact = variant === 'compact';

    return (
        <section
            style={{
                background: isCompact ? 'transparent' : 'var(--cwp-surface)',
                borderTop: isCompact ? 'none' : '1px solid var(--cwp-border)',
                borderBottom: isCompact ? 'none' : '1px solid var(--cwp-border)',
                padding: isCompact ? '0' : '56px 48px',
            }}
        >
            <div
                style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: isCompact ? '1fr' : '1fr 1fr',
                    gap: '40px',
                    alignItems: 'center',
                }}
                className="newsletter-inner"
            >
                {/* Copy */}
                <div>
                    <p
                        style={{
                            fontSize: '9px',
                            fontWeight: 700,
                            letterSpacing: '0.25em',
                            textTransform: 'uppercase',
                            color: 'var(--cwp-accent)',
                            marginBottom: '12px',
                        }}
                    >
                        The CWP Legal Digest
                    </p>
                    <h2
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: isCompact ? '22px' : 'clamp(20px, 2.5vw, 30px)',
                            fontWeight: 400,
                            color: 'var(--cwp-white)',
                            lineHeight: 1.25,
                            marginBottom: '12px',
                        }}
                    >
                        Intelligence across the commercial spectrum.
                    </h2>
                    <p
                        style={{
                            fontSize: '13px',
                            color: 'var(--cwp-muted)',
                            lineHeight: 1.7,
                            maxWidth: '440px',
                        }}
                    >
                        Actionable analysis on Nigerian commercial law—curated for sole-proprietors, startups, and corporations. No noise. Just substance.
                    </p>
                </div>

                {/* Form */}
                <div>
                    {status === 'success' ? (
                        <div
                            style={{
                                padding: '28px 32px',
                                border: '1px solid var(--cwp-accent)',
                                background: 'rgba(212,168,83,0.06)',
                            }}
                        >
                            <p
                                style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: '18px',
                                    fontStyle: 'italic',
                                    color: 'var(--cwp-white)',
                                    marginBottom: '8px',
                                }}
                            >
                                You're on the list.
                            </p>
                            <p style={{ fontSize: '12px', color: 'var(--cwp-muted)' }}>
                                Expect your first digest within the month.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', gap: '0' }}>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    required
                                    style={{
                                        flex: 1,
                                        padding: '16px 20px',
                                        background: 'var(--cwp-raised)',
                                        border: '1px solid var(--cwp-border)',
                                        borderRight: 'none',
                                        color: 'var(--cwp-white)',
                                        fontSize: '13px',
                                        outline: 'none',
                                        fontFamily: 'Inter, sans-serif',
                                    }}
                                />
                                <button
                                    type="submit"
                                    disabled={status === 'submitting'}
                                    style={{
                                        padding: '16px 28px',
                                        background: status === 'submitting' ? 'var(--cwp-muted)' : 'var(--cwp-accent)',
                                        color: 'var(--cwp-void)',
                                        border: 'none',
                                        fontSize: '10px',
                                        fontWeight: 700,
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                        cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                                        whiteSpace: 'nowrap',
                                        fontFamily: 'Inter, sans-serif',
                                        transition: 'opacity 0.15s',
                                    }}
                                >
                                    {status === 'submitting' ? '...' : 'Subscribe'}
                                </button>
                            </div>
                            {status === 'error' && (
                                <p style={{ fontSize: '11px', color: '#e05252' }}>
                                    Something went wrong. Please try again.
                                </p>
                            )}
                            <p style={{ fontSize: '10px', color: 'var(--cwp-muted)', lineHeight: 1.6 }}>
                                No spam. Unsubscribe at any time. We only send when we have something worth saying.
                            </p>
                        </form>
                    )}
                </div>
            </div>

            <style>{`
        @media (max-width: 700px) {
          .newsletter-inner { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </section>
    );
}
