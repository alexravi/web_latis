import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { Post } from '../../types/PostTypes';
import { upvotePost, downvotePost, repostPost } from '../../services/postService';
import VoteButtons from './components/VoteButtons';
import RepostControl from './components/RepostControl';
import { useQueryClient } from '@tanstack/react-query';
import { postKeys } from '../../hooks/usePosts';
import { MessageSquare, Share2, Repeat2 } from 'lucide-react';

interface FeedPostProps {
    post: Post;
    onClick?: () => void;
}

const FeedPost: React.FC<FeedPostProps> = ({ post, onClick }) => {
    // If it's a repost, we display the "Who reposted" header and then render the original post content
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
            queryClient.invalidateQueries({ queryKey: postKeys.detail(interactionPost.id) });
        } catch (error) {
            console.error("Vote failed", error);
        }
    }, [interactionPost.id, queryClient]);

    const handleRepost = useCallback(async () => {
        try {
            await repostPost(interactionPost.id);
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
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            marginBottom: '20px'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)';
                e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.03)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            {isRepost && (
                <div style={{
                    padding: '16px 24px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'var(--color-text-muted)',
                    fontSize: '0.85rem',
                    fontWeight: 600
                }}>
                    <Repeat2 size={16} />
                    {post.first_name} {post.last_name} reposted
                </div>
            )}

            <div style={{ padding: '24px', cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <Link
                            to={`/${contentPost.username || contentPost.user_id}`}
                            style={{ textDecoration: 'none', color: 'inherit', display: 'flex', gap: '14px', alignItems: 'center' }}
                            onClick={(e) => e.stopPropagation()}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                        >
                            {contentPost.profile_image_url ? (
                                <img
                                    src={contentPost.profile_image_url}
                                    alt={`${contentPost.first_name} ${contentPost.last_name}`}
                                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-surface)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                                />
                            ) : (
                                <div style={{ 
                                    width: '48px', 
                                    height: '48px', 
                                    borderRadius: '50%', 
                                    background: 'linear-gradient(135deg, var(--color-accent), #8A2BE2)', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    fontWeight: 'bold', 
                                    color: '#FFF',
                                    fontSize: '1.2rem',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}>
                                    {contentPost.first_name[0]}
                                </div>
                            )}
                            <div>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-fg)', marginBottom: '2px' }}>
                                    {contentPost.first_name} {contentPost.last_name}
                                </h3>
                                {contentPost.headline && (
                                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{contentPost.headline}</p>
                                )}
                            </div>
                        </Link>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                        {new Date(contentPost.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                </div>

                <p style={{ 
                    fontSize: '1.1rem', 
                    lineHeight: 1.6, 
                    marginBottom: '20px', 
                    color: 'var(--color-fg)', 
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word' 
                }}>
                    {contentPost.content}
                </p>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--color-grid)'
                }}
                    onClick={(e) => e.stopPropagation()} 
                >
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
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
                                borderRadius: '24px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '6px',
                                transition: 'all 0.2s ease',
                                outline: 'none'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'var(--color-grid)';
                                e.currentTarget.style.color = 'var(--color-fg)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = 'var(--color-text-muted)';
                            }}
                        >
                            <MessageSquare size={18} />
                            {interactionPost.comments_count || 0}
                        </button>

                        <RepostControl
                            count={interactionPost.shares_count || 0}
                            isReposted={false}
                            onRepost={handleRepost}
                        />
                    </div>

                    <button style={{
                        background: 'transparent',
                        color: 'var(--color-text-muted)',
                        border: 'none',
                        padding: '10px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s ease'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--color-grid)';
                            e.currentTarget.style.color = 'var(--color-fg)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'var(--color-text-muted)';
                        }}
                    >
                        <Share2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default React.memo(FeedPost);
