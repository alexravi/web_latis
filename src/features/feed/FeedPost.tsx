import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { Post } from '../../types/PostTypes';
import { upvotePost, downvotePost, repostPost } from '../../services/postService';
import VoteButtons from './components/VoteButtons';
import RepostControl from './components/RepostControl';
import { useQueryClient } from '@tanstack/react-query';
import { postKeys } from '../../hooks/usePosts';

interface FeedPostProps {
    post: Post;
    onClick?: () => void;
}

const FeedPost: React.FC<FeedPostProps> = ({ post, onClick }) => {
    // If it's a repost, we display the "Who reposted" header and then render the original post content
    // contentPost is for Visuals (Avatar, Name, Text)
    // interactionPost is for Actions (Vote, Comment Count, ID) - using the wrapper ensures we use the stats that exist
    const contentPost = post.is_repost && post.original_post ? post.original_post : post;
    const interactionPost = post;
    const isRepost = post.is_repost;
    const queryClient = useQueryClient();

    const handleVote = useCallback(async (type: 'upvote' | 'downvote') => {
        try {
            if (type === 'upvote') {
                await upvotePost(interactionPost.id);
            } else {
                await downvotePost(interactionPost.id);
            }
            // Invalidate to ensure consistency, though VoteButtons handles immediate UI
            queryClient.invalidateQueries({ queryKey: postKeys.detail(interactionPost.id) });
        } catch (error) {
            console.error("Vote failed", error);
        }
    }, [interactionPost.id, queryClient]);

    const handleRepost = useCallback(async () => {
        try {
            await repostPost(interactionPost.id);
            // In a real app, we'd trigger a global feed refresh or toast here
        } catch (error) {
            console.error("Failed to repost", error);
        }
    }, [interactionPost.id]);

    return (
        <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-grid)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            transition: 'box-shadow 0.2s',
            marginBottom: '16px' // Add spacing between posts
        }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)'}
        >
            {/* Repost Header */}
            {isRepost && (
                <div style={{
                    padding: '12px 24px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'var(--color-text-muted)',
                    fontSize: '0.85rem',
                    fontWeight: 600
                }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>
                    {post.first_name} {post.last_name} reposted
                </div>
            )}

            <div style={{ padding: '24px', cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <Link
                            to={`/${contentPost.username || contentPost.user_id}`}
                            style={{ textDecoration: 'none', color: 'inherit', display: 'flex', gap: '12px', alignItems: 'center' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {contentPost.profile_image_url ? (
                                <img
                                    src={contentPost.profile_image_url}
                                    alt={`${contentPost.first_name} ${contentPost.last_name}`}
                                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                                />
                            ) : (
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #eee, #ccc)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#555' }}>
                                    {contentPost.first_name[0]}
                                </div>
                            )}
                            <div>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-fg)' }}>
                                    {contentPost.first_name} {contentPost.last_name}
                                </h3>
                                {contentPost.headline && (
                                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{contentPost.headline}</p>
                                )}
                            </div>
                        </Link>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {new Date(contentPost.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                </div>

                {/* Content */}
                <p style={{ fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '16px', color: 'var(--color-fg)', whiteSpace: 'pre-wrap' }}>
                    {contentPost.content}
                </p>

                {/* Action Bar */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--color-grid)'
                }}
                    onClick={(e) => e.stopPropagation()} // Prevent card click when interacting with actions
                >
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <VoteButtons
                            upvotes={interactionPost.upvotes_count || 0}
                            downvotes={interactionPost.downvotes_count || 0}
                            userVote={interactionPost.user_vote}
                            onVote={handleVote}
                        />

                        <button
                            onClick={onClick}
                            style={{
                                background: 'transparent',
                                color: 'var(--color-text-muted)',
                                border: 'none',
                                padding: '8px 12px',
                                borderRadius: '20px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '6px',
                                transition: 'all 0.2s',
                                outline: 'none'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(var(--color-accent-rgb), 0.1)';
                                e.currentTarget.style.color = 'var(--color-accent)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = 'var(--color-text-muted)';
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
                            {interactionPost.comments_count || 0}
                        </button>

                        <RepostControl
                            count={interactionPost.shares_count || 0}
                            isReposted={false} // API doesn't give us "isRepostedByMe" yet on the Post object easily without checking another endpoint, so implementing simpler for now or assuming false.
                            onRepost={handleRepost}
                        />
                    </div>

                    <button style={{
                        background: 'transparent',
                        color: 'var(--color-text-muted)',
                        border: 'none',
                        padding: '8px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default React.memo(FeedPost);
