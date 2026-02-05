import React from 'react';

const HowItWorksSection: React.FC = () => {
    const steps = [
        {
            title: "Profiles built for medicine",
            desc: "Create a professional profile that reflects your clinical background, education, and experience — not vanity metrics."
        },
        {
            title: "Connections that matter",
            desc: "Connect with professionals based on specialization, institutions, and shared interests."
        },
        {
            title: "A network that grows with you",
            desc: "As your career evolves, your network evolves — forming meaningful professional lattices over time."
        }
    ];

    return (
        <section style={{ borderBottom: '1px solid var(--color-grid)' }}>
            <div style={{ padding: '80px 5vw', borderBottom: '1px solid var(--color-grid)' }}>
                <h2 style={{ fontSize: '2rem', textAlign: 'center' }}>How Latis Works</h2>
            </div>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            }}>
                {steps.map((item, i) => (
                    <div key={i} style={{
                        padding: '3rem',
                        borderRight: '1px solid var(--color-grid)',
                        borderBottom: '1px solid var(--color-grid)',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        transition: 'background 0.2s',
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-accent-subtle)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{item.title}</h3>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.5 }}>{item.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HowItWorksSection;
