import React from 'react';

const ClosingSection: React.FC = () => {
    return (
        <section style={{
            padding: '120px 5vw',
            textAlign: 'center',
            background: 'var(--color-bg)'
        }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '3rem', marginBottom: '2rem', lineHeight: 1.1 }}>Join the network shaped by expertise</h2>

                <p style={{
                    fontSize: '1.25rem',
                    color: 'var(--color-text-muted)',
                    marginBottom: '3rem',
                    lineHeight: 1.6
                }}>
                    Your career is built on precision, discipline, and individuality.<br />
                    Your professional network should be too.
                </p>

                <button style={{
                    padding: '16px 32px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    background: 'var(--color-accent)',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-mono)'
                }}>
                    FIND YOUR NODES
                </button>
            </div>
        </section>
    );
};

export default ClosingSection;
