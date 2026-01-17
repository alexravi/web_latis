import React, { useState, useEffect } from 'react';
import AppHeader from '../dashboard/AppHeader';
import GridBackground from '../landing/GridBackground';
import type { Consult, Message } from '../../types/ConsultTypes';
import { getConsults, sendMessage } from '../../services/consultService';
import SEO from '../../components/SEO';

const SecureConsultsPage: React.FC = () => {
    const [consults, setConsults] = useState<Consult[]>([]);
    const [activeConsultId, setActiveConsultId] = useState<string | null>(null);
    const [messageInput, setMessageInput] = useState('');


    useEffect(() => {
        const load = async () => {
            const data = await getConsults();
            setConsults(data);
            if (data.length > 0 && !activeConsultId) {
                setActiveConsultId(data[0].id);
            }

        };
        load();
    }, []);

    const activeConsult = consults.find(c => c.id === activeConsultId);

    const handleSend = async () => {
        if (!messageInput.trim() || !activeConsultId) return;

        // Optimistic update
        const tempMsg: Message = {
            id: `temp-${Date.now()}`,
            senderId: 'me',
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

        // API Call
        await sendMessage(activeConsultId, messageInput);
    };



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
                        }} title="New Chat">
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
                                        <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-fg)' }}>{consult.participants[0].name}</div>
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
                                        <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{activeConsult.participants[0].name}</h2>
                                        {/* Optional: Show role if available */}
                                        <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>
                                            • {activeConsult.participants[0].role}
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
                                    const isMe = msg.senderId === 'me';
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
                            </div>

                            {/* Input Area */}
                            <div style={{ padding: '20px', borderTop: '1px solid var(--color-grid)', background: 'var(--color-surface)' }}>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <input
                                        type="text"
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
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
