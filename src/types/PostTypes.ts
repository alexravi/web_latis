export interface User {
    id: string;
    name: string;
    avatar?: string;
    role?: string; // e.g., "Cardiothoracic Surgeon"
}

export interface Comment {
    id: string;
    author: User;
    content: string;
    timestamp: string; // ISO string
    likes: number;
    replies: Comment[];
}

export interface Post {
    id: string;
    author: User;
    content: string;
    timestamp: string;
    tags: string[];
    userVote?: 'up' | 'down';
    likes: number;
    commentsCount: number;
    comments: Comment[]; // Top-level comments
}
