import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articles as localArticles } from '../data/articles';
import { personas } from '../data/personas';
import { fetchPosts } from '../lib/wpApi';

const CATEGORIES = ['All', 'Corporate', 'Capital Markets', 'M&A', 'Disputes', 'Network'];

export default function Precedent() {
    const [activePersona, setActivePersona] = useState('all');
    const [activeCategory, setActiveCategory] = useState('All');
    const [wpArticles, setWpArticles] = useState(null); // null = not yet tried
    const [loadingWP, setLoadingWP] = useState(false);

    // Try to load from WordPress; fall back to local data silently
    useEffect(() => {
        const wpUrl = import.meta.env.VITE_WP_API_URL;
        if (!wpUrl) return; // WordPress not configured yet — use local data

        setLoadingWP(true);
        fetchPosts({ perPage: 50 })
            .then(({ articles }) => setWpArticles(articles))
            .catch(() => setWpArticles(null)) // silent fallback on error
            .finally(() => setLoadingWP(false));
    }, []);

    // Active article source: WordPress if connected, local otherwise
    const articles = wpArticles ?? localArticles;

    const filtered = useMemo(() => {
        return articles.filter((a) => {
            const personaMatch = activePersona === 'all' || a.persona === activePersona;
            const catMatch = activeCategory === 'All' || a.category === activeCategory;
            return personaMatch && catMatch;
        });
    }, [activePersona, activeCategory]);

    return (
        <main style={{ minHeight: '100vh', background: 'var(--cwp-void)', paddingBottom: '80px' }}>
            {/* Header */}
            <section
                style={{
                    borderBottom: '1px solid var(--cwp-border)',
                    padding: '80px 48px 48px',
                    maxWidth: '1200px',
                    margin: '0 auto',
                }}
            >
                <p
                    style={{
                        fontSize: '9px',
                        fontWeight: 700,
                        letterSpacing: '0.25em',
                        textTransform: 'uppercase',
                        color: 'var(--cwp-accent)',
                        marginBottom: '20px',
                    }}
                >
                    Precedent — Legal Intelligence
                </p>
                <h1
                    style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 'clamp(28px, 4vw, 52px)',
                        fontWeight: 400,
                        color: 'var(--cwp-white)',
                        lineHeight: 1.15,
                        marginBottom: '16px',
                        maxWidth: '700px',
                    }}
                >
                    Analysis Written for the Decisions You Are Making
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--cwp-muted)', maxWidth: '520px', lineHeight: 1.7 }}>
                    Substantive analysis from the Clearwater Partners editorial team — segmented by who you are, not just what we do.
                </p>
                {wpArticles && (
                    <p style={{ fontSize: '10px', color: 'var(--cwp-accent)', marginTop: '12px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        ● Live — synced from CWP Editorial
                    </p>
                )}
            </section>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 48px' }}>
                {/* Persona Selector */}
                <section style={{ padding: '40px 0 0' }}>
                    <p
                        style={{
                            fontSize: '9px',
                            fontWeight: 700,
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            color: 'var(--cwp-muted)',
                            marginBottom: '16px',
                        }}
                    >
                        I am...
                    </p>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '32px' }}>
                        <button
                            onClick={() => setActivePersona('all')}
                            style={{
                                padding: '10px 20px',
                                fontSize: '12px',
                                fontWeight: 600,
                                border: '1px solid',
                                borderColor: activePersona === 'all' ? 'var(--cwp-accent)' : 'var(--cwp-border)',
                                background: activePersona === 'all' ? 'var(--cwp-accent)' : 'transparent',
                                color: activePersona === 'all' ? 'var(--cwp-void)' : 'var(--cwp-muted)',
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                                letterSpacing: '0.05em',
                            }}
                        >
                            Everyone
                        </button>
                        {personas.map((p) => (
                            <button
                                key={p.slug}
                                onClick={() => setActivePersona(p.slug)}
                                style={{
                                    padding: '10px 20px',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    border: '1px solid',
                                    borderColor: activePersona === p.slug ? 'var(--cwp-accent)' : 'var(--cwp-border)',
                                    background: activePersona === p.slug ? 'var(--cwp-accent)' : 'transparent',
                                    color: activePersona === p.slug ? 'var(--cwp-void)' : 'var(--cwp-muted)',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s',
                                    letterSpacing: '0.05em',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                }}
                            >
                                <span>{p.icon}</span>
                                {p.prompt}
                            </button>
                        ))}
                    </div>

                    {/* Category chips */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingBottom: '32px', borderBottom: '1px solid var(--cwp-border)' }}>
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                style={{
                                    padding: '6px 14px',
                                    fontSize: '10px',
                                    fontWeight: 600,
                                    letterSpacing: '0.12em',
                                    textTransform: 'uppercase',
                                    border: '1px solid var(--cwp-border)',
                                    background: activeCategory === cat ? 'var(--cwp-raised)' : 'transparent',
                                    color: activeCategory === cat ? 'var(--cwp-white)' : 'var(--cwp-muted)',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s',
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Persona Banner */}
                {activePersona !== 'all' && (() => {
                    const p = personas.find(p => p.slug === activePersona);
                    return p ? (
                        <div
                            style={{
                                margin: '32px 0',
                                padding: '28px 32px',
                                background: 'var(--cwp-surface)',
                                borderLeft: '3px solid var(--cwp-accent)',
                            }}
                        >
                            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--cwp-accent)', marginBottom: '8px' }}>
                                For {p.label}s
                            </p>
                            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 400, fontStyle: 'italic', color: 'var(--cwp-white)', marginBottom: '10px' }}>
                                {p.headline}
                            </h2>
                            <p style={{ fontSize: '13px', color: 'var(--cwp-muted)', lineHeight: 1.7, marginBottom: '16px', maxWidth: '600px' }}>
                                {p.description}
                            </p>
                            <Link
                                to={`/precedent/for/${p.slug}`}
                                style={{ fontSize: '11px', color: 'var(--cwp-accent)', fontWeight: 600, letterSpacing: '0.1em', textDecoration: 'none', textTransform: 'uppercase' }}
                            >
                                See dedicated hub →
                            </Link>
                        </div>
                    ) : null;
                })()}

                {/* Loading state */}
                {loadingWP && (
                    <div style={{ display: 'flex', gap: '1px', background: 'var(--cwp-border)', marginTop: '32px' }}>
                        {[1, 2, 3].map(n => (
                            <div key={n} style={{ flex: 1, background: 'var(--cwp-surface)', height: '200px', opacity: 0.6 }}
                                className="cwp-skeleton" />
                        ))}
                    </div>
                )}

                {/* Results count */}
                <p style={{ fontSize: '11px', color: 'var(--cwp-muted)', margin: '24px 0 20px', letterSpacing: '0.05em' }}>
                    {filtered.length} article{filtered.length !== 1 ? 's' : ''}
                </p>

                {/* Article Grid */}
                {filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--cwp-muted)' }}>
                        <p style={{ fontSize: '14px' }}>No articles match this combination yet.</p>
                    </div>
                ) : (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                            gap: '1px',
                            background: 'var(--cwp-border)',
                            border: '1px solid var(--cwp-border)',
                        }}
                    >
                        {filtered.map((article) => (
                            <Link
                                key={article.slug}
                                to={`/precedent/${article.slug}`}
                                style={{ textDecoration: 'none', display: 'block', background: 'var(--cwp-void)' }}
                            >
                                <article
                                    style={{
                                        padding: '32px',
                                        height: '100%',
                                        cursor: 'pointer',
                                        transition: 'background 0.15s',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--cwp-surface)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--cwp-void)')}
                                >
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                                        <span
                                            style={{
                                                fontSize: '9px',
                                                fontWeight: 700,
                                                letterSpacing: '0.15em',
                                                textTransform: 'uppercase',
                                                color: 'var(--cwp-accent)',
                                            }}
                                        >
                                            {article.category}
                                        </span>
                                        {article.persona && article.persona !== 'corporate' && (
                                            <span
                                                style={{
                                                    fontSize: '9px',
                                                    fontWeight: 600,
                                                    letterSpacing: '0.12em',
                                                    textTransform: 'uppercase',
                                                    color: 'var(--cwp-muted)',
                                                    borderLeft: '1px solid var(--cwp-border)',
                                                    paddingLeft: '8px',
                                                }}
                                            >
                                                {personas.find(p => p.slug === article.persona)?.label || article.persona}
                                            </span>
                                        )}
                                    </div>
                                    <h2
                                        style={{
                                            fontFamily: "'Playfair Display', serif",
                                            fontSize: '18px',
                                            fontWeight: 400,
                                            color: 'var(--cwp-white)',
                                            lineHeight: 1.35,
                                            marginBottom: '12px',
                                        }}
                                    >
                                        {article.title}
                                    </h2>
                                    <p
                                        style={{
                                            fontSize: '12px',
                                            color: 'var(--cwp-muted)',
                                            lineHeight: 1.7,
                                            marginBottom: '24px',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {article.excerpt}
                                    </p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '10px', color: 'var(--cwp-muted)', letterSpacing: '0.05em' }}>
                                            {article.date}
                                        </span>
                                        <span style={{ fontSize: '10px', color: 'var(--cwp-muted)', letterSpacing: '0.05em' }}>
                                            {article.readTime}
                                        </span>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
        @media (max-width: 600px) {
          main section, main > div > * { padding-left: 24px !important; padding-right: 24px !important; }
        }
        @keyframes cwp-skeleton-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        .cwp-skeleton { animation: cwp-skeleton-pulse 1.5s ease-in-out infinite; }
      `}</style>
        </main>
    );
}
