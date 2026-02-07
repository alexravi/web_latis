import React from 'react';
import Header from '../features/landing/Header';
import GridBackground from '../features/landing/GridBackground';
import Footer from '../features/landing/Footer';

const TermsOfService: React.FC = () => {
    return (
        <div style={{ position: 'relative', width: '100%', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
            <GridBackground />
            <Header />
            <main style={{
                position: 'relative',
                zIndex: 1,
                paddingTop: '100px',
                paddingBottom: '60px',
                maxWidth: '800px',
                margin: '0 auto',
                paddingLeft: '24px',
                paddingRight: '24px',
                color: 'var(--color-fg)',
                fontFamily: 'var(--font-sans)'
            }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', fontFamily: 'var(--font-mono)' }}>Terms of Service</h1>
                <p style={{ marginBottom: '1rem', opacity: 0.8 }}>Last updated: {new Date().toLocaleDateString()}</p>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'var(--font-mono)' }}>1. Agreement to Terms</h2>
                    <p style={{ lineHeight: 1.6, opacity: 0.9 }}>
                        These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and <strong>Latis under Deepa AI Private Limited</strong> (“we,” “us” or “our”), concerning your access to and use of the Latis application.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'var(--font-mono)' }}>2. User Representations</h2>
                    <p style={{ lineHeight: 1.6, opacity: 0.9 }}>
                        By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'var(--font-mono)' }}>3. Prohibited Activities</h2>
                    <p style={{ lineHeight: 1.6, opacity: 0.9 }}>
                        You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
                    </p>
                </section>
                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'var(--font-mono)' }}>4. Contact Us</h2>
                    <p style={{ lineHeight: 1.6, opacity: 0.9 }}>
                        In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at: <br />
                        <strong>Deepa AI Private Limited</strong>
                    </p>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default TermsOfService;
