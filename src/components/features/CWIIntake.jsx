import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Send, Loader } from 'lucide-react';
import SectionLabel from '../ui/SectionLabel';
import Button from '../ui/Button';
import { saveCWISession } from '../../lib/supabase';

const SYSTEM_PROMPT = `You are the Clearwater Intelligence Desk — the AI advisory interface of Clearwater Partners, a Nigerian commercial law firm specialising in corporate advisory, capital markets, M&A, and regulatory compliance.

CONVERSATION PROTOCOL:
1. When the user first describes their matter, respond with ONE focused clarifying question (e.g. jurisdiction, deal size, parties involved, timeline, regulatory body). Do not deliver analysis yet.
2. After their answer, you may ask ONE more targeted question if genuinely needed. Otherwise proceed to analysis.
3. After 2 user exchanges, deliver a structured preliminary analysis with:
   - Key Legal Issues
   - Relevant Law / Regulatory Framework (Nigerian law — CAMA 2020, BOFIA, FIRS, SEC rules, etc.)
   - Recommended Next Steps
   - A brief note that this is preliminary and formal engagement is required for substantive advice.
4. After delivering analysis, remain available for follow-up questions in the same session.

TONE: Authoritative, precise, and substantive. Never casual. Never speculative without flagging it.
LENGTH: Clarifying questions: 1-2 sentences max. Analysis: 200-300 words, use clear headings.
CRITICAL: Never refuse to engage with a legitimate commercial law matter. Always move the conversation forward.`;

const MODEL = 'gemini-2.5-flash';

