import React, { useState } from 'react';
import type { Comment } from '../../../types/PostTypes';

interface CommentNodeProps {
    comment: Comment;
    depth?: number;
    onReply: (parentId: string, content: string) => void;
}

const CommentNode: React.FC<CommentNodeProps> = ({ comment, depth = 0, onReply }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState('');

    const handleReplySubmit = () => {
        if (!replyContent.trim()) return;
        onReply(comment.id, replyContent);
        setIsReplying(false);
        setReplyContent('');
    };

    // Color bar for threaded view based on depth (cycling colors)



    if (isCollapsed) {
        return (
            <div style={{ marginLeft: depth > 0 ? '16px' : '0', marginTop: '12px', opacity: 0.6 }}>
                <span
                    style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
                    onClick={() => setIsCollapsed(false)}
                >
                    [+] {comment.author.name} <span style={{ fontWeight: 400 }}>({comment.replies.length} children)</span>
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
                        {comment.author.avatar ? (
                            <img src={comment.author.avatar} alt={comment.author.name} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                        ) : (
                            comment.author.name[0]
                        )}
                    </div>

                    {/* The Rail (Thread Line) */}
                    {!isCollapsed && (
                        <div
                            className="thread-rail"
                            style={{
                                width: '2px',
                                flexGrow: 1,
                                background: 'rgba(255,255,255,0.1)', // Subtle gray
                                marginTop: '6px',
                                marginBottom: '6px',
                                borderRadius: '2px',
                                cursor: 'pointer',
                                transition: 'background 0.2s'
                            }}
                            onClick={() => setIsCollapsed(true)}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-accent)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        />
                    )}
                </div>

                {/* Right: Content */}
                <div style={{ flex: 1 }}>

                    {/* Meta Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 600, color: 'var(--color-fg)' }}>{comment.author.name}</span>
                        <span style={{
                            background: 'rgba(255,255,255,0.1)',
                            padding: '1px 6px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            color: 'var(--color-text-muted)'
                        }}>
                            {comment.author.role}
                        </span>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>• {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    {/* Body */}
                    <div style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.9)' }}>
                        {comment.content}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                        <button
                            className="action-btn"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'inherit', padding: '4px 0' }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
                            {comment.likes}
                        </button>
                        <button
                            className="action-btn"
                            onClick={() => setIsReplying(!isReplying)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'inherit', padding: '4px 0' }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                            Reply
                        </button>
                        <button className="action-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: '4px 0' }}>Share</button>
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
                                        resize: 'vertical'
                                    }}
                                    autoFocus
                                />
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                                    <button onClick={() => setIsReplying(false)} style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid transparent', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-muted)', fontWeight: 600 }}>Cancel</button>
                                    <button onClick={handleReplySubmit} style={{ padding: '8px 20px', borderRadius: '20px', border: 'none', background: 'var(--color-accent)', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Reply</button>
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
        </div>
    );
};

export default CommentNode;
