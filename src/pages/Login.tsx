import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GridBackground from '../features/landing/GridBackground';
import api from '../services/api';
import toast from 'react-hot-toast';

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

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', display: 'flex' }}>
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