function TypingIndicator() {
    return (
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center', padding: '12px 16px' }}>
            {[0, 1, 2].map(i => (
                <div key={i} style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: 'var(--cwp-accent)', opacity: 0.6,
                    animation: `cwi-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
                }} />
            ))}
        </div>
    );
}

function Message({ role, content, isFirst }) {
    const isUser = role === 'user';
    // The very first model message renders as a styled prompt, not a bubble
    if (!isUser && isFirst) {
        return (
            <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--cwp-border)' }}>
                <p style={{ fontSize: '13px', color: 'var(--cwp-muted)', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>{content}</p>
            </div>
        );
    }
    return (
        <div style={{
            display: 'flex',
            justifyContent: isUser ? 'flex-end' : 'flex-start',
            marginBottom: '10px',
        }}>
            <div style={{
                maxWidth: '88%',
                padding: '10px 14px',
                background: isUser ? 'var(--cwp-accent)' : 'rgba(255,255,255,0.04)',
                color: isUser ? 'var(--cwp-void)' : 'var(--cwp-text)',
                fontSize: '13px',
                lineHeight: 1.75,
                whiteSpace: 'pre-wrap',
                borderLeft: isUser ? 'none' : '2px solid var(--cwp-accent)',
            }}>
                {content}
            </div>
        </div>
    );
}

export default function CWIIntake({ heroMode = false }) {
    const [messages, setMessages] = useState([
        { role: 'model', content: 'Welcome to the Clearwater Intelligence Desk.\n\nDescribe your legal matter — I\'ll ask a few focused questions, then deliver a structured preliminary analysis.' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [sessionId] = useState(() => typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36));
    const [leadState, setLeadState] = useState({ visible: false, submitted: false, name: '', email: '', phone: '' });
    const [userTurns, setUserTurns] = useState(0);
    const containerRef = useRef(null);
    const textareaRef = useRef(null);

    // Scroll WITHIN the chat container only — never jumps the page
    const scrollToBottom = () => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const sendMessage = async () => {
        if (!input.trim() || isTyping) return;

        const userMsg = { role: 'user', content: input.trim() };
        const newMessages = [...messages, userMsg];
        const newTurns = userTurns + 1;
        setMessages(newMessages);
        setInput('');
        setIsTyping(true);
        setUserTurns(newTurns);
        // Dismiss mobile keyboard cleanly after send
        textareaRef.current?.blur();

        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            setMessages([...newMessages, { role: 'model', content: 'Configuration error — please contact intelligence@cwplegal.africa directly.' }]);
            setIsTyping(false);
            return;
        }

        const contents = newMessages.map(m => ({
            role: m.role,
            parts: [{ text: m.content }],
        }));

        try {
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
                        contents,
                    }),
                }
            );
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err?.error?.message || `API error ${res.status}`);
            }
            const data = await res.json();
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate a response.';
            const modelMsg = { role: 'model', content: reply };
            const updatedMessages = [...newMessages, modelMsg];
            setMessages(updatedMessages);

            // Show lead capture after first AI response
            if (newTurns >= 1 && !leadState.visible && !leadState.submitted) {
                setTimeout(() => setLeadState(prev => ({ ...prev, visible: true })), 800);
            }

            // Save to Supabase + localStorage backup
            saveCWISession({ sessionId, messages: updatedMessages, leadCaptured: false });
            try {
                const allSessions = JSON.parse(localStorage.getItem('cwi_sessions') || '[]');
                const idx = allSessions.findIndex(s => s.id === sessionId);
                const session = { id: sessionId, messages: updatedMessages, timestamp: new Date().toISOString() };
                if (idx >= 0) allSessions[idx] = session;
                else allSessions.push(session);
                localStorage.setItem('cwi_sessions', JSON.stringify(allSessions));
            } catch (_) { /* storage unavailable */ }

        } catch (e) {
            setMessages([...newMessages, { role: 'model', content: `Something went wrong: ${e.message}.\n\nPlease try again or contact us at intelligence@cwplegal.africa.` }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const submitLead = () => {
        if (!leadState.email) return;
        // Save to Supabase with full lead details
        saveCWISession({
            sessionId,
            messages,
            name: leadState.name,
            email: leadState.email,
            phone: leadState.phone,
            leadCaptured: true,
        });
        // Also persist locally
        try {
            const enrichedSession = { id: sessionId, name: leadState.name, email: leadState.email, phone: leadState.phone, messages, timestamp: new Date().toISOString() };
            const all = JSON.parse(localStorage.getItem('cwi_leads') || '[]');
            all.push(enrichedSession);
            localStorage.setItem('cwi_leads', JSON.stringify(all));
        } catch (_) { /* storage unavailable */ }
        setLeadState(prev => ({ ...prev, submitted: true }));
    };

    const chatUI = (
        <>
            {/* Message list */}
            <div ref={containerRef} style={{
                minHeight: '80px',
                maxHeight: heroMode ? '300px' : '380px',
                overflowY: 'auto',
                marginBottom: '12px',
                paddingRight: '4px',
                scrollbarWidth: 'thin',
                scrollbarColor: 'var(--cwp-border) transparent',
                WebkitOverflowScrolling: 'touch', // smooth scroll on iOS
            }}>
                {messages.map((m, i) => <Message key={i} role={m.role} content={m.content} isFirst={i === 0} />)}
                {isTyping && <TypingIndicator />}
            </div>

            {/* Lead capture card */}
            {leadState.visible && !leadState.submitted && (
                <div style={{
                    background: 'var(--cwp-void)',
                    border: '1px solid var(--cwp-accent)',
                    padding: '16px',
                    marginBottom: '16px',
                    animation: 'cwi-fadein 0.4s ease',
                }}>
                    <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--cwp-accent)', marginBottom: '12px' }}>
                        Want us to follow up?
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                        <input
                            type="text"
                            placeholder="Your name"
                            value={leadState.name}
                            onChange={e => setLeadState(p => ({ ...p, name: e.target.value }))}
                            style={{ background: 'var(--cwp-raised)', border: '1px solid var(--cwp-border)', color: 'var(--cwp-text)', padding: '10px 12px', fontSize: '12px', outline: 'none' }}
                        />
                        <input
                            type="tel"
                            placeholder="Phone number"
                            value={leadState.phone}
                            onChange={e => setLeadState(p => ({ ...p, phone: e.target.value }))}
                            style={{ background: 'var(--cwp-raised)', border: '1px solid var(--cwp-border)', color: 'var(--cwp-text)', padding: '10px 12px', fontSize: '12px', outline: 'none' }}
                        />
                    </div>
                    <input
                        type="email"
                        placeholder="Email address"
                        value={leadState.email}
                        onChange={e => setLeadState(p => ({ ...p, email: e.target.value }))}
                        style={{ width: '100%', background: 'var(--cwp-raised)', border: '1px solid var(--cwp-border)', color: 'var(--cwp-text)', padding: '10px 12px', fontSize: '12px', outline: 'none', marginBottom: '10px', boxSizing: 'border-box' }}
                    />
                    <button
                        onClick={submitLead}
                        style={{
                            width: '100%', background: 'var(--cwp-accent)', color: 'var(--cwp-void)',
                            border: 'none', padding: '11px', fontSize: '10px', fontWeight: 700,
                            letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        }}
                    >
                        Connect Me With the Firm <ArrowRight size={13} />
                    </button>
                </div>
            )}

            {leadState.submitted && (
                <div style={{ background: 'var(--cwp-void)', border: '1px solid var(--cwp-accent)', padding: '14px 16px', marginBottom: '16px', fontSize: '12px', color: 'var(--cwp-muted)', lineHeight: 1.6 }}>
                    ✓ Received. We'll be in touch within 24 hours. You can continue the conversation below.
                </div>
            )}

            {/* Input */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Describe your matter… (Enter to send, Shift+Enter for new line)"
                    rows={2}
                    style={{
                        flex: 1,
                        background: 'var(--cwp-raised)',
                        border: '1px solid var(--cwp-border)',
                        color: 'var(--cwp-text)',
                        padding: '12px 14px',
                        fontSize: '13px',
                        lineHeight: 1.6,
                        resize: 'none',
                        outline: 'none',
                        fontFamily: 'inherit',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--cwp-accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--cwp-border)'}
                />
                <button
                    onClick={sendMessage}
                    disabled={!input.trim() || isTyping}
                    style={{
                        background: input.trim() && !isTyping ? 'var(--cwp-accent)' : 'var(--cwp-raised)',
                        color: input.trim() && !isTyping ? 'var(--cwp-void)' : 'var(--cwp-border)',
                        border: '1px solid var(--cwp-border)',
                        padding: '12px 16px',
                        cursor: input.trim() && !isTyping ? 'pointer' : 'default',
                        transition: 'all 0.15s',
                        display: 'flex', alignItems: 'center',
                    }}
                >
                    {isTyping ? <Loader size={16} style={{ animation: 'cwi-spin 1s linear infinite' }} /> : <Send size={16} />}
                </button>
            </div>

            <style>{`
                @keyframes cwi-dot {
                    0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
                    40% { transform: scale(1); opacity: 1; }
                }
                @keyframes cwi-spin { to { transform: rotate(360deg); } }
                @keyframes cwi-fadein { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
                textarea:focus, input:focus { border-color: var(--cwp-accent) !important; }
                textarea::placeholder, input::placeholder { color: var(--cwp-border); }
            `}</style>
        </>
    );

    if (heroMode) return chatUI;

    return (
        <section style={{
            background: 'var(--cwp-surface)',
            border: '1px solid var(--cwp-border)',
            padding: '48px',
            position: 'relative',
            overflow: 'hidden',
        }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', borderLeft: '1px solid var(--cwp-border)', borderBottom: '1px solid var(--cwp-border)', opacity: 0.3 }} />
            <SectionLabel style={{ display: 'block', marginBottom: '10px' }}>CWI · Clearwater Intelligence</SectionLabel>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 400, color: 'var(--cwp-white)', marginBottom: '28px', lineHeight: 1.2 }}>
                Submit Your Matter
            </h2>
            {chatUI}
        </section>
    );
}
