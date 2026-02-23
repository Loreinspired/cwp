import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Loader, AlertCircle, CheckCircle2 } from 'lucide-react';
import SectionLabel from '../ui/SectionLabel';
import Button from '../ui/Button';
import { CWI_EDGE_URL, logCWISession } from '../../lib/supabase';

// ─── Gemini fallback (used when Supabase is not yet configured) ───────────────
const GEMINI_SYSTEM_PROMPT = `You are the Clearwater Intelligence Desk — the AI advisory interface of Clearwater Partners, a Nigerian commercial law firm headquartered in Ado-Ekiti, Ekiti State, specialising in corporate advisory, capital markets, M&A, and regulatory compliance.

Provide brief, authoritative, commercially grounded preliminary legal analysis. Reference Nigerian law specifically: CAMA 2020, NDPA 2023, CBN/SEC frameworks, and Ekiti State Laws where applicable.

Structure:
1. One-sentence statement of the core legal issue.
2. 2–3 paragraphs of analysis citing applicable Nigerian statutes and regulators (CAC, FIRS, CBN, SEC, NDPC).
3. Strategic Considerations: 2–3 bullet points.
4. Action Items: numbered list of concrete next steps.
5. Close with: "This preliminary analysis is provided for orientation purposes only and does not constitute legal advice. Contact the Intelligence Desk to engage Clearwater Partners formally."
Tone: authoritative, principal-led, precise. Word limit: ~300 words.`;

