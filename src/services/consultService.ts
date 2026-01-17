import type { Consult, Message } from '../types/ConsultTypes';

// Mock Data
const mockConsults: Consult[] = [
    {
        id: 'c-101',
        participants: [
            { id: 'u-2', name: 'Dr. Sarah Chen', role: 'Neurologist', avatar: 'S' }
        ],
        subject: 'Research Collaboration: AI in Neurology',
        urgency: 'URGENT',
        status: 'ACTIVE',
        lastMessage: {
            id: 'm-2',
            senderId: 'u-2',
            content: 'I reviewed your draft. The methodology section looks solid, but I have comments on the data source.',
            timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
            isRead: false
        },
        messages: [
            {
                id: 'm-1',
                senderId: 'me',
                content: 'Hi Sarah, seeing if you had time to look at the paper draft?',
                timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
                isRead: true
            },
            {
                id: 'm-2',
                senderId: 'u-2',
                content: 'I reviewed your draft. The methodology section looks solid, but I have comments on the data source.',
                timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
                isRead: false
            }
        ]
    },
    {
        id: 'c-102',
        participants: [
            { id: 'u-3', name: 'Dr. Michael Chang', role: 'Pediatrician', avatar: 'M' }
        ],
        subject: 'Keynote Invitation: PediatriCon 2026',
        urgency: 'ROUTINE',
        status: 'ACTIVE',
        lastMessage: {
            id: 'm-10',
            senderId: 'me',
            content: 'Thank you for the invite. I would be honored to speak.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
            isRead: true
        },
        messages: []
    },
    {
        id: 'c-103',
        participants: [
            { id: 'u-4', name: 'Dr. James Wilson', role: 'Cardiologist', avatar: 'J' }
        ],
        subject: 'Introduction: Dr. Emily Ross',
        urgency: 'ROUTINE',
        status: 'FLAGGED',
        lastMessage: {
            id: 'm-22',
            senderId: 'u-4',
            content: 'Wanted to introduce you to Dr. Ross, she is leading the new study at Hopkins.',
            timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
            isRead: false
        },
        messages: []
    }
];

export const getConsults = async (): Promise<Consult[]> => {
    // Simulate API delay
    return new Promise((resolve) => {
        setTimeout(() => resolve(mockConsults), 500);
    });
};

export const getConsultById = async (id: string): Promise<Consult | undefined> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(mockConsults.find(c => c.id === id)), 300);
    });
};

export const sendMessage = async (_consultId: string, content: string): Promise<Message> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newMessage: Message = {
                id: `m-${Date.now()}`,
                senderId: 'me',
                content,
                timestamp: new Date().toISOString(),
                isRead: true
            };
            // In a real app, we'd append to the consult in the backend
            resolve(newMessage);
        }, 300);
    });
};
