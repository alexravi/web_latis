import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AppHeader: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            toast.success('Logged out successfully');
            navigate('/login');
        }
    };

    // Mock Nav Items
    const navItems = [
        // ... (rest of file)
        { label: "FEED", active: true },
        { label: "NETWORK", active: false },
        { label: "JOBS", active: false },
        { label: "MESSAGING", active: false },
        { label: "NOTIFICATIONS", active: false }
    ];

    return (
        <header style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '60px',
            background: 'var(--color-bg)',
            borderBottom: '1px solid var(--color-grid)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            zIndex: 1000
        }}>
            {/* LEFT: LOGO + SEARCH */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                    <div style={{
                        fontSize: '1.2rem',
                        fontWeight: 800,
                        letterSpacing: '-0.05em',
                        color: 'var(--color-fg)'
                    }}>
                        LATIS<span style={{ color: 'var(--color-accent)' }}>/</span>MD
                    </div>
                </Link>

                <div className="hide-on-mobile" style={{ position: 'relative' }}>
                    <input type="text" placeholder="Search directory, drugs, or conditions..." style={{
                        background: 'var(--color-accent-subtle)',
                        border: 'none',
                        padding: '8px 16px',
                        width: '300px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        color: 'var(--color-fg)',
                        outline: 'none'
                    }} />
                    <span style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '0.8rem',
                        opacity: 0.5
                    }}>⌘K</span>
                </div>
            </div>

            {/* CENTER: NAV */}
            <nav className="nav-desktop" style={{ gap: '2px', height: '100%' }}>
                {navItems.map(item => (
                    <div key={item.label} style={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 16px',
                        borderBottom: item.active ? '2px solid var(--color-accent)' : '2px solid transparent',
                        cursor: 'pointer',
                        color: item.active ? 'var(--color-fg)' : 'var(--color-text-muted)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        fontFamily: 'var(--font-mono)'
                    }}>
                        {item.label}
                    </div>
                ))}
            </nav>

            {/* RIGHT: PROFILE */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                    textAlign: 'right',
                    fontSize: '0.8rem',
                    lineHeight: 1.2
                }} className="hide-on-mobile">
                    <div style={{ fontWeight: 600 }}>Dr. Chen</div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem' }}>ONLINE</div>
                </div>
                <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'var(--color-fg)',
                    color: 'var(--color-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 600
                }}>
                    SC
                </div>

                <button onClick={handleLogout} style={{
                    background: 'transparent',
                    border: '1px solid var(--color-grid)',
                    padding: '4px 8px',
                    fontSize: '0.7rem',
                    cursor: 'pointer',
                    color: 'var(--color-text-muted)',
                    fontFamily: 'var(--font-mono)'
                }}>
                    LOGOUT
                </button>

                {/* Theme Toggle */}
                <button onClick={toggleTheme} style={{
                    width: '32px',
                    height: '32px',
                    border: '1px solid var(--color-grid)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem'
                }}>
                    {theme === 'light' ? '☾' : '☀'}
                </button>
            </div>
        </header>
    );
};

export default AppHeader;
