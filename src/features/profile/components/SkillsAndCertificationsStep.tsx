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
        <div style={{ maxWidth: '800px', width: '100%' }}>

            {/* --- Skills Section --- */}
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--color-text-main)' }}>SKILLS & EXPERTISE</h3>

            <div className="skills-container">
                {skills.map((skill, idx) => (
                    <span key={idx} className="skill-tag">
                        {typeof skill === 'string' ? skill : (skill as any).name}
                        <button onClick={() => removeSkill(idx)}>×</button>
                    </span>
                ))}
            </div>

            <form onSubmit={addSkill} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill (e.g. Echocardiography)"
                    className="input-premium"
                />
                <button type="submit" className="btn-secondary" disabled={!newSkill}>ADD</button>
            </form>

            <hr style={{ margin: '2rem 0', borderColor: 'var(--color-grid)', opacity: 0.5 }} />

            {/* --- Certifications Section --- */}
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--color-text-main)' }}>CERTIFICATIONS</h3>

            <div className="list-container">
                {certifications.map((cert, idx) => (
                    <div key={idx} className="item-card">
                        <div>
                            <strong>{cert.name}</strong>
                            <div className="meta">{cert.issuing_organization} — {cert.certification_type}</div>
                        </div>
                        <button onClick={() => removeCertification(idx)} className="btn-icon">×</button>
                    </div>
                ))}
            </div>

            {showCertForm ? (
                <div className="sub-form">
                    <div className="grid-2">
                        <input
                            placeholder="Name *"
                            value={newCert.name || ''}
                            onChange={e => setNewCert({ ...newCert, name: e.target.value })}
                            className="input-premium"
                        />
                        <input
                            placeholder="Type (Board, License) *"
                            value={newCert.certification_type || ''}
                            onChange={e => setNewCert({ ...newCert, certification_type: e.target.value })}
                            className="input-premium"
                        />
                        <input
                            placeholder="Issuing Organization"
                            value={newCert.issuing_organization || ''}
                            onChange={e => setNewCert({ ...newCert, issuing_organization: e.target.value })}
                            className="input-premium"
                        />
                        <input
                            type="date"
                            placeholder="Issue Date"
                            value={newCert.issue_date || ''}
                            onChange={e => setNewCert({ ...newCert, issue_date: e.target.value })}
                            className="input-premium"
                        />
                    </div>
                    <div className="form-actions">
                        <button onClick={() => setShowCertForm(false)} className="btn-secondary">CANCEL</button>
                        <button onClick={addCertification} className="btn-primary-small">ADD CERTIFICATION</button>
                    </div>
                </div>
            ) : (
                <button onClick={() => setShowCertForm(true)} className="btn-dashed">+ ADD CERTIFICATION</button>
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
                .skills-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                }
                .skill-tag {
                    display: inline-flex;
                    align-items: center;
                    padding: 4px 12px;
                    background: var(--color-background-alt, #f5f5f5);
                    border: 1px solid var(--color-grid);
                    border-radius: 20px;
                    font-size: 0.9rem;
                }
                .skill-tag button {
                    margin-left: 8px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 1.1rem;
                    line-height: 1;
                    color: var(--color-text-muted);
                }
                .skill-tag button:hover {
                    color: red;
                }
            `}</style>
        </div>
    );
};

export default SkillsAndCertificationsStep;
