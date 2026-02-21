import React, { useState, useRef } from 'react';
import { ArrowRight, Loader, AlertCircle } from 'lucide-react';
import SectionLabel from '../ui/SectionLabel';
import Button from '../ui/Button';

const RATE_LIMIT_MS = 30000; // 30s between requests per session
const SYSTEM_PROMPT = `You are the Clearwater Intelligence Desk — the AI advisory interface of Clearwater Partners, a Nigerian commercial law firm specialising in corporate advisory, capital markets, M&A, and regulatory compliance.

Your role is to provide brief, authoritative, and commercially grounded preliminary legal analysis on matters submitted by prospective and existing clients. 

Rules:
1. Be direct and structured. Lead with the key legal issues, then outline 2–3 strategic considerations.
2. Use short paragraphs. Never use bullet lists except for the strategic considerations.
3. Limit your response to approximately 250 words.
4. End with: "This preliminary analysis is provided for orientation purposes only and does not constitute legal advice. Contact the intelligence desk to engage Clearwater Partners formally."
5. Do not ask follow-up questions. Work with what you have.
6. Maintain a tone that is authoritative, precise, and reassuring — never casual or speculative.`;

export default function CWIIntake({ heroMode = false }) {
    const [step, setStep] = useState(1); // 1=scenario, 2=email gate, 3=result
    const [scenario, setScenario] = useState('');
    const [email, setEmail] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const lastRequestRef = useRef(0);

    const handleAnalyze = () => {
        if (!scenario.trim() || scenario.trim().length < 30) {
            setError('Please describe your matter in at least 30 characters.');
            return;
        }
        setError('');
        setStep(2);
    };

    const handleUnlock = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        const now = Date.now();
        if (now - lastRequestRef.current < RATE_LIMIT_MS) {
            setError('Please wait 30 seconds between requests.');
            return;
        }
        setError('');
        setLoading(true);
        lastRequestRef.current = now;

        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            setError('API key not configured. Please contact the intelligence desk directly.');
            setLoading(false);
            return;
        }

        // Simple input sanitisation
        const sanitised = scenario.replace(/<[^>]*>/g, '').slice(0, 2000);

        try {
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
                        contents: [{ parts: [{ text: sanitised }] }],
                    }),
                }
            );

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData?.error?.message || `API error ${res.status}`);
            }

            const data = await res.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!text) throw new Error('No response received from the model.');
            setResult(text);
            setStep(3);
        } catch (err) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setStep(1);
        setScenario('');
        setEmail('');
        setResult('');
        setError('');
    };

    const inner = (
        <>
            {/* Step indicators */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
                {[1, 2, 3].map(s => (
                    <div key={s} style={{ width: s <= step ? '24px' : '8px', height: '2px', background: s <= step ? 'var(--cwp-accent)' : 'var(--cwp-border)', transition: 'all 0.3s ease' }} />
                ))}
            </div>

            {/* Step 1: Scenario */}
            {step === 1 && (
                <div>
                    <textarea
                        value={scenario}
                        onChange={e => setScenario(e.target.value)}
                        placeholder="Describe your matter — e.g. 'We are acquiring a 60% stake in a Nigerian fintech company and need to understand the regulatory approvals required before signing…'"
                        rows={5}
                        style={{
                            width: '100%',
                            background: 'var(--cwp-raised)',
                            border: '1px solid var(--cwp-border)',
                            color: 'var(--cwp-text)',
                            padding: '16px',
                            fontSize: '13px',
                            lineHeight: '1.7',
                            resize: 'vertical',
                            outline: 'none',
                            marginBottom: '16px',
                        }}
                    />
                    {error && <p style={{ fontSize: '12px', color: '#e07070', marginBottom: '12px' }}><AlertCircle size={12} style={{ display: 'inline', marginRight: '6px' }} />{error}</p>}
                    <Button onClick={handleAnalyze} variant="primary">
                        Analyse Scenario <ArrowRight size={14} />
                    </Button>
                </div>
            )}

            {/* Step 2: Email Gate */}
            {step === 2 && (
                <div>
                    <p style={{ fontSize: '13px', color: 'var(--cwp-muted)', marginBottom: '20px', lineHeight: 1.6 }}>
                        Your analysis is ready. Enter your work email to receive the preliminary assessment — we do not share your details with third parties.
                    </p>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !loading && handleUnlock()}
                        placeholder="your@organisation.com"
                        style={{
                            width: '100%',
                            background: 'var(--cwp-raised)',
                            border: '1px solid var(--cwp-border)',
                            color: 'var(--cwp-text)',
                            padding: '14px 16px',
                            fontSize: '13px',
                            outline: 'none',
                            marginBottom: '16px',
                        }}
                    />
                    {error && <p style={{ fontSize: '12px', color: '#e07070', marginBottom: '12px' }}><AlertCircle size={12} style={{ display: 'inline', marginRight: '6px' }} />{error}</p>}
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <Button onClick={handleUnlock} disabled={loading} variant="primary">
                            {loading ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Analysing…</> : <>Unlock Analysis <ArrowRight size={14} /></>}
                        </Button>
                        <Button onClick={() => { setStep(1); setError(''); }} variant="ghost">Back</Button>
                    </div>
                </div>
            )}

            {/* Step 3: Result */}
            {step === 3 && (
                <div>
                    <div
                        style={{
                            background: 'var(--cwp-raised)',
                            border: '1px solid var(--cwp-border)',
                            borderLeft: '3px solid var(--cwp-accent)',
                            padding: '24px',
                            marginBottom: '24px',
                        }}
                    >
                        <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--cwp-accent)', marginBottom: '16px' }}>
                            Preliminary Analysis
                        </p>
                        <div style={{ fontSize: '13px', color: 'var(--cwp-text)', lineHeight: '1.85', whiteSpace: 'pre-wrap' }}>
                            {result}
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <Button onClick={reset} variant="ghost">Submit Another Matter</Button>
                        <Button onClick={() => window.location.href = '/contact'} variant="primary">Engage Formally <ArrowRight size={14} /></Button>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        textarea:focus, input:focus { border-color: var(--cwp-accent) !important; }
        textarea::placeholder, input::placeholder { color: var(--cwp-border); }
      `}</style>
        </>
    );

    if (heroMode) return inner;

    return (
        <section style={{
            background: 'var(--cwp-surface)',
            border: '1px solid var(--cwp-border)',
            padding: '56px 48px',
            position: 'relative',
            overflow: 'hidden',
        }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', borderLeft: '1px solid var(--cwp-border)', borderBottom: '1px solid var(--cwp-border)', opacity: 0.4 }} />
            <SectionLabel style={{ display: 'block', marginBottom: '12px' }}>CWI · Clearwater Intelligence</SectionLabel>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 400, color: 'var(--cwp-white)', marginBottom: '8px', lineHeight: 1.2 }}>
                Submit Your Matter
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--cwp-muted)', marginBottom: '36px', maxWidth: '480px', lineHeight: 1.6 }}>
                Describe your legal scenario below. Our AI advisory desk provides rapid preliminary analysis — no commitment required.
            </p>
            {inner}
        </section>
    );
}
