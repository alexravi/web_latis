import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import type { Post, Comment, PaginatedResponse } from '../types/PostTypes';
import { getPostById } from '../services/postService';
import { createComment, getPostComments } from '../services/commentService';
import CommentTree from '../features/feed/components/CommentTree';

const PostPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [sort, setSort] = useState('best');
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (id) {
            loadPost(parseInt(id, 10));
        }
    }, [id]);

    const loadPost = async (postId: number) => {
        setIsLoading(true);
        try {
            const postData = await getPostById(postId);
            setPost(postData);
            fetchComments(postId);
        } catch (error) {
            console.error("Failed to load post", error);
            navigate('/feed'); // Redirect on error
        } finally {
            setIsLoading(false);
        }
    };

    const fetchComments = async (postId: number) => {
        setIsLoadingComments(true);
        try {
            const result = await getPostComments(postId, sort, true, 50, 0);
            const commentsData = Array.isArray(result) ? result : (result as PaginatedResponse<Comment>).data;
            setComments(commentsData);
        } catch (error) {
            console.error("Failed to load comments", error);
        } finally {
            setIsLoadingComments(false);
        }
    };

    // Reload comments when sort changes
    useEffect(() => {
        if (post) {
            fetchComments(post.id);
        }
    }, [sort]);

    const handleAddTopLevelComment = async () => {
        if (!newComment.trim() || !post) return;

        setIsSubmitting(true);
        try {
            const addedComment = await createComment(post.id, newComment);
            setComments(prev => [addedComment, ...prev]);
            setNewComment('');
            toast.success('Comment posted successfully');
        } catch (error) {
            console.error("Failed to post comment", error);
            toast.error('Failed to post comment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReply = useCallback(async (parentId: number, content: string) => {
        if (!post) return;
        try {
            const addedReply = await createComment(post.id, content, parentId);

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
            toast.success('Reply posted successfully');
        } catch (error) {
            console.error("Failed to post reply", error);
            toast.error('Failed to post reply. Please try again.');
            throw error;
        }
    }, [post]);

    if (isLoading) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading post...</div>;
    if (!post) return null;

    return (
        <div style={{ maxWidth: '768px', margin: '0 auto', padding: '32px 24px' }}>
            <button
                onClick={() => navigate(-1)}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    marginBottom: '24px',
                    fontSize: '0.9rem',
                    fontWeight: 600
                }}
            >
                ← Back
            </button>

            {/* Post Content - similar to Modal but inline */}
            <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                    {post.profile_image_url ? (
                        <img src={post.profile_image_url} alt={post.first_name} style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                        <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #4da6ff, #0066cc)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            color: 'white',
                            fontSize: '1.2rem'
                        }}>
                            {post.first_name[0]}
                        </div>
                    )}
                    <div>
                        <div style={{ fontWeight: 600, fontSize: '1.15rem', color: 'var(--color-fg)' }}>{post.first_name} {post.last_name}</div>
                        <div style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                            {post.headline || 'Member'} • <span style={{ opacity: 0.8 }}>{new Date(post.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</span>
                        </div>
                    </div>
                </div>

                <p style={{
                    fontSize: '1.2rem',
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
                        <span style={{ color: 'var(--color-fg)', fontWeight: 700 }}>{post.upvotes_count || 0}</span> Upvotes
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'var(--color-fg)', fontWeight: 700 }}>{post.comments_count || 0}</span> Comments
                    </span>
                </div>
            </div>

            {/* Add Comment */}
            <div style={{ marginBottom: '32px' }}>
                <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Adds to the discussion..."
                        style={{
                            width: '100%',
                            padding: '16px',
                            background: 'transparent',
                            border: 'none',
                            outline: 'none',
                            minHeight: '80px',
                            fontSize: '1rem',
                            color: 'var(--color-fg)',
                            resize: 'vertical'
                        }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <button
                            onClick={handleAddTopLevelComment}
                            disabled={!newComment.trim() || isSubmitting}
                            style={{
                                padding: '10px 32px',
                                background: newComment.trim() ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)',
                                color: newComment.trim() ? 'white' : 'rgba(255,255,255,0.3)',
                                border: 'none',
                                borderRadius: '24px',
                                fontWeight: 600,
                                cursor: newComment.trim() ? 'pointer' : 'default',
                                transition: 'all 0.2s',
                                opacity: isSubmitting ? 0.7 : 1
                            }}
                        >
                            {isSubmitting ? 'Posting...' : 'Comment'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Comments List */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Discussion</h3>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--color-text-muted)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            outline: 'none'
                        }}
                    >
                        <option value="best">Best</option>
                        <option value="top">Top</option>
                        <option value="new">Newest</option>
                    </select>
                </div>

                {isLoadingComments ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading discussions...</div>
                ) : (
                    <CommentTree comments={comments} onAddReply={handleReply} />
                )}
            </div>
        </div>
    );
};

export default PostPage;
