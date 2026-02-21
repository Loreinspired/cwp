import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { articles } from '../../data/articles';
import Tag from '../ui/Tag';
import { ArrowRight } from 'lucide-react';

const CATEGORIES = ['All', 'Corporate', 'Capital Markets', 'M&A', 'Disputes', 'Network'];

export default function PrecedentGrid({ teaser = false, filter: externalFilter = null }) {
    const [activeFilter, setActiveFilter] = useState('All');
    const filter = externalFilter || activeFilter;

    const visible = teaser
        ? articles.slice(0, 4)
        : filter === 'All'
            ? articles
            : articles.filter(a => a.category === filter);

    return (
        <div>
            {/* Category filter (only show if not teaser and no external filter) */}
            {!teaser && !externalFilter && (
                <div style={{ display: 'flex', gap: '2px', marginBottom: '32px', flexWrap: 'wrap' }}>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveFilter(cat)}
                            style={{
                                padding: '8px 16px',
                                fontSize: '9px',
                                fontWeight: 700,
                                letterSpacing: '0.18em',
                                textTransform: 'uppercase',
                                background: activeFilter === cat ? 'var(--cwp-white)' : 'var(--cwp-surface)',
                                color: activeFilter === cat ? 'var(--cwp-void)' : 'var(--cwp-muted)',
                                border: '1px solid var(--cwp-border)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            )}

            {/* Grid */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: teaser ? 'repeat(auto-fill, minmax(260px, 1fr))' : 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '1px',
                    background: 'var(--cwp-border)',
                }}
            >
                {visible.map(article => (
                    <Link
                        to={`/precedent/${article.slug}`}
                        key={article.slug}
                        style={{ display: 'block', background: 'var(--cwp-surface)', textDecoration: 'none' }}
                    >
                        <article
                            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                            onMouseEnter={e => e.currentTarget.parentElement.style.background = 'var(--cwp-raised)'}
                            onMouseLeave={e => e.currentTarget.parentElement.style.background = 'var(--cwp-surface)'}
                        >
                            {/* Featured image (WordPress only) */}
                            {article.featuredImage && (
                                <div style={{
                                    height: '160px',
                                    backgroundImage: `url(${article.featuredImage})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    borderBottom: '1px solid var(--cwp-border)',
                                    filter: 'brightness(0.7)',
                                }} />
                            )}
                            <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                    <Tag>{article.category}</Tag>
                                    <span style={{ fontSize: '9px', color: 'var(--cwp-muted)', letterSpacing: '0.08em' }}>{article.readTime}</span>
                                </div>
                                <h3
                                    style={{
                                        fontFamily: "'Playfair Display', serif",
                                        fontSize: '17px',
                                        fontWeight: 400,
                                        color: 'var(--cwp-white)',
                                        lineHeight: 1.4,
                                        marginBottom: '12px',
                                        flex: 1,
                                    }}
                                >
                                    {article.title}
                                </h3>
                                <p style={{ fontSize: '12px', color: 'var(--cwp-muted)', lineHeight: 1.7, marginBottom: '20px' }}>
                                    {article.excerpt}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                    <span style={{ fontSize: '10px', color: 'var(--cwp-muted)' }}>{article.date}</span>
                                    <ArrowRight size={14} style={{ color: 'var(--cwp-accent)' }} />
                                </div>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>
        </div>
    );
}
