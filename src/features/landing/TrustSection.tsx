import React from 'react';

const TrustSection: React.FC = () => {
    return (
        <section style={{
            padding: '120px 5vw',
            borderBottom: '1px solid var(--color-grid)',
            textAlign: 'center',
            background: 'var(--color-bg)'
        }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Built with intention</h2>
                <p style={{ fontSize: '1.25rem', lineHeight: 1.6, color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                    Latis is designed with privacy, professionalism, and trust at its core.<br />
                    No noise. No performative engagement. Just real connections in medicine.
                </p>
                <div style={{ width: '60px', height: '1px', background: 'var(--color-accent)', margin: '0 auto' }}></div>
            </div>
        </section>
    );
};

export default TrustSection;
