import React, { useState } from 'react';
import { createPost } from '../../services/postService';

interface CreatePostProps {
    onPostCreated: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [visibility, setVisibility] = useState<'public' | 'connections'>('public');

    const handleSubmit = async () => {
        if (!content.trim()) return;

        setIsLoading(true);
        try {
            await createPost(content, 'post', visibility);
            setContent('');
            onPostCreated();
        } catch (error) {
            console.error("Failed to create post", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-grid)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.04)'
        }}>
            <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'var(--color-accent)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                }}>
                    Me
                </div>
                <div style={{ flex: 1 }}>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Share your professional insights..."
                        style={{
                            width: '100%',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--color-grid)',
                            borderRadius: '12px',
                            padding: '16px',
                            color: 'var(--color-fg)',
                            fontSize: '1rem',
                            minHeight: '100px',
                            resize: 'vertical',
                            outline: 'none',
                            fontFamily: 'inherit'
                        }}
                    />

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '16px'
                    }}>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <select
                                value={visibility}
                                onChange={(e) => setVisibility(e.target.value as 'public' | 'connections')}
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: 'var(--color-text-muted)',
                                    padding: '6px 12px',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    outline: 'none'
                                }}
                            >
                                <option value="public">🌎 Everyone</option>
                                <option value="connections">👥 Connections</option>
                            </select>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={!content.trim() || isLoading}
                            style={{
                                background: content.trim() ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)',
                                color: content.trim() ? 'white' : 'rgba(255,255,255,0.3)',
                                border: 'none',
                                borderRadius: '24px',
                                padding: '10px 32px',
                                fontWeight: 600,
                                cursor: content.trim() ? 'pointer' : 'not-allowed',
                                transition: 'all 0.2s',
                                opacity: isLoading ? 0.7 : 1
                            }}
                        >
                            {isLoading ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
