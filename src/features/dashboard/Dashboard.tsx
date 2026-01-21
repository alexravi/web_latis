import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AppHeader from './AppHeader';
import GridBackground from '../landing/GridBackground';
import SEO from '../../components/SEO';
import ProfileCompletionWidget from './components/ProfileCompletionWidget';
import { useProfile } from '../../hooks/useProfile';
import { useInfinitePosts } from '../../hooks/usePosts';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import FeedPost from '../feed/FeedPost';
import PostSkeleton from '../../components/skeletons/PostSkeleton';
import CreatePost from '../feed/CreatePost';
import PostDetailModal from '../feed/PostDetailModal';
import type { Post } from '../../types/PostTypes';
import { useQueryClient } from '@tanstack/react-query';
import { postKeys } from '../../hooks/usePosts';

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

    // Flatten pages into single array
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
                        <div style={{ marginBottom: '24px' }}>
                            <CreatePost onPostCreated={() => {
                                queryClient.invalidateQueries({ queryKey: postKeys.lists() });
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
                                            key={post.id}
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
                                        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                            No more posts to load
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
