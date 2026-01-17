import React from 'react';
import { Link } from 'react-router-dom';
import AppHeader from './AppHeader';
import GridBackground from '../landing/GridBackground';
import SEO from '../../components/SEO';
import ProfileCompletionWidget from './components/ProfileCompletionWidget';
import { getProfile } from '../../services/profileService';

const Dashboard: React.FC = () => {
    // Real Data State
    const [userProfile, setUserProfile] = React.useState<any>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchProfile = async () => {
            try {
                // converted from dynamic import
                const data = await getProfile();
                setUserProfile(data);
            } catch (error) {
                console.error('Failed to fetch dashboard profile:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    // Fallback/Default values if data is missing
    const displayName = userProfile?.user?.first_name
        ? `${userProfile.user.first_name} ${userProfile.user.last_name}`
        : "User";

    const displayTitle = userProfile?.user?.current_role || "Medical Professional";
    const displayInstitution = userProfile?.user?.location || "";

    const feed = [
        {
            author: "Dr. James Wilson",
            role: "Cardiothoracic Surgeon",
            time: "2h ago",
            content: "Interesting presentation in the OR today. Mitral valve repair with unexpected calcification. Opted for a commisurotomy. Anyone seen similar patterns in post-COVID cohorts?",
            tags: ["#Cardiology", "#Surgery", "#CaseStudy"],
            likes: 42,
            comments: 8
        },
        {
            author: "Elena Rodriguez, PhD",
            role: "Clinical Researcher",
            time: "5h ago",
            content: "Just published our findings on non-invasive biomarkers for early-stage glioblastoma. Link to full paper below. Would love thoughts from the neurosurgery community on clinical applicability.",
            tags: ["#Oncology", "#Research", "#Biomarkers"],
            likes: 128,
            comments: 24
        },
        {
            author: "Dr. Michael Chang",
            role: "Attending Physician",
            time: "1d ago",
            content: "Looking for recommendations for a verified pediatric neurologist in the Seattle area for a consult. Complex presentation involving seizures and motor delay.",
            tags: ["#Referral", "#Pediatrics", "#Neurology"],
            likes: 15,
            comments: 32
        }
    ];

    const trending = [
        "New Board Guidelines: Sepsis",
        "Conference: Neuro 2026",
        "Residency Match Results",
        "Telehealth Billing Codes"
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
            <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
                <GridBackground />
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
                <SEO title="Dashboard" description="Your professional medical dashboard." />
                <AppHeader />

                <main className="container" style={{
                    paddingTop: '100px',
                    paddingBottom: '4rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(12, 1fr)',
                    gap: '24px'
                }}>
                    {/* LEFT COLUMN: IDENTITY (3 cols) */}
                    <div style={{ gridColumn: 'span 3' }} className="hide-on-mobile">
                        {isLoading ? (
                            <div style={{ padding: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-grid)', color: 'var(--color-text-muted)' }}>
                                Loading profile...
                            </div>
                        ) : (
                            <div style={{
                                background: 'var(--color-surface)',
                                border: '1px solid var(--color-grid)',
                                padding: '24px'
                            }}>
                                <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        background: 'var(--color-grid)',
                                        marginBottom: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontFamily: 'var(--font-mono)',
                                        color: 'var(--color-text-muted)',
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold'
                                    }}>
                                        {displayName.charAt(0)}
                                    </div>
                                    <h2 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{displayName}</h2>
                                </Link>
                                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
                                    {displayTitle}<br />{displayInstitution}
                                </p>

                                <div style={{ borderTop: '1px solid var(--color-grid)', paddingTop: '16px', fontSize: '0.85rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ color: 'var(--color-text-muted)' }}>Connections</span>
                                        <span style={{ fontFamily: 'var(--font-mono)' }}>0</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--color-text-muted)' }}>Profile Views</span>
                                        <span style={{ fontFamily: 'var(--font-mono)' }}>0</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <ProfileCompletionWidget />
                    </div>

                    {/* CENTER COLUMN: FEED (6 cols) */}
                    <div style={{ gridColumn: 'span 6' }} className="grid-col-full-mobile">
                        {/* Post Input */}
                        <div style={{
                            background: 'var(--color-surface)',
                            border: '1px solid var(--color-grid)',
                            padding: '24px',
                            marginBottom: '24px'
                        }}>
                            <input type="text" placeholder="Share a case, research, or question..." style={{
                                width: '100%',
                                padding: '12px',
                                background: 'transparent',
                                border: '1px solid var(--color-grid)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.9rem',
                                color: 'var(--color-fg)',
                                outline: 'none'
                            }} />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px', gap: '12px' }}>
                                <button style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>+ MEDIA</button>
                                <button style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>+ CASE FILE</button>
                                <button style={{
                                    background: 'var(--color-fg)',
                                    color: 'var(--color-bg)',
                                    padding: '8px 16px',
                                    fontSize: '0.8rem',
                                    fontFamily: 'var(--font-mono)'
                                }}>POST</button>
                            </div>
                        </div>

                        {/* Feed Stream */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {feed.map((post, i) => (
                                <div key={i} style={{
                                    background: 'var(--color-surface)',
                                    border: '1px solid var(--color-grid)',
                                    padding: '24px'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1rem' }}>{post.author}</h3>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{post.role}</p>
                                        </div>
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                            {post.time}
                                        </span>
                                    </div>

                                    <p style={{ fontSize: '1rem', lineHeight: 1.5, marginBottom: '16px' }}>
                                        {post.content}
                                    </p>

                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                                        {post.tags.map(tag => (
                                            <span key={tag} style={{
                                                fontSize: '0.75rem',
                                                color: 'var(--color-accent)',
                                                fontFamily: 'var(--font-mono)'
                                            }}>{tag}</span>
                                        ))}
                                    </div>

                                    <div style={{
                                        borderTop: '1px solid var(--color-grid)',
                                        paddingTop: '16px',
                                        display: 'flex',
                                        gap: '24px',
                                        fontSize: '0.85rem',
                                        fontFamily: 'var(--font-mono)',
                                        color: 'var(--color-fg)'
                                    }}>
                                        <button>ENDORSE ({post.likes})</button>
                                        <button>DISCUSS ({post.comments})</button>
                                        <button>SHARE</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: WIDGETS (3 cols) */}
                    <div style={{ gridColumn: 'span 3' }} className="hide-on-mobile">
                        <div style={{
                            background: 'var(--color-surface)',
                            border: '1px solid var(--color-grid)',
                            padding: '24px',
                            marginBottom: '24px'
                        }}>
                            <h3 style={{ fontSize: '0.9rem', fontFamily: 'var(--font-mono)', marginBottom: '16px', color: 'var(--color-text-muted)' }}>
                                 // TRENDING IN ACADEMIA
                            </h3>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {trending.map((item, i) => (
                                    <li key={i} style={{ fontSize: '0.9rem', cursor: 'pointer' }}>
                                        <span style={{ marginRight: '8px', color: 'var(--color-accent)' }}>↗</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div style={{
                            background: 'var(--color-surface)',
                            border: '1px solid var(--color-grid)',
                            padding: '24px'
                        }}>
                            <h3 style={{ fontSize: '0.9rem', fontFamily: 'var(--font-mono)', marginBottom: '16px', color: 'var(--color-text-muted)' }}>
                                 // SUGGESTED PEERS
                            </h3>
                            <div style={{ fontSize: '0.9rem', marginBottom: '12px' }}>
                                <div style={{ fontWeight: 600 }}>Dr. Amina K.</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Dermatology</div>
                                <button style={{ fontSize: '0.75rem', border: '1px solid var(--color-grid)', padding: '4px 8px' }}>+ CONNECT</button>
                            </div>
                            <div style={{ fontSize: '0.9rem' }}>
                                <div style={{ fontWeight: 600 }}>Dr. Mark R.</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Orthopedics</div>
                                <button style={{ fontSize: '0.75rem', border: '1px solid var(--color-grid)', padding: '4px 8px' }}>+ CONNECT</button>
                            </div>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default Dashboard;
