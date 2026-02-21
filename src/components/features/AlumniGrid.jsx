import React from 'react';
import { alumni } from '../../data/alumni';

export default function AlumniGrid() {
    return (
        <section style={{ marginTop: '80px' }}>
            {/* Section Header */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid var(--cwp-border)',
                    paddingBottom: '24px',
                    marginBottom: '0',
                    flexWrap: 'wrap',
                    gap: '16px',
                }}
            >
                <div>
                    <p
                        style={{
                            fontSize: '9px',
                            fontWeight: 700,
                            letterSpacing: '0.25em',
                            textTransform: 'uppercase',
                            color: 'var(--cwp-accent)',
                            marginBottom: '10px',
                        }}
                    >
                        Alumni — The CWP Badge
                    </p>
                    <h2
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 'clamp(22px, 3vw, 36px)',
                            fontWeight: 400,
                            color: 'var(--cwp-white)',
                            lineHeight: 1.2,
                            maxWidth: '520px',
                        }}
                    >
                        People Wear Their Association with CWP as a Mark
                    </h2>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--cwp-muted)', maxWidth: '380px', lineHeight: 1.7, paddingBottom: '4px' }}>
                    Our alumni go on to lead legal departments, found their own practices, and serve at the most consequential organisations in Africa. The thread connecting them is the rigour this firm demands.
                </p>
            </div>

            {/* Grid */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                    gap: '1px',
                    background: 'var(--cwp-border)',
                    border: '1px solid var(--cwp-border)',
                }}
            >
                {alumni.map((person) => (
                    <div
                        key={person.id}
                        style={{
                            background: 'var(--cwp-void)',
                            padding: '36px 32px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                            transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--cwp-surface)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--cwp-void)')}
                    >
                        {/* Top: Avatar + Name */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                            <div
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    background: 'var(--cwp-raised)',
                                    border: '1px solid var(--cwp-border)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '13px',
                                    fontWeight: 700,
                                    color: 'var(--cwp-accent)',
                                    letterSpacing: '0.05em',
                                    flexShrink: 0,
                                }}
                            >
                                {person.initials}
                            </div>
                            <div>
                                <h3
                                    style={{
                                        fontFamily: "'Playfair Display', serif",
                                        fontSize: '16px',
                                        fontWeight: 400,
                                        color: 'var(--cwp-white)',
                                        marginBottom: '4px',
                                    }}
                                >
                                    {person.name}
                                </h3>
                                <p style={{ fontSize: '10px', color: 'var(--cwp-muted)', letterSpacing: '0.05em' }}>
                                    {person.yearsAtCWP} · {person.roleAtCWP}
                                </p>
                            </div>
                        </div>

                        {/* Quote */}
                        <blockquote
                            style={{
                                borderLeft: '2px solid var(--cwp-accent)',
                                paddingLeft: '16px',
                                margin: 0,
                            }}
                        >
                            <p
                                style={{
                                    fontSize: '12px',
                                    color: 'var(--cwp-muted)',
                                    lineHeight: 1.75,
                                    fontStyle: 'italic',
                                }}
                            >
                                "{person.quote}"
                            </p>
                        </blockquote>

                        {/* Current Role */}
                        <div
                            style={{
                                paddingTop: '16px',
                                borderTop: '1px solid var(--cwp-border)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                flexWrap: 'wrap',
                                gap: '8px',
                            }}
                        >
                            <div>
                                <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--cwp-accent)', marginBottom: '4px' }}>
                                    Now
                                </p>
                                <p style={{ fontSize: '12px', color: 'var(--cwp-white)', fontWeight: 600 }}>
                                    {person.currentRole}
                                </p>
                                <p style={{ fontSize: '11px', color: 'var(--cwp-muted)' }}>
                                    {person.currentOrg}
                                </p>
                            </div>
                            <span
                                style={{
                                    fontSize: '9px',
                                    fontWeight: 700,
                                    letterSpacing: '0.15em',
                                    textTransform: 'uppercase',
                                    color: 'var(--cwp-muted)',
                                    border: '1px solid var(--cwp-border)',
                                    padding: '4px 10px',
                                    alignSelf: 'flex-end',
                                }}
                            >
                                CWP Alumni
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
