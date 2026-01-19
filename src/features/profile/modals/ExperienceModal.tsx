import React, { useState, useEffect } from 'react';
import ActionModal from './ActionModal';
import { type Experience, addExperience, updateExperience } from '../../../services/profileService';
import LocationAutocomplete from '../../../components/LocationAutocomplete';
import toast from 'react-hot-toast';

interface ExperienceModalProps {
    isOpen: boolean;
    onClose: () => void;
    experienceToEdit?: Experience | null;
    onSuccess: () => void;
}

const ExperienceModal: React.FC<ExperienceModalProps> = ({
    isOpen,
    onClose,
    experienceToEdit,
    onSuccess
}) => {
    const [formData, setFormData] = useState<Partial<Experience>>({
        title: '',
        institution_name: '',
        description: '',
        is_current: false,
        position_type: 'Full Time',
        department: '',
        institution_type: '',
        specialty: '',
        subspecialty: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (experienceToEdit) {
            setFormData({
                ...experienceToEdit,
                start_date: experienceToEdit.start_date ? experienceToEdit.start_date.split('T')[0] : '',
                end_date: experienceToEdit.end_date ? experienceToEdit.end_date.split('T')[0] : ''
            });
        } else {
            // Reset for Add mode
            setFormData({
                title: '',
                institution_name: '',
                location: '',
                start_date: '',
                end_date: '',
                is_current: false,
                description: '',
                position_type: 'Full Time',
                department: '',
                institution_type: '',
                specialty: '',
                subspecialty: ''
            });
        }
    }, [experienceToEdit, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (experienceToEdit && experienceToEdit.id) {
                await updateExperience(experienceToEdit.id, formData as Experience);
                toast.success('Experience updated');
            } else {
                await addExperience(formData as Experience);
                toast.success('Experience added');
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error('Failed to save experience');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ActionModal
            isOpen={isOpen}
            onClose={onClose}
            title={experienceToEdit ? 'Edit Experience' : 'Add Experience'}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
        >
            <label className="modal-label">TITLE</label>
            <input
                className="modal-input"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Ex: Attending Physician"
            />

            <label className="modal-label">INSTITUTION / COMPANY</label>
            <input
                className="modal-input"
                value={formData.institution_name}
                onChange={e => setFormData({ ...formData, institution_name: e.target.value })}
                required
                placeholder="Ex: Mayo Clinic"
            />

            <label className="modal-label">POSITION TYPE</label>
            <select
                className="modal-input"
                style={{ appearance: 'none', backgroundImage: 'none' }} // Ensure cross-browser consistency
                value={formData.position_type}
                onChange={e => setFormData({ ...formData, position_type: e.target.value })}
            >
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Contract">Contract</option>
                <option value="Temporary">Temporary</option>
                <option value="Internship">Internship</option>
                <option value="Residency">Residency</option>
                <option value="Fellowship">Fellowship</option>
                <option value="Volunteer">Volunteer</option>
                <option value="Consultant">Consultant</option>
            </select>

            <label className="modal-label">DEPARTMENT</label>
            <input
                className="modal-input"
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                placeholder="Ex: Cardiology"
            />

            <label className="modal-label">INSTITUTION TYPE</label>
            <input
                className="modal-input"
                value={formData.institution_type}
                onChange={e => setFormData({ ...formData, institution_type: e.target.value })}
                placeholder="Ex: Hospital"
            />

            <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                    <label className="modal-label">SPECIALTY</label>
                    <input
                        className="modal-input"
                        value={formData.specialty}
                        onChange={e => setFormData({ ...formData, specialty: e.target.value })}
                        placeholder="Ex: Cardiology"
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <label className="modal-label">SUBSPECIALTY</label>
                    <input
                        className="modal-input"
                        value={formData.subspecialty}
                        onChange={e => setFormData({ ...formData, subspecialty: e.target.value })}
                        placeholder="Ex: Interventional"
                    />
                </div>
            </div>

            <label className="modal-label">LOCATION</label>
            <LocationAutocomplete
                className="modal-input"
                value={formData.location || ''}
                onChange={(val) => setFormData({ ...formData, location: val })}
                placeholder="Ex: Rochester, MN"
            />

            <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                    <label className="modal-label">START DATE</label>
                    <input
                        type="date"
                        className="modal-input"
                        value={formData.start_date}
                        onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                        required
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <label className="modal-label">END DATE</label>
                    <input
                        type="date"
                        className="modal-input"
                        style={{ opacity: formData.is_current ? 0.5 : 1, pointerEvents: formData.is_current ? 'none' : 'auto', transition: 'opacity 0.2s' }}
                        value={formData.end_date || ''}
                        onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                        disabled={formData.is_current}
                    />
                </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="toggle-switch">
                    <input
                        type="checkbox"
                        checked={formData.is_current}
                        onChange={e => setFormData({ ...formData, is_current: e.target.checked, end_date: e.target.checked ? null : formData.end_date })}
                    />
                    <span className="slider"></span>
                </div>
                <span style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', fontWeight: 500 }}>
                    I currently work here
                </span>
            </div>

            <style>{`
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

            <label className="modal-label">DESCRIPTION</label>
            <textarea
                className="modal-input"
                style={{ minHeight: '100px', resize: 'vertical' }}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your role and responsibilities..."
            />
        </ActionModal>
    );
};

export default ExperienceModal;
