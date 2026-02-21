import React from 'react';

export default function Tag({ children, className = '' }) {
    return (
        <span
            className={className}
            style={{
                display: 'inline-block',
                padding: '3px 10px',
                fontSize: '9px',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                background: 'var(--cwp-raised)',
                border: '1px solid var(--cwp-border)',
                color: 'var(--cwp-muted)',
                lineHeight: '1.6',
            }}
        >
            {children}
        </span>
    );
}
