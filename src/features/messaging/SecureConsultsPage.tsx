import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AppHeader from '../dashboard/AppHeader';
import GridBackground from '../landing/GridBackground';
import { useSocket } from '../../context/SocketContext';
import { getConsults, getConsultMessages, sendMessage, markConsultAsRead } from '../../services/consultService';
import type { Consult, Message } from '../../types/ConsultTypes';
import './SecureConsults.css';
import MessageSkeleton from '../../components/skeletons/MessageSkeleton';

// --- Types ---
interface GroupedMessage {
    id: string;
    senderId: string;
    messages: Message[];
    timestamp: string;
}

const SecureConsultsPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { socket } = useSocket();

    // -- State --
    const [consults, setConsults] = useState<Consult[]>([]);
    const [activeConsultId, setActiveConsultId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]); // Current active messages
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [messageInput, setMessageInput] = useState('');

    // Pagination & Loading
    const [loadingList, setLoadingList] = useState(true);
    const [loadingChat, setLoadingChat] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const MESSAGES_PER_PAGE = 20;

    // Typing
    const [typingUsers, setTypingUsers] = useState<number[]>([]);
    const typingTimeoutRef = useRef<any>(null);

    // Refs
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const prevScrollHeightRef = useRef<number>(0);

    // -- Init --
    useEffect(() => {
        try {
            const userJson = localStorage.getItem('user');
            if (userJson) {
                const user = JSON.parse(userJson);
                setCurrentUserId(user.id?.toString() || null);
            }
        } catch (e) {
            console.error("Failed to parse user", e);
        }

        const fetchList = async () => {
            setLoadingList(true);
            const data = await getConsults();
            setConsults(data);
            setLoadingList(false);

            // Handle URL param or default
            const cid = searchParams.get('cid');
            if (cid) {
                setActiveConsultId(cid);
            }
        };
        fetchList();
    }, []);

    // -- Active Consult Change --
    useEffect(() => {
        if (!activeConsultId) return;
        setSearchParams({ cid: activeConsultId });

        const loadActiveChat = async () => {
            setLoadingChat(true);
            setMessages([]);
            setHasMore(true);
            setTypingUsers([]);

            try {
                const msgs = await getConsultMessages(activeConsultId, { limit: MESSAGES_PER_PAGE, offset: 0 });

                // Sort Chronologically: Oldest (Top) -> Newest (Bottom)
                // This ensures standard chat order (Top to Bottom)
                const sorted = [...msgs].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
                setMessages(sorted);

                if (msgs.length < MESSAGES_PER_PAGE) setHasMore(false);

                // Mark Read
                if (activeConsultId) markConsultAsRead(activeConsultId);

                // Scroll to bottom
                setTimeout(() => scrollToBottom('auto'), 50);

            } catch (e) {
                console.error("Failed to load chat", e);
            } finally {
                setLoadingChat(false);
            }
        };

        loadActiveChat();

        // Socket Join
        if (socket) {
            socket.emit('conversation:join', activeConsultId);
        }

        return () => {
            if (socket) socket.emit('conversation:leave', activeConsultId);
        }

    }, [activeConsultId, socket]);

    // -- Pagination Handler --
    const handleScroll = async () => {
        if (!messagesContainerRef.current || !activeConsultId || loadingMore || !hasMore) return;

        if (messagesContainerRef.current.scrollTop === 0) {
            setLoadingMore(true);
            const currentOffset = messages.length;

            try {
                // Capture scroll height before loading
                prevScrollHeightRef.current = messagesContainerRef.current.scrollHeight;

                const olderMsgs = await getConsultMessages(activeConsultId, { limit: MESSAGES_PER_PAGE, offset: currentOffset });
                if (olderMsgs.length < MESSAGES_PER_PAGE) setHasMore(false);

                // Sort older messages chronologically too (Oldest -> Newest) before prepending
                const sortedOlder = [...olderMsgs].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

                setMessages(prev => [...sortedOlder, ...prev]);

            } catch (e) {
                console.error("Pagination failed", e);
            } finally {
                setLoadingMore(false);
            }
        }
    };

    // Restore scroll position after pagination
    useLayoutEffect(() => {
        if (!messagesContainerRef.current || prevScrollHeightRef.current === 0) return;

        const newHeight = messagesContainerRef.current.scrollHeight;
        const diff = newHeight - prevScrollHeightRef.current;
        messagesContainerRef.current.scrollTop = diff;
        prevScrollHeightRef.current = 0;
    }, [messages]);


    // -- Socket Listener --
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (data: any) => {
            const rawMsg = data.message || data;
            const convId = rawMsg.conversation_id?.toString();

            // If relevant to active chat
            if (convId === activeConsultId) {
                const newMsg: Message = {
                    id: rawMsg.id?.toString() || `sock-${Date.now()}`,
                    senderId: rawMsg.sender_id?.toString(),
                    content: rawMsg.content,
                    timestamp: rawMsg.created_at || new Date().toISOString(),
                    isRead: true,
                    attachments: rawMsg.attachment_url ? [rawMsg.attachment_url] : []
                };

                setMessages(prev => {
                    // Dedup
                    if (prev.some(m => m.id === newMsg.id)) return prev;
                    // Append and sort
                    return [...prev, newMsg].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
                });

                setTypingUsers([]);
                scrollToBottom('smooth');
                if (activeConsultId) markConsultAsRead(activeConsultId);
            }

            // Update List Last Message
            setConsults(prev => prev.map(c => {
                if (c.id === convId) {
                    return {
                        ...c,
                        lastMessage: {
                            id: rawMsg.id?.toString(),
                            senderId: rawMsg.sender_id?.toString(),
                            content: rawMsg.content,
                            timestamp: rawMsg.created_at,
                            isRead: convId === activeConsultId
                        }
                    }
                }
                return c;
            }));
        };

        const handleTyping = (data: any) => {
            if (Number(data.conversation_id) === Number(activeConsultId)) {
                if (data.typing) {
                    setTypingUsers(prev => prev.includes(data.user_id) ? prev : [...prev, data.user_id]);
                } else {
                    setTypingUsers(prev => prev.filter(id => id !== data.user_id));
                }
            }
        };

        socket.on('message:new', handleNewMessage);
        socket.on('typing:status', handleTyping);

        return () => {
            socket.off('message:new', handleNewMessage);
            socket.off('typing:status', handleTyping);
        };
    }, [socket, activeConsultId]);


    // -- Actions --
    const scrollToBottom = (behavior: 'auto' | 'smooth' = 'smooth') => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior });
        }
    };

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !activeConsultId) return;

        const tempId = `temp-${Date.now()}`;
        const tempMsg: Message = {
            id: tempId,
            senderId: currentUserId || 'me',
            content: messageInput,
            timestamp: new Date().toISOString(),
            isRead: true
        };

        // Optimistic UI
        setMessages(prev => [...prev, tempMsg]);
        setMessageInput('');
        scrollToBottom('smooth');

        try {
            await sendMessage(activeConsultId, tempMsg.content);
        } catch (e) {
            console.error("Send failed", e);
        }
    };

    const handleTypingInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageInput(e.target.value);

        if (socket && activeConsultId) {
            socket.emit('message:typing:start', { conversation_id: Number(activeConsultId) });
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                socket.emit('message:typing:stop', { conversation_id: Number(activeConsultId) });
            }, 3000);
        }
    };

    // -- Helper: Group Messages --
    const getGroupedMessages = () => {
        const groups: GroupedMessage[] = [];
        let currentGroup: GroupedMessage | null = null;

        messages.forEach(msg => {
            if (currentGroup && currentGroup.senderId === msg.senderId) {
                currentGroup.messages.push(msg);
            } else {
                currentGroup = {
                    id: `group-${msg.id}`,
                    senderId: msg.senderId,
                    messages: [msg],
                    timestamp: msg.timestamp
                };
                groups.push(currentGroup);
            }
        });
        return groups;
    };


    // -- Render --
    return (
        <div className="consult-page-wrapper">
            <div style={{ position: 'fixed', inset: 0, zIndex: 0, opacity: 0.5 }}>
                <GridBackground />
            </div>

            {/* Nav Header */}
            <AppHeader />

            <div className="consult-main-layout">
                {/* 1. Sidebar */}
                <div className={`consult-sidebar ${activeConsultId ? 'mobile-hidden' : 'mobile-visible'}`}>
                    <div className="sidebar-header">
                        <h2 className="sidebar-title">Chats</h2>
                        <button className="new-chat-btn" onClick={() => navigate('/messaging?new=true')} title="New Consult">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        </button>
                    </div>

                    <div className="conversation-list custom-scrollbar">
                        {loadingList ? (
                            <div className="p-4 text-center text-gray-400">Loading...</div>
                        ) : (
                            consults.map(c => (
                                <div
                                    key={c.id}
                                    className={`conversation-item ${activeConsultId === c.id ? 'active' : ''}`}
                                    onClick={() => setActiveConsultId(c.id)}
                                >
                                    <div className="conv-avatar-row">
                                        <span className="conv-name">{c.participants[0]?.name || 'Unknown'}</span>
                                        <span className="conv-date">
                                            {new Date(c.lastMessage.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <div className="conv-preview">
                                        {c.lastMessage.senderId === currentUserId || c.lastMessage.senderId === 'me' ? 'You: ' : ''}
                                        {c.lastMessage.content}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>


                {/* 2. Chat Window */}
                <div className={`consult-chat-window ${activeConsultId ? 'mobile-visible' : 'mobile-hidden'}`}>
                    {activeConsultId ? (
                        <>
                            {/* Header */}
                            <div className="chat-header">
                                <div className="chat-user-info">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <button className="md:hidden" onClick={() => setActiveConsultId(null)}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                                        </button>

                                        <div>
                                            <h2>{consults.find(c => c.id === activeConsultId)?.participants[0]?.name || 'Chat'}</h2>
                                            <div className="chat-status">
                                                <div className="status-dot"></div> Online
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div
                                className="chat-messages-area custom-scrollbar"
                                ref={messagesContainerRef}
                                onScroll={handleScroll}
                            >
                                {loadingMore && (
                                    <div className="flex justify-center py-2">
                                        <div className="animate-spin h-5 w-5 border-2 border-[var(--color-accent)] border-t-transparent rounded-full"></div>
                                    </div>
                                )}

                                {loadingChat && messages.length === 0 ? (
                                    <MessageSkeleton />
                                ) : messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                        <div className="text-4xl mb-4">📝</div>
                                        <p>No messages yet.</p>
                                        <p className="text-sm mt-2">Start the conversation!</p>
                                    </div>
                                ) : (
                                    getGroupedMessages().map(group => {
                                        const isMe = group.senderId === currentUserId || group.senderId === 'me';
                                        return (
                                            <div key={group.id} className={`message-cluster ${isMe ? 'mine' : 'theirs'}`}>
                                                {group.messages.map((msg) => (
                                                    <div key={msg.id} className="message-bubble">
                                                        {msg.content}
                                                        <div className={`message-time ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })
                                )}

                                {/* Typing Indicator */}
                                {typingUsers.length > 0 && typingUsers.some(id => id.toString() !== currentUserId) && (
                                    <div className="typing-cluster">
                                        <div className="typing-dot"></div>
                                        <div className="typing-dot"></div>
                                        <div className="typing-dot"></div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="chat-input-wrapper">
                                <div className="input-container">
                                    <input
                                        className="chat-input"
                                        placeholder="Type a message..."
                                        value={messageInput}
                                        onChange={handleTypingInput}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    />
                                    <button
                                        className="send-btn"
                                        disabled={!messageInput.trim()}
                                        onClick={handleSendMessage}
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon">💬</div>
                            <h3>Select a conversation to start messaging</h3>
                            <p>End-to-end encrypted for your privacy.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SecureConsultsPage;
