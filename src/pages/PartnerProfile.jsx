import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { partners } from '../data/partners';
import Tag from '../components/ui/Tag';
import SectionLabel from '../components/ui/SectionLabel';

export default function PartnerProfile() {
    const { slug } = useParams();
    const partner = partners.find(p => p.slug === slug);
    if (!partner) return <Navigate to="/network" replace />;

    return (
        <div style={{ paddingTop: '64px' }}>
            {/* Back */}
            <div style={{ padding: '24px 40px', borderBottom: '1px solid var(--cwp-border)', background: 'var(--cwp-ink)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <Link to="/network" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '10px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--cwp-muted)' }}>
                        <ArrowLeft size={12} /> Network
                    </Link>
                </div>
            </div>

            {/* Header */}
            <section style={{ padding: '64px 40px', borderBottom: '1px solid var(--cwp-border)', background: 'var(--cwp-ink)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {partner.isHQ && <Tag>Network HQ</Tag>}
                        {partner.isAnchor && <Tag>Alliance Anchor</Tag>}
                        <SectionLabel>{partner.role}</SectionLabel>
                    </div>
                    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 5vw, 60px)', fontWeight: 400, color: 'var(--cwp-white)', lineHeight: 1.1, marginBottom: '16px' }}>
                        {partner.name}
                    </h1>
                    <p style={{ fontSize: '14px', color: 'var(--cwp-muted)', marginBottom: '8px' }}>{partner.jurisdiction}</p>
                    {partner.founded && (
                        <p style={{ fontSize: '12px', color: 'var(--cwp-border)' }}>Est. {partner.founded}</p>
                    )}
                </div>
            </section>

            {/* Content grid */}
            <section style={{ padding: '64px 40px', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '64px' }} className="profile-grid">
                    <div>
                        {/* About */}
                        <SectionLabel light style={{ display: 'block', marginBottom: '16px' }}>About</SectionLabel>
                        <p style={{ fontSize: '14px', color: 'var(--cwp-text)', lineHeight: 1.85, marginBottom: '48px' }}>
                            {partner.description}
                        </p>

                        {/* Representative matters */}
                        <SectionLabel light style={{ display: 'block', marginBottom: '20px' }}>Representative Matters</SectionLabel>
                        {partner.matters.length > 0 ? (
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0' }}>
                                {partner.matters.map((matter, i) => (
                                    <li key={i} style={{ padding: '16px 0', borderBottom: '1px solid var(--cwp-border)', display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--cwp-muted)', lineHeight: 1.7 }}>
                                        <span style={{ color: 'var(--cwp-accent)', fontSize: '10px', fontWeight: 700, marginTop: '3px', minWidth: '18px' }}>0{i + 1}</span>
                                        {matter}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ fontSize: '13px', color: 'var(--cwp-muted)', lineHeight: 1.7 }}>Matter details available on enquiry through the CWP Intelligence Desk.</p>
                        )}
                    </div>

                    <div>
                        {/* Specializations */}
                        <SectionLabel light style={{ display: 'block', marginBottom: '16px' }}>Specializations</SectionLabel>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '40px' }}>
                            {partner.specializations.map(spec => <Tag key={spec}>{spec}</Tag>)}
                        </div>

                        {/* Attorneys */}
                        <SectionLabel light style={{ display: 'block', marginBottom: '16px' }}>Key Personnel</SectionLabel>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                            {partner.attorneys.length > 0 ? partner.attorneys.map(att => (
                                <div key={att.name} style={{ padding: '14px 0', borderBottom: '1px solid var(--cwp-border)' }}>
                                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--cwp-white)', marginBottom: '3px' }}>{att.name}</p>
                                    <p style={{ fontSize: '11px', color: 'var(--cwp-muted)' }}>{att.title}</p>
                                </div>
                            )) : (
                                <p style={{ fontSize: '12px', color: 'var(--cwp-muted)', paddingTop: '8px' }}>Details available on enquiry.</p>
                            )}
                        </div>

                        {/* Contact CTA */}
                        <div style={{ marginTop: '40px', padding: '24px', background: 'var(--cwp-surface)', border: '1px solid var(--cwp-border)' }}>
                            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--cwp-accent)', marginBottom: '12px' }}>
                                Make a Referral
                            </p>
                            <p style={{ fontSize: '12px', color: 'var(--cwp-muted)', lineHeight: 1.6, marginBottom: '16px' }}>
                                Contact the CWP Intelligence Desk to route a matter to this firm.
                            </p>
                            <a href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--cwp-white)' }}>
                                Intelligence Desk <ArrowRight size={11} />
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            <style>{`
        @media (max-width: 700px) { .profile-grid { grid-template-columns: 1fr !important; } }
      `}</style>
        </div>
    );
}
