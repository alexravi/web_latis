import React from 'react';
import GridBackground from './GridBackground';
import Header from './Header';
import HeroSection from './HeroSection';
import ValuePropSection from './ValuePropSection';
import FeaturesSection from './FeaturesSection';
import Footer from './Footer';

const LandingPage: React.FC = () => {
    return (
        <div style={{ position: 'relative', width: '100%', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
            <GridBackground />

            <Header />

            <main style={{ position: 'relative', zIndex: 1, paddingTop: '60px' }}>
                <HeroSection />
                <ValuePropSection />
                <FeaturesSection />

                {/* Placeholder for "The Pulse" or other future sections */}
                <div style={{
                    height: '400px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '1px solid var(--color-grid)',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--color-text-muted)'
                }}>
                    [ SYSTEM STATUS: ONLINE ]
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default LandingPage;
