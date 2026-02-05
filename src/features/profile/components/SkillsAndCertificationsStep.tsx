import React, { useState } from 'react';
import type { Skill, Certification } from '../../../services/profileService';

interface Props {
    skills: Skill[];
    certifications: Certification[];
    updateSkills: (data: Skill[]) => void;
    updateCertifications: (data: Certification[]) => void;
    onBack: () => void;
    onNext: () => void;
}

const SkillsAndCertificationsStep: React.FC<Props> = ({ skills, certifications, updateSkills, updateCertifications, onBack, onNext }) => {

    // --- Skills State ---
    const [newSkill, setNewSkill] = useState('');

    // --- Certifications State ---
    const [newCert, setNewCert] = useState<Partial<Certification>>({});
    const [showCertForm, setShowCertForm] = useState(false);

    // --- Handlers ---
    const addSkill = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (newSkill.trim()) {
            // Check for duplicates
            if (!skills.includes(newSkill.trim())) {
                updateSkills([...skills, newSkill.trim()]);
            }
            setNewSkill('');
        }
    };

    const removeSkill = (index: number) => {
        const updated = [...skills];
        updated.splice(index, 1);
        updateSkills(updated);
    };

    const addCertification = () => {
        if (newCert.name && newCert.certification_type) {
            updateCertifications([...certifications, newCert as Certification]);
            setNewCert({});
            setShowCertForm(false);
        }
    };

    const removeCertification = (index: number) => {
        const updated = [...certifications];
        updated.splice(index, 1);
        updateCertifications(updated);
    };

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '3rem' }}>

            {/* --- Skills Section --- */}
            <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--color-fg)', marginBottom: '1.5rem' }}>SKILLS & EXPERTISE</h3>

                <div className="skills-container">
                    {skills.map((skill, idx) => (
                        <span key={idx} className="skill-tag">
                            {typeof skill === 'string' ? skill : (skill as any).name}
                            <button onClick={() => removeSkill(idx)}>×</button>
                        </span>
                    ))}
                </div>

                <form onSubmit={addSkill} style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                        <input
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            placeholder="Add a skill (e.g. Echocardiography)"
                            className="input-premium"
                        />
                    </div>
                    <button type="submit" className="btn-secondary" disabled={!newSkill}>ADD</button>
                </form>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--color-grid)', opacity: 0.5, margin: 0 }} />

            {/* --- Certifications Section --- */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--color-fg)' }}>CERTIFICATIONS</h3>
                    {!showCertForm && (
                        <button onClick={() => setShowCertForm(true)} className="btn-dashed">
                            + ADD CERTIFICATION
                        </button>
                    )}
                </div>

                <div className="list-container">
                    {certifications.map((cert, idx) => (
                        <div key={idx} className="item-card">
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '4px' }}>{cert.name}</div>
                                <div className="meta">{cert.issuing_organization} — {cert.certification_type}</div>
                            </div>
                            <button onClick={() => removeCertification(idx)} className="btn-icon">×</button>
                        </div>
                    ))}
                </div>

                {showCertForm ? (
                    <div className="sub-form">
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>New Certification</h4>
                        <div className="grid-2">
                            <div className="form-group">
                                <input
                                    placeholder="Name *"
                                    value={newCert.name || ''}
                                    onChange={e => setNewCert({ ...newCert, name: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    placeholder="Type (Board, License) *"
                                    value={newCert.certification_type || ''}
                                    onChange={e => setNewCert({ ...newCert, certification_type: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    placeholder="Issuing Organization"
                                    value={newCert.issuing_organization || ''}
                                    onChange={e => setNewCert({ ...newCert, issuing_organization: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="sub-label">Issue Date</label>
                                <input
                                    type="date"
                                    value={newCert.issue_date || ''}
                                    onChange={e => setNewCert({ ...newCert, issue_date: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="form-actions">
                            <button onClick={() => setShowCertForm(false)} className="btn-text">Cancel</button>
                            <button onClick={addCertification} className="btn-small-primary">Add Certification</button>
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
                
                /* Shared Input Styles */
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .form-group input, .form-group textarea, .input-premium {
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
                .form-group input:focus, .form-group textarea:focus, .input-premium:focus {
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

export default SkillsAndCertificationsStep;
