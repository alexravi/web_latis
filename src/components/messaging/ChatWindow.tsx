import React, { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react';
import type { Message, Conversation } from '../../types/message';
import { getMessages, getConversationDetails, sendMessage, markConversationRead } from '../../services/messageService';
import { useSocket } from '../../context/SocketContext';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import MessageSkeleton from '../skeletons/MessageSkeleton';
import { formatDistanceToNow } from 'date-fns';

interface ChatWindowProps {
    conversationId: number;
    onBack: () => void;
    onMessageSent?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId, onBack, onMessageSent }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);
    const MESSAGES_PER_PAGE = 20;

    const [typingUsers, setTypingUsers] = useState<number[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const prevScrollHeightRef = useRef<number>(0);
    const { socket } = useSocket();

    // Typing timeout ref
    const typingTimeoutRef = useRef<any>(null);

    const loadData = useCallback(async (isInitial = true) => {
        if (isInitial) {
            setLoading(true);
            setOffset(0);
        } else {
            setLoadingMore(true);
        }

        try {
            const currentOffset = isInitial ? 0 : offset;

            const promises: Promise<any>[] = [
                getMessages(conversationId, MESSAGES_PER_PAGE, currentOffset)
            ];

            // Only fetch details on initial load
            if (isInitial) {
                promises.push(getConversationDetails(conversationId));
            }

            const [msgsRes, convRes] = await Promise.all(promises);

            // Backend returns DESC (newest first). 
            // For correct chronological display, we reverse them.
            // When paginating (getting older messages), they also come DESC (50...30).
            // We reverse them to be (30...50) and prepend to current list.
            const newMessages = [...msgsRes.data].reverse();

            if (msgsRes.data.length < MESSAGES_PER_PAGE) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }

            if (isInitial) {
                setMessages(newMessages);
                if (convRes) {
                    setConversation(convRes.data);
                    if (convRes.data.unread_count > 0) {
                        markConversationRead(conversationId);
                    }
                }
                setTimeout(() => scrollToBottom(), 100);
            } else {
                // Capture scroll height before update to maintain position
                if (messagesContainerRef.current) {
                    prevScrollHeightRef.current = messagesContainerRef.current.scrollHeight;
                }
                setMessages(prev => [...newMessages, ...prev]);
                setOffset(prev => prev + MESSAGES_PER_PAGE);
            }

        } catch (err) {
            console.error("Failed to load chat", err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [conversationId, offset]);

    // Independent scroll handler for pagination
    const handleScroll = () => {
        if (!messagesContainerRef.current) return;
        const { scrollTop } = messagesContainerRef.current;

        if (scrollTop === 0 && hasMore && !loading && !loadingMore) {
            loadData(false);
        }
    };

    // Maintain scroll position after loading older messages
    useLayoutEffect(() => {
        if (loadingMore || !messagesContainerRef.current || prevScrollHeightRef.current === 0) return;

        // The DOM has been updated with new messages at the top.
        // We need to jump down by the difference in height.
        const newScrollHeight = messagesContainerRef.current.scrollHeight;
        const scrollDiff = newScrollHeight - prevScrollHeightRef.current;

        messagesContainerRef.current.scrollTop = scrollDiff;
        prevScrollHeightRef.current = 0; // Reset

    }, [messages]);

    useEffect(() => {
        loadData(true);
    }, [conversationId]);

    useEffect(() => {
        if (!socket) return;

        // Join room
        socket.emit('conversation:join', conversationId);

        const handleNewMessage = (data: any) => {
            // Ensure data belongs to this conversation
            // Data might be wrapped or direct depending on backend event structure
            const msg: Message = data.message || data;
            if (msg.conversation_id === Number(conversationId)) {
                setMessages(prev => {
                    if (prev.some(m => m.id === msg.id)) return prev;
                    return [...prev, msg];
                });

                // If incoming message, mark read
                // Assuming we can check if it's not ours (we need current user ID, but for now logic is inferred)
                // Ideally backend handles 'read' status automatically when joined, but we call API to be sure
                markConversationRead(conversationId);
            }
        };

        const handleTypingStatus = (data: { conversation_id: number, user_id: number, typing: boolean }) => {
            if (Number(data.conversation_id) !== Number(conversationId)) return;

            setTypingUsers(prev => {
                if (data.typing) {
                    return prev.includes(data.user_id) ? prev : [...prev, data.user_id];
                } else {
                    return prev.filter(id => id !== data.user_id);
                }
            });
        };

        const handleMessageDelivered = (data: { message_id: number }) => {
            setMessages(prev => prev.map(m =>
                m.id === data.message_id ? { ...m, delivery_status: 'delivered' } : m
            ));
        };

        const handleConversationRead = (data: { conversation_id: number }) => {
            if (Number(data.conversation_id) === Number(conversationId)) {
                setMessages(prev => prev.map(m => ({ ...m, delivery_status: 'read' as const })));
            }
        };

        socket.on('message:new', handleNewMessage);
        socket.on('typing:status', handleTypingStatus);
        socket.on('message:delivered', handleMessageDelivered);
        socket.on('conversation:read', handleConversationRead);

        return () => {
            socket.emit('conversation:leave', conversationId);
            socket.off('message:new', handleNewMessage);
            socket.off('typing:status', handleTypingStatus);
            socket.off('message:delivered', handleMessageDelivered);
            socket.off('conversation:read', handleConversationRead);
        };
    }, [socket, conversationId]);

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Scroll to bottom on new message sent/received (only if already near bottom or it's my message)
    useEffect(() => {
        // Simple heuristic: if it's a new message (length changed) and not loading history
        // Note: checking loadingMore prevents scrolling to bottom when loading history
        if (!loadingMore && messages.length > 0) {
            const lastMsg = messages[messages.length - 1];
            // If I sent it, always scroll
            if (lastMsg.sender_id !== conversation?.other_participant?.id && lastMsg.sender_id !== conversation?.other_user?.id) {
                scrollToBottom();
            }
        }
    }, [messages.length, loadingMore]);


    const handleSendMessage = async (content: string) => {
        const tempId = Date.now();
        // Optimistic update
        const tempMsg: Message = {
            id: tempId,
            conversation_id: conversationId,
            sender_id: 0, // Placeholder
            content,
            delivery_status: 'sent',
            created_at: new Date().toISOString()
        };

        setMessages(prev => [...prev, tempMsg]);

        try {
            const res = await sendMessage(conversationId, { content });
            // Update temp message with real data
            setMessages(prev => prev.map(m => m.id === tempId ? res.data : m));
            if (onMessageSent) onMessageSent();
        } catch (err) {
            console.error("Failed to send", err);
            // Optionally show error state
        }
    };

    const handleInput = () => {
        if (!socket) return;

        // Emit start typing
        socket.emit('message:typing:start', { conversation_id: conversationId });

        // Debounce stop typing
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('message:typing:stop', { conversation_id: conversationId });
        }, 3000);
    };

    if (loading && messages.length === 0) {
        return (
            <div className="flex flex-col h-full bg-[#f8f9fa] dark:bg-[#0B1120]">
                {/* Header Skeleton */}
                <div className="px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 z-10 h-[65px]">
                    <div className="flex items-center gap-4 animate-pulse">
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                        <div className="space-y-2">
                            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 p-6">
                    <MessageSkeleton />
                </div>
            </div>
        );
    }

    const otherUser = conversation?.other_participant || conversation?.other_user;
    const isOnline = otherUser?.is_online;

    // Typing indicator text
    const showTyping = typingUsers.length > 0 && typingUsers.some(id => id === otherUser?.id);

    return (
        <div className="flex flex-col h-full bg-[#f8f9fa] dark:bg-[#0B1120]">
            {/* Header */}
            <div className="px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>

                    <div className="relative">
                        <img
                            src={otherUser?.profile_image_url || `https://ui-avatars.com/api/?name=${otherUser?.first_name}+${otherUser?.last_name}&background=random`}
                            className="w-10 h-10 rounded-full object-cover shadow-sm border border-gray-100 dark:border-gray-700"
                            alt="Profile"
                        />
                        {isOnline && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-gray-800 rounded-full shadow-sm"></span>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight">
                            {otherUser?.first_name} {otherUser?.last_name}
                        </h3>
                        <div className="flex items-center gap-1.5 h-4">
                            {showTyping ? (
                                <span className="text-xs font-medium text-blue-600 dark:text-blue-400 animate-pulse">typing...</span>
                            ) : (
                                <span className={`text-xs ${isOnline ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                    {isOnline ? 'Active now' : `Last seen ${otherUser?.last_seen_at ? formatDistanceToNow(new Date(otherUser.last_seen_at), { addSuffix: true }) : 'recently'}`}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions (Video/Call placeholders) */}
                <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700/50 rounded-full transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700/50 rounded-full transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700/50 rounded-full transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth bg-gray-50 dark:bg-gray-900/50"
            >
                <div className="max-w-3xl mx-auto space-y-6">
                    {/* Loading more indicator */}
                    {loadingMore && (
                        <div className="flex justify-center py-2">
                            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    {/* Conversation Start Date/Info could go here */}

                    {messages.map((msg, idx) => {
                        // Logic to check ownership
                        // Assuming the other user is participant1 or 2, and we are the OTHER one.
                        // msg.sender_id === otherUser.id => It's THEM.
                        // msg.sender_id !== otherUser.id => It's ME.
                        const isOwn = msg.sender_id !== otherUser?.id;

                        // Grouping logic (optional, for spacing)
                        const showAvatar = !isOwn && (idx === messages.length - 1 || messages[idx + 1]?.sender_id !== msg.sender_id);

                        return (
                            <MessageBubble
                                key={msg.id}
                                message={msg}
                                isOwn={isOwn}
                                showAvatar={showAvatar}
                                senderAvatar={otherUser?.profile_image_url}
                            />
                        );
                    })}

                    {/* Typing Bubble */}
                    {showTyping && (
                        <div className="flex items-end gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-700">
                                <img
                                    src={otherUser?.profile_image_url || `https://ui-avatars.com/api/?name=${otherUser?.first_name}+${otherUser?.last_name}&background=random`}
                                    alt="User" className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="max-w-3xl mx-auto">
                    <MessageInput onSend={handleSendMessage} onTyping={handleInput} />
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
