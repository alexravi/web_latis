import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer style={{
            padding: '4rem 5vw',
            background: 'var(--color-fg)',
            color: 'var(--color-bg)',
            position: 'relative',
            zIndex: 10
        }}>
            <div className="grid-stack-mobile" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '4rem',
                borderBottom: '1px solid rgba(255,255,255,0.2)',
                paddingBottom: '4rem',
                marginBottom: '2rem'
            }}>
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'white' }}>LATIS INTELLIGENCE</h2>
                    <p style={{ maxWidth: '400px', opacity: 0.7, fontFamily: 'var(--font-mono)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                        Latis is a professional networking platform for doctors and healthcare professionals, built to support meaningful connections in medicine.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '2rem', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                    <Link to="/terms" style={{ color: 'white', textDecoration: 'none' }}>Terms</Link>
                    <Link to="/privacy" style={{ color: 'white', textDecoration: 'none' }}>Privacy Policy</Link>
                    <a href="mailto:contact@latis.com" style={{ color: 'white', textDecoration: 'none' }}>Contact</a>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.5, fontFamily: 'var(--font-mono)', fontSize: '0.8rem', flexWrap: 'wrap', gap: '1rem' }}>
                <span>&copy; {new Date().getFullYear()} Latis under Deepa AI Private Limited. All rights reserved.</span>
            </div>
        </footer>
    );
};

export default Footer;
