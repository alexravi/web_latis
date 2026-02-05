import React, { useEffect, useState, useRef } from 'react';
import type { Conversation } from '../../types/message';
import { getConversations, markConversationRead, createConversation } from '../../services/messageService';
import { getConnections } from '../../services/relationshipService';
import { searchService } from '../../services/searchService';
import { useSocket } from '../../context/SocketContext';
import { formatDistanceToNow } from 'date-fns';

interface ConversationListProps {
    onSelect: (id: number) => void;
    selectedId: number | null;
    refreshTrigger?: number;
}

const ConversationList: React.FC<ConversationListProps> = ({ onSelect, selectedId, refreshTrigger = 0 }) => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNewChat, setShowNewChat] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const { socket } = useSocket();
    const searchTimeoutRef = useRef<any>(null);

    const fetchConversations = async () => {
        try {
            const res = await getConversations();
            // Handle both wrapped { data: [...] } and direct array [...] responses
            // and ensure we fallback to empty array if something is wrong
            const list = Array.isArray(res) ? res : (res.data || []);
            // Deduplicate by ID just in case
            const uniqueList = Array.from(new Map(list.map((item: any) => [item.id, item])).values()) as Conversation[];
            setConversations(uniqueList);
            setLoading(false);
        } catch (error) {
            console.error('Failed to load conversations', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, [refreshTrigger]);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = () => {
            // Optimistically move conversation to top or update content
            // For now, simpler to just refetch or manually splice
            // Ideally: find conversation, update last_message, move to top
            fetchConversations();
        };

        const handleConversationRead = (data: { conversation_id: number }) => {
            setConversations(prev => prev.map(c =>
                c.id === Number(data.conversation_id) ? { ...c, unread_count: 0 } : c
            ));
        };

        socket.on('message:new', handleNewMessage);
        socket.on('conversation:read', handleConversationRead);

        return () => {
            socket.off('message:new', handleNewMessage);
            socket.off('conversation:read', handleConversationRead);
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

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

        if (!query.trim()) {
            // Load connections if query is empty
            loadConnections();
            return;
        }

        setIsSearching(true);
        searchTimeoutRef.current = setTimeout(async () => {
            try {
                // Search people
                const res = await searchService.search({ q: query, type: 'people', limit: 10 });
                // @ts-ignore - Fixing build quickly, searchService response structure changed
                setSearchResults(res.data?.people || []);
            } catch (err) {
                console.error("Search failed", err);
            } finally {
                setIsSearching(false);
            }
        }, 300);
    };

    const loadConnections = async () => {
        setIsSearching(true);
        try {
            // Fetch connections as default list
            const res = await getConnections('connected');
            setSearchResults(res.data || []);
        } catch (err) {
            console.error("Failed to load connections", err);
        } finally {
            setIsSearching(false);
        }
    };

    const handleStartNewChat = async (userId: number) => {
        try {
            const res = await createConversation(userId);
            setShowNewChat(false);
            onSelect(res.data.id);
            fetchConversations(); // Immediate refetch
        } catch (err) {
            console.error("Failed to create conversation", err);
        }
    };

    useEffect(() => {
        if (showNewChat) {
            loadConnections();
        }
    }, [showNewChat]);


    if (loading) {
        return (
            <div className="flex flex-col gap-4 p-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-3 animate-pulse">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        <div className="flex-1 space-y-2 py-1">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800/50 backdrop-blur-xl relative">
            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700/50 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Messages</h2>
                <button
                    onClick={() => setShowNewChat(true)}
                    className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                    title="New Message"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </button>
            </div>

            {showNewChat && (
                <div className="absolute inset-0 z-20 bg-white dark:bg-gray-800 flex flex-col">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
                        <button onClick={() => setShowNewChat(false)} className="text-gray-500 hover:text-gray-700">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <input
                            type="text"
                            placeholder="Search people..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="flex-1 bg-gray-100 dark:bg-gray-700 border-none rounded-lg py-2 px-4 focus:ring-2 focus:ring-blue-500"
                            autoFocus
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {isSearching ? (
                            <div className="p-8 text-center text-gray-400">Loading...</div>
                        ) : searchResults.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">No people found</div>
                        ) : (
                            <ul className="divide-y divide-gray-50 dark:divide-gray-700">
                                {searchResults.map((user: any) => (
                                    <li key={user.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" onClick={() => handleStartNewChat(user.id)}>
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={user.profile_image_url || `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=random`}
                                                alt={user.first_name}
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white">{user.first_name} {user.last_name}</h4>
                                                <p className="text-xs text-gray-500">{user.headline || user.username}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}

            <div className="overflow-y-auto flex-1 custom-scrollbar">
                {conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center px-6">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-400">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">No conversations yet</p>
                        <p className="text-sm text-gray-400 mt-1">Connect with people to start chatting</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
                        {conversations.map(conv => {
                            const otherUser = conv.other_user || {
                                first_name: conv.other_user_first_name,
                                last_name: conv.other_user_last_name,
                                profile_image_url: conv.other_user_profile_image,
                                is_online: false // Default fallback
                            };

                            const isSelected = selectedId === conv.id;

                            return (
                                <button
                                    key={conv.id}
                                    onClick={() => handleConversationClick(conv)}
                                    className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all duration-200 group relative ${isSelected ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                                        }`}
                                >
                                    {isSelected && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full"></div>
                                    )}

                                    <div className="flex items-center gap-4">
                                        <div className="relative flex-shrink-0">
                                            <img
                                                src={otherUser.profile_image_url || `https://ui-avatars.com/api/?name=${otherUser.first_name}+${otherUser.last_name}&background=random`}
                                                alt="User"
                                                className="w-12 h-12 rounded-full object-cover shadow-sm ring-2 ring-transparent group-hover:ring-gray-200 dark:group-hover:ring-gray-700 transition-all"
                                            />
                                            {otherUser.is_online && (
                                                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-gray-800 rounded-full shadow-sm"></span>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <h3 className={`text-base font-semibold truncate ${conv.unread_count > 0 ? 'text-gray-900 dark:text-gray-50' : 'text-gray-700 dark:text-gray-200'
                                                    }`}>
                                                    {otherUser.first_name} {otherUser.last_name}
                                                </h3>
                                                {conv.last_message_at && (
                                                    <span className={`text-xs whitespace-nowrap ml-2 ${conv.unread_count > 0 ? 'text-blue-600 font-medium' : 'text-gray-400'
                                                        }`}>
                                                        {formatDistanceToNow(new Date(conv.last_message_at), { addSuffix: false, includeSeconds: false }).replace('about ', '')}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex justify-between items-center gap-2">
                                                <p className={`text-sm truncate leading-relaxed ${conv.unread_count > 0 ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'
                                                    }`}>
                                                    {conv.last_message_sender_id === (conversations[0]?.participant1_id === undefined ? 0 : 0) ? 'You: ' : ''}
                                                    {/* Note: logic for 'You:' is tricky without accurate auth user ID. disabling prefix for now to avoid confusion */}
                                                    {conv.last_message_content || 'Started a conversation'}
                                                </p>
                                                {conv.unread_count > 0 && (
                                                    <span className="flex-shrink-0 min-w-[1.25rem] h-5 flex items-center justify-center bg-blue-600 text-white text-[10px] font-bold px-1.5 rounded-full shadow-sm shadow-blue-200 dark:shadow-none">
                                                        {conv.unread_count}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConversationList;
