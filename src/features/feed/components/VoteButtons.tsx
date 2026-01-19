import React, { useState, useCallback } from 'react';

interface VoteButtonsProps {
    upvotes: number;
    downvotes: number;
    userVote: 'upvote' | 'downvote' | null;
    onVote: (type: 'upvote' | 'downvote') => Promise<void>;
    orientation?: 'vertical' | 'horizontal';
    size?: 'sm' | 'md';
}

const VoteButtons: React.FC<VoteButtonsProps> = ({
    upvotes,
    downvotes,
    userVote,
    onVote,
    orientation = 'horizontal',
    size = 'md'
}) => {
    // Optimistic state
    const [optimisticVote, setOptimisticVote] = useState(userVote);
    const [optimisticScore, setOptimisticScore] = useState(upvotes - downvotes);

    const handleVote = useCallback(async (type: 'upvote' | 'downvote') => {
        // Calculate optimistic values
        const currentVote = optimisticVote;
        let diff = 0;

        if (currentVote === type) {
            // Toggle off
            setOptimisticVote(null);
            diff = type === 'upvote' ? -1 : 1; // Remove upvote (-1) or Remove downvote (+1)
        } else {
            // Switch or Add
            setOptimisticVote(type);
            if (currentVote === 'upvote') {
                // Switching from up to down: -1 (remove up) -1 (add down)
                diff = -2;
            } else if (currentVote === 'downvote') {
                // Switching from down to up: +1 (remove down) +1 (add up)
                diff = 2;
            } else {
                // No previous vote
                diff = type === 'upvote' ? 1 : -1;
            }
        }

        setOptimisticScore(prev => prev + diff);

        // Fire and forget (parent handles actual API and error revert if needed, 
        // but for this component we just show immediate feedback)
        await onVote(type);
    }, [optimisticVote, onVote]);

    // Icon sizes
    const iconSize = size === 'sm' ? 16 : 20;
    const padding = size === 'sm' ? '4px 8px' : '6px 10px';
    const fontSize = size === 'sm' ? '0.8rem' : '0.9rem';

    return (
        <div style={{
            display: 'flex',
            flexDirection: orientation === 'vertical' ? 'column' : 'row',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '24px',
            border: '1px solid var(--color-grid)',
            overflow: 'hidden'
        }}>
            <button
                onClick={(e) => { e.stopPropagation(); handleVote('upvote'); }}
                style={{
                    background: 'transparent',
                    border: 'none',
                    padding: padding,
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: optimisticVote === 'upvote' ? '#ff4500' : 'var(--color-text-muted)',
                    transition: 'all 0.2s',
                    outline: 'none'
                }}
            >
                <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill={optimisticVote === 'upvote' ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
            </button>

            <span style={{
                fontWeight: 700,
                fontSize: fontSize,
                minWidth: '24px',
                textAlign: 'center',
                color: optimisticVote === 'upvote' ? '#ff4500' : optimisticVote === 'downvote' ? '#7193ff' : 'var(--color-fg)',
                padding: orientation === 'vertical' ? '4px 0' : '0 4px',
                userSelect: 'none'
            }}>
                {optimisticScore}
            </span>

            <button
                onClick={(e) => { e.stopPropagation(); handleVote('downvote'); }}
                style={{
                    background: 'transparent',
                    border: 'none',
                    padding: padding,
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: optimisticVote === 'downvote' ? '#7193ff' : 'var(--color-text-muted)',
                    transition: 'all 0.2s',
                    outline: 'none'
                }}
            >
                <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill={optimisticVote === 'downvote' ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
            </button>
        </div>
    );
};

export default VoteButtons;
