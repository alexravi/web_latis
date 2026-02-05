import React from 'react';

const HeroSection: React.FC = () => {
    return (
        <section className="pad-mobile-relaxed" style={{
            paddingTop: '180px',
            paddingBottom: '120px',
            paddingLeft: '5vw',
            paddingRight: '5vw',
            borderBottom: '1px solid var(--color-grid)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)',
        }}>
            <div style={{ maxWidth: '1200px' }}>
                <h1 style={{
                    fontSize: 'clamp(3rem, 7vw, 7rem)',
                    lineHeight: 0.9,
                    letterSpacing: '-0.04em',
                    marginBottom: '2rem',
                    color: 'var(--color-fg)',
                    maxWidth: '1200px',
                    textTransform: 'uppercase',
                }}>
                    Your edge is<br />
                    <span style={{ color: 'var(--color-accent)' }}>your strength</span>.
                </h1>

                <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: 500,
                    marginBottom: '2rem',
                    lineHeight: 1.4,
                    maxWidth: '800px',
                    color: 'var(--color-fg)'
                }}>
                    A professional network for medicine — built around expertise, not algorithms.
                </h2>

                <p style={{
                    fontSize: '1.1rem',
                    lineHeight: 1.6,
                    color: 'var(--color-text-muted)',
                    maxWidth: '600px',
                    marginBottom: '3rem'
                }}>
                    Latis connects doctors, medical students, and healthcare professionals through what makes them different.
                    Your specialization, experience, and perspective are not noise — they are nodes in a stronger network.
                </p>

                <button
                    type="button"
                    onClick={() => { /* TODO: Add navigation behavior */ }}
                    style={{
                        padding: '16px 32px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        background: 'var(--color-accent)',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-mono)'
                    }}
                >
                    FIND YOUR NODES
                </button>
            </div>
        </section>
    );
};

export default HeroSection;
