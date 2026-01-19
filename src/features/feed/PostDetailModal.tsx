import React, { useState, useEffect, useCallback } from 'react';
import type { Post, Comment, PaginatedResponse } from '../../types/PostTypes';
import { createComment, getPostComments } from '../../services/commentService';
import CommentTree from './components/CommentTree';

interface PostDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: Post | null;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({ isOpen, onClose, post }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [sort, setSort] = useState('best');
    const [isLoadingComments, setIsLoadingComments] = useState(false);

    // Fetch comments when modal opens or post/sort changes
    useEffect(() => {
        if (isOpen && post) {
            fetchComments();
        } else {
            setComments([]);
        }
    }, [isOpen, post, sort]);

    const fetchComments = async () => {
        if (!post) return;
        setIsLoadingComments(true);
        try {
            // We use tree=true to get the nested structure directly from backend
            const result = await getPostComments(post.id, sort, true, 50, 0);
            // Type guard to handle if it returns array or paginated response
            const commentsData = Array.isArray(result) ? result : (result as PaginatedResponse<Comment>).data;
            setComments(commentsData);
        } catch (error) {
            console.error("Failed to load comments", error);
        } finally {
            setIsLoadingComments(false);
        }
    };

    const handleAddTopLevelComment = async () => {
        if (!newComment.trim() || !post) return;

        try {
            const addedComment = await createComment(post.id, newComment);
            setComments(prev => [addedComment, ...prev]);
            setNewComment('');
        } catch (error) {
            console.error("Failed to post comment", error);
        }
    };

    const handleReply = useCallback(async (parentId: number, content: string) => {
        if (!post) return;
        try {
            const addedReply = await createComment(post.id, content, parentId);

            // Recursive helper to insert the new reply into the tree
            const insertReply = (list: Comment[]): Comment[] => {
                return list.map(c => {
                    if (c.id === parentId) {
                        return {
                            ...c,
                            replies: c.replies ? [...c.replies, addedReply] : [addedReply],
                            replies_count: (c.replies_count || 0) + 1
                        };
                    } else if (c.replies && c.replies.length > 0) {
                        return {
                            ...c,
                            replies: insertReply(c.replies)
                        };
                    }
                    return c;
                });
            };

            setComments(prev => insertReply(prev));
        } catch (error) {
            console.error("Failed to post reply", error);
        }
    }, [post]);

    if (!isOpen || !post) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
        }}>
            {/* Extended Backdrop with deep blur */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(5, 5, 5, 0.85)',
                    backdropFilter: 'blur(12px)',
                    transition: 'opacity 0.3s ease'
                }}
                onClick={onClose}
            />

            {/* Modal Content - Premium Glass */}
            <div style={{
                width: '100%',
                maxWidth: '850px',
                height: '92vh',
                background: 'rgba(30,30,30, 0.6)', // Semi-transparent dark
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 32px 64px rgba(0,0,0,0.4)',
                borderRadius: '24px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                animation: 'modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
                {/* Sticky Header */}
                <div style={{
                    padding: '20px 32px',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(30,30,30, 0.8)',
                    zIndex: 10
                }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--color-fg)' }}>
                        Discussion
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: 'none',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'var(--color-text-muted)',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                            e.currentTarget.style.color = 'var(--color-fg)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                            e.currentTarget.style.color = 'var(--color-text-muted)';
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '0' }}>

                    <div style={{ maxWidth: '768px', margin: '0 auto', padding: '32px 0' }}>
                        {/* Original Post Content */}
                        <div style={{ marginBottom: '40px', padding: '0 32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                                {post.profile_image_url ? (
                                    <img src={post.profile_image_url} alt={post.first_name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }} />
                                ) : (
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #4da6ff, #0066cc)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: '700',
                                        color: 'white',
                                        fontSize: '1.1rem',
                                        boxShadow: '0 4px 12px rgba(0,102,204,0.3)'
                                    }}>
                                        {post.first_name[0]}
                                    </div>
                                )}
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--color-fg)' }}>{post.first_name} {post.last_name}</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                                        {post.headline || 'Member'} • <span style={{ opacity: 0.8 }}>{new Date(post.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</span>
                                    </div>
                                </div>
                            </div>

                            <p style={{
                                fontSize: '1.15rem',
                                lineHeight: 1.7,
                                marginBottom: '24px',
                                color: 'rgba(255,255,255,0.9)',
                                fontWeight: 400,
                                whiteSpace: 'pre-wrap'
                            }}>
                                {post.content}
                            </p>

                            <div style={{
                                borderTop: '1px solid rgba(255,255,255,0.08)',
                                borderBottom: '1px solid rgba(255,255,255,0.08)',
                                padding: '16px 0',
                                display: 'flex',
                                gap: '32px',
                                color: 'var(--color-text-muted)',
                                fontSize: '0.95rem',
                                fontWeight: 500
                            }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ color: 'var(--color-fg)', fontWeight: 700 }}>{post.upvotes_count}</span> Upvotes
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ color: 'var(--color-fg)', fontWeight: 700 }}>{post.comments_count}</span> Comments
                                </span>
                            </div>
                        </div>

                        {/* Add Nested Comment Box */}
                        <div style={{ padding: '0 32px 32px 32px' }}>
                            <div style={{
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: '16px',
                                padding: '20px',
                                border: '1px solid rgba(255,255,255,0.05)'
                            }}>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '50%',
                                        background: 'var(--color-fg)',
                                        color: 'var(--color-bg)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.9rem',
                                        fontWeight: 700
                                    }}>
                                        Me
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <textarea
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Adds to the discussion..."
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                background: 'transparent',
                                                border: 'none',
                                                outline: 'none',
                                                minHeight: '60px',
                                                fontSize: '1rem',
                                                color: 'var(--color-fg)',
                                                resize: 'vertical'
                                            }}
                                        />
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                            <button
                                                onClick={handleAddTopLevelComment}
                                                disabled={!newComment.trim()}
                                                style={{
                                                    padding: '8px 24px',
                                                    background: newComment.trim() ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)',
                                                    color: newComment.trim() ? 'white' : 'rgba(255,255,255,0.3)',
                                                    border: 'none',
                                                    borderRadius: '24px',
                                                    fontWeight: 600,
                                                    cursor: newComment.trim() ? 'pointer' : 'default',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                Comment
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Thread Filter */}
                        <div style={{ padding: '0 32px', marginBottom: '8px', display: 'flex', justifyContent: 'flex-end' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                Sort by:
                                <select
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--color-fg)',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        fontSize: '0.85rem',
                                        outline: 'none'
                                    }}
                                >
                                    <option value="best">Best</option>
                                    <option value="top">Top</option>
                                    <option value="new">Newest</option>
                                </select>
                            </div>
                        </div>

                        {/* Nested Comments */}
                        <div style={{ padding: '0 32px' }}>
                            {isLoadingComments ? (
                                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading discussions...</div>
                            ) : (
                                <CommentTree comments={comments} onAddReply={handleReply} />
                            )}
                        </div>
                    </div>

                </div>
            </div>
            <style>{`
                @keyframes modalSlideUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
};

export default PostDetailModal;
