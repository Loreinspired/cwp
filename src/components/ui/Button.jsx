import React from 'react';

const VARIANTS = {
    primary: {
        background: 'var(--cwp-white)',
        color: 'var(--cwp-void)',
        border: '1px solid var(--cwp-white)',
    },
    ghost: {
        background: 'transparent',
        color: 'var(--cwp-white)',
        border: '1px solid var(--cwp-border)',
    },
    accent: {
        background: 'var(--cwp-accent)',
        color: 'var(--cwp-void)',
        border: '1px solid var(--cwp-accent)',
    },
};

export default function Button({ children, variant = 'primary', onClick, type = 'button', disabled, className = '', ...props }) {
    const base = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '12px 28px',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s ease',
        borderRadius: 0,
        whiteSpace: 'nowrap',
        ...VARIANTS[variant],
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            style={base}
            className={`cwp-button cwp-button--${variant} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
