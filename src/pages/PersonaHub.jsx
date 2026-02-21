import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { personas } from '../data/personas';
import { articles } from '../data/articles';

export default function PersonaHub() {
    const { persona: slug } = useParams();
    const persona = personas.find((p) => p.slug === slug);
    const personaArticles = articles.filter((a) => a.persona === slug);

    if (!persona) {
        return (
            <main style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cwp-void)' }}>
                <p style={{ color: 'var(--cwp-muted)', fontSize: '14px' }}>Persona not found.</p>
            </main>
        );
    }

    return (
        <main style={{ background: 'var(--cwp-void)', minHeight: '100vh', paddingBottom: '100px' }}>
            {/* Hero */}
            <section
                style={{
                    borderBottom: '1px solid var(--cwp-border)',
                    padding: '80px 48px 60px',
                    maxWidth: '1200px',
                    margin: '0 auto',
                }}
            >
                <Link
                    to="/precedent"
                    style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: 'var(--cwp-muted)',
                        textDecoration: 'none',
                        display: 'inline-block',
                        marginBottom: '32px',
                    }}
                >
                    ← All Articles
                </Link>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', marginBottom: '24px' }}>
                    <span style={{ fontSize: '48px', lineHeight: 1 }}>{persona.icon}</span>
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
                            Written for {persona.label}s
                        </p>
                        <h1
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: 'clamp(26px, 3.5vw, 48px)',
                                fontWeight: 400,
                                color: 'var(--cwp-white)',
                                lineHeight: 1.2,
                                maxWidth: '640px',
                            }}
                        >
                            {persona.headline}
                        </h1>
                    </div>
                </div>

                <p
                    style={{
                        fontSize: '14px',
                        color: 'var(--cwp-muted)',
                        maxWidth: '540px',
                        lineHeight: 1.75,
                        marginBottom: '32px',
                    }}
                >
                    {persona.description}
                </p>

                {/* Topic tags */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {persona.topics.map((t) => (
                        <span
                            key={t}
                            style={{
                                padding: '6px 14px',
                                fontSize: '10px',
                                fontWeight: 600,
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                border: '1px solid var(--cwp-border)',
                                color: 'var(--cwp-muted)',
                            }}
                        >
                            {t}
                        </span>
                    ))}
                </div>
            </section>

            {/* Articles */}
            <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 48px 0' }}>
                {personaArticles.length === 0 ? (
                    <div
                        style={{
                            padding: '80px 0',
                            textAlign: 'center',
                            border: '1px solid var(--cwp-border)',
                        }}
                    >
                        <p style={{ color: 'var(--cwp-muted)', fontSize: '14px' }}>
                            Articles for this audience are coming soon.
                        </p>
                    </div>
                ) : (
                    <>
                        <p
                            style={{
                                fontSize: '11px',
                                color: 'var(--cwp-muted)',
                                letterSpacing: '0.05em',
                                marginBottom: '24px',
                            }}
                        >
                            {personaArticles.length} article{personaArticles.length !== 1 ? 's' : ''} for {persona.label}s
                        </p>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                                gap: '1px',
                                background: 'var(--cwp-border)',
                                border: '1px solid var(--cwp-border)',
                            }}
                        >
                            {personaArticles.map((article) => (
                                <Link
                                    key={article.slug}
                                    to={`/precedent/${article.slug}`}
                                    style={{ textDecoration: 'none', background: 'var(--cwp-void)', display: 'block' }}
                                >
                                    <article
                                        style={{ padding: '32px', cursor: 'pointer', transition: 'background 0.15s' }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--cwp-surface)')}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--cwp-void)')}
                                    >
                                        <span
                                            style={{
                                                fontSize: '9px',
                                                fontWeight: 700,
                                                letterSpacing: '0.15em',
                                                textTransform: 'uppercase',
                                                color: 'var(--cwp-accent)',
                                                display: 'block',
                                                marginBottom: '16px',
                                            }}
                                        >
                                            {article.category}
                                        </span>
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
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ fontSize: '10px', color: 'var(--cwp-muted)' }}>{article.date}</span>
                                            <span style={{ fontSize: '10px', color: 'var(--cwp-muted)' }}>{article.readTime}</span>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    </>
                )}
            </section>

            {/* CWI CTA */}
            <section
                style={{
                    maxWidth: '1200px',
                    margin: '64px auto 0',
                    padding: '48px',
                    background: 'var(--cwp-surface)',
                    borderTop: '1px solid var(--cwp-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '32px',
                    flexWrap: 'wrap',
                }}
            >
                <div>
                    <p
                        style={{
                            fontSize: '9px',
                            fontWeight: 700,
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            color: 'var(--cwp-accent)',
                            marginBottom: '10px',
                        }}
                    >
                        Clearwater Intelligence
                    </p>
                    <h2
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '22px',
                            fontWeight: 400,
                            fontStyle: 'italic',
                            color: 'var(--cwp-white)',
                            marginBottom: '8px',
                        }}
                    >
                        Have a specific matter in mind?
                    </h2>
                    <p style={{ fontSize: '13px', color: 'var(--cwp-muted)', maxWidth: '440px', lineHeight: 1.7 }}>
                        Our AI intake desk can give you a preliminary read on your situation in under 2 minutes — before you speak to a lawyer.
                    </p>
                </div>
                <Link
                    to="/"
                    style={{
                        display: 'inline-block',
                        padding: '16px 28px',
                        background: 'var(--cwp-accent)',
                        color: 'var(--cwp-void)',
                        fontSize: '11px',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        textDecoration: 'none',
                        whiteSpace: 'nowrap',
                        transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                    Use the Intake Desk →
                </Link>
            </section>

            <style>{`
        @media (max-width: 600px) {
          main section { padding-left: 24px !important; padding-right: 24px !important; }
        }
      `}</style>
        </main>
    );
}
