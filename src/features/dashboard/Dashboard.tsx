import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AppHeader from './AppHeader';
import GridBackground from '../landing/GridBackground';
import SEO from '../../components/SEO';
import ProfileCompletionWidget from './components/ProfileCompletionWidget';
import { useProfile } from '../../hooks/useProfile';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { useConnections } from '../../hooks/useRelationship';
import FeedPost from '../feed/FeedPost';
import PostSkeleton from '../../components/skeletons/PostSkeleton';
import CreatePost from '../feed/CreatePost';
import PostDetailModal from '../feed/PostDetailModal';
import type { Post } from '../../types/PostTypes';
import { useQueryClient } from '@tanstack/react-query';
import { useInfinitePosts } from '../../hooks/usePosts';
import { useVisitStats, useSuggestions } from '../../hooks/useSocialGraph';

const Dashboard: React.FC = () => {
    // Modal state
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();

    // Use React Query hooks for data fetching
    const { data: userProfile, isLoading: isProfileLoading } = useProfile();
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isPostsLoading,
    } = useInfinitePosts(10);

    const { data: connectionsData } = useConnections('connected');
    const { data: visitStats } = useVisitStats(userProfile?.user?.id || 0);
    const { data: suggestions } = useSuggestions(3);

    // Flatten pages into single array (Posts)
    const posts = useMemo(() => {
        return data?.pages.flatMap((page) => page.data) || [];
    }, [data]);

    // Infinite scroll observer
    const observerTarget = useInfiniteScroll({
        hasNextPage: hasNextPage ?? false,
        isFetchingNextPage: isFetchingNextPage,
        fetchNextPage,
    });

    const isLoading = isProfileLoading || isPostsLoading;

    // ... (rest of memoized values)

    // Fallback/Default values if data is missing - memoized
    const displayName = useMemo(() =>
        userProfile?.user?.first_name
            ? `${userProfile.user.first_name} ${userProfile.user.last_name}`
            : "User",
        [userProfile?.user?.first_name, userProfile?.user?.last_name]
    );

    const displayTitle = useMemo(() =>
        userProfile?.user?.current_role || "Medical Professional",
        [userProfile?.user?.current_role]
    );

    const displayInstitution = useMemo(() =>
        userProfile?.user?.location || "",
        [userProfile?.user?.location]
    );

    // Trending Data (Static) - memoized
    const trending = useMemo(() => [
        "New Board Guidelines: Sepsis",
        "Conference: Neuro 2026",
        "Residency Match Results",
        "Telehealth Billing Codes"
    ], []);

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            overflow: 'hidden',
            background: 'var(--color-bg)',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                <GridBackground />
            </div>

            <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <SEO title="Dashboard" description="Your professional medical dashboard." />

                {/* Header is fixed at top inside AppHeader component, but we need to reserve space or place it properly */}
                <div style={{ flex: '0 0 auto', zIndex: 1001 }}>
                    <AppHeader />
                </div>

                <main className="container" style={{
                    flex: '1 1 auto',
                    marginTop: '60px', // Header height
                    height: 'calc(100vh - 60px)', // Precise height calculation
                    display: 'grid',
                    gridTemplateColumns: 'repeat(12, 1fr)',
                    gap: '24px',
                    paddingTop: '24px', // Internal padding
                    paddingBottom: '0', // No bottom padding needed on container
                    overflow: 'hidden' // Container doesn't scroll, columns do
                }}>
                    {/* LEFT COLUMN: IDENTITY (3 cols) - Fixed */}
                    <div style={{
                        gridColumn: 'span 3',
                        height: '100%',
                        overflowY: 'auto',
                        scrollbarWidth: 'none', // Firefox
                        paddingBottom: '24px'
                    }} className="hide-on-mobile custom-scrollbar-hidden">
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
                                <Link to={userProfile?.user?.username ? `/${userProfile.user.username}` : (userProfile?.user?.id ? `/${userProfile.user.id}` : '/profile')} style={{ textDecoration: 'none', color: 'inherit' }}>
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
                                        <span style={{ fontFamily: 'var(--font-mono)' }}>{connectionsData?.count || 0}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--color-text-muted)' }}>Profile Views</span>
                                        <span style={{ fontFamily: 'var(--font-mono)' }}>{visitStats?.total_visits || 0}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div style={{ marginTop: '24px' }}>
                            <ProfileCompletionWidget />
                        </div>

                        {/* Footer Links for Left Column */}
                        <div style={{ marginTop: '24px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                            <p>&copy; 2024 Latis Inc.</p>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                                <span>Privacy</span>
                                <span>Terms</span>
                                <span>Guidelines</span>
                            </div>
                        </div>
                    </div>

                    {/* CENTER COLUMN: FEED (6 cols) - Scrolling */}
                    <div style={{
                        gridColumn: 'span 6',
                        height: '100%',
                        overflowY: 'auto',
                        paddingRight: '4px', // Space for scrollbar
                        paddingBottom: '40px'
                    }} className="grid-col-full-mobile custom-scrollbar">
                        {/* Post Input */}
                        <div style={{ marginBottom: '24px' }}>
                            <CreatePost onPostCreated={() => {
                                queryClient.invalidateQueries({ queryKey: ['posts'] });
                            }} />
                        </div>

                        {/* Feed Stream */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {isPostsLoading && posts.length === 0 ? (
                                <>
                                    <PostSkeleton />
                                    <PostSkeleton />
                                    <PostSkeleton />
                                </>
                            ) : posts.length === 0 ? (
                                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                    No posts yet. Start a discussion!
                                </div>
                            ) : (
                                <>
                                    {posts.map((post) => (
                                        <FeedPost
                                            key={`post-${post.id}`}
                                            post={post}
                                            onClick={() => {
                                                setSelectedPost(post);
                                                setIsModalOpen(true);
                                            }}
                                        />
                                    ))}
                                    {/* Infinite scroll trigger */}
                                    <div ref={observerTarget} style={{ height: '20px' }}>
                                        {isFetchingNextPage && <PostSkeleton />}
                                    </div>
                                    {!hasNextPage && posts.length > 0 && (
                                        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                                            You've reached the end
                                        </div>
                                    )}
                                </>
                            )}
                        </div>


                        <PostDetailModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            post={selectedPost}
                        />
                    </div>

                    {/* RIGHT COLUMN: WIDGETS (3 cols) - Fixed */}
                    <div style={{
                        gridColumn: 'span 3',
                        height: '100%',
                        overflowY: 'auto',
                        scrollbarWidth: 'none',
                        paddingBottom: '24px'
                    }} className="hide-on-mobile custom-scrollbar-hidden">
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
                                    <li key={i} style={{ fontSize: '0.9rem', cursor: 'pointer', transition: 'color 0.2s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-accent)'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
                                    >
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
                            {suggestions?.map((user) => (
                                <div key={user.id} style={{ fontSize: '0.9rem', marginBottom: '12px' }}>
                                    <div style={{ fontWeight: 600 }}>
                                        <Link to={`/${user.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                            {user.first_name} {user.last_name}
                                        </Link>
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                                        {user.headline || 'Medical Professional'}
                                    </div>
                                    <button style={{ fontSize: '0.75rem', border: '1px solid var(--color-grid)', padding: '4px 8px', width: '100%', marginTop: '4px', cursor: 'pointer' }}>
                                        + CONNECT
                                    </button>
                                </div>
                            ))}
                            {(!suggestions || suggestions.length === 0) && (
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                    No suggestions at the moment.
                                </div>
                            )}
                        </div>
                    </div>

                </main>
            </div>

            <style>{`
                /* Hide scrollbar for Chrome, Safari and Opera */
                .custom-scrollbar-hidden::-webkit-scrollbar {
                    display: none;
                }

                /* Custom scrollbar for feed */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: var(--color-grid);
                    border-radius: 20px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: var(--color-text-muted);
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
