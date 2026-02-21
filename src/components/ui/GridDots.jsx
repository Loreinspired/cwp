import React from 'react';

export default function GridDots({ size = 160, opacity = 0.35 }) {
    return (
        <div
            aria-hidden="true"
            style={{
                position: 'absolute',
                width: `${size}px`,
                height: `${size}px`,
                opacity,
                backgroundImage:
                    'radial-gradient(circle, var(--cwp-border) 1px, transparent 1px)',
                backgroundSize: '12px 12px',
                pointerEvents: 'none',
            }}
        />
    );
}
