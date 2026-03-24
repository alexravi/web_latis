import React, { useState } from 'react';
import { createPost } from '../../services/postService';
import { Image, SmilePlus, Globe, Users, Send } from 'lucide-react';

interface CreatePostProps {
    onPostCreated: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [visibility, setVisibility] = useState<'public' | 'connections'>('public');
    const [isFocused, setIsFocused] = useState(false);

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
            border: `1px solid ${isFocused ? 'var(--color-accent)' : 'var(--color-grid)'}`,
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '24px',
            boxShadow: isFocused ? '0 8px 32px rgba(0,0,0,0.08)' : '0 4px 20px rgba(0,0,0,0.04)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
            <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-accent), #8A2BE2)',
                    color: '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                    Me
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="What's going on?"
                        style={{
                            width: '100%',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--color-text-main)',
                            fontSize: '1.1rem',
                            minHeight: content.trim() || isFocused ? '100px' : '44px',
                            padding: '10px 0',
                            resize: 'none',
                            outline: 'none',
                            fontFamily: 'inherit',
                            transition: 'min-height 0.3s ease',
                        }}
                    />

                    {(content.trim() || isFocused) && (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '12px',
                            paddingTop: '16px',
                            borderTop: '1px solid var(--color-grid)',
                            animation: 'fadeIn 0.3s ease'
                        }}>
                            <div style={{ display: 'flex', gap: '4px', position: 'relative', alignItems: 'center' }}>
                                <button style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '8px 12px',
                                    borderRadius: '20px',
                                    background: 'var(--color-accent-subtle)',
                                    color: 'var(--color-text-main)',
                                    fontSize: '0.85rem',
                                    fontWeight: 500,
                                    border: '1px solid var(--color-grid)',
                                    cursor: 'pointer',
                                    position: 'relative',
                                }}>
                                    {visibility === 'public' ? (
                                        <><Globe size={16} /> Everyone</>
                                    ) : (
                                        <><Users size={16} /> Connections</>
                                    )}
                                    <select
                                        value={visibility}
                                        onChange={(e) => setVisibility(e.target.value as 'public' | 'connections')}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            opacity: 0,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <option value="public">Everyone</option>
                                        <option value="connections">Connections</option>
                                    </select>
                                </button>
                                
                                <div style={{ display: 'flex', gap: '4px', marginLeft: '12px' }}>
                                    {[
                                        { icon: <Image size={18} />, label: 'Image' },
                                        { icon: <SmilePlus size={18} />, label: 'Emoji' },
                                    ].map((action, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            title={action.label}
                                            style={{
                                                padding: '8px',
                                                borderRadius: '50%',
                                                color: 'var(--color-text-muted)',
                                                background: 'transparent',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.background = 'var(--color-grid)';
                                                e.currentTarget.style.color = 'var(--color-text-main)';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.background = 'transparent';
                                                e.currentTarget.style.color = 'var(--color-text-muted)';
                                            }}
                                        >
                                            {action.icon}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={!content.trim() || isLoading}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    background: content.trim() ? 'var(--color-accent)' : 'var(--color-grid)',
                                    color: content.trim() ? '#FFF' : 'var(--color-text-muted)',
                                    border: 'none',
                                    borderRadius: '24px',
                                    padding: '10px 24px',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    cursor: content.trim() ? 'pointer' : 'not-allowed',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    opacity: isLoading ? 0.7 : 1,
                                    transform: content.trim() && !isLoading ? 'scale(1.02)' : 'scale(1)',
                                }}
                            >
                                {isLoading ? 'Posting...' : (
                                    <>
                                        Post <Send size={16} />
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default CreatePost;
