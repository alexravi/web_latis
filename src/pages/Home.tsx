import React from 'react';
import LandingPage from '../features/landing/LandingPage';
import SEO from '../components/SEO';

const Home: React.FC = () => {
    return (
        <main>
            <SEO
                title="Latis — Professional Network for Medicine | Your Edge Is Your Strength"
                description="Latis is a professional network for doctors, medical students, and healthcare professionals. Connect through expertise, not noise. Find your nodes."
            />
            <LandingPage />
        </main>
    );
};

export default Home;
