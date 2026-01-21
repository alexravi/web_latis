import React, { useEffect, useState } from 'react';
import type { Conversation } from '../../types/message';
import { getConversations, markConversationRead } from '../../services/messageService';
import { useSocket } from '../../context/SocketContext';


interface ConversationListProps {
    onSelect: (id: number) => void;
    selectedId: number | null;
}

const ConversationList: React.FC<ConversationListProps> = ({ onSelect, selectedId }) => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const { socket } = useSocket();
    // const navigate = useNavigate(); // Unused for now

    const fetchConversations = async () => {
        try {
            const res = await getConversations();
            setConversations(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to load conversations', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (_data: any) => {
            // Ideally re-fetch or optimistically update list
            fetchConversations();
        };

        socket.on('message:new', handleNewMessage);

        return () => {
            socket.off('message:new', handleNewMessage);
        };
    }, [socket]);

    const handleConversationClick = async (conv: Conversation) => {
        onSelect(conv.id);
        if (conv.unread_count > 0) {
            // Optimistically update unread count
            setConversations(prev => prev.map(c =>
                c.id === conv.id ? { ...c, unread_count: 0 } : c
            ));
            await markConversationRead(conv.id);
        }
    };

    if (loading) {
        return <div className="p-4 text-center text-gray-500">Loading conversations...</div>;
    }

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Messages</h2>
            </div>
            <div className="overflow-y-auto flex-1">
                {conversations.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        No conversations yet.
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-50 dark:divide-gray-700">
                        {conversations.map(conv => (
                            <li
                                key={conv.id}
                                onClick={() => handleConversationClick(conv)}
                                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors duration-200 ${selectedId === conv.id ? 'bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500' : 'border-l-4 border-transparent'}`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="relative flex-shrink-0">
                                        <img
                                            src={conv.other_user?.profile_image_url || conv.other_user_profile_image || `https://ui-avatars.com/api/?name=${conv.other_user_first_name}+${conv.other_user_last_name}&background=random`}
                                            alt="User Avatar"
                                            className="w-12 h-12 rounded-full object-cover shadow-sm"
                                        />
                                        {conv.other_user?.is_online && (
                                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                                {conv.other_user_first_name} {conv.other_user_last_name}
                                            </h3>
                                            {conv.last_message_at && (
                                                <span className="text-xs text-gray-400 dark:text-gray-500">
                                                    {new Date(conv.last_message_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className={`text-sm truncate ${conv.unread_count > 0 ? 'font-semibold text-gray-800 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>
                                                {conv.last_message_sender_id === conv.other_user_id ? '' : 'You: '}{conv.last_message_content || 'Sent an attachment'}
                                            </p>
                                            {conv.unread_count > 0 && (
                                                <span className="ml-2 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full inline-block min-w-[1.25rem] text-center shadow-sm">
                                                    {conv.unread_count}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ConversationList;
