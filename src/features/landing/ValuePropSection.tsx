import React from 'react';

const ValuePropSection: React.FC = () => {
    return (
        <section style={{ borderBottom: '1px solid var(--color-grid)' }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            }}>
                {[
                    { num: '01', title: 'Verified Credentials', desc: 'Immutable proof of specialty.' },
                    { num: '02', title: 'Case Matching', desc: 'Algorithmic peer-to-peer consults.' },
                    { num: '03', title: 'Research Graph', desc: 'Connect through citation networks.' },
                    { num: '04', title: 'Private Circles', desc: 'Encrypted channels for department heads.' }
                ].map((item, i) => (
                    <div key={i} style={{
                        padding: '3rem',
                        borderRight: '1px solid var(--color-grid)',
                        borderBottom: '1px solid var(--color-grid)', // Mobile consistency
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '300px',
                        transition: 'background 0.2s',
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-accent-subtle)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <span style={{
                            fontFamily: 'var(--font-mono)',
                            color: 'var(--color-accent)',
                            fontSize: '1rem'
                        }}>{item.num}</span>

                        <div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{item.title}</h3>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ValuePropSection;
