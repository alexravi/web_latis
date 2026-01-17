import React, { useState } from 'react';
import type { Experience, Education } from '../../../services/profileService';

interface Props {
    experiences: Experience[];
    education: Education[];
    updateExperiences: (data: Experience[]) => void;
    updateEducation: (data: Education[]) => void;
    onBack: () => void;
    onNext: () => void;
}

const ProfessionalDetailsStep: React.FC<Props> = ({ experiences, education, updateExperiences, updateEducation, onBack, onNext }) => {

    // --- Experience State ---
    const [newExp, setNewExp] = useState<Partial<Experience>>({});
    const [showExpForm, setShowExpForm] = useState(false);

    // --- Education State ---
    const [newEdu, setNewEdu] = useState<Partial<Education>>({});
    const [showEduForm, setShowEduForm] = useState(false);

    // --- Handlers ---
    const addExperience = () => {
        // Basic validation
        if (!newExp.title || !newExp.institution_name || !newExp.start_date) {
            alert('Please fill in Title, Institution, and Start Date.');
            return;
        }

        const experience: Experience = {
            title: newExp.title,
            institution_name: newExp.institution_name,
            position_type: newExp.position_type || 'Clinical', // Default if missing
            start_date: newExp.start_date,
            is_current: newExp.is_current || false,
            description: newExp.description || '',
            ...newExp
        };

        updateExperiences([...experiences, experience]);
        setNewExp({});
        setShowExpForm(false);
    };

    const removeExperience = (index: number) => {
        const updated = [...experiences];
        updated.splice(index, 1);
        updateExperiences(updated);
    };

    const addEducation = () => {
        if (!newEdu.degree_type || !newEdu.institution_name) {
            alert('Please fill in Degree Type and Institution.');
            return;
        }

        const educationRecord: Education = {
            degree_type: newEdu.degree_type,
            institution_name: newEdu.institution_name,
            field_of_study: newEdu.field_of_study || '',
            graduation_date: newEdu.graduation_date,
            ...newEdu
        };

        updateEducation([...education, educationRecord]);
        setNewEdu({});
        setShowEduForm(false);
    };

    const removeEducation = (index: number) => {
        const updated = [...education];
        updated.splice(index, 1);
        updateEducation(updated);
    };

    return (
        <div style={{ maxWidth: '800px', width: '100%' }}>
            {/* --- Experiences Section --- */}
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--color-text-main)' }}>PROFESSIONAL EXPERIENCE</h3>

            <div className="list-container">
                {experiences.map((exp, idx) => (
                    <div key={idx} className="item-card">
                        <div>
                            <strong>{exp.title}</strong> at {exp.institution_name}
                            <div className="meta">{exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}</div>
                        </div>
                        <button onClick={() => removeExperience(idx)} className="btn-icon">×</button>
                    </div>
                ))}
            </div>

            {showExpForm ? (
                <div className="sub-form">
                    <div className="grid-2">
                        <input
                            placeholder="Job Title *"
                            value={newExp.title || ''}
                            onChange={e => setNewExp({ ...newExp, title: e.target.value })}
                            className="input-premium"
                        />
                        <input
                            placeholder="Institution *"
                            value={newExp.institution_name || ''}
                            onChange={e => setNewExp({ ...newExp, institution_name: e.target.value })}
                            className="input-premium"
                        />
                        <input
                            placeholder="Position Type (e.g. Clinical)"
                            value={newExp.position_type || ''}
                            onChange={e => setNewExp({ ...newExp, position_type: e.target.value })}
                            className="input-premium"
                        />
                        <input
                            placeholder="Specialty"
                            value={newExp.specialty || ''}
                            onChange={e => setNewExp({ ...newExp, specialty: e.target.value })}
                            className="input-premium"
                        />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label style={{ fontSize: '0.75rem', marginBottom: '4px', color: 'var(--color-text-muted)' }}>Start Date *</label>
                            <input
                                type="date"
                                value={newExp.start_date || ''}
                                onChange={e => setNewExp({ ...newExp, start_date: e.target.value })}
                                className="input-premium"
                            />
                        </div>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={newExp.is_current || false}
                                onChange={e => setNewExp({ ...newExp, is_current: e.target.checked })}
                            /> Current Position
                        </label>
                    </div>
                    <textarea
                        placeholder="Description"
                        value={newExp.description || ''}
                        onChange={e => setNewExp({ ...newExp, description: e.target.value })}
                        className="input-premium"
                        style={{ marginTop: '1rem' }}
                    />
                    <div className="form-actions">
                        <button onClick={() => setShowExpForm(false)} className="btn-secondary">CANCEL</button>
                        <button onClick={addExperience} className="btn-primary-small">ADD EXPERIENCE</button>
                    </div>
                </div>
            ) : (
                <button onClick={() => setShowExpForm(true)} className="btn-dashed">+ ADD EXPERIENCE</button>
            )}

            <hr style={{ margin: '2rem 0', borderColor: 'var(--color-grid)', opacity: 0.5 }} />

            {/* --- Education Section --- */}
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--color-text-main)' }}>EDUCATION</h3>

            <div className="list-container">
                {education.map((ed, idx) => (
                    <div key={idx} className="item-card">
                        <div>
                            <strong>{ed.degree_type}</strong> in {ed.field_of_study}
                            <div className="meta">{ed.institution_name}</div>
                        </div>
                        <button onClick={() => removeEducation(idx)} className="btn-icon">×</button>
                    </div>
                ))}
            </div>

            {showEduForm ? (
                <div className="sub-form">
                    <div className="grid-2">
                        <input
                            placeholder="Degree Type (MD, PhD) *"
                            value={newEdu.degree_type || ''}
                            onChange={e => setNewEdu({ ...newEdu, degree_type: e.target.value })}
                            className="input-premium"
                        />
                        <input
                            placeholder="Institution *"
                            value={newEdu.institution_name || ''}
                            onChange={e => setNewEdu({ ...newEdu, institution_name: e.target.value })}
                            className="input-premium"
                        />
                        <input
                            placeholder="Field of Study"
                            value={newEdu.field_of_study || ''}
                            onChange={e => setNewEdu({ ...newEdu, field_of_study: e.target.value })}
                            className="input-premium"
                        />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label style={{ fontSize: '0.75rem', marginBottom: '4px', color: 'var(--color-text-muted)' }}>Graduation Date</label>
                            <input
                                type="date"
                                value={newEdu.graduation_date || ''}
                                onChange={e => setNewEdu({ ...newEdu, graduation_date: e.target.value })}
                                className="input-premium"
                            />
                        </div>
                    </div>
                    <div className="form-actions">
                        <button onClick={() => setShowEduForm(false)} className="btn-secondary">CANCEL</button>
                        <button onClick={addEducation} className="btn-primary-small">ADD EDUCATION</button>
                    </div>
                </div>
            ) : (
                <button onClick={() => setShowEduForm(true)} className="btn-dashed">+ ADD EDUCATION</button>
            )}

            <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={onBack} className="btn-secondary">
                    BACK
                </button>
                <button onClick={onNext} className="btn-primary">
                    SAVE & CONTINUE
                </button>
            </div>

            <style>{`
                .grid-2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }
                .sub-form {
                    background: rgba(0,0,0,0.02);
                    padding: 1.5rem;
                    border: 1px solid var(--color-grid);
                    margin-bottom: 1rem;
                }
                .item-card {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    border: 1px solid var(--color-grid);
                    background: var(--color-bg);
                    margin-bottom: 0.5rem;
                }
                .meta {
                    font-size: 0.8rem;
                    color: var(--color-text-muted);
                }
                .btn-dashed {
                    width: 100%;
                    padding: 1rem;
                    border: 1px dashed var(--color-grid);
                    background: transparent;
                    color: var(--color-text-muted);
                    cursor: pointer;
                }
                .btn-dashed:hover {
                    border-color: var(--color-accent);
                    color: var(--color-accent);
                }
                .form-actions {
                    margin-top: 1rem;
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                }
                .btn-primary-small {
                    padding: 8px 16px;
                    background: var(--color-accent);
                    color: white;
                    border: none;
                    font-weight: 600;
                    cursor: pointer;
                }
                .list-container {
                    margin-bottom: 1rem;
                }
                .btn-icon {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: var(--color-text-muted);
                }
                .checkbox-label {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-family: var(--font-mono);
                    font-size: 0.8rem;
                }
            `}</style>
        </div>
    );
};

export default ProfessionalDetailsStep;
