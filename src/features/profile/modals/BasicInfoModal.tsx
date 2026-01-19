import React, { useState, useEffect } from 'react';
import ActionModal from './ActionModal';
import { type UserProfile, updateBasicInfo } from '../../../services/profileService';
import LocationAutocomplete from '../../../components/LocationAutocomplete';
import toast from 'react-hot-toast';

interface BasicInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserProfile | undefined;
    onSuccess: () => void;
}

const BasicInfoModal: React.FC<BasicInfoModalProps> = ({
    isOpen,
    onClose,
    user,
    onSuccess
}) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        headline: '',
        location: '',
        current_role: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                headline: user.headline || '',
                location: user.location || '',
                current_role: user.current_role || ''
            });
        }
    }, [user, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await updateBasicInfo(formData);
            toast.success('Profile info updated');
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error('Failed to update info');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ActionModal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Intro"
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
        >
            <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                    <label className="modal-label">FIRST NAME</label>
                    <input
                        className="modal-input"
                        value={formData.first_name}
                        onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                        disabled // Typically name is locked or requires special process, but can enable if needed
                        style={{ opacity: 0.7, cursor: 'not-allowed' }}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <label className="modal-label">LAST NAME</label>
                    <input
                        className="modal-input"
                        value={formData.last_name}
                        onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                        disabled
                        style={{ opacity: 0.7, cursor: 'not-allowed' }}
                    />
                </div>
            </div>

            <label className="modal-label">HEADLINE</label>
            <input
                className="modal-input"
                value={formData.headline}
                onChange={e => setFormData({ ...formData, headline: e.target.value })}
                placeholder="Ex: Cardiologist at Mayo Clinic"
            />

            <label className="modal-label">CURRENT POSITION</label>
            <input
                className="modal-input"
                value={formData.current_role}
                onChange={e => setFormData({ ...formData, current_role: e.target.value })}
                placeholder="Ex: Attending Physician"
            />

            <label className="modal-label">LOCATION</label>
            <LocationAutocomplete
                className="modal-input"
                value={formData.location || ''}
                onChange={(val) => setFormData({ ...formData, location: val })}
                placeholder="Ex: New York, NY"
            />
        </ActionModal>
    );
};

export default BasicInfoModal;
