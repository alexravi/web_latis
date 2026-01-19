import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { getProfile } from '../../services/profileService';

import ConsultDrawer from '../messaging/ConsultDrawer';

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


    const [userProfile, setUserProfile] = React.useState<any>(null);
    const [showConsultDrawer, setShowConsultDrawer] = React.useState(false);

    React.useEffect(() => {
        const fetchProfile = async () => {
            try {
                // converted from dynamic import
                const data = await getProfile();
                setUserProfile(data);
            } catch (error) {
                console.error('Failed to fetch header profile:', error);
            }
        };
        fetchProfile();
    }, []);

    const name = userProfile?.user?.last_name ? `Dr. ${userProfile.user.last_name}` : 'User';
    const initials = userProfile?.user?.first_name && userProfile?.user?.last_name
        ? `${userProfile.user.first_name[0]}${userProfile.user.last_name[0]}`
        : 'U';


    // Nav Items
    const navItems = [
        { label: "FEED", path: "/dashboard", active: location.pathname === '/dashboard' },
        { label: "NODES", path: "/nodes", active: location.pathname === '/nodes' },
        { label: "MESSAGING", path: "/messaging", active: location.pathname === '/messaging' },

    ];


    const [searchQuery, setSearchQuery] = React.useState('');

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <>
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
                        <input
                            type="text"
                            placeholder="Search directory, drugs, or conditions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                            style={{
                                background: 'var(--color-accent-subtle)',
                                border: 'none',
                                padding: '8px 16px',
                                width: '300px',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.8rem',
                                color: 'var(--color-fg)',
                                outline: 'none'
                            }}
                        />
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
                        <Link key={item.label} to={item.path} style={{ textDecoration: 'none' }}>
                            <div style={{
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
                        </Link>
                    ))}

                </nav>

                {/* RIGHT: PROFILE */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>

                    {/* Pager / Drawer Toggle */}
                    <button
                        onClick={() => setShowConsultDrawer(!showConsultDrawer)}
                        style={{
                            background: showConsultDrawer ? 'var(--color-fg)' : 'transparent',
                            color: showConsultDrawer ? 'var(--color-bg)' : 'var(--color-text-muted)',
                            border: '1px solid var(--color-grid)',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        title="Quick Consults"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    </button>

                    <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            textAlign: 'right',
                            fontSize: '0.8rem',
                            lineHeight: 1.2
                        }} className="hide-on-mobile">
                            <div style={{ fontWeight: 600 }}>{name}</div>
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
                            {initials}
                        </div>
                    </Link>

                    {/* Theme Toggle */}
                    <button onClick={toggleTheme} style={{
                        width: '32px',
                        height: '32px',
                        border: '1px solid var(--color-grid)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.9rem'
                    }} title="Toggle Theme">
                        {theme === 'light' ? '☾' : '☀'}
                    </button>

                    {/* Logout Button */}
                    <button onClick={handleLogout} style={{
                        width: '32px',
                        height: '32px',
                        border: '1px solid var(--color-grid)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-text-muted)',
                        cursor: 'pointer'
                    }} title="Sign Out">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    </button>
                </div>
            </header>

            {/* Slide-out Drawer */}
            <ConsultDrawer isOpen={showConsultDrawer} onClose={() => setShowConsultDrawer(false)} />
        </>
    );
};

export default AppHeader;
