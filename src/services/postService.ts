import type { Post, Comment, User } from '../types/PostTypes';

// Mock Data
const MOCK_USER: User = {
    id: 'u1',
    name: 'Dr. Alex Ravi',
    role: 'Chief Resident',
    avatar: undefined
};

const MOCK_COMMENTS: Comment[] = [
    {
        id: 'c1',
        author: { id: 'u2', name: 'Dr. Sarah Chen', role: 'Neurologist' },
        content: 'This is a really interesting case. Have you considered differential diagnosis X?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        likes: 12,
        replies: [
            {
                id: 'c1-r1',
                author: { id: 'u1', name: 'Dr. James Wilson', role: 'Cardiologist' },
                content: 'Yes, we ruled that out due to the lack of symptom Y. Good thought though!',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
                likes: 5,
                replies: []
            }
        ]
    },
    {
        id: 'c2',
        author: { id: 'u3', name: 'Dr. Emily Blunt', role: 'General Surgeon' },
        content: 'I have seen similar presentation in post-op patients.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        likes: 8,
        replies: []
    }
];

const MOCK_POSTS: Post[] = [
    {
        id: 'p1',
        author: { id: 'u10', name: 'Dr. James Wilson', role: 'Cardiothoracic Surgeon' },
        content: "Interesting presentation in the OR today. Mitral valve repair with unexpected calcification. Opted for a commisurotomy. Anyone seen similar patterns in post-COVID cohorts?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        tags: ["#Cardiology", "#Surgery", "#CaseStudy"],
        likes: 42,
        commentsCount: 8,
        comments: MOCK_COMMENTS
    },
    {
        id: 'p2',
        author: { id: 'u11', name: 'Elena Rodriguez, PhD', role: 'Clinical Researcher' },
        content: "Just published our findings on non-invasive biomarkers for early-stage glioblastoma. Link to full paper below. Would love thoughts from the neurosurgery community on clinical applicability.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        tags: ["#Oncology", "#Research", "#Biomarkers"],
        likes: 128,
        commentsCount: 24,
        comments: []
    }
];

export const getPosts = async (): Promise<Post[]> => {
    // Simulate API delay
    return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_POSTS), 500);
    });
};

export const getPostById = async (id: string): Promise<Post | undefined> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_POSTS.find(p => p.id === id)), 300);
    });
};

export const addComment = async (_postId: string, content: string, _parentCommentId?: string): Promise<Comment> => {
    // In a real app, this would POST to backend.
    // Here we just return a new mock object.
    const newComment: Comment = {
        id: `c-${Date.now()}`,
        author: MOCK_USER, // Acting as current user
        content,
        timestamp: new Date().toISOString(),
        likes: 0,
        replies: []
    };
    return new Promise((resolve) => {
        setTimeout(() => resolve(newComment), 300);
    });
};
