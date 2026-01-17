import React from 'react';

const WhoIsForSection: React.FC = () => {
    const audience = [
        "Doctors and physicians",
        "Medical students and residents",
        "Surgeons and specialists",
        "Researchers and healthcare innovators",
        "Hospitals and medical institutions"
    ];

    return (
        <section style={{
            padding: '120px 5vw',
            borderBottom: '1px solid var(--color-grid)',
            background: 'var(--color-surface)'
        }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', color: 'var(--color-fg)' }}>Who is Latis for?</h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '2rem',
                    marginBottom: '4rem'
                }}>
                    {audience.map((item, i) => (
                        <div key={i} style={{
                            padding: '1.5rem',
                            border: '1px solid var(--color-grid)',
                            background: 'var(--color-bg)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '1rem'
                        }}>
                            {item}
                        </div>
                    ))}
                </div>

                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '1.5rem', fontWeight: 500 }}>
                        If medicine is your profession, Latis is your network.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default WhoIsForSection;
