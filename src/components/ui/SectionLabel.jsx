import React from 'react';

export default function SectionLabel({ children, light = false, className = '' }) {
    return (
        <span
            className={className}
            style={{
                display: 'inline-block',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: light ? 'var(--cwp-muted)' : 'var(--cwp-accent)',
                lineHeight: '1',
            }}
        >
            {children}
        </span>
    );
}
