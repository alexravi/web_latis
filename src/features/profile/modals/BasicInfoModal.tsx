import React, { useState, useEffect } from 'react';
import ActionModal from './ActionModal';
import { type UserProfile, updateBasicInfo, checkUsernameAvailability } from '../../../services/profileService';
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
        current_role: '',
        username: ''
    });
    const [usernameError, setUsernameError] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const timeoutRef = React.useRef<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                headline: user.headline || '',
                location: user.location || '',
                current_role: user.current_role || '',
                username: user.username || ''
            });
        }
    }, [user, isOpen]);

    const validateUsername = (val: string) => {
        if (!val) return '';
        if (val.length < 3) return 'Username must be at least 3 characters';
        if (val.length > 30) return 'Username must be at most 30 characters';
        if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]*[a-zA-Z0-9]$|^[a-zA-Z0-9]$/.test(val)) {
            return 'Only letters, numbers, underscores, and hyphens allowed.';
        }
        return '';
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setFormData(prev => ({ ...prev, username: val }));
        setIsUsernameAvailable(null);

        const error = validateUsername(val);
        setUsernameError(error);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        // Don't check availability if it's the same as current user's username (unless we want to verify it's still "available" to us, but the API might fail if we check our own name)
        // Actually, if we type our own name, the API check might return "available: false" or "available: true".
        // Backend doc says "excludes current user from check" - so it should be TRUE.

        if (val && !error && val !== user?.username) {
            setIsCheckingUsername(true);
            timeoutRef.current = setTimeout(async () => {
                try {
                    const result = await checkUsernameAvailability(val);
                    setIsUsernameAvailable(result.available);
                    if (!result.available) {
                        setUsernameError('Username is already taken');
                    }
                } catch (err) {
                    console.error('Error checking username:', err);
                } finally {
                    setIsCheckingUsername(false);
                }
            }, 500);
        } else {
            setIsCheckingUsername(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (usernameError) return;
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



            <div style={{ marginBottom: '1rem' }}>
                <label className="modal-label">USERNAME</label>
                <div style={{ position: 'relative' }}>
                    <input
                        className="modal-input"
                        value={formData.username}
                        onChange={handleUsernameChange}
                        placeholder="unique-handle"
                        style={{
                            borderColor: usernameError ? 'red' : (isUsernameAvailable && formData.username !== user?.username ? 'green' : undefined)
                        }}
                    />
                    {isCheckingUsername && (
                        <span style={{ position: 'absolute', right: '10px', top: '14px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Checking...</span>
                    )}
                </div>
                {usernameError && (
                    <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '4px' }}>{usernameError}</div>
                )}
                {isUsernameAvailable && !usernameError && formData.username !== user?.username && (
                    <div style={{ color: 'green', fontSize: '0.8rem', marginTop: '4px' }}>✓ Username available</div>
                )}
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
        </ActionModal >
    );
};

export default BasicInfoModal;
