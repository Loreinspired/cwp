import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'; // ← Added for SEO Injection
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

    // ─── SEO & AI PREPARATION ──────────────────────────────────────────────
    
    // Safely strip markdown asterisks and line breaks to create a clean meta description
    const plainTextBody = article.body.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\n/g, ' ');
    const seoDescription = article.excerpt || (plainTextBody.length > 150 ? `${plainTextBody.substring(0, 150)}...` : plainTextBody);
    const seoTitle = `${article.title} | Clearwater Partners`;

    // Construct the mathematically verifiable schema for AI Crawlers
    const generateSchema = () => {
        return JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LegalArticle",
            "headline": article.title,
            "description": seoDescription,
            "image": article.image || "https://cwplegal.africa/cwp-favicon.svg", // Fallback image
            "datePublished": article.date,
            "author": {
                "@type": "Person",
                "name": article.author,
                "url": "https://cwplegal.africa/about"
            },
            "publisher": {
                "@type": "Organization",
                "name": "Clearwater Partners",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://cwplegal.africa/cwp-logo-icon.svg"
                }
            },
            "inLanguage": "en-NG",
            "isAccessibleForFree": "True",
            "about": [
                {
                    "@type": "Thing",
                    "name": article.category
                },
                ...(article.tags || []).map(tag => ({
                    "@type": "Thing",
                    "name": tag
                }))
            ]
        });
    };

    return (
        <div style={{ paddingTop: '64px' }}>
            
            {/* ─── AI & SEO HEAD INJECTION ───────────────────────────────────── */}
            <Helmet>
                <title>{seoTitle}</title>
                <meta name="description" content={seoDescription} />
                
                {/* Open Graph for LinkedIn/Twitter formatting */}
                <meta property="og:title" content={seoTitle} />
                <meta property="og:description" content={seoDescription} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={`https://cwplegal.africa/precedent/${article.slug}`} />
                {article.image && <meta property="og:image" content={article.image} />}
                
                {/* The Machine-Readable Payload for GPTBot / Google-Extended */}
                <script type="application/ld+json">
                    {generateSchema()}
                </script>
            </Helmet>

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
