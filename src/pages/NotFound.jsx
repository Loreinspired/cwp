import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
                textAlign: 'center',
            }}
        >
            <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--cwp-muted)', marginBottom: '24px' }}>
                Error 404
            </p>
            <h1
                style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 'clamp(80px, 15vw, 180px)',
                    fontWeight: 700,
                    color: 'var(--cwp-border)',
                    lineHeight: 1,
                    marginBottom: '24px',
                    letterSpacing: '-0.04em',
                }}
            >
                404
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--cwp-muted)', maxWidth: '360px', lineHeight: 1.7, marginBottom: '40px' }}>
                This page does not exist or has been moved. Navigate using the links below.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link
                    to="/"
                    style={{
                        padding: '12px 28px',
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        background: 'var(--cwp-white)',
                        color: 'var(--cwp-void)',
                    }}
                >
                    Return Home
                </Link>
                <Link
                    to="/contact"
                    style={{
                        padding: '12px 28px',
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        background: 'transparent',
                        color: 'var(--cwp-white)',
                        border: '1px solid var(--cwp-border)',
                    }}
                >
                    Intelligence Desk
                </Link>
            </div>
        </div>
    );
}
