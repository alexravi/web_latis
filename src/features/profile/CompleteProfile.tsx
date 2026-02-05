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
        <div style={{ position: 'relative', width: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <SEO title="Complete Profile" description="Finalize your provider profile" />
            <div style={{ position: 'absolute', inset: 0, zIndex: -1 }}>
                <GridBackground />
            </div>

            {/* Mobile Header / Stepper */}
            <div className="mobile-stepper" style={{
                padding: '16px',
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid var(--color-grid)',
                position: 'sticky',
                top: 0,
                zIndex: 50,
                display: 'none' // Default hidden, shown via media query
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 700 }}>STEP {currentStep + 1}/{STEPS.length}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{STEPS[currentStep].title}</div>
                </div>
                <div style={{ height: '4px', background: 'var(--color-grid)', marginTop: '8px', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                        height: '100%',
                        width: `${((currentStep + 1) / STEPS.length) * 100}%`,
                        background: 'var(--color-accent)',
                        transition: 'width 0.3s ease'
                    }} />
                </div>
            </div>

            <div style={{ display: 'flex', flex: 1 }}>
                {/* Sidebar / Progress (Desktop) */}
                <div className="desktop-sidebar" style={{
                    width: '320px',
                    background: 'rgba(255,255,255,0.6)',
                    backdropFilter: 'blur(12px)',
                    borderRight: '1px solid var(--color-grid)',
                    padding: '3rem 2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'sticky',
                    top: 0,
                    height: '100vh',
                    zIndex: 10
                }}>
                    <div style={{ marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                            LATIS<span style={{ color: 'var(--color-accent)' }}>/</span>MD
                        </h2>
                        <div style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.75rem',
                            color: 'var(--color-text-muted)',
                            letterSpacing: '0.05em'
                        }}>
                            PROVIDER ONBOARDING
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                        {STEPS.map((step, idx) => {
                            const isActive = currentStep === idx;
                            const isCompleted = idx < currentStep;

                            return (
                                <div key={idx} style={{ position: 'relative', paddingBottom: idx === STEPS.length - 1 ? 0 : '2rem' }}>
                                    {/* Connectivity Line */}
                                    {idx !== STEPS.length - 1 && (
                                        <div style={{
                                            position: 'absolute',
                                            left: '15px',
                                            top: '30px',
                                            bottom: '-6px',
                                            width: '2px',
                                            background: isCompleted ? 'var(--color-accent)' : 'var(--color-grid)',
                                            transition: 'background 0.3s'
                                        }} />
                                    )}

                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                        {/* Circle Indicator */}
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            border: isActive || isCompleted ? 'unset' : '1px solid var(--color-grid)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.85rem',
                                            fontWeight: 600,
                                            background: isActive ? 'var(--color-accent)' : isCompleted ? 'var(--color-accent)' : 'white',
                                            color: isActive || isCompleted ? 'white' : 'var(--color-text-muted)',
                                            zIndex: 2,
                                            boxShadow: isActive ? '0 4px 12px rgba(var(--color-accent-rgb), 0.3)' : 'none',
                                            transition: 'all 0.3s'
                                        }}>
                                            {isCompleted ? '✓' : idx + 1}
                                        </div>

                                        <div style={{ paddingTop: '4px', opacity: isActive ? 1 : 0.6, transition: 'opacity 0.3s' }}>
                                            <div style={{
                                                fontWeight: isActive ? 700 : 500,
                                                fontSize: '1rem',
                                                color: isActive ? 'var(--color-fg)' : 'var(--color-text-main)'
                                            }}>
                                                {step.title}
                                            </div>
                                            <div style={{
                                                fontSize: '0.8rem',
                                                color: 'var(--color-text-muted)',
                                                marginTop: '2px'
                                            }}>
                                                {step.description}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content */}
                <div className="main-content" style={{ flex: 1, padding: '3rem', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto' }}>

                        {/* Glass Card Container */}
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.7)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.5)',
                            borderRadius: '24px',
                            padding: '3rem',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.05)'
                        }}>
                            <div style={{ marginBottom: '2.5rem' }}>
                                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>
                                    {STEPS[currentStep].title}
                                </h1>
                                <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                                    Please provide your {STEPS[currentStep].title.toLowerCase()} details to complete your professional profile.
                                </p>
                            </div>

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

                    <div style={{ marginTop: 'auto', paddingTop: '2rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                        &copy; {new Date().getFullYear()} Latis Medical Systems. All rights reserved.
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 900px) {
                    .desktop-sidebar {
                        display: none !important;
                    }
                    .mobile-stepper {
                        display: block !important;
                    }
                    .main-content {
                        padding: 1.5rem !important;
                    }
                    div[style*="padding: 3rem"] {
                         padding: 1.5rem !important;
                    }
                    h1 {
                        font-size: 1.5rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default CompleteProfile;
