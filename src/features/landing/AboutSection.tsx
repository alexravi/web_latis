import React from 'react';

const AboutSection: React.FC = () => {
    return (
        <section style={{
            padding: '120px 5vw',
            borderBottom: '1px solid var(--color-grid)',
            background: 'var(--color-bg)'
        }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                <h2 style={{
                    fontSize: '2.5rem',
                    marginBottom: '2rem',
                    color: 'var(--color-fg)'
                }}>
                    What is Latis?
                </h2>

                <p style={{
                    fontSize: '1.25rem',
                    lineHeight: 1.6,
                    color: 'var(--color-text-muted)',
                    marginBottom: '1.5rem'
                }}>
                    Latis is a professional networking platform designed specifically for medicine.
                    Unlike generic social networks, Latis focuses on meaningful professional connections — based on specialization, experience, and shared purpose.
                </p>

                <p style={{
                    fontSize: '1.25rem',
                    lineHeight: 1.6,
                    color: 'var(--color-text-muted)'
                }}>
                    Whether you are a practicing doctor, a medical student, or part of the healthcare ecosystem, Latis helps you connect through expertise, not popularity.
                </p>
            </div>
        </section>
    );
};

export default AboutSection;
