import React from 'react';
import type { UserProfile } from '../../../services/profileService';
import LocationAutocomplete from '../../../components/LocationAutocomplete';

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
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>

            {/* Specialization fields removed per user request */}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                    <label>FIRST NAME</label>
                    <input
                        type="text"
                        name="first_name"
                        value={data.first_name || ''}
                        onChange={handleChange}
                        placeholder="First Name"
                    />
                </div>
                <div className="form-group">
                    <label>LAST NAME</label>
                    <input
                        type="text"
                        name="last_name"
                        value={data.last_name || ''}
                        onChange={handleChange}
                        placeholder="Last Name"
                    />
                </div>
            </div>

            <div className="form-group">
                <label>HEADLINE</label>
                <input
                    type="text"
                    name="headline"
                    value={data.headline || ''}
                    onChange={handleChange}
                    placeholder="e.g. Cardiologist specializing in interventional procedures"
                />
            </div>

            <div className="form-group">
                <label>PROFESSIONAL SUMMARY</label>
                <textarea
                    name="summary"
                    value={data.summary || ''}
                    onChange={handleChange}
                    style={{ minHeight: '120px', resize: 'vertical', lineHeight: '1.6' }}
                    placeholder="Briefly describe your experience and expertise..."
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.5rem' }}>
                <div className="form-group">
                    <label>LOCATION</label>
                    <LocationAutocomplete
                        value={data.location || ''}
                        onChange={(val) => updateData({ ...data, location: val })}
                        placeholder="City, State, Country"
                    />
                </div>
                <div className="form-group">
                    <label>PHONE (OPTIONAL)</label>
                    <input
                        type="text"
                        name="phone"
                        value={data.phone || ''}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="form-group">
                <label>WEBSITE</label>
                <input
                    type="text"
                    name="website"
                    value={data.website || ''}
                    onChange={handleChange}
                    placeholder="https://..."
                />
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', paddingTop: '2rem', borderTop: '1px solid var(--color-grid)' }}>
                <button type="submit" className="btn-primary">
                    SAVE & CONTINUE
                </button>
            </div>

            <style>{`
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .form-group label {
                    font-family: var(--font-mono);
                    font-size: 0.75rem;
                    color: var(--color-text-muted);
                    letter-spacing: 0.05em;
                    font-weight: 500;
                    text-transform: uppercase;
                }
                .form-group input, .form-group textarea {
                    width: 100%;
                    padding: 14px 16px;
                    border: 1px solid var(--color-grid);
                    background: rgba(255,255,255,0.5); /* Slight glass inside input */
                    color: var(--color-text-main);
                    border-radius: 12px;
                    font-size: 0.95rem;
                    outline: none;
                    transition: all 0.2s;
                    box-sizing: border-box;
                }
                .form-group input:focus, .form-group textarea:focus {
                    border-color: var(--color-accent);
                    background: white;
                    box-shadow: 0 0 0 3px rgba(var(--color-accent-rgb), 0.1);
                }
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
                    transition: transform 0.1s, opacity 0.2s;
                }
                .btn-primary:active {
                    transform: scale(0.98);
                }
            `}</style>
        </form>
    );
};

export default BasicInfoStep;