const RATE_LIMIT_MS = 30_000;
const STEPS = [
    { key: 1, label: 'Matter' },
    { key: 2, label: 'Clarify' },
    { key: 3, label: 'Identify' },
    { key: 4, label: 'Analysis' },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function CWIIntake() {
    const [step, setStep]                 = useState(1);
    const [scenario, setScenario]         = useState('');
    const [questions, setQuestions]       = useState([]);
    const [answers, setAnswers]           = useState(['', '']);
    const [email, setEmail]               = useState('');
    const [streamedText, setStreamedText] = useState('');
    const [sources, setSources]           = useState([]);
    const [error, setError]               = useState('');
    const [loading, setLoading]           = useState(false);

    const lastRequestRef = useRef(0);
    const abortRef       = useRef(null);

    useEffect(() => () => abortRef.current?.abort(), []);

    // ── Step 1 ──────────────────────────────────────────────────────────────
    const handleScenarioSubmit = async () => {
        const trimmed = scenario.trim();
        if (trimmed.length < 30) {
            setError('Please describe your matter in at least 30 characters.');
            return;
        }
        setError('');

        if (!CWI_EDGE_URL) { setStep(3); return; }

        setLoading(true);
        try {
            const res  = await fetch(CWI_EDGE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scenario: trimmed, mode: 'drill' }),
            });
            const data = await res.json();
            if (data.questions?.length > 0) {
                setQuestions(data.questions);
                setStep(2);
            } else {
                setStep(3);
            }
        } catch {
            setStep(3);
        } finally {
            setLoading(false);
        }
    };

    // ── Step 3: Unlock ──────────────────────────────────────────────────────
    const handleUnlock = async () => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address.'); return;
        }
        const now = Date.now();
        if (now - lastRequestRef.current < RATE_LIMIT_MS) {
            setError('Please wait 30 seconds between requests.'); return;
        }
        lastRequestRef.current = now;
        setError('');

        CWI_EDGE_URL ? await runRAGAnalysis() : await runGeminiFallback();
    };

    // ── RAG path ────────────────────────────────────────────────────────────
    const runRAGAnalysis = async () => {
        setStep(4);
        setStreamedText('');
        setSources([]);

        const clarifications = questions.length > 0
            ? questions.map((q, i) => `Q: ${q}\nA: ${answers[i] || '(not provided)'}`).join('\n\n')
            : null;

        const controller = new AbortController();
        abortRef.current = controller;

        try {
            const res = await fetch(CWI_EDGE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    scenario: scenario.trim(), email, clarifications, mode: 'analyze',
                }),
                signal: controller.signal,
            });

            if (!res.ok) {
                const e = await res.json().catch(() => ({}));
                throw new Error(e.error || `Server error ${res.status}`);
            }

            const srcHeader = res.headers.get('X-CWI-Sources');
            if (srcHeader) try { setSources(JSON.parse(srcHeader)); } catch { /**/ }

            const reader  = res.body.getReader();
            const decoder = new TextDecoder();
            let fullText  = '';

            outer: while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const lines = decoder.decode(value, { stream: true }).split('\n');
                for (const line of lines) {
                    if (!line.startsWith('data:')) continue;
                    const payload = line.slice(5).trim();
                    if (payload === '[DONE]') break outer;
                    try {
                        const delta = JSON.parse(payload).choices?.[0]?.delta?.content || '';
                        fullText += delta;
                        setStreamedText(fullText);
                    } catch { /**/ }
                }
            }

            // Log session (non-blocking)
            logCWISession({
                email, query: scenario.trim(), clarifications, response: fullText,
                sources: srcHeader ? JSON.parse(srcHeader) : [],
                actionItems: extractActionItems(fullText),
            }).catch(() => {});

        } catch (err) {
            if (err.name !== 'AbortError') {
                setError(err.message || 'Connection failed. Please try again.');
                setStep(3);
            }
        }
    };

    // ── Gemini fallback ─────────────────────────────────────────────────────
    const runGeminiFallback = async () => {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            setError('Intelligence Desk is not yet configured. Please contact us directly.');
            return;
        }
        setStep(4);
        setStreamedText('');
        try {
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        system_instruction: { parts: [{ text: GEMINI_SYSTEM_PROMPT }] },
                        contents: [{ parts: [{ text: scenario.replace(/<[^>]*>/g, '').slice(0, 2000) }] }],
                    }),
                }
            );
            if (!res.ok) throw new Error(`API error ${res.status}`);
            const data = await res.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!text) throw new Error('No response from model.');
            setStreamedText(text);
        } catch (err) {
            setError(err.message || 'An error occurred. Please try again.');
            setStep(3);
        }
    };

    const reset = () => {
        abortRef.current?.abort();
        setStep(1); setScenario(''); setQuestions([]); setAnswers(['', '']);
        setEmail(''); setStreamedText(''); setSources([]); setError('');
    };

    const showResult  = step === 4 && streamedText.length > 0;
    const isStreaming = step === 4 && !showResult;
    const actionItems = extractActionItems(streamedText);

    // ── Render ──────────────────────────────────────────────────────────────
    return (
        <section style={{
            background: 'var(--cwp-surface)', border: '1px solid var(--cwp-border)',
            padding: '56px 48px', position: 'relative', overflow: 'hidden',
        }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', borderLeft: '1px solid var(--cwp-border)', borderBottom: '1px solid var(--cwp-border)', opacity: 0.4 }} />

            <SectionLabel style={{ display: 'block', marginBottom: '12px' }}>
                CWI · Clearwater Intelligence
            </SectionLabel>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 400, color: 'var(--cwp-white)', marginBottom: '8px', lineHeight: 1.2 }}>
                Submit Your Matter
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--cwp-muted)', marginBottom: '36px', maxWidth: '520px', lineHeight: 1.6 }}>
                Describe your legal scenario. The Intelligence Desk provides rapid preliminary
                analysis grounded in the firm's internal precedents and Nigerian commercial law.
            </p>

            {/* Step indicator */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '36px' }} className="cwi-steps">
                {STEPS.map(({ key, label }, i) => {
                    const active = step === key;
                    const done   = step > key;
                    return (
                        <React.Fragment key={key}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                                <div style={{
                                    width: '28px', height: '28px', borderRadius: '50%',
                                    border: `1.5px solid ${done || active ? 'var(--cwp-accent)' : 'var(--cwp-border)'}`,
                                    background: done ? 'var(--cwp-accent)' : 'transparent',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.3s',
                                }}>
                                    {done
                                        ? <CheckCircle2 size={13} style={{ color: 'var(--cwp-void)' }} />
                                        : <span style={{ fontSize: '9px', color: active ? 'var(--cwp-accent)' : 'var(--cwp-muted)' }}>{key}</span>
                                    }
                                </div>
                                <span style={{ fontSize: '8px', letterSpacing: '0.14em', textTransform: 'uppercase', color: active || done ? 'var(--cwp-accent)' : 'var(--cwp-muted)' }}>
                                    {label}
                                </span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div style={{ flex: 1, height: '1px', margin: '0 8px', marginBottom: '20px', background: done ? 'var(--cwp-accent)' : 'var(--cwp-border)', transition: 'background 0.4s' }} />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            {/* ── Step 1: Scenario ─────────────────────────────────────── */}
            {step === 1 && (
                <div>
                    <textarea
                        value={scenario}
                        onChange={e => setScenario(e.target.value)}
                        placeholder="Describe your matter — e.g. 'We are acquiring a 60% stake in a Nigerian fintech company and need to understand the regulatory approvals required before signing a term sheet…'"
                        rows={5}
                        style={{ ...BASE_INPUT, padding: '16px', lineHeight: '1.7', resize: 'vertical', marginBottom: '16px' }}
                    />
                    {error && <Err msg={error} />}
                    <Button onClick={handleScenarioSubmit} disabled={loading} variant="primary">
                        {loading ? <><Loader size={14} style={SPIN} /> Preparing…</> : <>Continue <ArrowRight size={14} /></>}
                    </Button>
                </div>
            )}

            {/* ── Step 2: Drilling Questions ───────────────────────────── */}
            {step === 2 && (
                <div>
                    <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--cwp-accent)', marginBottom: '24px' }}>
                        Two clarifying questions
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginBottom: '32px' }}>
                        {questions.map((q, i) => (
                            <div key={i}>
                                <p style={{ fontSize: '13px', color: 'var(--cwp-white)', marginBottom: '12px', lineHeight: 1.55 }}>
                                    <span style={{ color: 'var(--cwp-accent)', fontFamily: "'Playfair Display', serif", marginRight: '10px' }}>0{i + 1}.</span>
                                    {q}
                                </p>
                                <input
                                    type="text"
                                    value={answers[i]}
                                    onChange={e => setAnswers(a => { const n = [...a]; n[i] = e.target.value; return n; })}
                                    placeholder="Your answer…"
                                    style={{ ...BASE_INPUT, padding: '14px 16px' }}
                                />
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Button onClick={() => setStep(3)} variant="primary">Continue <ArrowRight size={14} /></Button>
                        <Button onClick={() => setStep(3)} variant="ghost">Skip</Button>
                    </div>
                </div>
            )}

            {/* ── Step 3: Email Gate ───────────────────────────────────── */}
            {step === 3 && (
                <div>
                    <p style={{ fontSize: '13px', color: 'var(--cwp-muted)', marginBottom: '20px', lineHeight: 1.6 }}>
                        Your analysis is ready. Enter your work email to unlock the preliminary
                        assessment — sourced from the firm's internal precedents and Nigerian commercial law.
                    </p>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !loading && handleUnlock()}
                        placeholder="your@organisation.com"
                        style={{ ...BASE_INPUT, padding: '14px 16px', marginBottom: '16px' }}
                    />
                    {error && <Err msg={error} />}
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <Button onClick={handleUnlock} disabled={loading} variant="primary">
                            Unlock Analysis <ArrowRight size={14} />
                        </Button>
                        <Button onClick={() => { setStep(questions.length ? 2 : 1); setError(''); }} variant="ghost">Back</Button>
                    </div>
                </div>
            )}

            {/* ── Step 4: Streaming + Complete Result ─────────────────── */}
            {step === 4 && (
                <div>
                    {sources.length > 0 && (
                        <div style={{ marginBottom: '16px', padding: '10px 16px', background: 'rgba(201,160,74,0.06)', border: '1px solid rgba(201,160,74,0.2)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                            <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--cwp-accent)', whiteSpace: 'nowrap', paddingTop: '2px' }}>Sources</span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {sources.map(s => (
                                    <span key={s} style={{ fontSize: '10px', color: 'var(--cwp-text)', background: 'var(--cwp-surface)', padding: '3px 10px', border: '1px solid var(--cwp-border)' }}>{s}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {!showResult && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <Loader size={14} style={{ color: 'var(--cwp-accent)', ...SPIN }} />
                            <p style={{ fontSize: '11px', color: 'var(--cwp-muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                                Consulting precedents…
                            </p>
                        </div>
                    )}

                    <div style={{ background: 'var(--cwp-raised)', border: '1px solid var(--cwp-border)', borderLeft: '3px solid var(--cwp-accent)', padding: '24px', marginBottom: '20px' }}>
                        <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--cwp-accent)', marginBottom: '16px' }}>
                            Preliminary Analysis
                        </p>
                        <div style={{ fontSize: '13px', color: 'var(--cwp-text)', lineHeight: '1.85', whiteSpace: 'pre-wrap' }}>
                            {streamedText}
                            {!showResult && (
                                <span style={{ display: 'inline-block', width: '2px', height: '14px', background: 'var(--cwp-accent)', marginLeft: '2px', animation: 'cwi-blink 1s steps(1) infinite' }} />
                            )}
                        </div>
                    </div>

                    {showResult && actionItems.length > 0 && (
                        <div style={{ padding: '20px 24px', background: 'var(--cwp-surface)', border: '1px solid var(--cwp-border)', marginBottom: '20px' }}>
                            <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--cwp-accent)', marginBottom: '16px' }}>
                                Action Items
                            </p>
                            <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {actionItems.map((item, i) => (
                                    <li key={i} style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--cwp-text)', lineHeight: 1.55 }}>
                                        <span style={{ color: 'var(--cwp-accent)', fontWeight: 700, flexShrink: 0, fontFamily: "'Playfair Display', serif" }}>
                                            {String(i + 1).padStart(2, '0')}.
                                        </span>
                                        {item}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}

                    {showResult && (
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <Button onClick={reset} variant="ghost">Submit Another Matter</Button>
                            <Button onClick={() => window.location.href = '/contact'} variant="primary">
                                Engage Formally <ArrowRight size={14} />
                            </Button>
                        </div>
                    )}
                </div>
            )}

            <style>{`
                @keyframes cwi-spin  { to { transform: rotate(360deg); } }
                @keyframes cwi-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
                .cwi-steps { overflow-x: auto; scrollbar-width: none; }
                textarea:focus, input:focus { border-color: var(--cwp-accent) !important; outline: none; }
                textarea::placeholder, input::placeholder { color: var(--cwp-border); }
            `}</style>
        </section>
    );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractActionItems(text) {
    if (!text) return [];
    const match = text.match(/\*{0,2}Action Items?\*{0,2}:?\n+([\s\S]*?)(?:\n{2,}\*{0,2}Disclaimer|\n{2,}\*{0,2}$|$)/i);
    if (!match) return [];
    return match[1]
        .split('\n')
        .map(l => l.replace(/^\d+\.\s*/, '').replace(/^\*+\s*/, '').trim())
        .filter(l => l.length > 10)
        .slice(0, 5);
}

const BASE_INPUT = {
    width: '100%',
    background: 'var(--cwp-raised)',
    border: '1px solid var(--cwp-border)',
    color: 'var(--cwp-text)',
    fontSize: '13px',
    fontFamily: 'Inter, sans-serif',
    display: 'block',
};

const SPIN = { animation: 'cwi-spin 1s linear infinite' };

function Err({ msg }) {
    return (
        <p style={{ fontSize: '12px', color: '#e07070', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertCircle size={12} style={{ flexShrink: 0 }} /> {msg}
        </p>
    );
}
