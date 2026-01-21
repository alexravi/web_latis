import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProfile, getUserProfileById, type CompleteProfileData, type Experience, type Education, type Skill, type Certification, type Publication, type Project, type Award } from '../../services/profileService';
import SEO from '../../components/SEO';
import GridBackground from '../landing/GridBackground';
import AppHeader from '../dashboard/AppHeader';

// Modals
import ExperienceModal from './modals/ExperienceModal';
import EducationModal from './modals/EducationModal';
import SkillModal from './modals/SkillModal';
import BasicInfoModal from './modals/BasicInfoModal';
import AboutModal from './modals/AboutModal';

import api from '../../services/api';
import toast from 'react-hot-toast';
import RelationshipManager from '../../components/profile/RelationshipManager';

// Icons (Simple SVGs)
const EditIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
);

const PlusIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

const ProfileView: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [profileData, setProfileData] = useState<CompleteProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isOwnProfile, setIsOwnProfile] = useState(false);

    // Modal States
    const [showBasicInfoModal, setShowBasicInfoModal] = useState(false);
    const [showAboutModal, setShowAboutModal] = useState(false);
    const [showSkillModal, setShowSkillModal] = useState(false);

    // Complex Modal States (Edit vs Add)
    const [experienceModalState, setExperienceModalState] = useState<{ open: boolean; data: Experience | null }>({ open: false, data: null });
    const [educationModalState, setEducationModalState] = useState<{ open: boolean; data: Education | null }>({ open: false, data: null });

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

    const fetchData = async () => {
        // Don't set loading true on refresh to avoid flickering entire page
        if (!profileData) setIsLoading(true);
        try {
            let data;
            if (id) {
                // Fetch generic profile by ID
                data = await getUserProfileById(id);
                // Check ownership
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const me = JSON.parse(storedUser);
                    if (String(me.id) === String(id)) {
                        setIsOwnProfile(true);
                        // If it's me, fetch the FULL profile instead of generic
                        const fullData = await getProfile();
                        data = fullData;
                    } else {
                        setIsOwnProfile(false);
                    }
                }
            } else {
                // /profile route -> My Profile
                data = await getProfile();
                setIsOwnProfile(true);
            }
            setProfileData(data);
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    if (isLoading && !profileData) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>LOADING PROFILE...</div>
            </div>
        );
    }

    if (!profileData || !profileData.user) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>PROFILE NOT FOUND</div>
                {isOwnProfile && (
                    <button onClick={() => navigate('/complete-profile')} className="btn-primary">COMPLETE PROFLE</button>
                )}
            </div>
        );
    }

    const { user, profile, experiences, education, skills, certifications, publications, projects, awards } = profileData;
    const name = user?.first_name ? `${user.first_name} ${user.last_name}` : 'User';

    // Premium UI Helper Components
    const GlassCard = ({ children, className, style }: { children: React.ReactNode, className?: string, style?: React.CSSProperties }) => (
        <div className={className} style={{
            background: 'rgba(255, 255, 255, 0.8)', // Fallback for glass
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            ...style
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 40px 0 rgba(31, 38, 135, 0.12)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.07)';
            }}
        >
            {children}
        </div>
    );

    const SectionHeader = ({ title, action }: { title: string, action?: React.ReactNode }) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--color-fg)',
                letterSpacing: '-0.02em'
            }}>
                {title}
            </h2>
            {action}
        </div>
    );

    // Timeline Node for Experience/Education
    const TimelineItem = ({ children, isLast }: { children: React.ReactNode, isLast?: boolean }) => (
        <div style={{ display: 'flex', gap: '20px', position: 'relative' }}>
            {/* Timeline Line */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: 'var(--color-accent)',
                    marginTop: '6px',
                    boxShadow: '0 0 0 4px rgba(var(--color-accent-rgb), 0.2)'
                }}></div>
                {!isLast && <div style={{ width: '2px', flex: 1, background: 'var(--color-grid)', margin: '4px 0' }}></div>}
            </div>
            <div style={{ flex: 1, paddingBottom: isLast ? 0 : '32px' }}>
                {children}
            </div>
        </div>
    );

    const IconButton = ({ onClick, icon }: { onClick: () => void, icon: React.ReactNode }) => (
        <button
            onClick={onClick}
            style={{
                background: 'rgba(0,0,0,0.03)',
                border: '1px solid rgba(0,0,0,0.05)',
                cursor: 'pointer',
                color: 'var(--color-text-main)',
                padding: '8px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-accent)';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.borderColor = 'var(--color-accent)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0,0,0,0.03)';
                e.currentTarget.style.color = 'var(--color-text-main)';
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.05)';
            }}
        >
            {icon}
        </button>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#f8f9fa', paddingBottom: '4rem' }}>
            <div style={{ position: 'fixed', inset: 0, zIndex: 0, opacity: 0.4 }}>
                <GridBackground />
            </div>

            <SEO title={`${name} | Profile`} description={`Professional profile for ${name}`} />
            <AppHeader />

            <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '120px', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '320px 1fr', gap: '32px', alignItems: 'start' }}>

                {/* --- LEFT COLUMN: STICKY IDENTITY --- */}
                <div style={{ position: 'sticky', top: '100px' }}>
                    <GlassCard style={{ textAlign: 'center', padding: '32px 24px' }}>
                        {isOwnProfile && (
                            <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                                <IconButton onClick={() => setShowBasicInfoModal(true)} icon={<EditIcon />} />
                            </div>
                        )}

                        {/* Avatar */}
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            background: 'white',
                            padding: '4px',
                            margin: '0 auto 16px auto',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--color-text-main) 0%, var(--color-text-muted) 100%)',
                                color: 'var(--color-bg)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2.5rem',
                                fontWeight: 700
                            }}>
                                {user?.first_name?.[0]}{user?.last_name?.[0]}
                            </div>
                        </div>

                        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '4px', color: 'var(--color-fg)', letterSpacing: '-0.02em' }}>{name}</h1>
                        {user?.username && (
                            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '8px', fontFamily: 'var(--font-mono)' }}>@{user.username}</div>
                        )}
                        <p style={{ fontSize: '1rem', color: 'var(--color-text-main)', marginBottom: '8px', lineHeight: 1.4 }}>
                            {user?.headline || user?.current_role || 'Medical Professional'}
                        </p>

                        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px', alignItems: 'center' }}>
                            <span style={{ color: 'var(--color-text-secondary)' }}>{user?.location || 'Location not set'}</span>
                            <span style={{ width: '3px', height: '3px', background: 'var(--color-text-muted)', borderRadius: '50%' }}></span>
                            <span style={{ color: 'var(--color-accent)', fontWeight: 600, cursor: 'pointer' }}>Contact info</span>
                        </div>

                        <div style={{ fontSize: '0.9rem', color: 'var(--color-accent)', fontWeight: 600, marginBottom: '20px' }}>
                            500+ connections
                        </div>

                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            {isOwnProfile ? (
                                <>
                                    <button className="btn-primary" style={{ padding: '6px 16px', borderRadius: '24px', flex: 1 }}>Open to</button>
                                    <button className="btn-outline" style={{ padding: '6px 16px', borderRadius: '24px', border: '1px solid var(--color-accent)', color: 'var(--color-accent)', flex: 1 }}>Add section</button>
                                    <button className="btn-outline" style={{ padding: '6px 12px', borderRadius: '50%', border: '1px solid var(--color-text-muted)', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                                    </button>
                                </>
                            ) : (
                                <RelationshipManager
                                    userId={user?.id}
                                    initialRelationship={user?.relationship}
                                    onUpdate={fetchData}
                                />
                            )}
                        </div>
                    </GlassCard>

                    {/* Analytics Card (Private) */}
                    {isOwnProfile && (
                        <GlassCard>
                            <SectionHeader title="Analytics" />
                            <div style={{ display: 'flex', gap: '4px', fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                <span>Private to you</span>
                            </div>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ flex: 1, display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>42 profile views</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Discover who's viewed your profile.</div>
                                    </div>
                                </div>
                                <div style={{ flex: 1, display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>15 post impressions</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Check out who's engaging with your posts.</div>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    )}

                    {/* Resources Card (Private) */}
                    {isOwnProfile && (
                        <GlassCard>
                            <SectionHeader title="Resources" />
                            <div style={{ display: 'flex', gap: '4px', fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                <span>Private to you</span>
                            </div>
                            <div style={{ borderBottom: '1px solid var(--color-grid)', paddingBottom: '12px', marginBottom: '12px' }}>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path></svg>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            Creator mode <span style={{ padding: '0 6px', borderRadius: '4px', background: 'var(--color-grid)', fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>OFF</span>
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Get discovered, showcase content on your profile, and get access to creator tools.</div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>My Network</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>See and manage your connections and interests.</div>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    )}



                    {/* Contact / Links Card */}
                    <GlassCard>
                        <SectionHeader title="Contact" />
                        {user?.website && (
                            <a href={user.website} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-accent)', textDecoration: 'none' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                                Website
                            </a>
                        )}
                        {/* Placeholder for dynamic contact info */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text-main)' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            {user?.email || 'email@example.com'}
                        </div>

                    </GlassCard>

                    {/* Settings Card (Private) */}
                    {isOwnProfile && (
                        <GlassCard>
                            <SectionHeader title="Settings" />
                            <button
                                onClick={handleLogout}
                                className="btn-outline"
                                style={{
                                    width: '100%',
                                    borderColor: '#ef4444',
                                    color: '#ef4444',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                Sign Out
                            </button>
                        </GlassCard>
                    )}
                </div>


                {/* --- RIGHT COLUMN: CONTENT --- */}
                <div style={{ minWidth: 0 }}> {/* minWidth fix for grid text overflow */}

                    {/* 1. ABOUT SECTION */}
                    <GlassCard>
                        <SectionHeader
                            title="About"
                            action={isOwnProfile && <IconButton onClick={() => setShowAboutModal(true)} icon={<EditIcon />} />}
                        />
                        {profile?.bio || user?.summary ? (
                            <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, fontSize: '1rem', color: 'var(--color-text-secondary)' }}>
                                {profile?.bio || user?.summary}
                            </p>
                        ) : (
                            <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                                {isOwnProfile ? 'Add a summary to highlight your professional background.' : 'No summary provided.'}
                            </p>
                        )}
                    </GlassCard>

                    {/* 2. ACTIVITY SECTION (Mocked) */}
                    <GlassCard>
                        <SectionHeader
                            title="Activity"
                            action={
                                <button className="btn-outline" style={{ borderRadius: '16px', padding: '4px 12px', fontSize: '0.85rem' }}>Start a post</button>
                            }
                        />
                        <div style={{ fontSize: '0.9rem', color: 'var(--color-accent)', fontWeight: 600, marginBottom: '16px' }}>
                            500 followers
                        </div>

                        {/* Tabs */}
                        <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--color-grid)', marginBottom: '16px' }}>
                            {['Posts', 'Comments', 'Images'].map(tab => (
                                <button key={tab} style={{
                                    padding: '8px 12px',
                                    borderBottom: tab === 'Posts' ? '2px solid var(--color-accent)' : '2px solid transparent',
                                    fontWeight: tab === 'Posts' ? 600 : 400,
                                    color: tab === 'Posts' ? 'var(--color-accent)' : 'var(--color-text-muted)',
                                    background: 'none',
                                    borderTop: 'none', borderLeft: 'none', borderRight: 'none', cursor: 'pointer'
                                }}>{tab}</button>
                            ))}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Mock Post 1 */}
                            <div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                                    <span style={{ fontWeight: 600, color: 'var(--color-fg)' }}>{name}</span> posted this • 2d
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    {/* Thumbnail */}
                                    <div style={{ width: '64px', height: '64px', background: '#e9ecef', borderRadius: '4px' }}></div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', lineHeight: 1.4 }}>
                                            Excited to share our latest research on cardiovascular health! The findings suggest a strong correlation between...
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Mock Post 2 */}
                            <div style={{ borderTop: '1px solid var(--color-grid)', paddingTop: '16px' }}>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                                    <span style={{ fontWeight: 600, color: 'var(--color-fg)' }}>{name}</span> reposted this • 1w
                                </div>
                                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', lineHeight: 1.4 }}>
                                    What a fantastic medical conference last week. Great to connect with colleagues...
                                </p>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid var(--color-grid)', marginTop: '16px', paddingTop: '12px', textAlign: 'center' }}>
                            <button style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', width: '100%' }}>
                                Show all posts
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                    </GlassCard>

                    {/* 3. EXPERIENCE SECTION */}
                    <GlassCard>
                        <SectionHeader
                            title="Experience"
                            action={isOwnProfile && <IconButton onClick={() => setExperienceModalState({ open: true, data: null })} icon={<PlusIcon />} />}
                        />

                        {experiences && experiences.length > 0 ? (
                            <div style={{ marginTop: '16px' }}>
                                {experiences.map((exp: Experience, index: number) => (
                                    <TimelineItem key={index} isLast={index === experiences.length - 1}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-fg)' }}>{exp.title}</h3>
                                                <div style={{ fontSize: '1rem', color: 'var(--color-text-main)', marginTop: '2px' }}>{exp.institution_name}</div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                                                    {exp.start_date?.split('T')[0]} — {exp.is_current ? 'Present' : exp.end_date?.split('T')[0]}
                                                    {exp.location && ` · ${exp.location}`}
                                                </div>
                                            </div>
                                            {isOwnProfile && (
                                                <div style={{ opacity: 0.5, transition: 'opacity 0.2s' }} className="edit-trigger">
                                                    <IconButton onClick={() => setExperienceModalState({ open: true, data: exp })} icon={<EditIcon />} />
                                                </div>
                                            )}
                                        </div>
                                        {exp.description && (
                                            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', marginTop: '12px', lineHeight: 1.5 }}>
                                                {exp.description}
                                            </p>
                                        )}
                                    </TimelineItem>
                                ))}
                            </div>
                        ) : (
                            <div style={{ padding: '32px', textAlign: 'center', border: '2px dashed var(--color-grid)', borderRadius: '12px', color: 'var(--color-text-muted)' }}>
                                <p style={{ marginBottom: '16px' }}>Showcase your career history.</p>
                                {isOwnProfile && (
                                    <button onClick={() => setExperienceModalState({ open: true, data: null })} className="btn-outline">
                                        + Add position
                                    </button>
                                )}
                            </div>
                        )}
                    </GlassCard>

                    {/* 3. EDUCATION SECTION */}
                    <GlassCard>
                        <SectionHeader
                            title="Education"
                            action={isOwnProfile && <IconButton onClick={() => setEducationModalState({ open: true, data: null })} icon={<PlusIcon />} />}
                        />

                        {education && education.length > 0 ? (
                            <div style={{ marginTop: '16px' }}>
                                {education.map((edu: Education, index: number) => (
                                    <TimelineItem key={index} isLast={index === education.length - 1}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-fg)' }}>{edu.institution_name}</h3>
                                                <div style={{ fontSize: '1rem', color: 'var(--color-text-main)', marginTop: '2px' }}>{edu.degree_type}, {edu.field_of_study}</div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                                                    {edu.start_date?.split('T')[0]} — {edu.graduation_date?.split('T')[0]}
                                                </div>
                                            </div>
                                            {isOwnProfile && (
                                                <div style={{ opacity: 0.5 }} className="edit-trigger">
                                                    <IconButton onClick={() => setEducationModalState({ open: true, data: edu })} icon={<EditIcon />} />
                                                </div>
                                            )}
                                        </div>
                                    </TimelineItem>
                                ))}
                            </div>
                        ) : (
                            <div style={{ padding: '32px', textAlign: 'center', border: '2px dashed var(--color-grid)', borderRadius: '12px', color: 'var(--color-text-muted)' }}>
                                <p style={{ marginBottom: '16px' }}>Add your educational background.</p>
                                {isOwnProfile && (
                                    <button onClick={() => setEducationModalState({ open: true, data: null })} className="btn-outline">
                                        + Add education
                                    </button>
                                )}
                            </div>
                        )}
                    </GlassCard>

                    {/* 4. SKILLS SECTION */}
                    <GlassCard>
                        <SectionHeader
                            title="Skills & Expertise"
                            action={isOwnProfile && <IconButton onClick={() => setShowSkillModal(true)} icon={<PlusIcon />} />}
                        />
                        {skills && skills.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {skills.map((skill: Skill, index: number) => {
                                    let skillName = 'Unknown Skill';
                                    if (typeof skill === 'string') {
                                        skillName = skill;
                                    } else if (typeof skill === 'object' && skill !== null && 'name' in skill) {
                                        skillName = skill.name || 'Unknown Skill';
                                    }
                                    return (
                                        <span key={index} style={{
                                            padding: '8px 16px',
                                            borderRadius: '8px',
                                            background: 'rgba(var(--color-accent-rgb), 0.1)',
                                            color: 'var(--color-accent)',
                                            fontSize: '0.9rem',
                                            fontWeight: 600,
                                            border: '1px solid rgba(var(--color-accent-rgb), 0.2)'
                                        }}>
                                            {skillName}
                                        </span>
                                    );
                                })}
                            </div>
                        ) : (
                            <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                                {isOwnProfile ? 'Add skills to show your expertise.' : 'No skills listed.'}
                            </p>
                        )}
                    </GlassCard>

                    {/* 5. CERTIFICATIONS SECTION */}
                    {certifications && certifications.length > 0 && (
                        <GlassCard>
                            <SectionHeader title="Certifications" />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {certifications.map((cert: Certification, idx: number) => (
                                    <div key={idx} style={{
                                        display: 'flex',
                                        gap: '16px',
                                        alignItems: 'center',
                                        padding: '16px',
                                        background: 'var(--color-surface)',
                                        borderRadius: '12px',
                                        border: '1px solid var(--color-grid)'
                                    }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            background: 'var(--color-text-main)',
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.2rem'
                                        }}>
                                            {/* Generic Badge Icon */}
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-fg)' }}>{cert.name}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{cert.issuing_organization}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    )}

                    {/* 6. PUBLICATIONS SECTION */}
                    {publications && publications.length > 0 && (
                        <GlassCard>
                            <SectionHeader title="Publications" />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {publications.map((pub: Publication, idx: number) => (
                                    <div key={idx}>
                                        <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-fg)' }}>{pub.title}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-main)' }}>{pub.journal_name} • {pub.publication_date?.split('T')[0]}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>{pub.authors.join(', ')}</div>
                                        {pub.url && (
                                            <a href={pub.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: 'var(--color-accent)', textDecoration: 'none', display: 'inline-block', marginTop: '4px' }}>
                                                View Publication ↗
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    )}

                    {/* 7. PROJECTS SECTION */}
                    {projects && projects.length > 0 && (
                        <GlassCard>
                            <SectionHeader title="Projects" />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {projects.map((proj: Project, idx: number) => (
                                    <div key={idx}>
                                        <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-fg)' }}>{proj.title}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                            {proj.start_date?.split('T')[0]} — {proj.is_current ? 'Present' : proj.end_date?.split('T')[0]}
                                        </div>
                                        {proj.description && <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>{proj.description}</p>}
                                        {proj.url && (
                                            <a href={proj.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: 'var(--color-accent)', textDecoration: 'none', display: 'inline-block', marginTop: '4px' }}>
                                                Show project ↗
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    )}

                    {/* 8. AWARDS SECTION */}
                    {awards && awards.length > 0 && (
                        <GlassCard>
                            <SectionHeader title="Honors & Awards" />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {awards.map((award: Award, idx: number) => (
                                    <div key={idx}>
                                        <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-fg)' }}>{award.title}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-main)' }}>{award.issuing_organization}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Issued {award.date_received?.split('T')[0] || award.year}</div>
                                        {award.description && <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>{award.description}</p>}
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    )}

                </div>
            </div >

            {/* MODALS */}
            {
                isOwnProfile && (
                    <>
                        <BasicInfoModal
                            isOpen={showBasicInfoModal}
                            onClose={() => setShowBasicInfoModal(false)}
                            user={user}
                            onSuccess={fetchData}
                        />
                        <AboutModal
                            isOpen={showAboutModal}
                            onClose={() => setShowAboutModal(false)}
                            user={user}
                            profile={profile}
                            onSuccess={fetchData}
                        />
                        <ExperienceModal
                            isOpen={experienceModalState.open}
                            onClose={() => setExperienceModalState({ open: false, data: null })}
                            experienceToEdit={experienceModalState.data}
                            onSuccess={fetchData}
                        />
                        <EducationModal
                            isOpen={educationModalState.open}
                            onClose={() => setEducationModalState({ open: false, data: null })}
                            educationToEdit={educationModalState.data}
                            onSuccess={fetchData}
                        />
                        <SkillModal
                            isOpen={showSkillModal}
                            onClose={() => setShowSkillModal(false)}
                            onSuccess={fetchData}
                        />
                    </>
                )
            }
            <style>{`
                .btn-primary {
                    padding: 12px 24px;
                    background: var(--color-accent);
                    color: white;
                    border: none;
                    font-family: var(--font-main);
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-primary:hover {
                    opacity: 0.9;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(var(--color-accent-rgb), 0.3);
                }
                .btn-outline {
                    padding: 8px 16px;
                    background: transparent;
                    border: 1px solid var(--color-text-main);
                    color: var(--color-text-main);
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.2s;
                }
                .btn-outline:hover {
                    background: var(--color-text-main);
                    color: white;
                }
                .edit-trigger:hover {
                    opacity: 1 !important;
                }
                @media (max-width: 800px) {
                    .container {
                        grid-template-columns: 1fr !important;
                    }
                    div[style*="sticky"] {
                        position: relative !important;
                        top: 0 !important;
                    }
                }
            `}</style>
        </div >
    );
};

export default ProfileView;
