import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GridBackground from '../features/landing/GridBackground';
import api from '../services/api';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';
import { signInWithGoogle } from '../services/authService';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/auth/signin', {
                email,
                password
            });

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                // Optionally store user info
                localStorage.setItem('user', JSON.stringify(response.data.user));

                toast.success('Successfully logged in');
                navigate('/dashboard');
            }
        } catch (error: any) {
            console.error('Login error:', error);
            const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const idToken = await signInWithGoogle();
            const response = await api.post('/auth/google', { token: idToken });

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                toast.success('Successfully logged in with Google');
                navigate('/dashboard');
            }
        } catch (error: any) {
            console.error('Google Login error:', error);
            const message = error.response?.data?.message || 'Google Sign-In failed.';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', display: 'flex' }}>
            <SEO title="Login" description="Secure Provider Portal Login" />
            {/* Background Grid (Subtle) */}
            <div style={{ position: 'absolute', inset: 0, zIndex: -1 }}>
                <GridBackground />
            </div>

            {/* Left Panel: Form */}
            <div style={{
                flex: 1,
                background: 'var(--color-bg)',
                borderRight: '1px solid var(--color-grid)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '0 8vw',
                position: 'relative'
            }}>
                {/* Back Home */}
                <Link to="/" style={{
                    position: 'absolute',
                    top: '40px',
                    left: '40px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    color: 'var(--color-text-muted)'
                }}>
                    return to latis_home
                </Link>

                <div style={{ maxWidth: '400px', width: '100%' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', lineHeight: 1, color: 'var(--color-fg)' }}>PROVIDER PORTAL</h1>
                    <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginBottom: '3rem' }}>
                        SECURE CLINICAL ACCESS
                    </p>

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--color-text-main)' }}>
                                MEDICAL ID (EMAIL)
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid var(--color-grid)',
                                    background: 'var(--color-bg)',
                                    color: 'var(--color-text-main)',
                                    borderRadius: '0',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    fontFamily: 'var(--font-mono)'
                                }}
                                placeholder="doctor@hospital.org"
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--color-text-main)' }}>
                                PASSWORD
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid var(--color-grid)',
                                    background: 'var(--color-bg)',
                                    color: 'var(--color-text-main)',
                                    borderRadius: '0',
                                    fontSize: '1rem',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                marginTop: '1rem',
                                padding: '16px',
                                background: loading ? 'var(--color-text-muted)' : 'var(--color-accent)',
                                color: 'white',
                                fontSize: '1rem',
                                fontWeight: 600,
                                letterSpacing: '0.05em',
                                border: 'none',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                textAlign: 'center',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? 'SIGNING IN...' : 'SECURE SIGN IN'}
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.5rem 0' }}>
                            <div style={{ flex: 1, height: '1px', background: 'var(--color-grid)' }}></div>
                            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>OR</span>
                            <div style={{ flex: 1, height: '1px', background: 'var(--color-grid)' }}></div>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: 'transparent',
                                color: 'var(--color-text-main)',
                                fontSize: '1rem',
                                fontWeight: 500,
                                border: '1px solid var(--color-grid)',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px'
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M23.52 12.29C23.52 11.43 23.47 10.73 23.32 10.01H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.95 21.1C22.2 19.01 23.52 15.92 23.52 12.29Z" fill="#4285F4" />
                                <path d="M12 24C15.24 24 17.96 22.92 19.95 21.1L16.08 18.1C15 18.82 13.62 19.24 12 19.24C8.87 19.24 6.22 17.13 5.27 14.29L1.27 17.38C3.26 21.34 7.37 24 12 24Z" fill="#34A853" />
                                <path d="M5.27 14.29C5.02 13.57 4.89 12.8 4.89 12C4.89 11.2 5.02 10.43 5.27 9.71L1.27 6.62C0.46 8.23 0 10.06 0 12C0 13.94 0.46 15.77 1.27 17.38L5.27 14.29Z" fill="#FBBC05" />
                                <path d="M12 4.75C13.77 4.75 15.35 5.36 16.6 6.55L20.02 3.13C17.96 1.21 15.24 0 12 0C7.37 0 3.26 2.66 1.27 6.62L5.27 9.71C6.22 6.87 8.87 4.75 12 4.75Z" fill="#EA4335" />
                            </svg>
                            Sign in with Google
                        </button>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '0.9rem' }}>
                            <a href="#" style={{ color: 'var(--color-text-muted)' }}>Forgot Credentials?</a>
                            <Link to="/signup" style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>Apply for Access →</Link>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right Panel: Decorative / Info (Hidden on mobile) */}
            <div className="nav-desktop" style={{
                flex: 1,
                background: 'var(--color-accent-subtle)',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                borderLeft: '1px solid var(--color-grid)'
            }}>
                <div style={{ maxWidth: '400px', textAlign: 'center' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'var(--color-accent)',
                        margin: '0 auto 2rem auto'
                    }}></div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>SECURE ENVIRONMENT</h2>
                    <p style={{ color: 'var(--color-text-muted)' }}>
                        You are entering a restricted clinical network. All activities are encrypted and logged.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
