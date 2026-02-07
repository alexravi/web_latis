import React from 'react';
import Header from '../features/landing/Header';
import GridBackground from '../features/landing/GridBackground';
import Footer from '../features/landing/Footer';

const PrivacyPolicy: React.FC = () => {
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
                <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', fontFamily: 'var(--font-mono)' }}>Privacy Policy</h1>
                <p style={{ marginBottom: '1rem', opacity: 0.8 }}>Last updated: {new Date().toLocaleDateString()}</p>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'var(--font-mono)' }}>1. Introduction</h2>
                    <p style={{ lineHeight: 1.6, opacity: 0.9 }}>
                        Welcome to Latis. We are committed to protecting your personal information and your right to privacy.
                        If you have any questions or concerns about our policy, or our practices with regards to your personal information,
                        please contact us.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'var(--font-mono)' }}>2. Information We Collect</h2>
                    <p style={{ lineHeight: 1.6, opacity: 0.9 }}>
                        We collect personal information that you voluntarily provide to us when registering at the Services,
                        expressing an interest in obtaining information about us or our products and services, when participating
                        in activities on the Services or otherwise contacting us.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'var(--font-mono)' }}>3. How We Use Your Information</h2>
                    <p style={{ lineHeight: 1.6, opacity: 0.9 }}>
                        We use personal information collected via our Services for a variety of business purposes described below.
                        We process your personal information for these purposes in reliance on our legitimate business interests,
                        in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
                    </p>
                </section>
                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'var(--font-mono)' }}>4. Contact Us</h2>
                    <p style={{ lineHeight: 1.6, opacity: 0.9 }}>
                        If you have questions or comments about this policy, you may email us or by post to: <br />
                        <strong>Latis under Deepa AI Private Limited</strong>
                    </p>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
