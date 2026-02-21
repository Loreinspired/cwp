import React from 'react';
import { Link } from 'react-router-dom';
import { partners } from '../../data/partners';
import Tag from '../ui/Tag';

export default function AllianceNetwork() {
    return (
        <div>
            {/* Network grid */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '1px',
                    background: 'var(--cwp-border)',
                    border: '1px solid var(--cwp-border)',
                }}
            >
                {partners.map((partner) => (
                    <Link
                        to={`/network/${partner.slug}`}
                        key={partner.slug}
                        style={{ display: 'block', background: 'var(--cwp-surface)', textDecoration: 'none' }}
                    >
                        <div
                            style={{
                                padding: '32px',
                                height: '100%',
                                transition: 'background 0.2s',
                                cursor: 'pointer',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--cwp-raised)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'var(--cwp-surface)'}
                        >
                            {(partner.isHQ || partner.isAnchor) && (
                                <div style={{ marginBottom: '12px' }}>
                                    <Tag>{partner.isHQ ? 'Network HQ' : 'Alliance Anchor'}</Tag>
                                </div>
                            )}
                            <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--cwp-accent)', marginBottom: '8px' }}>
                                {partner.founded ? `Est. ${partner.founded} · ` : ''}{partner.jurisdiction}
                            </p>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--cwp-white)', marginBottom: '6px', lineHeight: 1.3 }}>
                                {partner.name}
                            </h3>
                            <p style={{ fontSize: '11px', color: 'var(--cwp-muted)', marginBottom: '16px' }}>
                                {partner.role}
                            </p>
                            {partner.attorneys.length > 0 && (
                                <p style={{ fontSize: '10px', color: 'var(--cwp-muted)', marginBottom: '16px', letterSpacing: '0.04em' }}>
                                    {partner.attorneys.length} attorney{partner.attorneys.length !== 1 ? 's' : ''}
                                </p>
                            )}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {partner.specializations.slice(0, 3).map(spec => (
                                    <Tag key={spec}>{spec}</Tag>
                                ))}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
