import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProfile, getUserProfileById, getUserProfileByUsername, type CompleteProfileData, type Experience, type Education, type Skill, type Certification, type Publication, type Project, type Award } from '../../services/profileService';
import SEO from '../../components/SEO';
import GridBackground from '../landing/GridBackground';
import AppHeader from '../dashboard/AppHeader';

// Modals
import ExperienceModal from './modals/ExperienceModal';
import EducationModal from './modals/EducationModal';
import SkillModal from './modals/SkillModal';
import BasicInfoModal from './modals/BasicInfoModal';
import AboutModal from './modals/AboutModal';
import ConnectionsModal from './modals/ConnectionsModal';

// import api from '../../services/api';
// import toast from 'react-hot-toast';
// import RelationshipManager from '../../components/profile/RelationshipManager'; // Removed

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

import { useFollowers, useConnections, useConnectMutation, useCancelConnectionMutation } from '../../hooks/useRelationship';
import { useVisitStats } from '../../hooks/useSocialGraph';
import { useUserActivities } from '../../hooks/useActivityFeed';
import FeedPost from '../feed/FeedPost';
import PostSkeleton from '../../components/skeletons/PostSkeleton';
import type { Post } from '../../types/PostTypes'; // Import Post type

const ProfileView: React.FC = () => {
    // const navigate = useNavigate(); // Removed unused
    const { id } = useParams<{ id: string }>();
    const [profileData, setProfileData] = useState<CompleteProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [activeActivityTab, setActiveActivityTab] = useState<'Posts' | 'Comments'>('Posts');

    const connectMutation = useConnectMutation(); // Relationship Mutation
    const cancelConnectionMutation = useCancelConnectionMutation();

    // Modal States
    const [showBasicInfoModal, setShowBasicInfoModal] = useState(false);
    const [showAboutModal, setShowAboutModal] = useState(false);
    const [showSkillModal, setShowSkillModal] = useState(false);

    // Complex Modal States (Edit vs Add)
    const [experienceModalState, setExperienceModalState] = useState<{ open: boolean; data: Experience | null }>({ open: false, data: null });
    const [educationModalState, setEducationModalState] = useState<{ open: boolean; data: Education | null }>({ open: false, data: null });

    // Relationship Data
    // Relationship Data - DEPENDENT on profileData resolving
    // We should NOT use 'id' directly here because it might be a username string, and these services expect IDs (or might fail with usernames if backend is strict)
    // Plus we only want to fetch stats for the RESOLVED user.
    const resolvedUserId = profileData?.user?.id || 0;
    const [showConnectionsModal, setShowConnectionsModal] = useState(false);


    const { data: followersData } = useFollowers(resolvedUserId, 50, 0); // Removed 'id' fallback
    // const { data: followingData } = useFollowing(resolvedUserId); 
    const { data: myConnections } = useConnections('connected');
    const { data: visitStats } = useVisitStats(resolvedUserId);
    // const { data: mutualConnections } = useMutualConnections(resolvedUserId);


    // User Activities
    const activityTypeMap = {
        'Posts': 'post_created',
        'Comments': 'comment_created'
    } as const;

    const {
        data: activityData,
        isLoading: isActivitiesLoading,
        hasNextPage,
        fetchNextPage
    } = useUserActivities(
        profileData?.user?.id || 0,
        5,
        activityTypeMap[activeActivityTab] as any, // Cast to ActivityType
        { enabled: !!profileData?.user?.id }
    );

    // Flatten activities
    const activities = React.useMemo(() => {
        return activityData?.pages.flatMap((page) => page.data) || [];
    }, [activityData]);

    /*
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
    */

    const fetchData = React.useCallback(async () => {
        try {
            setIsLoading(true);
            let data: CompleteProfileData;

            // Get current user from local storage
            const storedUser = localStorage.getItem('user');
            const currentUser = storedUser ? JSON.parse(storedUser) : null;
            const currentUserId = currentUser?.id;
            const currentUsername = currentUser?.username;

            if (id) {
                const isNumericId = /^\d+$/.test(id);

                if (isNumericId) {
                    const targetId = parseInt(id);
                    // Check if the requested ID matches the logged-in user
                    // Use loose equality to handle string/number mismatch
                    if (currentUserId && targetId == currentUserId) {
                        setIsOwnProfile(true);
                        data = await getProfile();
                    } else {
                        setIsOwnProfile(false);
                        data = await getUserProfileById(targetId);
                    }
                } else {
                    // Check if requested username matches logged-in user
                    // Case-insensitive comparison
                    if (currentUsername && id.toLowerCase() === currentUsername.toLowerCase()) {
                        setIsOwnProfile(true);
                        data = await getProfile();
                    } else {
                        setIsOwnProfile(false);
                        data = await getUserProfileByUsername(id);
                    }
                }
            } else {
                // Default to own profile if no ID/Username provided (legacy /profile route)
                setIsOwnProfile(true);
                data = await getProfile();
            }

            // Safety check: if we fetched a profile, and its ID matches currentUserId, FORCE isOwnProfile to true
            // This handles cases where URL is username but we only have ID in local storage or vice versa
            if (data?.user?.id && currentUserId && data.user.id == currentUserId) {
                setIsOwnProfile(true);
            }

            setProfileData(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
            // toast.error('Failed to load profile'); 
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const { user, profile, experiences, education, skills, certifications, publications, projects, awards } = profileData || {};
    const name = user ? `${user.first_name} ${user.last_name}` : 'User';


    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '16px' }}>
                <div className="spinner"></div>
                <p style={{ color: 'var(--color-text-muted)' }}>Loading medical profile...</p>
                <style>{`
                    .spinner {
                        width: 40px; height: 40px;
                        border: 3px solid rgba(var(--color-accent-rgb), 0.3);
                        border-radius: 50%;
                        border-top-color: var(--color-accent);
                        animation: spin 1s ease-in-out infinite;
                    }
                    @keyframes spin { to { transform: rotate(360deg); } }
                `}</style>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '16px' }}>
                <h2 style={{ color: 'var(--color-fg)' }}>Profile not found</h2>
                <p style={{ color: 'var(--color-text-muted)' }}>The user you are looking for does not exist.</p>
                <button
                    onClick={() => window.history.back()}
                    style={{ padding: '8px 16px', background: 'var(--color-accent)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f8f9fa', paddingBottom: '4rem' }}>
            <SEO title={`${name} | Latis Medical`} description={user?.headline || 'Medical Professional Profile'} />
            <GridBackground />
            <AppHeader />

            <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '100px', maxWidth: '1128px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '24px', alignItems: 'start' }}>

                {/* --- MAIN COLUMN --- */}
                <div style={{ minWidth: 0 }}>

                    {/* INTRO CARD */}
                    <GlassCard style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
                        {/* Cover Image */}
                        <div style={{ height: '200px', background: 'linear-gradient(45deg, #708090, #53626F)', position: 'relative' }}>
                            {/* Edit Cover (if own profile) */}
                            {isOwnProfile && (
                                <button style={{ position: 'absolute', top: '24px', right: '24px', background: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                                </button>
                            )}
                        </div>

                        <div style={{ padding: '0 24px 24px', position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                {/* Avatar */}
                                <div style={{ width: '152px', height: '152px', marginTop: '-100px', borderRadius: '50%', border: '4px solid white', background: 'white', overflow: 'hidden', position: 'relative' }}>
                                    <img
                                        src={user?.profile_picture_url || `https://ui-avatars.com/api/?name=${name}&background=0D8ABC&color=fff&size=200`}
                                        alt={name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>

                                {/* Right Side Icons (Company/School) - Mocked for visual */}
                                <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '200px' }}>
                                    {experiences && experiences.length > 0 && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '32px', height: '32px', background: '#f3f2ef', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🏢</div>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-fg)' }}>{experiences[0].company_name}</span>
                                        </div>
                                    )}
                                    {education && education.length > 0 && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '32px', height: '32px', background: '#f3f2ef', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🎓</div>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-fg)' }}>{education[0].institution_name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Name & Headline */}
                            <div style={{ marginTop: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-fg)', lineHeight: 1 }}>{name}</h1>
                                    {/* Verified badge */}
                                    {/* <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--color-text-secondary)" stroke="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg> */}
                                </div>
                                <p style={{ fontSize: '1rem', color: 'var(--color-fg)', marginTop: '4px' }}>
                                    {user?.headline || user?.current_role || 'Medical Professional'}
                                </p>
                            </div>

                            {/* Location & Contact Info */}
                            <div style={{ marginTop: '8px', fontSize: '0.9rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span>{user?.location || 'Location not set'}</span>
                                <span>·</span>
                                <span style={{ color: 'var(--color-accent)', fontWeight: 600, cursor: 'pointer' }}>Contact info</span>
                            </div>

                            <div style={{ marginTop: '12px', fontSize: '0.9rem', color: 'var(--color-accent)', fontWeight: 600 }}>
                                {isOwnProfile ? (
                                    <span style={{ cursor: 'pointer' }} onClick={() => setShowConnectionsModal(true)}>
                                        {myConnections?.count || 0} connections
                                    </span>
                                ) : (
                                    <span>
                                        {user?.counts?.followers || followersData?.count || 0} followers · {user?.counts?.connections || 0} connections
                                    </span>
                                )}
                            </div>

                            {/* Actions */}
                            <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {isOwnProfile ? (
                                    <>
                                        <button className="btn-outline" style={{ borderRadius: '24px', color: 'var(--color-accent)', borderColor: 'var(--color-accent)' }}>Add profile section</button>
                                        <button className="btn-outline" style={{ borderRadius: '24px' }}>More</button>
                                    </>
                                ) : (
                                    <>
                                        {user?.relationship?.connectionStatus === 'connected' ? (
                                            <button className="btn-primary" style={{ borderRadius: '24px' }}>Message</button>
                                        ) : user?.relationship?.connectionStatus === 'pending' ? (
                                            <button
                                                className="btn-outline"
                                                style={{ borderRadius: '24px', background: 'rgba(0,0,0,0.05)' }}
                                                onClick={() => {
                                                    if (user?.id) cancelConnectionMutation.mutate(user.id);
                                                }}
                                                disabled={cancelConnectionMutation.isPending}
                                            >
                                                {cancelConnectionMutation.isPending ? 'Withdrawing...' : 'Withdraw Request'}
                                            </button>
                                        ) : (
                                            <button
                                                className="btn-primary"
                                                style={{ borderRadius: '24px' }}
                                                onClick={() => {
                                                    if (user?.id) connectMutation.mutate(user.id);
                                                }}
                                                disabled={connectMutation.isPending}
                                            >
                                                {connectMutation.isPending ? 'Connecting...' : 'Connect'}
                                            </button>
                                        )}
                                        {/* Show generic Message button only if NOT connected (initial outreach)? 
                                            Usually LinkedIn shows "Message" as primary if connected. 
                                            If not connected, "Connect" is primary. 
                                            Let's keep "Message" as secondary if not connected (might be locked feature usually but we'll leave it simple).
                                         */}
                                        {user?.relationship?.connectionStatus !== 'connected' && (
                                            <button className="btn-outline" style={{ borderRadius: '24px' }}>Message</button>
                                        )}
                                        <button className="btn-outline" style={{ borderRadius: '24px' }}>More</button>
                                    </>
                                )}
                            </div>



                        </div>
                    </GlassCard>

                    {/* Continue with existing content... */}
                    <div style={{ minWidth: 0 }}>

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

                        {/* 2. ACTIVITY SECTION */}
                        <GlassCard>
                            <SectionHeader
                                title="Activity"
                                action={
                                    isOwnProfile && <button className="btn-outline" style={{ borderRadius: '16px', padding: '4px 12px', fontSize: '0.85rem' }}>Start a post</button>
                                }
                            />
                            <div style={{ fontSize: '0.9rem', color: 'var(--color-accent)', fontWeight: 600, marginBottom: '16px' }}>
                                {followersData?.count || 0} followers
                            </div>

                            {/* Tabs - Keeping static for now, but filtering query by type eventually */}
                            {/* Tabs */}
                            <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--color-grid)', marginBottom: '16px' }}>
                                {(['Posts', 'Comments'] as const).map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveActivityTab(tab)}
                                        style={{
                                            padding: '8px 12px',
                                            borderBottom: activeActivityTab === tab ? '2px solid var(--color-accent)' : '2px solid transparent',
                                            fontWeight: activeActivityTab === tab ? 600 : 400,
                                            color: activeActivityTab === tab ? 'var(--color-accent)' : 'var(--color-text-muted)',
                                            background: 'none',
                                            borderTop: 'none', borderLeft: 'none', borderRight: 'none', cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {isActivitiesLoading ? (
                                    <PostSkeleton />
                                ) : activities.length === 0 ? (
                                    <div style={{ padding: '16px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                        No recent activity.
                                    </div>
                                ) : (
                                    activities.map((activity) => {
                                        // We trust the API to return the correct type based on activeActivityTab
                                        // However, if we eventually mix types, we'd filter here.
                                        // For now, we render FeedPost for both (as comments might look like mini-posts or we just show the related post).
                                        // Ideally we'd have a CommentItem component.

                                        // Map to Post (Simplified for Profile view)
                                        // Since we are viewing a specific user, we know the user details mostly, but activity has snapshots
                                        const post: Post = {
                                            id: activity.related_post_id || activity.activity_data?.post_id || activity.id,
                                            user_id: activity.user_id,
                                            first_name: activity.first_name || user?.first_name || 'Unknown',
                                            last_name: activity.last_name || user?.last_name || 'User',
                                            profile_image_url: activity.profile_image_url || user?.profile_picture_url || null,
                                            headline: null,
                                            content: activity.activity_data?.content || activity.activity_data?.title || 'No content',
                                            created_at: activity.created_at,
                                            upvotes_count: activity.activity_data?.upvotes_count || 0,
                                            downvotes_count: activity.activity_data?.downvotes_count || 0,
                                            comments_count: activity.activity_data?.comments_count || 0,
                                            shares_count: activity.activity_data?.shares_count || 0,
                                            user_vote: activity.activity_data?.user_vote || null,
                                            post_type: 'post',
                                            visibility: 'public',
                                            is_pinned: false,
                                            is_edited: false
                                        };

                                        return (
                                            <div key={activity.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
                                                {/* Simplified FeedPost for Profile (or full FeedPost) */}
                                                <FeedPost post={post} />
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {hasNextPage && (
                                <div style={{ marginTop: '16px', textAlign: 'center' }}>
                                    <button
                                        onClick={() => fetchNextPage()}
                                        style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', width: '100%' }}
                                    >
                                        Show all posts
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                    </button>
                                </div>
                            )}
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
                </div>

                {/* --- RIGHT SIDEBAR --- */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <GlassCard style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-fg)' }}>Profile language</h3>
                            <IconButton onClick={() => { }} icon={<EditIcon />} />
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>English</div>
                    </GlassCard>

                    <GlassCard style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-fg)' }}>Public profile & URL</h3>
                            <IconButton onClick={() => { }} icon={<EditIcon />} />
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', wordBreak: 'break-all' }}>www.latis.com/in/{user?.username || id}</div>
                    </GlassCard>

                    {isOwnProfile && (
                        <GlassCard style={{ padding: '16px' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-fg)', marginBottom: '16px' }}>Dashboard</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ background: 'var(--color-surface)', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-grid)' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-accent)' }}>{visitStats?.total_visits || 0}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Profile views (who viewed you)</div>
                                </div>
                                <div style={{ background: 'var(--color-surface)', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-grid)' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-accent)' }}>{visitStats?.unique_visitors || 0}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Unique visitors</div>
                                </div>
                            </div>
                        </GlassCard>
                    )}

                </div>

            </div>

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
            <ConnectionsModal
                isOpen={showConnectionsModal}
                onClose={() => setShowConnectionsModal(false)}
                connections={myConnections?.data as any}
                isLoading={false}
                title="My Connections"
            />
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

/* --- STYLED COMPONENTS --- */
const GlassCard = ({ children, style, className = '' }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) => (
    <div className={`glass-card ${className}`} style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        border: '1px solid var(--color-grid)',
        marginBottom: '24px',
        position: 'relative',
        overflow: 'hidden',
        ...style
    }}>
        {children}
    </div>
);

const IconButton = ({ onClick, icon }: { onClick: () => void; icon: React.ReactNode }) => (
    <button onClick={onClick} style={{
        background: 'rgba(var(--color-accent-rgb), 0.1)',
        border: 'none',
        borderRadius: '50%',
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-accent)',
        cursor: 'pointer',
        transition: 'all 0.2s'
    }} className="edit-trigger">
        {React.cloneElement(icon as React.ReactElement<any>, { width: 16, height: 16 })}
    </button>
);

const SectionHeader = ({ title, action }: { title: string; action?: React.ReactNode }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-fg)', letterSpacing: '-0.01em' }}>
            {title}
        </h2>
        {action}
    </div>
);

const TimelineItem = ({ children, isLast }: { children: React.ReactNode; isLast?: boolean }) => (
    <div style={{
        position: 'relative',
        paddingBottom: isLast ? '0' : '24px',
        paddingLeft: '20px',
        borderLeft: isLast ? '2px solid transparent' : '2px solid var(--color-grid)',
        marginLeft: '4px'
    }}>
        <div style={{
            position: 'absolute',
            left: '-7px',
            top: '0',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: 'var(--color-accent)',
            border: '2px solid white',
            boxShadow: '0 0 0 1px var(--color-accent)'
        }}></div>
        {children}
    </div>
);

export default ProfileView;

