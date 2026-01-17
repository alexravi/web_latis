import React, { useState, useEffect } from 'react';
import ActionModal from './ActionModal';
import { type Education, addEducation, updateEducation } from '../../../services/profileService';
import toast from 'react-hot-toast';

interface EducationModalProps {
    isOpen: boolean;
    onClose: () => void;
    educationToEdit?: Education | null;
    onSuccess: () => void;
}

const EducationModal: React.FC<EducationModalProps> = ({
    isOpen,
    onClose,
    educationToEdit,
    onSuccess
}) => {
    const [formData, setFormData] = useState<Partial<Education>>({
        institution_name: '',
        degree_type: '',
        field_of_study: '',
        start_date: '',
        graduation_date: '',
        grade: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (educationToEdit) {
            setFormData({
                ...educationToEdit,
                start_date: educationToEdit.start_date ? educationToEdit.start_date.split('T')[0] : '',
                graduation_date: educationToEdit.graduation_date ? educationToEdit.graduation_date.split('T')[0] : ''
            });
        } else {
            setFormData({
                institution_name: '',
                degree_type: '',
                field_of_study: '',
                start_date: '',
                graduation_date: '',
                grade: ''
            });
        }
    }, [educationToEdit, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (educationToEdit && educationToEdit.id) {
                await updateEducation(educationToEdit.id, formData as Education);
                toast.success('Education updated');
            } else {
                await addEducation(formData as Education);
                toast.success('Education added');
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error('Failed to save education');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ActionModal
            isOpen={isOpen}
            onClose={onClose}
            title={educationToEdit ? 'Edit Education' : 'Add Education'}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
        >
            <label className="modal-label">SCHOOL / INSTITUTION</label>
            <input
                className="modal-input"
                value={formData.institution_name}
                onChange={e => setFormData({ ...formData, institution_name: e.target.value })}
                required
                placeholder="Ex: Harvard University"
            />

            <label className="modal-label">DEGREE</label>
            <input
                className="modal-input"
                value={formData.degree_type}
                onChange={e => setFormData({ ...formData, degree_type: e.target.value })}
                required
                placeholder="Ex: MD, PhD, BS"
            />

            <label className="modal-label">FIELD OF STUDY</label>
            <input
                className="modal-input"
                value={formData.field_of_study}
                onChange={e => setFormData({ ...formData, field_of_study: e.target.value })}
                placeholder="Ex: Neuroscience"
            />

            <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                    <label className="modal-label">START DATE</label>
                    <input
                        type="date"
                        className="modal-input"
                        value={formData.start_date}
                        onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <label className="modal-label">GRADUATION DATE (OR EXPECTED)</label>
                    <input
                        type="date"
                        className="modal-input"
                        value={formData.graduation_date}
                        onChange={e => setFormData({ ...formData, graduation_date: e.target.value })}
                    />
                </div>
            </div>

        </ActionModal>
    );
};

export default EducationModal;
