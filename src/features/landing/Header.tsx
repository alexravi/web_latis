import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    return (
        <header style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '60px',
            zIndex: 100,
            background: 'var(--color-bg)',
            borderBottom: '1px solid var(--color-grid)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            fontFamily: 'var(--font-mono)',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: 'var(--color-accent)',
                }}></div>
                <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.05em' }}>LATIS_OS</span>
            </div>

            <nav className="nav-desktop" style={{ gap: '2rem', fontSize: '0.85rem' }}>
                {['OVERVIEW', 'DIRECTORY', 'RESEARCH'].map(item => (
                    <a key={item} href="#" className="nav-link">{item}</a>
                ))}
            </nav>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                    <button style={{
                        fontSize: '0.85rem',
                        padding: '8px 16px',
                        border: '1px solid var(--color-grid)',
                        color: 'var(--color-fg)',
                        fontFamily: 'var(--font-mono)',
                    }}>PROVIDER LOG IN</button>
                </Link>
                <Link to="/signup" style={{ textDecoration: 'none' }}>
                    <button style={{
                        fontSize: '0.85rem',
                        padding: '8px 16px',
                        backgroundColor: 'var(--color-fg)',
                        color: 'var(--color-bg)',
                        fontFamily: 'var(--font-mono)',
                    }}>APPLY FOR ACCESS</button>
                </Link>
            </div>
        </header>
    );
};

export default Header;
