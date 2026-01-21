import React, { useState, useEffect } from 'react';
import AppHeader from '../dashboard/AppHeader';
import GridBackground from '../landing/GridBackground';
import type { Consult, Message } from '../../types/ConsultTypes';
import { useNavigate } from 'react-router-dom';
import { getConsults, getConsultMessages, sendMessage, markConsultAsRead } from '../../services/consultService';
import { useSocket } from '../../context/SocketContext';
import SEO from '../../components/SEO';

const SecureConsultsPage: React.FC = () => {
    const navigate = useNavigate();
    const { socket } = useSocket();
    const [consults, setConsults] = useState<Consult[]>([]);
    const [activeConsultId, setActiveConsultId] = useState<string | null>(null);
    const [messageInput, setMessageInput] = useState('');
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [typingUsers, setTypingUsers] = useState<number[]>([]);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);
    const typingTimeoutRef = React.useRef<any>(null);

    useEffect(() => {
        // Get current user ID from localStorage or auth service
        try {
            const userJson = localStorage.getItem('user');
            if (userJson) {
                const user = JSON.parse(userJson);
                setCurrentUserId(user.id?.toString() || null);
            }
        } catch (e) {
            console.error("Failed to parse user from localstorage", e);
        }

        const load = async () => {
            const data = await getConsults();
            setConsults(data);
            if (data.length > 0 && !activeConsultId) {
                setActiveConsultId(data[0].id);
            }
        };
        load();
    }, []);

    // Socket Events
    useEffect(() => {
        if (!socket) return;

        if (activeConsultId) {
            socket.emit('conversation:join', activeConsultId);
            // Mark read when joining/opening
            markConsultAsRead(activeConsultId);
        }

        const handleNewMessage = (data: any) => {
            const rawMsg = data.message || data;
            const convId = rawMsg.conversation_id?.toString() || activeConsultId;
            const rawSenderId = rawMsg.sender_id?.toString();

            // 1. Clear typing status for this sender immediately upon message receipt
            if (rawSenderId) {
                setTypingUsers(prev => prev.filter(id => id.toString() !== rawSenderId));
            }

            // Update consult list 
            setConsults(prev => prev.map(c => {
                if (c.id === convId) {
                    const isCurrent = c.id === activeConsultId;
                    const newMessage: Message = {
                        id: rawMsg.id?.toString() || `socket-${Date.now()}`,
                        senderId: rawSenderId || '',
                        content: rawMsg.content || '',
                        timestamp: rawMsg.created_at || new Date().toISOString(),
                        isRead: isCurrent,
                        attachments: rawMsg.attachment_url ? [rawMsg.attachment_url] : []
                    };

                    // Deduplication Logic
                    const existingIndex = c.messages.findIndex(m => m.id === newMessage.id);
                    if (existingIndex !== -1) return c;

                    let newMessages = [...c.messages];
                    const isMe = newMessage.senderId === currentUserId || newMessage.senderId === 'me';

                    if (isMe) {
                        // Find a temp message from me with same content
                        const tempIndex = newMessages.findIndex(m =>
                            m.id.startsWith('temp-') &&
                            m.content === newMessage.content &&
                            (m.senderId === currentUserId || m.senderId === 'me')
                        );

                        if (tempIndex !== -1) {
                            newMessages[tempIndex] = newMessage;
                        } else {
                            newMessages.push(newMessage);
                        }
                    } else {
                        newMessages.push(newMessage);
                    }

                    return {
                        ...c,
                        messages: isCurrent ? newMessages : c.messages,
                        lastMessage: newMessage,
                    };
                }
                return c;
            }));

            if (activeConsultId && convId === activeConsultId) {
                markConsultAsRead(activeConsultId);
            }
        };

        const handleTypingStatus = (data: { conversation_id: number, user_id: number, typing: boolean }) => {
            // Ensure IDs are comparable (numbers vs strings)
            if (activeConsultId && data.conversation_id.toString() === activeConsultId.toString()) {
                setTypingUsers(prev => {
                    if (data.typing) {
                        // Add if not present
                        return prev.some(id => id.toString() === data.user_id.toString())
                            ? prev
                            : [...prev, data.user_id];
                    } else {
                        // Remove
                        return prev.filter(id => id.toString() !== data.user_id.toString());
                    }
                });
            }
        };

        socket.on('message:new', handleNewMessage);
        socket.on('typing:status', handleTypingStatus);

        return () => {
            if (activeConsultId) {
                socket.emit('conversation:leave', activeConsultId);
            }
            socket.off('message:new', handleNewMessage);
            socket.off('typing:status', handleTypingStatus);
        };
    }, [socket, activeConsultId, currentUserId]);

    // Failsafe: Clear typing indicators every 5 seconds if no updates
    useEffect(() => {
        const interval = setInterval(() => {
            setTypingUsers(prev => {
                if (prev.length === 0) return prev;
                // Just clear all as a fallback if they stick for too long (simple approach)
                // A better approach would be to track timestamps per user, but for now this clears "stuck" states
                return [];
            });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Fetch messages when active consult changes
    useEffect(() => {
        if (!activeConsultId) return;
        setTypingUsers([]); // Clear typing on switch

        const loadMessages = async () => {
            try {
                const msgs = await getConsultMessages(activeConsultId);
                setConsults(prev => prev.map(c =>
                    c.id === activeConsultId
                        ? { ...c, messages: msgs }
                        : c
                ));
            } catch (error) {
                console.error("Failed to load consult messages", error);
            }
        };
        loadMessages();
    }, [activeConsultId]);

    const activeConsult = consults.find(c => c.id === activeConsultId);

    const handleNewChat = () => {
        // Redirect to main messaging for new chat flow as it has the full connection picker
        navigate('/messaging?new=true');
    };

    const handleTyping = () => {
        if (!socket || !activeConsultId) return;
        socket.emit('message:typing:start', { conversation_id: Number(activeConsultId) });

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('message:typing:stop', { conversation_id: Number(activeConsultId) });
        }, 3000);
    };

    const handleSend = async () => {
        if (!messageInput.trim() || !activeConsultId) return;

        const tempId = `temp-${Date.now()}`;
        // Optimistic update
        const tempMsg: Message = {
            id: tempId,
            senderId: currentUserId || 'me',
            content: messageInput,
            timestamp: new Date().toISOString(),
            isRead: true
        };

        const updatedConsults = consults.map(c => {
            if (c.id === activeConsultId) {
                return {
                    ...c,
                    messages: [...c.messages, tempMsg],
                    lastMessage: tempMsg
                };
            }
            return c;
        });
        setConsults(updatedConsults);
        setMessageInput('');

        try {
            // API Call
            await sendMessage(activeConsultId, tempMsg.content);
            // If API returns the full message object, we can update the temp one
            // Assuming response.data is the message object. 
            // If response format is { success: true, data: Message }, great.
            // If not, we rely on the socket to replace it eventually or just leave it.
            // But to be safe vs socket race:
            // if socket event came first, it replaced temp.
            // if API returns now, we might want to ensure we have real ID.

            // For now, let's just let socket handle replacement to avoid complexity race conditions,
            // or if we really need to, we can update ID here.
            // But since socket is reliable for "new message", dedupe logic in handleNewMessage is key.
        } catch (e) {
            console.error("Send failed", e);
            // Ideally show error state on message
        }
    };



    useEffect(() => {
        if (activeConsultId && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [activeConsultId, consults]);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'fixed', inset: 0, zIndex: 0, opacity: 0.5 }}>
                <GridBackground />
            </div>

            <SEO title="Secure Consults" description="Encrypted clinical communication." />
            <AppHeader />

            <div className="container" style={{
                flex: 1,
                paddingTop: '80px',
                paddingBottom: '24px',
                maxWidth: '1400px',
                margin: '0 auto',
                width: '100%',
                display: 'flex',
                gap: '24px',
                position: 'relative',
                zIndex: 1,
                height: '100vh',
                boxSizing: 'border-box'
            }}>

                {/* LEFT PANE: Consult List */}
                <div style={{
                    width: '320px',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-grid)',
                    borderRadius: '16px',
                    overflow: 'hidden'
                }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-grid)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.01em' }}>Inbox</h2>
                        <button style={{
                            background: 'transparent',
                            border: '1px solid var(--color-grid)',
                            borderRadius: '50%',
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'var(--color-text-main)'
                        }} title="New Chat" onClick={handleNewChat}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><line x1="9" y1="10" x2="15" y2="10"></line><line x1="12" y1="7" x2="12" y2="13"></line></svg>
                        </button>
                    </div>

                    <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
                        {consults.map(consult => {
                            const isActive = consult.id === activeConsultId;
                            return (
                                <div
                                    key={consult.id}
                                    onClick={() => setActiveConsultId(consult.id)}
                                    style={{
                                        padding: '16px 20px',
                                        borderBottom: '1px solid var(--color-grid-subtle)',
                                        cursor: 'pointer',
                                        background: isActive ? 'rgba(var(--color-accent-rgb), 0.05)' : 'transparent',
                                        borderLeft: isActive ? '3px solid var(--color-accent)' : '3px solid transparent',
                                        transition: 'background 0.2s'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-fg)' }}>{consult.participants[0]?.name || 'Unknown User'}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                            {new Date(consult.lastMessage.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {consult.lastMessage.senderId === 'me' ? 'You: ' : ''}{consult.lastMessage.content}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT PANE: Case File / Conversation */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-grid)',
                    borderRadius: '16px',
                    overflow: 'hidden'
                }}>
                    {activeConsult ? (
                        <>
                            {/* Thread Header */}
                            <div style={{
                                padding: '16px 24px',
                                borderBottom: '1px solid var(--color-grid)',
                                background: 'rgba(var(--color-bg-rgb), 0.5)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{activeConsult.participants[0]?.name || 'Unknown User'}</h2>
                                        {/* Optional: Show role if available */}
                                        <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>
                                            • {activeConsult.participants[0]?.role || 'User'}
                                        </span>
                                    </div>

                                </div>
                                <div>
                                    <button style={{ padding: '8px 16px', fontSize: '0.85rem', background: 'transparent', border: '1px solid var(--color-grid)', color: 'var(--color-text-muted)', borderRadius: '8px', cursor: 'pointer' }}>
                                        View Profile
                                    </button>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="custom-scrollbar" style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {activeConsult.messages.map(msg => {
                                    const isMe = msg.senderId === currentUserId || msg.senderId === 'me';
                                    return (
                                        <div key={msg.id} style={{
                                            alignSelf: isMe ? 'flex-end' : 'flex-start',
                                            maxWidth: '70%'
                                        }}>
                                            <div style={{
                                                background: isMe ? 'var(--color-accent)' : 'var(--color-bg)',
                                                color: isMe ? 'white' : 'var(--color-fg)',
                                                border: isMe ? 'none' : '1px solid var(--color-grid)',
                                                padding: '12px 16px',
                                                borderRadius: isMe ? '12px 12px 0 12px' : '12px 12px 12px 0',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                            }}>
                                                <div style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>{msg.content}</div>
                                            </div>
                                            <div style={{
                                                fontSize: '0.7rem',
                                                color: 'var(--color-text-muted)',
                                                marginTop: '4px',
                                                textAlign: isMe ? 'right' : 'left',
                                                fontFamily: 'var(--font-mono)'
                                            }}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    );
                                })}
                                {typingUsers.filter(id => id.toString() !== currentUserId).length > 0 && (
                                    <div style={{ alignSelf: 'flex-start', maxWidth: '70%' }}>
                                        <div style={{
                                            background: 'var(--color-bg)',
                                            border: '1px solid var(--color-grid)',
                                            padding: '12px 16px',
                                            borderRadius: '12px 12px 12px 0',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                            display: 'flex', gap: '4px', alignItems: 'center'
                                        }}>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Typing...</span>
                                            <div className="animate-pulse" style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--color-text-muted)' }}></div>
                                            <div className="animate-pulse" style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--color-text-muted)', animationDelay: '0.1s' }}></div>
                                            <div className="animate-pulse" style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--color-text-muted)', animationDelay: '0.2s' }}></div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div style={{ padding: '20px', borderTop: '1px solid var(--color-grid)', background: 'var(--color-surface)' }}>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <input
                                        type="text"
                                        value={messageInput}
                                        onChange={(e) => {
                                            setMessageInput(e.target.value);
                                            handleTyping();
                                        }}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                        placeholder="Type a secure message..."
                                        style={{
                                            flex: 1,
                                            padding: '12px 16px',
                                            borderRadius: '8px',
                                            border: '1px solid var(--color-grid)',
                                            background: 'var(--color-bg)',
                                            color: 'var(--color-fg)',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                    <button
                                        onClick={handleSend}
                                        style={{
                                            padding: '0 24px',
                                            background: 'var(--color-fg)',
                                            color: 'var(--color-bg)',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontWeight: 600,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                            Select a consult to view details
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default SecureConsultsPage;
