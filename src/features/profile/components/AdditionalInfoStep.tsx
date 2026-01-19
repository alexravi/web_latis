import React, { useState } from 'react';
import type { ExtendedProfile } from '../../../services/profileService';

interface Props {
    data: ExtendedProfile;
    updateData: (data: Partial<ExtendedProfile>) => void;
    onBack: () => void;
    onSubmit: () => void;
    isSubmitting: boolean;
}

const AdditionalInfoStep: React.FC<Props> = ({ data, updateData, onBack, onSubmit, isSubmitting }) => {

    // Helper for array fields (languages, interests)
    const [newItem, setNewItem] = useState<{ type: 'languages' | 'interests' | null, value: string }>({ type: null, value: '' });

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateData({ [e.target.name]: e.target.value });
    };

    const addItem = (type: 'languages' | 'interests') => {
        if (!newItem.value.trim()) return;
        const currentList = data[type] || [];
        if (!currentList.includes(newItem.value.trim())) {
            updateData({ [type]: [...currentList, newItem.value.trim()] });
        }
        setNewItem({ type: null, value: '' });
    };

    const removeItem = (type: 'languages' | 'interests', index: number) => {
        const currentList = data[type] || [];
        const updated = [...currentList];
        updated.splice(index, 1);
        updateData({ [type]: updated });
    };

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '3rem' }}>

            <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--color-fg)', marginBottom: '1.5rem' }}>ABOUT YOU</h3>

                <div className="form-group">
                    <label className="label-mono">PROFESSIONAL BIO</label>
                    <textarea
                        name="bio"
                        value={data.bio || ''}
                        onChange={handleChange}
                        className="input-premium"
                        style={{ minHeight: '150px', resize: 'vertical' }}
                        placeholder="Tell us about your professional journey..."
                    />
                </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--color-grid)', opacity: 0.5, margin: 0 }} />

            <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--color-fg)', marginBottom: '1.5rem' }}>LANGUAGES</h3>
                <div className="skills-container" style={{ marginBottom: '1rem' }}>
                    {(data.languages || []).map((lang, idx) => (
                        <span key={idx} className="skill-tag">
                            {lang}
                            <button onClick={() => removeItem('languages', idx)}>×</button>
                        </span>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                        <input
                            value={newItem.type === 'languages' ? newItem.value : ''}
                            onChange={(e) => setNewItem({ type: 'languages', value: e.target.value })}
                            placeholder="Add language (e.g. Spanish)"
                            onKeyDown={(e) => e.key === 'Enter' && addItem('languages')}
                            className="input-premium"
                        />
                    </div>
                    <button onClick={() => addItem('languages')} className="btn-secondary" disabled={newItem.type !== 'languages' || !newItem.value}>ADD</button>
                </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--color-grid)', opacity: 0.5, margin: 0 }} />

            <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--color-fg)', marginBottom: '1.5rem' }}>INTERESTS</h3>
                <div className="skills-container" style={{ marginBottom: '1rem' }}>
                    {(data.interests || []).map((int, idx) => (
                        <span key={idx} className="skill-tag">
                            {int}
                            <button onClick={() => removeItem('interests', idx)}>×</button>
                        </span>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                        <input
                            value={newItem.type === 'interests' ? newItem.value : ''}
                            onChange={(e) => setNewItem({ type: 'interests', value: e.target.value })}
                            placeholder="Add interest (e.g. Telemedicine)"
                            onKeyDown={(e) => e.key === 'Enter' && addItem('interests')}
                            className="input-premium"
                        />
                    </div>
                    <button onClick={() => addItem('interests')} className="btn-secondary" disabled={newItem.type !== 'interests' || !newItem.value}>ADD</button>
                </div>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', paddingTop: '2rem', borderTop: '1px solid var(--color-grid)' }}>
                <button onClick={onBack} className="btn-secondary">
                    BACK
                </button>
                <button
                    onClick={onSubmit}
                    className="btn-primary"
                    disabled={isSubmitting}
                    style={{ opacity: isSubmitting ? 0.7 : 1 }}
                >
                    {isSubmitting ? 'CREATING PROFILE...' : 'COMPLETE PROFILE'}
                </button>
            </div>

            <style>{`
                .label-mono {
                    font-family: var(--font-mono);
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: var(--color-text-muted);
                    margin-bottom: 8px;
                    display: block;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                }
                .input-premium {
                    width: 100%;
                    padding: 16px;
                    border: 1px solid var(--color-grid);
                    background: rgba(255,255,255,0.5);
                    color: var(--color-text-main);
                    border-radius: 12px;
                    font-size: 1rem;
                    outline: none;
                    transition: all 0.2s;
                    box-sizing: border-box;
                }
                .input-premium:focus {
                    border-color: var(--color-accent);
                    background: white;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }

                .skills-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.75rem;
                }
                .skill-tag {
                    display: inline-flex;
                    align-items: center;
                    padding: 8px 16px;
                    background: white;
                    border: 1px solid var(--color-grid);
                    border-radius: 20px;
                    font-size: 0.9rem;
                    color: var(--color-text-main);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                }
                .skill-tag button {
                    margin-left: 8px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 1.1rem;
                    line-height: 1;
                    color: var(--color-text-muted);
                    display: flex;
                    align-items: center;
                }
                .skill-tag button:hover {
                    color: var(--color-accent);
                }

                /* Nav Buttons */
                .btn-primary {
                    padding: 14px 32px;
                    background: var(--color-accent);
                    color: white;
                    font-size: 0.9rem;
                    font-weight: 600;
                    border: none;
                    border-radius: 12px;
                    cursor: pointer;
                    letter-spacing: 0.02em;
                    transition: transform 0.1s;
                }
                .btn-primary:active {
                    transform: scale(0.98);
                }
                .btn-secondary {
                    padding: 14px 24px;
                    background: transparent;
                    color: var(--color-text-muted);
                    font-size: 0.9rem;
                    font-weight: 600;
                    border: none;
                    cursor: pointer;
                }
                .btn-secondary:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .btn-secondary:hover:not(:disabled) {
                    color: var(--color-fg);
                }
            `}</style>
        </div>
    );
};

export default AdditionalInfoStep;
