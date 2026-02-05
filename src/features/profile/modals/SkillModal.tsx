import React, { useState } from 'react';
import ActionModal from './ActionModal';
import { addSkill, type Skill } from '../../../services/profileService';
import toast from 'react-hot-toast';

interface SkillModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const SkillModal: React.FC<SkillModalProps> = ({
    isOpen,
    onClose,
    onSuccess
}) => {
    const [skillName, setSkillName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!skillName.trim()) return;

        setIsSubmitting(true);
        try {
            await addSkill({ name: skillName } as Skill);
            toast.success('Skill added');
            setSkillName('');
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error('Failed to add skill');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ActionModal
            isOpen={isOpen}
            onClose={onClose}
            title="Add Skill"
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitLabel="ADD SKILL"
        >
            <label className="modal-label">SKILL NAME</label>
            <input
                className="modal-input"
                value={skillName}
                onChange={e => setSkillName(e.target.value)}
                required
                placeholder="Ex: Cardiology, Python, Team Leadership"
                autoFocus
            />
            <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Add skills to highlight your expertise.
            </p>
        </ActionModal>
    );
};

export default SkillModal;
