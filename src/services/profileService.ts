import api from './api';

// --- Types ---

export interface UserProfile {
    headline?: string;
    summary?: string;
    location?: string;
    phone?: string;
    website?: string;
    current_role?: string;
    specialization?: string;
    subspecialization?: string;
    years_of_experience?: number;
    medical_school_graduation_year?: number;
    residency_completion_year?: number;
    fellowship_completion_year?: number;
    [key: string]: any; // Allow flexibility
}

export interface ExtendedProfile {
    bio?: string;
    languages?: string[];
    interests?: string[];
    causes?: string[];
    volunteer_experiences?: any; // strict typing can be added later if needed
    [key: string]: any;
}

export interface Experience {
    title: string;
    position_type: string;
    institution_name: string;
    department?: string;
    specialty?: string;
    subspecialty?: string;
    institution_type?: string;
    location?: string;
    start_date: string; // YYYY-MM-DD
    end_date?: string | null;
    is_current?: boolean;
    description?: string;
    patient_care_responsibilities?: string;
    research_focus_areas?: string[];
    [key: string]: any;
}

export interface Education {
    degree_type: string;
    institution_name: string;
    field_of_study?: string;
    institution_type?: string;
    location?: string;
    program_name?: string;
    specialty?: string;
    subspecialty?: string;
    start_date?: string;
    end_date?: string;
    graduation_date?: string;
    gpa?: number;
    honors?: string[];
    recognition?: string;
    description?: string;
    is_current?: boolean;
    [key: string]: any;
}

// Skill can be string, number (ID), or object
export type Skill = string | number | { id?: number; name?: string; category?: string; proficiency_level?: string; years_of_experience?: number };

export interface Certification {
    certification_type: string;
    name: string;
    issuing_organization: string;
    certification_board?: string;
    license_number?: string;
    credential_id?: string;
    issue_date?: string;
    expiration_date?: string;
    status?: string;
    verification_url?: string;
    description?: string;
    [key: string]: any;
}

export interface Publication {
    publication_type: string;
    title: string;
    authors: string[];
    journal_name?: string;
    publication_date?: string;
    url?: string;
    description?: string;
    [key: string]: any;
}

export interface Project {
    title: string;
    project_type: string;
    description?: string;
    start_date?: string;
    end_date?: string;
    is_current?: boolean;
    role?: string;
    url?: string;
    [key: string]: any;
}

export interface Award {
    title: string;
    award_type: string;
    issuing_organization?: string;
    description?: string;
    date_received?: string;
    year?: number;
    url?: string;
    [key: string]: any;
}

export interface CompleteProfileData {
    user?: UserProfile;
    profile?: ExtendedProfile;
    experiences?: Experience[];
    education?: Education[];
    skills?: Skill[];
    certifications?: Certification[];
    publications?: Publication[];
    projects?: Project[];
    awards?: Award[];
}

// --- Service ---

export const completeProfile = async (data: CompleteProfileData) => {
    const response = await api.post('/users/me/profile/complete', data);
    return response.data;
};

export const updateProfile = async (data: CompleteProfileData) => {
    const response = await api.put('/users/me/profile/complete', data);
    return response.data;
};

export const getProfile = async () => {
    const response = await api.get('/users/me/profile/complete');
    return response.data;
};
