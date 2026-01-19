import React, { useState } from 'react';
import type { Experience, Education } from '../../../services/profileService';
import LocationAutocomplete from '../../../components/LocationAutocomplete';

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
    const [editingExpIndex, setEditingExpIndex] = useState<number | null>(null);

    // --- Education State ---
    const [newEdu, setNewEdu] = useState<Partial<Education>>({});
    const [showEduForm, setShowEduForm] = useState(false);

    // --- Handlers ---
    const addExperience = () => {
        // Basic validation
        if (!newExp.title || !newExp.institution_name || !newExp.start_date || !newExp.position_type) {
            alert('Please fill in Title, Institution, Start Date, and Position Type.');
            return;
        }

        const experience: Experience = {
            title: newExp.title,
            institution_name: newExp.institution_name,
            position_type: newExp.position_type,
            start_date: newExp.start_date,
            is_current: newExp.is_current || false,
            description: newExp.description || '',
            ...newExp
        };

        if (editingExpIndex !== null) {
            const updated = [...experiences];
            updated[editingExpIndex] = experience;
            updateExperiences(updated);
        } else {
            updateExperiences([...experiences, experience]);
        }

        setNewExp({});
        setEditingExpIndex(null);
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
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '3rem' }}>

            {/* --- Experiences Section --- */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--color-fg)' }}>PROFESSIONAL EXPERIENCE</h3>
                    {!showExpForm && (
                        <button onClick={() => {
                            setNewExp({});
                            setEditingExpIndex(null);
                            setShowExpForm(true);
                        }} className="btn-dashed">
                            + ADD POSITION
                        </button>
                    )}
                </div>

                <div className="list-container">
                    {experiences.map((exp, idx) => (
                        <div key={idx} className="item-card">
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '4px' }}>{exp.title}</div>
                                <div style={{ fontSize: '0.95rem', color: 'var(--color-text-main)' }}>
                                    {exp.institution_name}
                                    {exp.institution_type && <span style={{ opacity: 0.7 }}> ({exp.institution_type})</span>}
                                </div>
                                {exp.department && <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{exp.department}</div>}
                                <div className="meta" style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                                    <span>{exp.start_date} — {exp.is_current ? 'Present' : exp.end_date}</span>
                                    {exp.position_type && (
                                        <>
                                            <span className="dot">•</span>
                                            <span>{exp.position_type}</span>
                                        </>
                                    )}
                                    {exp.location && (
                                        <>
                                            <span className="dot">•</span>
                                            <span>{exp.location}</span>
                                        </>
                                    )}
                                    {exp.specialty && (
                                        <>
                                            <span className="dot">•</span>
                                            <span>{exp.specialty}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={() => {
                                        setNewExp(exp);
                                        setEditingExpIndex(idx);
                                        setShowExpForm(true);
                                    }}
                                    className="btn-icon"
                                    title="Edit"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                </button>
                                <button onClick={() => removeExperience(idx)} className="btn-icon" title="Remove">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {showExpForm && (
                    <div className="sub-form">
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {editingExpIndex !== null ? 'Edit Position' : 'New Position'}
                        </h4>
                        <div className="grid-2">
                            <div className="form-group">
                                <input
                                    placeholder="Job Title *"
                                    value={newExp.title || ''}
                                    onChange={e => setNewExp({ ...newExp, title: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    placeholder="Institution *"
                                    value={newExp.institution_name || ''}
                                    onChange={e => setNewExp({ ...newExp, institution_name: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="sub-label">Position Type *</label>
                                <select
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        border: '1px solid var(--color-grid)',
                                        background: 'rgba(255,255,255,0.5)',
                                        borderRadius: '12px',
                                        fontSize: '0.95rem',
                                        outline: 'none',
                                        color: 'var(--color-text-main)'
                                    }}
                                    value={newExp.position_type || ''}
                                    onChange={e => setNewExp({ ...newExp, position_type: e.target.value })}
                                >
                                    <option value="">Select Type...</option>
                                    <option value="full time">Full Time</option>
                                    <option value="part time">Part Time</option>
                                    <option value="contract">Contract</option>
                                    <option value="temporary">Temporary</option>
                                    <option value="internship">Internship</option>
                                    <option value="residency">Residency</option>
                                    <option value="fellowship">Fellowship</option>
                                    <option value="volunteer">Volunteer</option>
                                    <option value="consultant">Consultant</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <input
                                    placeholder="Department"
                                    value={newExp.department || ''}
                                    onChange={e => setNewExp({ ...newExp, department: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    placeholder="Institution Type (e.g. Hospital)"
                                    value={newExp.institution_type || ''}
                                    onChange={e => setNewExp({ ...newExp, institution_type: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    placeholder="Specialty"
                                    value={newExp.specialty || ''}
                                    onChange={e => setNewExp({ ...newExp, specialty: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    placeholder="Subspecialty"
                                    value={newExp.subspecialty || ''}
                                    onChange={e => setNewExp({ ...newExp, subspecialty: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <LocationAutocomplete
                                    value={newExp.location || ''}
                                    onChange={(val) => setNewExp({ ...newExp, location: val })}
                                    placeholder="Location (City, State)"
                                />
                            </div>
                            <div className="form-group">
                                <label className="sub-label">Start Date *</label>
                                <input
                                    type="date"
                                    value={newExp.start_date || ''}
                                    onChange={e => setNewExp({ ...newExp, start_date: e.target.value })}
                                />
                            </div>
                            <div className="form-group" style={{ opacity: newExp.is_current ? 0.5 : 1, pointerEvents: newExp.is_current ? 'none' : 'auto', transition: 'opacity 0.2s' }}>
                                <label className="sub-label">End Date</label>
                                <input
                                    type="date"
                                    value={newExp.end_date || ''}
                                    onChange={e => setNewExp({ ...newExp, end_date: e.target.value })}
                                    disabled={newExp.is_current}
                                />
                            </div>
                            <div className="form-group" style={{ justifyContent: 'flex-end', paddingBottom: '2px' }}>
                                <label className="toggle-label" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                    <div className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={newExp.is_current || false}
                                            onChange={e => setNewExp({ ...newExp, is_current: e.target.checked, end_date: e.target.checked ? '' : newExp.end_date })}
                                        />
                                        <span className="slider"></span>
                                    </div>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', fontWeight: 500 }}>I currently work here</span>
                                </label>
                            </div>
                        </div>
                        <div className="form-group" style={{ marginTop: '1rem' }}>
                            <textarea
                                placeholder="Description of roles and responsibilities..."
                                value={newExp.description || ''}
                                onChange={e => setNewExp({ ...newExp, description: e.target.value })}
                                style={{ minHeight: '80px', resize: 'vertical' }}
                            />
                        </div>
                        <div className="form-actions">
                            <button onClick={() => {
                                setShowExpForm(false);
                                setNewExp({});
                                setEditingExpIndex(null);
                            }} className="btn-text">Cancel</button>
                            <button onClick={addExperience} className="btn-small-primary">
                                {editingExpIndex !== null ? 'Update Position' : 'Add Experience'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--color-grid)', opacity: 0.5, margin: 0 }} />

            {/* --- Education Section --- */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--color-fg)' }}>EDUCATION</h3>
                    {!showEduForm && (
                        <button onClick={() => setShowEduForm(true)} className="btn-dashed">
                            + ADD EDUCATION
                        </button>
                    )}
                </div>

                <div className="list-container">
                    {education.map((ed, idx) => (
                        <div key={idx} className="item-card">
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '4px' }}>{ed.degree_type}</div>
                                <div style={{ fontSize: '0.95rem', color: 'var(--color-text-main)' }}>{ed.institution_name}</div>
                                <div className="meta" style={{ marginTop: '8px' }}>
                                    <span>{ed.field_of_study}</span>
                                    {ed.graduation_date && (
                                        <>
                                            <span className="dot">•</span>
                                            <span>Graduated {ed.graduation_date}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <button onClick={() => removeEducation(idx)} className="btn-icon" title="Remove">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                            </button>
                        </div>
                    ))}
                </div>

                {showEduForm ? (
                    <div className="sub-form">
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>New Education</h4>
                        <div className="grid-2">
                            <div className="form-group">
                                <input
                                    placeholder="Degree Type (MD, PhD) *"
                                    value={newEdu.degree_type || ''}
                                    onChange={e => setNewEdu({ ...newEdu, degree_type: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    placeholder="Institution *"
                                    value={newEdu.institution_name || ''}
                                    onChange={e => setNewEdu({ ...newEdu, institution_name: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <LocationAutocomplete
                                    value={newEdu.location || ''}
                                    onChange={(val) => setNewEdu({ ...newEdu, location: val })}
                                    placeholder="Location (City, State)"
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    placeholder="Field of Study"
                                    value={newEdu.field_of_study || ''}
                                    onChange={e => setNewEdu({ ...newEdu, field_of_study: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="sub-label">Graduation Date</label>
                                <input
                                    type="date"
                                    value={newEdu.graduation_date || ''}
                                    onChange={e => setNewEdu({ ...newEdu, graduation_date: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="form-actions">
                            <button onClick={() => setShowEduForm(false)} className="btn-text">Cancel</button>
                            <button onClick={addEducation} className="btn-small-primary">Add Education</button>
                        </div>
                    </div>
                ) : null}
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', paddingTop: '2rem', borderTop: '1px solid var(--color-grid)' }}>
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
                    background: rgba(255,255,255,0.4);
                    padding: 1.5rem;
                    border: 1px solid var(--color-grid);
                    border-radius: 16px;
                    margin-bottom: 1rem;
                    backdrop-filter: blur(10px);
                }
                .item-card {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    padding: 1.25rem;
                    border: 1px solid var(--color-grid);
                    background: rgba(255,255,255,0.6);
                    backdrop-filter: blur(5px);
                    border-radius: 12px;
                    margin-bottom: 0.75rem;
                    transition: transform 0.2s;
                }
                .item-card:hover {
                    transform: translateY(-2px);
                    background: rgba(255,255,255,0.8);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }
                .meta {
                    font-size: 0.85rem;
                    color: var(--color-text-muted);
                    font-family: var(--font-mono);
                }
                .dot {
                    color: var(--color-grid);
                    font-weight: bold;
                }
                .btn-dashed {
                    padding: 8px 16px;
                    border: 1px dashed var(--color-grid);
                    border-radius: 8px;
                    background: transparent;
                    color: var(--color-text-main);
                    cursor: pointer;
                    font-size: 0.85rem;
                    font-weight: 500;
                    transition: all 0.2s;
                }
                .btn-dashed:hover {
                    border-color: var(--color-accent);
                    color: var(--color-accent);
                    background: rgba(var(--color-accent-rgb), 0.05);
                }
                .form-actions {
                    margin-top: 1.5rem;
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    align-items: center;
                }
                .btn-small-primary {
                    padding: 10px 20px;
                    background: var(--color-fg);
                    color: var(--color-bg);
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 0.85rem;
                }
                .btn-text {
                    background: none;
                    border: none;
                    color: var(--color-text-muted);
                    cursor: pointer;
                    font-size: 0.85rem;
                    text-decoration: underline;
                }
                .list-container {
                    margin-bottom: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                }
                .btn-icon {
                    background: none;
                    border: 1px solid transparent;
                    border-radius: 50%;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: var(--color-text-muted);
                    transition: all 0.2s;
                }
                .btn-icon:hover {
                    background: #fee2e2;
                    color: #ef4444;
                }
                .checkbox-label {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.9rem;
                    cursor: pointer;
                }
                
                /* Shared Input Styles */
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .form-group input, .form-group textarea {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid var(--color-grid);
                    background: white;
                    color: var(--color-text-main);
                    border-radius: 8px;
                    font-size: 0.9rem;
                    outline: none;
                    transition: all 0.2s;
                    box-sizing: border-box;
                }
                .form-group input:focus, .form-group textarea:focus {
                    border-color: var(--color-accent);
                    box-shadow: 0 0 0 2px rgba(var(--color-accent-rgb), 0.1);
                }
                .sub-label {
                    font-size: 0.75rem;
                    color: var(--color-text-muted);
                    font-weight: 500;
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
                .btn-secondary:hover {
                    color: var(--color-fg);
                }

                /* Toggle Switch */
                .toggle-switch {
                    position: relative;
                    display: inline-block;
                    width: 44px;
                    height: 24px;
                    flex-shrink: 0;
                }
                .toggle-switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: var(--color-grid); /* Default gray */
                    transition: .3s;
                    border-radius: 24px;
                }
                .slider:before {
                    position: absolute;
                    content: "";
                    height: 18px;
                    width: 18px;
                    left: 3px;
                    bottom: 3px;
                    background-color: white;
                    transition: .3s;
                    border-radius: 50%;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                }
                .toggle-switch input:checked + .slider {
                    background-color: var(--color-accent);
                }
                .toggle-switch input:checked + .slider:before {
                    transform: translateX(20px);
                }
            `}</style>
        </div>
    );
};

export default ProfessionalDetailsStep;
