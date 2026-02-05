import React from 'react';

const FAQSection: React.FC = () => {
    const faqs = [
        {
            q: "Is Latis like LinkedIn for doctors?",
            a: "Latis is purpose-built for medicine. Unlike generic professional networks, it focuses on clinical expertise and meaningful professional connections."
        },
        {
            q: "Who can join Latis?",
            a: "Doctors, medical students, and healthcare professionals can join Latis."
        },
        {
            q: "Is Latis free to use?",
            a: "Yes. Latis is currently free during its early access phase."
        }
    ];

    return (
        <section style={{
            padding: '120px 5vw',
            borderBottom: '1px solid var(--color-grid)',
            background: 'var(--color-surface)'
        }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '4rem', textAlign: 'center' }}>Frequently Asked Questions</h2>

            <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {faqs.map((item, i) => (
                    <div key={i} style={{ padding: '2rem', background: 'var(--color-bg)', border: '1px solid var(--color-grid)' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 600 }}>{item.q}</h3>
                        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{item.a}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FAQSection;
