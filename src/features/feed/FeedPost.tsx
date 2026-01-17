import React, { useState } from 'react';
import type { Post, Comment } from '../../types/PostTypes';
import { addComment } from '../../services/postService';
import CommentTree from './components/CommentTree';

interface FeedPostProps {
    post: Post;
}

const FeedPost: React.FC<FeedPostProps> = ({ post }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [localPost, setLocalPost] = useState<Post>(post);
    const [newComment, setNewComment] = useState('');

    // Voting State
    const [voteState, setVoteState] = useState<'up' | 'down' | undefined>(post.userVote);
    const [score, setScore] = useState(post.likes);

    const handleVote = (type: 'up' | 'down') => {
        if (voteState === type) {
            // Toggle off
            setVoteState(undefined);
            setScore(prev => type === 'up' ? prev - 1 : prev + 1);
        } else {
            // Switch vote
            let diff = 0;
            if (voteState === 'up') diff = -1;
            if (voteState === 'down') diff = 1;

            if (type === 'up') diff += 1;
            if (type === 'down') diff -= 1;

            setVoteState(type);
            setScore(prev => prev + diff);
        }
        // Mock API call would go here
    };

    const handleAddTopLevelComment = async () => {
        if (!newComment.trim()) return;

        // Optimistic Update
        const tempId = `temp-${Date.now()}`;
        const tempComment: Comment = {
            id: tempId,
            author: { id: 'me', name: 'Me', role: 'Medical Professional' }, // Mock current user
            content: newComment,
            timestamp: new Date().toISOString(),
            likes: 0,
            replies: []
        };

        const updatedComments = [tempComment, ...localPost.comments];
        setLocalPost({
            ...localPost,
            comments: updatedComments,
            commentsCount: localPost.commentsCount + 1
        });
        setNewComment('');

        // API Call (Mock)
        await addComment(localPost.id, newComment);
    };

    const handleReply = async (parentId: string, content: string) => {
        // Helper to recursively find and add reply
        const addReplyToTree = (comments: Comment[]): Comment[] => {
            return comments.map(c => {
                if (c.id === parentId) {
                    const newReply: Comment = {
                        id: `r-${Date.now()}`,
                        author: { id: 'me', name: 'Me', role: 'Medical Professional' },
                        content: content,
                        timestamp: new Date().toISOString(),
                        likes: 0,
                        replies: []
                    };
                    return { ...c, replies: [...c.replies, newReply] };
                } else if (c.replies.length > 0) {
                    return { ...c, replies: addReplyToTree(c.replies) };
                }
                return c;
            });
        };

        setLocalPost({
            ...localPost,
            comments: addReplyToTree(localPost.comments),
            commentsCount: localPost.commentsCount + 1
        });

        // Backend call (Fire and forget for mock)
        await addComment(localPost.id, content, parentId);
    };

    return (
        <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-grid)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            transition: 'box-shadow 0.2s',
        }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)'}
        >
            <div style={{ padding: '24px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #eee, #ccc)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#555' }}>
                            {post.author.name[0]}
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{post.author.name}</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{post.author.role}</p>
                        </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>

                {/* Content */}
                <p style={{ fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '16px', color: 'var(--color-fg)' }}>
                    {post.content}
                </p>

                {/* Tags */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                    {post.tags.map(tag => (
                        <span key={tag} style={{
                            fontSize: '0.75rem',
                            color: 'var(--color-accent)',
                            background: 'rgba(var(--color-accent-rgb), 0.1)',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontWeight: 500
                        }}>{tag}</span>
                    ))}
                </div>

                {/* Action Bar */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '16px',
                    borderTop: isExpanded ? '1px solid var(--color-grid)' : '1px solid transparent'
                }}>
                    {/* Voting Pill */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '24px',
                        padding: '4px',
                        border: '1px solid var(--color-grid)'
                    }}>
                        <button
                            onClick={() => handleVote('up')}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                padding: '6px 10px',
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: voteState === 'up' ? '#ff4500' : 'var(--color-text-muted)',
                                transition: 'color 0.2s'
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill={voteState === 'up' ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
                        </button>

                        <span style={{
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            minWidth: '24px',
                            textAlign: 'center',
                            color: voteState === 'up' ? '#ff4500' : voteState === 'down' ? '#7193ff' : 'var(--color-fg)'
                        }}>
                            {score}
                        </span>

                        <button
                            onClick={() => handleVote('down')}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                padding: '6px 10px',
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: voteState === 'down' ? '#7193ff' : 'var(--color-text-muted)',
                                transition: 'color 0.2s'
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill={voteState === 'down' ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            style={{
                                background: isExpanded ? 'rgba(var(--color-accent-rgb), 0.1)' : 'transparent',
                                color: isExpanded ? 'var(--color-accent)' : 'var(--color-text-muted)',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '8px',
                                transition: 'all 0.2s'
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
                            {localPost.commentsCount} Comments
                        </button>
                        <button style={{
                            background: 'transparent',
                            color: 'var(--color-text-muted)',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '8px'
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
                            Share
                        </button>
                    </div>
                </div>
            </div>

            {/* Expanded Comment Section */}
            {isExpanded && (
                <div style={{
                    background: 'var(--color-surface)',
                    borderTop: '1px solid var(--color-grid)',
                    padding: '24px',
                    animation: 'slideDown 0.3s ease-out'
                }}>
                    {/* Quick Input */}
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-fg)', color: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>Me</div>
                        <div style={{ flex: 1 }}>
                            <div style={{
                                display: 'flex',
                                background: 'var(--color-bg)',
                                border: '1px solid var(--color-grid)',
                                borderRadius: '20px',
                                padding: '8px 16px',
                                alignItems: 'center'
                            }}>
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add to the discussion..."
                                    style={{
                                        flex: 1,
                                        background: 'transparent',
                                        border: 'none',
                                        outline: 'none',
                                        color: 'var(--color-fg)',
                                        fontSize: '0.95rem'
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleAddTopLevelComment();
                                    }}
                                />
                                <button
                                    onClick={handleAddTopLevelComment}
                                    disabled={!newComment.trim()}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: newComment.trim() ? 'var(--color-accent)' : 'var(--color-text-muted)',
                                        fontWeight: 600,
                                        cursor: newComment.trim() ? 'pointer' : 'default',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>

                    <CommentTree comments={localPost.comments} onAddReply={handleReply} />
                </div>
            )}
            <style>{`
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default FeedPost;
