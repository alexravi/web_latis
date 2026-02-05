import React from 'react';
import { createPortal } from 'react-dom';

interface ActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    onSubmit: (e: React.FormEvent) => void;
    isSubmitting?: boolean;
    submitLabel?: string;
}

const ActionModal: React.FC<ActionModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    onSubmit,
    isSubmitting = false,
    submitLabel = 'SAVE'
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
        }}>
            <div style={{
                background: '#ffffff',
                width: '100%',
                maxWidth: '600px',
                borderRadius: '16px',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
                animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '85vh'
            }}>
                {/* Header */}
                <div style={{
                    padding: '24px',
                    borderBottom: '1px solid var(--color-grid)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <h2 style={{
                        fontSize: '1.4rem',
                        fontWeight: 700,
                        color: 'var(--color-fg)',
                        letterSpacing: '-0.02em'
                    }}>{title}</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--color-text-muted)',
                            padding: '8px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-grid)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                {/* Body */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    <form id="modal-form" onSubmit={onSubmit} style={{ padding: '24px' }}>
                        {children}
                    </form>
                </div>

                {/* Footer */}
                <div style={{
                    padding: '20px 24px',
                    borderTop: '1px solid var(--color-grid)',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '12px',
                    background: 'var(--color-surface)',
                    borderBottomLeftRadius: '16px',
                    borderBottomRightRadius: '16px'
                }}>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: '1px solid transparent',
                            padding: '10px 20px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            color: 'var(--color-text-main)',
                            borderRadius: '8px',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.03)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="modal-form"
                        disabled={isSubmitting}
                        style={{
                            background: 'var(--color-accent)',
                            border: 'none',
                            padding: '10px 24px',
                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            color: 'white',
                            borderRadius: '8px',
                            opacity: isSubmitting ? 0.7 : 1,
                            boxShadow: '0 4px 12px rgba(var(--color-accent-rgb), 0.25)',
                            transition: 'transform 0.2s, box-shadow 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            if (!isSubmitting) {
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = '0 6px 16px rgba(var(--color-accent-rgb), 0.35)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isSubmitting) {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(var(--color-accent-rgb), 0.25)';
                            }
                        }}
                    >
                        {isSubmitting ? 'Saving...' : submitLabel}
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .modal-input, .modal-textarea {
                    width: 100%;
                    padding: 14px 16px;
                    background: #f8f9fa;
                    border: 1px solid #e9ecef;
                    color: var(--color-fg);
                    font-size: 1rem;
                    border-radius: 8px;
                    outline: none;
                    transition: all 0.2s ease;
                    margin-top: 6px;
                }
                .modal-textarea {
                    min-height: 120px;
                    resize: vertical;
                    line-height: 1.5;
                }
                .modal-input:focus, .modal-textarea:focus {
                    background: #ffffff;
                    border-color: var(--color-accent);
                    box-shadow: 0 0 0 4px rgba(var(--color-accent-rgb), 0.1);
                }
                .modal-label {
                    display: block;
                    font-family: var(--font-main);
                    font-weight: 600;
                    font-size: 0.85rem;
                    color: var(--color-text-main);
                    margin-bottom: 0.5rem;
                    margin-top: 20px;
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                }
                .modal-label:first-child {
                    margin-top: 0;
                }
            `}</style>
        </div>,
        document.body
    );
};

export default ActionModal;
