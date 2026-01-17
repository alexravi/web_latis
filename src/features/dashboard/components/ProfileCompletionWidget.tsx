import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../../../services/profileService';

const ProfileCompletionWidget: React.FC = () => {
    const navigate = useNavigate();
    const [completion, setCompletion] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkProfile = async () => {
            try {
                const data = await getProfile();

                // Calculate completion percentage
                // If backend provides it in data (e.g. data.completion_percentage), use it.
                // Otherwise custom logic:
                let score = 0;
                let total = 0;

                // Basic weights
                const sections = [
                    { key: 'user.headline', weight: 10 },
                    { key: 'user.location', weight: 10 },
                    { key: 'user.summary', weight: 10 },
                    { key: 'experiences', weight: 30, isArray: true }, // Big weight for experience
                    { key: 'education', weight: 20, isArray: true },
                    { key: 'skills', weight: 10, isArray: true },
                    { key: 'profile.bio', weight: 10 }
                ];

                const getValue = (obj: any, path: string) => {
                    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
                };

                sections.forEach(section => {
                    total += section.weight;
                    const val = getValue(data, section.key);
                    if (section.isArray) {
                        if (Array.isArray(val) && val.length > 0) score += section.weight;
                    } else {
                        if (val) score += section.weight;
                    }
                });

                // If the user object is missing entirely, it's 0%
                if (!data || !data.user) {
                    setCompletion(0);
                } else if (data.completion_percentage !== undefined) {
                    setCompletion(data.completion_percentage);
                } else {
                    setCompletion(Math.min(100, Math.round((score / total) * 100)));
                }

            } catch (error) {
                // If 404 or error, assume 0% or incomplete
                setCompletion(0);
            } finally {
                setLoading(false);
            }
        };

        checkProfile();
    }, []);

    if (loading || completion === null || completion === 100) return null;

    return (
        <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-grid)',
            padding: '24px',
            marginTop: '24px'
        }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: '12px', color: 'var(--color-fg)' }}>
                COMPLETE YOUR PROFILE
            </h3>

            <div style={{
                height: '8px',
                background: 'var(--color-grid)',
                borderRadius: '4px',
                marginBottom: '12px',
                overflow: 'hidden'
            }}>
                <div style={{
                    height: '100%',
                    width: `${completion}%`,
                    background: 'var(--color-accent)',
                    transition: 'width 0.5s ease-out'
                }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    {completion}% COMPLETE
                </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                Complete your profile to get verified and unlock full access to the network.
            </p>

            <button
                onClick={() => navigate('/complete-profile')}
                style={{
                    width: '100%',
                    padding: '10px',
                    background: 'var(--color-fg)',
                    color: 'var(--color-bg)',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    letterSpacing: '0.05em'
                }}
            >
                CONTINUE SETUP
            </button>
        </div>
    );
};

export default ProfileCompletionWidget;
