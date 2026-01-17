import React, { useState, useEffect } from 'react';
import ActionModal from './ActionModal';
import { type UserProfile, type ExtendedProfile, updateBasicInfo } from '../../../services/profileService';
import toast from 'react-hot-toast';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserProfile | undefined;
    profile: ExtendedProfile | undefined;
    onSuccess: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({
    isOpen,
    onClose,
    user,
    profile,
    onSuccess
}) => {
    const [summary, setSummary] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Summary might be in 'user.summary' or 'profile.bio'. Let's check both or prefer one.
        // Based on API docs, user.summary exists, and profile.bio exists. 
        // We'll prioritize profile.bio but fallback to user.summary
        if (profile?.bio) {
            setSummary(profile.bio);
        } else if (user?.summary) {
            setSummary(user.summary);
        }
    }, [user, profile, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await updateBasicInfo({ bio: summary });
            toast.success('Summary updated');
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error('Failed to update summary');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ActionModal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit About"
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
        >
            <label className="modal-label">SUMMARY / BIO</label>
            <textarea
                className="modal-input"
                style={{ minHeight: '200px', resize: 'vertical' }}
                value={summary}
                onChange={e => setSummary(e.target.value)}
                placeholder="Write about your years of experience, industry, or skills. People also talk about their achievements or previous job experiences."
                autoFocus
            />
        </ActionModal>
    );
};

export default AboutModal;
