import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GridBackground from '../features/landing/GridBackground';
import api from '../services/api';
import { checkUsernameAvailability } from '../services/profileService';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(false);

    // Debounce timer ref
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const timeoutRef = React.useRef<any>(null);

    const validateUsername = (val: string) => {
        if (!val) return '';
        if (val.length < 3) return 'Username must be at least 3 characters';
        if (val.length > 30) return 'Username must be at most 30 characters';
        if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]*[a-zA-Z0-9]$|^[a-zA-Z0-9]$/.test(val)) {
            return 'Only letters, numbers, underscores, and hyphens allowed.';
        }
        return '';
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setUsername(val);
        setIsUsernameAvailable(null);

        const error = validateUsername(val);
        setUsernameError(error);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        if (val && !error) {
            setIsCheckingUsername(true);
            timeoutRef.current = setTimeout(async () => {
                try {
                    const result = await checkUsernameAvailability(val);
                    setIsUsernameAvailable(result.available);
                    if (!result.available) {
                        setUsernameError('Username is already taken');
                    }
                } catch (err) {
                    console.error('Error checking username:', err);
                } finally {
                    setIsCheckingUsername(false);
                }
            }, 500);
        } else {
            setIsCheckingUsername(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/auth/signup', {
                email,
                password,
                first_name: firstName,
                last_name: lastName,
                username: username || undefined
            });

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                // Optionally store user info
                localStorage.setItem('user', JSON.stringify(response.data.user));

                toast.success('Account created successfully');
                navigate('/complete-profile');
            }
        } catch (error: any) {
            console.error('Signup error:', error);
            const message = error.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', display: 'flex' }}>
            <SEO title="Signup" description="Apply for Provider Access" />
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
                <Link to="/" style={{
                    position: 'absolute',
                    top: '40px',
                    left: '40px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    color: 'var(--color-text-muted)'
                }}>
                    ← RETURN TO HOME
                </Link>

                <div style={{ maxWidth: '450px', width: '100%' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', lineHeight: 1, color: 'var(--color-fg)' }}>PROVIDER REGISTRATION</h1>
                    <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginBottom: '3rem' }}>
                        CREDENTIAL VERIFICATION REQUIRED
                    </p>

                    <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--color-text-main)' }}>
                                    FIRST NAME
                                </label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
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
                            <div>
                                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--color-text-main)' }}>
                                    LAST NAME
                                </label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
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
                        </div>

                        <div>
                            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--color-text-main)' }}>
                                EMAIL
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
                                USERNAME (OPTIONAL)
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={handleUsernameChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: usernameError ? '1px solid red' : (isUsernameAvailable ? '1px solid green' : '1px solid var(--color-grid)'),
                                        background: 'var(--color-bg)',
                                        color: 'var(--color-text-main)',
                                        borderRadius: '0',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        fontFamily: 'var(--font-mono)'
                                    }}
                                    placeholder="unique-handle"
                                />
                                {isCheckingUsername && (
                                    <span style={{ position: 'absolute', right: '10px', top: '12px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Checking...</span>
                                )}
                            </div>
                            {usernameError && (
                                <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '4px' }}>{usernameError}</div>
                            )}
                            {isUsernameAvailable && !usernameError && (
                                <div style={{ color: 'green', fontSize: '0.8rem', marginTop: '4px' }}>✓ Username available</div>
                            )}
                        </div>

                        <div>
                            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--color-text-main)' }}>
                                CREATE PASSWORD
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
                            {loading ? 'SUBMITTING...' : 'SUBMIT APPLICATION'}
                        </button>

                        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
                            <Link to="/login" style={{ color: 'var(--color-text-muted)' }}>Already verified? Provider Log In</Link>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right Panel */}
            <div className="nav-desktop" style={{
                flex: 1,
                background: 'var(--color-accent)',
                color: 'white',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                borderLeft: '1px solid rgba(255,255,255,0.1)',
                padding: '4rem'
            }}>
                <h2 style={{ fontSize: '3rem', lineHeight: 1, marginBottom: '2rem' }}>
                    MEDICAL<br />EXCELLENCE<br />AWAITS.
                </h2>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '2rem', maxWidth: '400px' }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', lineHeight: 1.6, opacity: 0.8 }}>
                        Applying creates a provider request in the Latis directory.
                        Your credentials will be cross-referenced against global medical registries.
                        <br /><br />
                        Estimated review time: &lt; 24 HRS
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
