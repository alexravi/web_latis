import api from './api';

// --- Types ---

export interface UserProfile {
    first_name?: string;
    last_name?: string;
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any; // Allow flexibility
    relationship?: import('../types/relationship').RelationshipStatus;
    username?: string;
    counts?: {
        connections: number;
        followers: number;
        following: number;
    };
}

export interface ExtendedProfile {
    bio?: string;
    languages?: string[];
    interests?: string[];
    causes?: string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    volunteer_experiences?: any; // strict typing can be added later if needed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export interface Experience {
    title: string;
    position_type: string; // Required
    institution_name: string;
    organization_id?: number;
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export interface Education {
    degree_type: string;
    institution_name: string;
    organization_id?: number;
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export interface Publication {
    publication_type: string;
    title: string;
    authors: string[];
    author_order?: number;
    journal_name?: string;
    publisher?: string;
    publication_date?: string;
    doi?: string;
    url?: string;
    abstract?: string;
    keywords?: string[];
    impact_factor?: number;
    citation_count?: number;
    is_peer_reviewed?: boolean;
    volume?: string;
    issue?: string;
    pages?: string;
    description?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export interface Project {
    title: string;
    project_type: string;
    organization_id?: number;
    description?: string;
    start_date?: string;
    end_date?: string;
    is_current?: boolean;
    role?: string;
    responsibilities?: string;
    outcomes?: string;
    technologies_used?: string[];
    collaborators?: string[];
    funding_source?: string;
    grant_number?: string;
    url?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export interface Award {
    title: string;
    award_type: string;
    organization_id?: number;
    issuing_organization?: string;
    description?: string;
    date_received?: string;
    year?: number;
    monetary_value?: number;
    currency?: string;
    url?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    const data = response.data;

    // Check if response matches the "API 3" structure (nested professional object)
    if (data.data && data.data.professional) {
        // Flatten it for frontend components which expect keys at root
        const { user, profile, professional } = data.data;
        return {
            user,
            profile,
            ...professional
        };
    }

    // Fallback/Legacy structure
    return data;
};



export const checkUsernameAvailability = async (username: string) => {
    try {
        const response = await api.get(`/users/username/${username}/available`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getUserProfileById = async (id: string | number) => {
    const response = await api.get(`/users/${id}`);
    const data = response.data;

    // API 2: Response structure { success: true, user: { ... } }
    // We return similar structure but likely without professional details arrays
    if (data.user) {
        return {
            user: data.user,
            profile: data.user.profile || {},
            // Default arrays to empty for safety in ProfileView
            experiences: [],
            education: [],
            skills: [],
            certifications: [],
            publications: [],
            projects: [],
            awards: []
        };
    }
    return data;
};

export const getUserProfileByUsername = async (username: string) => {
    // Attempt to fetch by username
    // Assuming backend endpoint: /users/username/:username
    const response = await api.get(`/users/username/${username}`);
    const data = response.data;

    // Normalize structure if needed, similar to getById
    if (data.user) {
        return {
            user: data.user,
            profile: data.user.profile || {},
            experiences: [],
            education: [],
            skills: [],
            certifications: [],
            publications: [],
            projects: [],
            awards: []
        };
    }
    return data;
};
// --- Granular APIs ---

// Basic Info
export const updateBasicInfo = async (data: Partial<UserProfile> & Partial<ExtendedProfile>) => {
    // We split this into two calls if needed, or assume backend handles 'me' update for user fields
    // and 'me/profile' for profile fields. For now, let's assume 'me/profile' can handle extended fields
    // and 'me' handles basic user fields.

    // 1. Update User fields (Headline, Location, etc.)
    if (data.headline || data.location || data.current_role || data.specialization || data.username) {
        await api.put('/users/me', data);
    }

    // 2. Update Profile fields (Bio, etc.)
    if (data.bio || data.summary || data.languages || data.interests) {
        await api.put('/users/me/profile', data);
    }

    return true;
};

// Experience
export const addExperience = async (data: Experience) => {
    const response = await api.post('/users/me/experiences', data);
    return response.data;
};

export const updateExperience = async (id: number | string, data: Experience) => {
    const response = await api.put(`/users/me/experiences/${id}`, data);
    return response.data;
};

export const deleteExperience = async (id: number | string) => {
    const response = await api.delete(`/users/me/experiences/${id}`);
    return response.data;
};

// Education
export const addEducation = async (data: Education) => {
    const response = await api.post('/users/me/education', data);
    return response.data;
};

export const updateEducation = async (id: number | string, data: Education) => {
    const response = await api.put(`/users/me/education/${id}`, data);
    return response.data;
};

export const deleteEducation = async (id: number | string) => {
    const response = await api.delete(`/users/me/education/${id}`);
    return response.data;
};

// Skills
export const addSkill = async (data: Skill) => {
    const response = await api.post('/users/me/skills', data);
    return response.data;
};

export const deleteSkill = async (id: number | string) => {
    const response = await api.delete(`/users/me/skills/${id}`);
    return response.data;
};

// Certifications
export const addCertification = async (data: Certification) => {
    const response = await api.post('/users/me/certifications', data);
    return response.data;
};

export const updateCertification = async (id: number | string, data: Certification) => {
    const response = await api.put(`/users/me/certifications/${id}`, data);
    return response.data;
};

export const deleteCertification = async (id: number | string) => {
    const response = await api.delete(`/users/me/certifications/${id}`);
    return response.data;
};
