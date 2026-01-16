import React from 'react';
import { Link } from 'react-router-dom';
import GridBackground from '../features/landing/GridBackground';

const Signup: React.FC = () => {
    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', display: 'flex' }}>
            <div style={{ position: 'absolute', inset: 0, zIndex: -1 }}>
                <GridBackground />
            </div>

            {/* Left Panel: Form */}
            <div style={{
                flex: 1,
                background: 'rgba(255,255,255,0.95)',
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
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', lineHeight: 1 }}>PROVIDER REGISTRATION</h1>
                    <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginBottom: '3rem' }}>
                        CREDENTIAL VERIFICATION REQUIRED
                    </p>

                    <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '8px' }}>
                                    FIRST NAME
                                </label>
                                <input type="text" style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid var(--color-fg)',
                                    borderRadius: '0',
                                    fontSize: '1rem',
                                    outline: 'none'
                                }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '8px' }}>
                                    LAST NAME
                                </label>
                                <input type="text" style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid var(--color-fg)',
                                    borderRadius: '0',
                                    fontSize: '1rem',
                                    outline: 'none'
                                }} />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '8px' }}>
                                EMAIL
                            </label>
                            <input type="email" style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid var(--color-fg)',
                                borderRadius: '0',
                                fontSize: '1rem',
                                outline: 'none',
                                fontFamily: 'var(--font-mono)'
                            }} placeholder="doctor@hospital.org" />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '8px' }}>
                                CREATE PASSWORD
                            </label>
                            <input type="password" style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid var(--color-fg)',
                                borderRadius: '0',
                                fontSize: '1rem',
                                outline: 'none'
                            }} />
                        </div>

                        <button type="button" style={{
                            marginTop: '1rem',
                            padding: '16px',
                            background: 'var(--color-fg)',
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: 600,
                            letterSpacing: '0.05em',
                            border: '1px solid var(--color-fg)',
                            cursor: 'pointer',
                            textAlign: 'center'
                        }}>
                            SUBMIT APPLICATION
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
                background: 'var(--color-fg)',
                color: 'white',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                borderLeft: '1px solid white',
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
