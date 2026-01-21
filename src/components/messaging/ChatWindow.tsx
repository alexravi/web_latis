import React, { useEffect, useRef, useState } from 'react';
import type { Message, Conversation } from '../../types/message';
import { getMessages, getConversationDetails, sendMessage, markConversationRead } from '../../services/messageService';
import { useSocket } from '../../context/SocketContext';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

interface ChatWindowProps {
    conversationId: number;
    onBack: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId, onBack }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { socket } = useSocket();

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [msgsRes, convRes] = await Promise.all([
                    getMessages(conversationId),
                    getConversationDetails(conversationId)
                ]);
                // Messages are returned newest first usually, we reverse for chat flow if needed
                // Assuming backend returns newest first (DESC), we reverse to show oldest at top for chat log
                setMessages([...msgsRes.data].reverse());
                setConversation(convRes.data);

                // Mark as read
                if (convRes.data.unread_count > 0) {
                    await markConversationRead(conversationId);
                }
            } catch (err) {
                console.error("Failed to load chat", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [conversationId]);

    useEffect(() => {
        if (!socket) return;

        socket.emit('conversation:join', conversationId);

        const handleNewMessage = (data: any) => {
            if (data.conversation_id === conversationId) {
                const newMsg: Message = data.message || data; // Adapt to actual payload
                // Check if message already exists to avoid dupes (optimistic update vs real event)
                setMessages(prev => {
                    if (prev.some(m => m.id === newMsg.id)) return prev;
                    return [...prev, newMsg];
                });

                // If it's incoming, mark read
                if (newMsg.sender_id !== conversation?.participant1_id) { // simplified check, need accurate current user ID
                    markConversationRead(conversationId);
                }
            }
        };

        // Listen for all message:new and filter
        // Or specific room event if backend supports it
        socket.on('message:new', handleNewMessage);

        return () => {
            socket.emit('conversation:leave', conversationId);
            socket.off('message:new', handleNewMessage);
        };
    }, [socket, conversationId]);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (content: string) => {
        const tempId = Date.now();
        // Optimistic update
        const tempMsg: Message = {
            id: tempId,
            conversation_id: conversationId,
            sender_id: 0, // Current user placeholder
            content,
            delivery_status: 'sent',
            created_at: new Date().toISOString()
        };

        setMessages(prev => [...prev, tempMsg]);

        try {
            const res = await sendMessage(conversationId, { content });
            // Replace temp message with real one
            setMessages(prev => prev.map(m => m.id === tempId ? res.data : m));
        } catch (err) {
            console.error("Failed to send", err);
            // Show error state on message
        }
    };

    if (loading) return <div className="flex-1 flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900">
            {/* Header */}
            <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center shadow-sm z-10">
                <button onClick={onBack} className="md:hidden mr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img
                            src={conversation?.other_participant?.profile_image_url || `https://ui-avatars.com/api/?name=${conversation?.other_participant?.first_name}+${conversation?.other_participant?.last_name}&background=random`}
                            className="w-10 h-10 rounded-full object-cover"
                            alt="Profile"
                        />
                        {conversation?.other_participant?.is_online && (
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white leading-tight">
                            {conversation?.other_participant?.first_name} {conversation?.other_participant?.last_name}
                        </h3>
                        <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                            {conversation?.other_participant?.is_online ? 'Online' : 'Offline'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
                {messages.map((msg, idx) => {
                    // Determine if own message. Need current user ID. 
                    // For now, hack: check if sender_id corresponds to "me" or not details.
                    // Assuming we can get current user ID from context or token.
                    // Let's assume sender_id !== conversation.other_participant.id means it's me.
                    const isOwn = msg.sender_id !== conversation?.other_participant?.id;
                    const showAvatar = !isOwn && (idx === 0 || messages[idx - 1].sender_id !== msg.sender_id);

                    return (
                        <MessageBubble
                            key={msg.id}
                            message={msg}
                            isOwn={isOwn}
                            showAvatar={showAvatar}
                            senderAvatar={conversation?.other_participant?.profile_image_url}
                        />
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <MessageInput onSend={handleSendMessage} />
            </div>
        </div>
    );
};

export default ChatWindow;
