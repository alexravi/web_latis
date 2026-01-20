import React, { useState, useCallback } from 'react';
import type { Comment } from '../../../types/PostTypes';
import { upvoteComment, downvoteComment } from '../../../services/commentService';
import VoteButtons from './VoteButtons';

interface CommentNodeProps {
    comment: Comment;
    depth?: number;
    onReply: (parentId: number, content: string) => Promise<void>;
}

const CommentNode: React.FC<CommentNodeProps> = ({ comment, depth = 0, onReply }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleVote = useCallback(async (type: 'upvote' | 'downvote') => {
        if (type === 'upvote') {
            await upvoteComment(comment.id);
        } else {
            await downvoteComment(comment.id);
        }
    }, [comment.id]);

    const handleReplySubmit = async () => {
        if (!replyContent.trim()) return;

        setIsSubmitting(true);
        try {
            await onReply(comment.id, replyContent);
            setIsReplying(false);
            setReplyContent('');
        } catch (error) {
            // Error is handled by parent toast, we just keep the form open
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isCollapsed) {
        return (
            <div style={{ marginLeft: depth > 0 ? '16px' : '0', marginTop: '12px', opacity: 0.6 }}>
                <span
                    style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}
                    onClick={() => setIsCollapsed(false)}
                >
                    [+] {comment.first_name} {comment.last_name} <span style={{ fontWeight: 400 }}>({comment.replies_count || 0} children)</span>
                </span>
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: '16px',
            position: 'relative'
        }}>
            <div style={{ display: 'flex' }}>
                {/* Left: Avatar / Thread Rail Container */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '28px', marginRight: '12px' }}>
                    <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: 'var(--color-grid)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        color: 'var(--color-text-muted)',
                        cursor: 'pointer',
                        overflow: 'hidden'
                    }} onClick={() => setIsCollapsed(true)}>
                        {comment.profile_image_url ? (
                            <img src={comment.profile_image_url} alt={comment.first_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            comment.first_name[0]
                        )}
                    </div>

                    {/* The Rail (Thread Line) */}
                    {!isCollapsed && (
                        <div
                            className="thread-rail"
                            style={{
                                width: '2px',
                                flexGrow: 1,
                                background: 'rgba(255,255,255,0.05)',
                                marginTop: '6px',
                                marginBottom: '6px',
                                borderRadius: '2px',
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                                minHeight: comment.replies && comment.replies.length > 0 ? '100%' : '0'
                            }}
                            onClick={() => setIsCollapsed(true)}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-accent)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        />
                    )}
                </div>

                {/* Right: Content */}
                <div style={{ flex: 1 }}>

                    {/* Meta Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 600, color: 'var(--color-fg)' }}>{comment.first_name} {comment.last_name}</span>
                        {/* Role isn't in new Comment object immediately, assume simple display or if user details enriched */}
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>• {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    {/* Body */}
                    <div style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.9)', whiteSpace: 'pre-wrap' }}>
                        {comment.content}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                        <VoteButtons
                            upvotes={comment.upvotes_count || 0}
                            downvotes={comment.downvotes_count || 0}
                            userVote={comment.user_vote}
                            onVote={handleVote}
                            size="sm"
                        />

                        <button
                            className="action-btn"
                            onClick={() => setIsReplying(!isReplying)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'inherit', padding: '4px 0', outline: 'none' }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                            Reply
                        </button>
                    </div>

                    {/* Reply Input with animation */}
                    {isReplying && (
                        <div style={{ marginTop: '16px', animation: 'fadeIn 0.2s ease-out' }}>
                            <div style={{
                                borderLeft: '2px solid var(--color-grid)',
                                paddingLeft: '16px'
                            }}>
                                <textarea
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder="What are your thoughts?"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid var(--color-grid)',
                                        background: 'rgba(0,0,0,0.2)',
                                        color: 'var(--color-fg)',
                                        fontSize: '0.95rem',
                                        fontFamily: 'inherit',
                                        minHeight: '80px',
                                        resize: 'vertical',
                                        outline: 'none'
                                    }}
                                    autoFocus
                                />
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                                    <button onClick={() => setIsReplying(false)} style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid transparent', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-muted)', fontWeight: 600 }}>Cancel</button>
                                    <button onClick={handleReplySubmit} disabled={isSubmitting} style={{ padding: '8px 20px', borderRadius: '20px', border: 'none', background: 'var(--color-accent)', color: 'white', fontWeight: 600, cursor: isSubmitting ? 'default' : 'pointer', opacity: isSubmitting ? 0.7 : 1 }}>{isSubmitting ? 'Posting...' : 'Reply'}</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Recursive Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div style={{ marginTop: '0px' }}> {/* Margin handled by parent indentation visual */}
                            {comment.replies.map(reply => (
                                <CommentNode
                                    key={reply.id}
                                    comment={reply}
                                    depth={depth + 1}
                                    onReply={onReply}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default React.memo(CommentNode);
