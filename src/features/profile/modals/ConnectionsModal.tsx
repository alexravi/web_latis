import React from 'react';
import { createPortal } from 'react-dom';
import type { RelationshipUser } from '../../../services/relationshipService';
import { Link } from 'react-router-dom';

interface ConnectionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    connections: RelationshipUser[] | undefined;
    isLoading: boolean;
    title?: string;
}

const ConnectionsModal: React.FC<ConnectionsModalProps> = ({
    isOpen,
    onClose,
    connections,
    isLoading,
    title = 'Connections'
}) => {
    if (!isOpen) return null;

    return createPortal(
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
        }} onClick={onClose}>
            <div style={{
                background: '#ffffff',
                width: '100%',
                maxWidth: '500px',
                borderRadius: '16px',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '80vh',
                overflow: 'hidden'
            }} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div style={{
                    padding: '16px 24px',
                    borderBottom: '1px solid var(--color-grid)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>{title}</h2>
                    <button onClick={onClose} style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1.5rem',
                        lineHeight: 1,
                        color: 'var(--color-text-muted)'
                    }}>×</button>
                </div>

                {/* List */}
                <div style={{ overflowY: 'auto', padding: '0' }}>
                    {isLoading ? (
                        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading...</div>
                    ) : !connections || connections.length === 0 ? (
                        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>No connections found.</div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {connections.map((user) => (
                                <div key={user.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '12px 24px',
                                    borderBottom: '1px solid var(--color-grid)',
                                    gap: '12px'
                                }}>
                                    <Link to={`/${user.username || user.id}`} onClick={onClose} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '50%',
                                            background: '#eee',
                                            overflow: 'hidden',
                                            flexShrink: 0
                                        }}>
                                            <img
                                                src={user.profile_picture || `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=random`}
                                                alt={`${user.first_name} ${user.last_name}`}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, color: 'var(--color-fg)' }}>{user.first_name} {user.last_name}</div>
                                            {(user.headline || user.current_role) && (
                                                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                    {user.headline || user.current_role}
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                    {/* Optional: Add Message/Connect button here */}
                                    <button style={{
                                        border: '1px solid var(--color-accent)',
                                        color: 'var(--color-accent)',
                                        background: 'transparent',
                                        borderRadius: '16px',
                                        padding: '4px 12px',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}>
                                        Message
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConnectionsModal;
