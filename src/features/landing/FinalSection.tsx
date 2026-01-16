import React from 'react';

const FinalSection: React.FC = () => {
    return (
        <section style={{
            position: 'relative',
            zIndex: 10,
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '4rem 20px',
            pointerEvents: 'none', // Allow clicks on buttons
        }}>
            <h2 style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                marginBottom: '2rem',
                color: '#fff',
                fontWeight: 300,
                maxWidth: '700px',
            }}>
                Medicine advances when individuals don't lose their edges.
            </h2>
            <button
                style={{
                    padding: '12px 32px',
                    fontSize: '1rem',
                    border: '1px solid var(--color-primary)',
                    color: 'var(--color-primary)',
                    borderRadius: '4px',
                    pointerEvents: 'auto',
                    transition: 'all 0.3s ease',
                    background: 'rgba(0, 128, 128, 0.05)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 128, 128, 0.15)';
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 128, 128, 0.4)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 128, 128, 0.05)';
                    e.currentTarget.style.boxShadow = 'none';
                }}
            >
                Find your nodes
            </button>
            <footer style={{
                marginTop: 'auto',
                paddingTop: '4rem',
                fontSize: '0.8rem',
                color: 'var(--color-text-muted)',
                opacity: 0.5,
            }}>
                © {new Date().getFullYear()} LATIS. All rights reserved.
            </footer>
        </section>
    );
};

export default FinalSection;
