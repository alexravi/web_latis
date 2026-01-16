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
                    The Blueprint<br />
                    <span style={{ color: 'var(--color-accent)' }}>of Medicine</span>.
                </h1>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem',
                    marginTop: '4rem',
                    borderTop: '1px solid var(--color-grid)',
                    paddingTop: '2rem'
                }}>
                    <div>
                        <p style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.9rem',
                            color: 'var(--color-text-muted)',
                            marginBottom: '0.5rem'
                        }}>01 — CONCEPT</p>
                        <p style={{ fontSize: '1.25rem', fontWeight: 500, lineHeight: 1.4 }}>
                            A high-fidelity network for the medical elite.
                            Verified intelligence, not social noise.
                        </p>
                    </div>

                    <div>
                        <p style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.9rem',
                            color: 'var(--color-text-muted)',
                            marginBottom: '0.5rem'
                        }}>02 — STATUS</p>
                        <p style={{ fontSize: '1.25rem', fontWeight: 500, lineHeight: 1.4 }}>
                            Reclaiming professional identity from the general public web.
                            Your edge is your strength.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
