import React from 'react';
import GridBackground from './GridBackground';
import Header from './Header';
import HeroSection from './HeroSection';
import AboutSection from './AboutSection';
import HowItWorksSection from './HowItWorksSection';
import WhoIsForSection from './WhoIsForSection';
import TrustSection from './TrustSection';
import FAQSection from './FAQSection';
import ClosingSection from './ClosingSection';
import Footer from './Footer';

const LandingPage: React.FC = () => {
    return (
        <div style={{ position: 'relative', width: '100%', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
            <GridBackground />

            <Header />

            <main style={{ position: 'relative', zIndex: 1, paddingTop: '60px' }}>
                <HeroSection />
                <AboutSection />
                <HowItWorksSection />
                <WhoIsForSection />
                <TrustSection />
                <FAQSection />
                <ClosingSection />
            </main>

            <Footer />
        </div>
    );
};

export default LandingPage;
