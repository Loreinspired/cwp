import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { articles } from '../data/articles';
import { partners } from '../data/partners';
import Tag from '../components/ui/Tag';
import SectionLabel from '../components/ui/SectionLabel';

export default function PrecedentArticle() {
    const { slug } = useParams();
    const article = articles.find(a => a.slug === slug);

    if (!article) return <Navigate to="/precedent" replace />;

    const relatedArticles = articles.filter(a => article.related?.includes(a.slug)).slice(0, 3);

    return (
        <div style={{ paddingTop: '64px' }}>
            {/* Back nav */}
            <div style={{ padding: '24px 40px', borderBottom: '1px solid var(--cwp-border)', background: 'var(--cwp-ink)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <Link to="/precedent" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '10px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--cwp-muted)' }}>
                        <ArrowLeft size={12} /> Precedent
                    </Link>
                </div>
            </div>

            {/* Article header */}
            <section style={{ padding: '64px 40px 48px', borderBottom: '1px solid var(--cwp-border)', background: 'var(--cwp-ink)' }}>
                <div style={{ maxWidth: '760px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
                        <Tag>{article.category}</Tag>
                        <span style={{ fontSize: '10px', color: 'var(--cwp-muted)' }}>{article.date}</span>
                        <span style={{ fontSize: '10px', color: 'var(--cwp-border)' }}>·</span>
                        <span style={{ fontSize: '10px', color: 'var(--cwp-muted)' }}>{article.readTime}</span>
                    </div>
                    <h1
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 'clamp(28px, 4vw, 52px)',
                            fontWeight: 400,
                            color: 'var(--cwp-white)',
                            lineHeight: 1.2,
                            marginBottom: '24px',
                        }}
                    >
                        {article.title}
                    </h1>
                    <p style={{ fontSize: '15px', color: 'var(--cwp-muted)', lineHeight: 1.8, fontStyle: 'italic' }}>
                        — {article.author}
                    </p>
                </div>
            </section>

            {/* Article body */}
            <section style={{ padding: '64px 40px', maxWidth: '760px', margin: '0 auto' }}>
                {article.body.split('\n\n').map((para, i) => {
                    // Simple markdown bold rendering
                    const rendered = para.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
                    if (para.startsWith('**') && para.endsWith('**')) {
                        return null; // handled inline
                    }
                    if (/^\d+\.\s/.test(para)) {
                        // Numbered list item
                        const [num, ...rest] = para.split('. ');
                        return (
                            <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--cwp-accent)', minWidth: '20px', marginTop: '3px' }}>{num}.</span>
                                <p style={{ fontSize: '14px', color: 'var(--cwp-text)', lineHeight: 1.85 }} dangerouslySetInnerHTML={{ __html: rest.join('. ').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
                            </div>
                        );
                    }
                    return (
                        <p
                            key={i}
                            style={{ fontSize: '14px', color: 'var(--cwp-text)', lineHeight: 1.85, marginBottom: '24px' }}
                            dangerouslySetInnerHTML={{ __html: rendered }}
                        />
                    );
                })}

                {/* Tags */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--cwp-border)' }}>
                    {article.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
                </div>
            </section>

            {/* Related articles */}
            {relatedArticles.length > 0 && (
                <section style={{ padding: '48px 40px 80px', borderTop: '1px solid var(--cwp-border)', background: 'var(--cwp-ink)' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <SectionLabel light style={{ display: 'block', marginBottom: '24px' }}>Related Precedent</SectionLabel>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1px', background: 'var(--cwp-border)' }}>
                            {relatedArticles.map(a => (
                                <Link key={a.slug} to={`/precedent/${a.slug}`} style={{ display: 'block', background: 'var(--cwp-surface)', textDecoration: 'none', padding: '24px' }}>
                                    <Tag style={{ marginBottom: '12px' }}>{a.category}</Tag>
                                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', fontWeight: 400, color: 'var(--cwp-white)', lineHeight: 1.4, marginTop: '10px' }}>{a.title}</h3>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
