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
        <div style={{ maxWidth: '800px', width: '100%' }}>

            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--color-text-main)' }}>ABOUT YOU</h3>

            <div>
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

            <div style={{ marginTop: '2rem' }}>
                <label className="label-mono">LANGUAGES</label>
                <div className="skills-container">
                    {(data.languages || []).map((lang, idx) => (
                        <span key={idx} className="skill-tag">
                            {lang}
                            <button onClick={() => removeItem('languages', idx)}>×</button>
                        </span>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        value={newItem.type === 'languages' ? newItem.value : ''}
                        onChange={(e) => setNewItem({ type: 'languages', value: e.target.value })}
                        placeholder="Add language (e.g. Spanish)"
                        onKeyDown={(e) => e.key === 'Enter' && addItem('languages')}
                        className="input-premium"
                    />
                    <button onClick={() => addItem('languages')} className="btn-secondary" disabled={newItem.type !== 'languages' || !newItem.value}>ADD</button>
                </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <label className="label-mono">INTERESTS</label>
                <div className="skills-container">
                    {(data.interests || []).map((int, idx) => (
                        <span key={idx} className="skill-tag">
                            {int}
                            <button onClick={() => removeItem('interests', idx)}>×</button>
                        </span>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        value={newItem.type === 'interests' ? newItem.value : ''}
                        onChange={(e) => setNewItem({ type: 'interests', value: e.target.value })}
                        placeholder="Add interest (e.g. Telemedicine)"
                        onKeyDown={(e) => e.key === 'Enter' && addItem('interests')}
                        className="input-premium"
                    />
                    <button onClick={() => addItem('interests')} className="btn-secondary" disabled={newItem.type !== 'interests' || !newItem.value}>ADD</button>
                </div>
            </div>

            <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between' }}>
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
        </div>
    );
};

export default AdditionalInfoStep;
