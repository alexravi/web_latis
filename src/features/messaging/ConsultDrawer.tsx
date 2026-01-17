import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Consult } from '../../types/ConsultTypes';
import { getConsults } from '../../services/consultService';

interface ConsultDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const ConsultDrawer: React.FC<ConsultDrawerProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [consults, setConsults] = useState<Consult[]>([]);

    useEffect(() => {
        if (isOpen) {
            getConsults().then(setConsults);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                style={{ position: 'fixed', inset: 0, zIndex: 1900, background: 'transparent' }}
                onClick={onClose}
            />

            {/* Drawer */}
            <div style={{
                position: 'fixed',
                top: '60px', // Below header
                right: '0',
                bottom: '0',
                width: '350px',
                background: 'var(--color-surface)',
                borderLeft: '1px solid var(--color-grid)',
                boxShadow: '-4px 0 24px rgba(0,0,0,0.1)',
                zIndex: 2000,
                display: 'flex',
                flexDirection: 'column',
                animation: 'slideInRight 0.2s ease-out'
            }}>
                <div style={{
                    padding: '16px',
                    borderBottom: '1px solid var(--color-grid)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Quick Messages</h3>
                    <button onClick={() => { navigate('/messaging'); onClose(); }} style={{ fontSize: '0.8rem', color: 'var(--color-accent)', background: 'none', border: 'none', cursor: 'pointer' }}>
                        Open Full View
                    </button>
                </div>

                <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
                    {consults.map(consult => (
                        <div
                            key={consult.id}
                            onClick={() => { navigate('/messaging'); onClose(); }}
                            style={{
                                padding: '16px',
                                borderBottom: '1px solid var(--color-grid-subtle)',
                                cursor: 'pointer',
                                transition: 'background 0.1s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(var(--color-bg-rgb), 0.5)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{consult.participants[0].name}</span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {consult.lastMessage.content}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
            `}</style>
        </>
    );
};

export default ConsultDrawer;
