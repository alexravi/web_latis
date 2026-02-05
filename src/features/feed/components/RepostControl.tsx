import React from 'react';

interface RepostControlProps {
    count: number;
    isReposted: boolean;
    onRepost: () => void;
    size?: 'sm' | 'md';
}

const RepostControl: React.FC<RepostControlProps> = ({
    count,
    isReposted,
    onRepost,
    size = 'md'
}) => {
    const iconSize = size === 'sm' ? 16 : 18;
    const fontSize = size === 'sm' ? '0.8rem' : '0.9rem';

    return (
        <button
            onClick={(e) => { e.stopPropagation(); onRepost(); }}
            style={{
                background: isReposted ? 'rgba(0, 255, 0, 0.1)' : 'transparent',
                color: isReposted ? '#00e676' : 'var(--color-text-muted)',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '20px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px',
                transition: 'all 0.2s',
                outline: 'none'
            }}
            onMouseEnter={(e) => {
                if (!isReposted) {
                    e.currentTarget.style.color = '#00e676';
                    e.currentTarget.style.background = 'rgba(0, 255, 0, 0.05)';
                }
            }}
            onMouseLeave={(e) => {
                if (!isReposted) {
                    e.currentTarget.style.color = 'var(--color-text-muted)';
                    e.currentTarget.style.background = 'transparent';
                }
            }}
        >
            <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 1l4 4-4 4" />
                <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                <path d="M7 23l-4-4 4-4" />
                <path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
            <span style={{ fontSize: fontSize }}>{count}</span>
        </button>
    );
};

export default RepostControl;
