import React from 'react';
import type { UserProfile } from '../../../services/profileService';

interface Props {
    data: UserProfile;
    updateData: (data: Partial<UserProfile>) => void;
    onNext: () => void;
}

const BasicInfoStep: React.FC<Props> = ({ data, updateData, onNext }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        updateData({ [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onNext();
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', width: '100%' }}>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                    <label className="label-mono">SPECIALIZATION</label>
                    <input
                        type="text"
                        name="specialization"
                        value={data.specialization || ''}
                        onChange={handleChange}
                        className="input-premium"
                        placeholder="e.g. Cardiology"
                    />
                </div>
                <div>
                    <label className="label-mono">SUB-SPECIALIZATION</label>
                    <input
                        type="text"
                        name="subspecialization"
                        value={data.subspecialization || ''}
                        onChange={handleChange}
                        className="input-premium"
                        placeholder="e.g. Interventional Cardiology"
                    />
                </div>
            </div>

            <div>
                <label className="label-mono">HEADLINE</label>
                <input
                    type="text"
                    name="headline"
                    value={data.headline || ''}
                    onChange={handleChange}
                    className="input-premium"
                    placeholder="e.g. Cardiologist specializing in interventional procedures"
                />
            </div>

            <div>
                <label className="label-mono">PROFESSIONAL SUMMARY</label>
                <textarea
                    name="summary"
                    value={data.summary || ''}
                    onChange={handleChange}
                    className="input-premium"
                    style={{ minHeight: '100px', resize: 'vertical' }}
                    placeholder="Briefly describe your experience and expertise..."
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                    <label className="label-mono">LOCATION</label>
                    <input
                        type="text"
                        name="location"
                        value={data.location || ''}
                        onChange={handleChange}
                        className="input-premium"
                        placeholder="City, State, Country"
                    />
                </div>
                <div>
                    <label className="label-mono">PHONE (OPTIONAL)</label>
                    <input
                        type="text"
                        name="phone"
                        value={data.phone || ''}
                        onChange={handleChange}
                        className="input-premium"
                    />
                </div>
            </div>

            <div>
                <label className="label-mono">WEBSITE</label>
                <input
                    type="text"
                    name="website"
                    value={data.website || ''}
                    onChange={handleChange}
                    className="input-premium"
                    placeholder="https://..."
                />
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn-primary">
                    SAVE & CONTINUE
                </button>
            </div>

            <style>{`
                .label-mono {
                    display: block;
                    font-family: var(--font-mono);
                    font-size: 0.75rem;
                    margin-bottom: 0.5rem;
                    color: var(--color-text-muted);
                    letter-spacing: 0.05em;
                }
                .input-premium {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid var(--color-grid);
                    background: var(--color-bg);
                    color: var(--color-text-main);
                    border-radius: 0;
                    font-size: 1rem;
                    outline: none;
                    transition: border-color 0.2s;
                }
                .input-premium:focus {
                    border-color: var(--color-accent);
                }
                .btn-primary {
                    padding: 14px 28px;
                    background: var(--color-accent);
                    color: white;
                    font-size: 0.9rem;
                    font-weight: 600;
                    border: none;
                    cursor: pointer;
                    letter-spacing: 0.05em;
                }
                .btn-secondary {
                    padding: 14px 28px;
                    background: transparent;
                    color: var(--color-text-main);
                    font-size: 0.9rem;
                    font-weight: 600;
                    border: 1px solid var(--color-grid);
                    cursor: pointer;
                    letter-spacing: 0.05em;
                }
            `}</style>
        </form>
    );
};

export default BasicInfoStep;
