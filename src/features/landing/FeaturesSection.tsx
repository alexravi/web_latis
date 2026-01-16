import React from 'react';

const FeaturesSection: React.FC = () => {
    const features = [
        {
            title: "INTELLIGENCE FEED",
            desc: "A noise-free clinical stream. Verified case studies, heavy-data research summaries, and institutional updates. No fluff, just signal.",
            meta: "CLINICAL AGGREGATE"
        },
        {
            title: "GLOBAL DIRECTORY",
            desc: "The only graph of medical professionals verified against primary sources. Filter by specialty, sub-specialty, and verified clinical outcomes.",
            meta: "ACCESS: VERIFIED"
        },
        {
            title: "SECURE CONSULT",
            desc: "End-to-end encrypted tunnels for high-acuity consults. Native support for DICOM sharing and large-dataset transmission.",
            meta: "HIPAA COMPLIANT"
        },
        {
            title: "CAREER PLACEMENT",
            desc: "Algorithmic matching for department heads and fellowships. We replace recruiters with competence graphs.",
            meta: "STATUS: ACTIVE"
        },
        {
            title: "INSTITUTIONAL ACCESS",
            desc: "Dedicated instances for hospitals and research centers to manage internal communications and cross-department consults.",
            meta: "ENTERPRISE"
        }
    ];

    return (
        <section style={{
            padding: '120px 5vw',
            borderBottom: '1px solid var(--color-grid)',
        }}>
            <h2 style={{
                fontSize: '1rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-text-muted)',
                marginBottom: '4rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
            }}>
                // Clinical Ecosystem
            </h2>

            <div style={{ display: 'grid', gap: '1px', background: 'var(--color-grid)' }}>
                {features.map((f, i) => (
                    <div key={i} style={{
                        background: 'var(--color-bg)',
                        padding: '4rem 0',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem',
                        alignItems: 'start'
                    }}>
                        {/* Left Col: Title & Meta */}
                        <div style={{ paddingRight: '2rem' }}>
                            <div style={{
                                fontFamily: 'var(--font-mono)',
                                color: 'var(--color-accent)',
                                fontSize: '0.8rem',
                                marginBottom: '1rem'
                            }}>
                                {`0${i + 1} — ${f.meta}`}
                            </div>
                            <h3 style={{
                                fontSize: '2rem',
                                fontWeight: 600,
                                lineHeight: 1.1,
                                textTransform: 'uppercase'
                            }}>
                                {f.title}
                            </h3>
                        </div>

                        {/* Right Col: Desc */}
                        <div style={{ paddingRight: '2rem', maxWidth: '600px' }}>
                            <p style={{
                                fontSize: '1.25rem',
                                lineHeight: 1.5,
                                color: 'var(--color-fg)',
                                opacity: 0.9
                            }}>
                                {f.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeaturesSection;
