import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import SEO from '../../components/SEO';
import GridBackground from '../landing/GridBackground';
import {
    updateProfile,
    getProfile,
    type CompleteProfileData,
    type UserProfile,
    type ExtendedProfile,
    type Experience,
    type Education,
    type Skill,
    type Certification
} from '../../services/profileService';

import BasicInfoStep from './components/BasicInfoStep';
import ProfessionalDetailsStep from './components/ProfessionalDetailsStep';
import SkillsAndCertificationsStep from './components/SkillsAndCertificationsStep';
import AdditionalInfoStep from './components/AdditionalInfoStep';

const STEPS = [
    { title: 'Basic Info', description: 'Personal & Role' },
    { title: 'Experience', description: 'Work & Education' },
    { title: 'Expertise', description: 'Skills & Certs' },
    { title: 'About', description: 'Bio & Interests' }
];

const CompleteProfile: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // --- Form State ---
    const [formData, setFormData] = useState<CompleteProfileData>({
        user: {},
        profile: { languages: [], interests: [] },
        experiences: [],
        education: [],
        skills: [],
        certifications: [],
        publications: [],
        projects: [],
        awards: []
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfile();
                if (data) {
                    // Merge existing data with default structure to ensure arrays are not undefined
                    setFormData(prev => ({
                        ...prev,
                        ...data,
                        user: { ...prev.user, ...(data.user || {}) },
                        profile: { ...prev.profile, ...(data.profile || {}) },
                        experiences: data.experiences || [],
                        education: data.education || [],
                        skills: data.skills || [],
                        certifications: data.certifications || [],
                        publications: data.publications || [],
                        projects: data.projects || [],
                        awards: data.awards || []
                    }));
                }
            } catch (error) {
                console.error('Failed to fetch profile:', error);
                // If 404, valid new user, just leave defaults.
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // --- Updaters ---
    const updateUserData = (data: Partial<UserProfile>) => {
        setFormData(prev => ({ ...prev, user: { ...prev.user, ...data } }));
    };

    const updateProfileData = (data: Partial<ExtendedProfile>) => {
        setFormData(prev => ({ ...prev, profile: { ...prev.profile, ...data } }));
    };

    const updateExperiences = (data: Experience[]) => {
        setFormData(prev => ({ ...prev, experiences: data }));
    };

    const updateEducation = (data: Education[]) => {
        setFormData(prev => ({ ...prev, education: data }));
    };

    const updateSkills = (data: Skill[]) => {
        setFormData(prev => ({ ...prev, skills: data }));
    };

    const updateCertifications = (data: Certification[]) => {
        setFormData(prev => ({ ...prev, certifications: data }));
    };

    // --- Actions ---
    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
            window.scrollTo(0, 0);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
            window.scrollTo(0, 0);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await updateProfile(formData);
            toast.success('Profile updated successfully!');
            navigate('/dashboard');
        } catch (error: any) {
            console.error('Profile update error:', error);
            const msg = error.response?.data?.message || 'Failed to update profile. Please try again.';
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>LOADING PROFILE...</div>
            </div>
        );
    }

    return (
        <div style={{ position: 'relative', width: '100vw', minHeight: '100vh', display: 'flex' }}>
            <SEO title="Complete Profile" description="Finalize your provider profile" />
            <div style={{ position: 'absolute', inset: 0, zIndex: -1 }}>
                <GridBackground />
            </div>

            {/* Sidebar / Progress */}
            <div className="progress-sidebar" style={{
                width: '300px',
                background: 'var(--color-bg)',
                borderRight: '1px solid var(--color-grid)',
                padding: '4rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 10
            }}>
                <div style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.2rem', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>LATIS</h2>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        PROVIDER ONBOARDING
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {STEPS.map((step, idx) => (
                        <div key={idx} style={{
                            display: 'flex',
                            gap: '1rem',
                            opacity: currentStep === idx ? 1 : idx < currentStep ? 0.6 : 0.3,
                            transition: 'opacity 0.3s'
                        }}>
                            <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                border: '1px solid currentColor',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.8rem',
                                background: currentStep === idx ? 'var(--color-accent)' : 'transparent',
                                color: currentStep === idx ? 'white' : 'inherit',
                                borderColor: currentStep === idx ? 'var(--color-accent)' : 'currentColor'
                            }}>
                                {idx + 1}
                            </div>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{step.title}</div>
                                <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>{step.description}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div style={{ marginLeft: '300px', flex: 1, padding: '4rem', background: 'var(--color-bg)' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                        {STEPS[currentStep].title.toUpperCase()}
                    </h1>
                    <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginBottom: '3rem' }}>
                        STEP {currentStep + 1} OF {STEPS.length}
                    </p>

                    {currentStep === 0 && (
                        <BasicInfoStep
                            data={formData.user || {}}
                            updateData={updateUserData}
                            onNext={handleNext}
                        />
                    )}

                    {currentStep === 1 && (
                        <ProfessionalDetailsStep
                            experiences={formData.experiences || []}
                            education={formData.education || []}
                            updateExperiences={updateExperiences}
                            updateEducation={updateEducation}
                            onBack={handleBack}
                            onNext={handleNext}
                        />
                    )}

                    {currentStep === 2 && (
                        <SkillsAndCertificationsStep
                            skills={formData.skills || []}
                            certifications={formData.certifications || []}
                            updateSkills={updateSkills}
                            updateCertifications={updateCertifications}
                            onBack={handleBack}
                            onNext={handleNext}
                        />
                    )}

                    {currentStep === 3 && (
                        <AdditionalInfoStep
                            data={formData.profile || {}}
                            updateData={updateProfileData}
                            onBack={handleBack}
                            onSubmit={handleSubmit}
                            isSubmitting={isSubmitting}
                        />
                    )}
                </div>
            </div>

            <style>{`
                @media (max-width: 900px) {
                    .progress-sidebar {
                        display: none !important;
                    }
                    div[style*="marginLeft: 300px"] {
                        margin-left: 0 !important;
                        padding: 2rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default CompleteProfile;
