import React, { useState, useEffect } from 'react';
import ActionModal from './ActionModal';
import { type Experience, addExperience, updateExperience } from '../../../services/profileService';
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
        location: '',
        start_date: '',
        end_date: '',
        is_current: false,
        description: '',
        position_type: 'Clinical Position'
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
                position_type: 'Clinical Position'
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

            <label className="modal-label">LOCATION</label>
            <input
                className="modal-input"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
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
                        value={formData.end_date || ''}
                        onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                        disabled={formData.is_current}
                    />
                </div>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                    type="checkbox"
                    id="is_current"
                    checked={formData.is_current}
                    onChange={e => setFormData({ ...formData, is_current: e.target.checked, end_date: e.target.checked ? null : formData.end_date })}
                />
                <label htmlFor="is_current" style={{ fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
                    I am currently working in this role
                </label>
            </div>

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
