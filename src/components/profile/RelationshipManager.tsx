import React, { useState } from 'react';
import type { RelationshipStatus } from '../../types/relationship';
import {
    sendConnectionRequest,
    acceptConnectionRequest,
    declineConnectionRequest,
    removeConnection,
    cancelConnectionRequest,
    followUser,
    unfollowUser,
    unblockUser
} from '../../services/relationshipService';
import toast from 'react-hot-toast';

interface RelationshipManagerProps {
    userId: number;
    initialRelationship?: RelationshipStatus;
    onUpdate?: () => void;
    layout?: 'profile' | 'card'; // 'profile' = full buttons, 'card' = compact/icon buttons
}

const RelationshipManager: React.FC<RelationshipManagerProps> = ({ userId, initialRelationship, onUpdate, layout = 'profile' }) => {
    // Local state to optimistic updates or manage simple transitions
    // However, since parent often controls data, we might just rely on props + local loading state
    const [isLoading, setIsLoading] = useState(false);
    const [relationship, setRelationship] = useState<RelationshipStatus | undefined>(initialRelationship);

    // Sync state if props change (optional, depends on if we want this component to own the state after init)
    React.useEffect(() => {
        setRelationship(initialRelationship);
    }, [initialRelationship]);

    const handleAction = async (actionFn: () => Promise<any>, successMessage: string) => {
        setIsLoading(true);
        try {
            await actionFn();
            toast.success(successMessage);
            if (onUpdate) onUpdate();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Action failed');
        } finally {
            setIsLoading(false);
        }
    };

    if (!relationship) {
        // Fallback or loading state if relationship data isn't ready
        return null;
    }

    // 1. Blocked States
    if (relationship.iBlocked) {
        return (
            <button
                onClick={() => handleAction(() => unblockUser(userId), 'Unblocked user')}
                className="btn-outline"
                disabled={isLoading}
                style={{ borderColor: '#ef4444', color: '#ef4444' }}
            >
                Unblock
            </button>
        );
    }

    if (relationship.blockedMe) {
        return (
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                Not available
            </span>
        );
    }

    // 2. Connected State
    if (relationship.isConnected) {
        return (
            <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-primary" style={{ borderRadius: '24px' }}>
                    Message
                </button>
                <button
                    className="btn-outline"
                    style={{ borderRadius: '24px' }}
                    onClick={() => {
                        if (window.confirm('Remove connection?')) {
                            handleAction(() => removeConnection(userId), 'Connection removed');
                        }
                    }}
                    disabled={isLoading}
                >
                    Remove
                </button>
                {/* Follow/Unfollow Toggle */}
                <button
                    className="btn-outline"
                    style={{ borderRadius: '24px', width: layout === 'card' ? '36px' : 'auto', padding: layout === 'card' ? '0' : '6px 16px' }}
                    onClick={() => {
                        if (relationship.iFollowThem) {
                            handleAction(() => unfollowUser(userId), 'Unfollowed');
                        } else {
                            handleAction(() => followUser(userId), 'Following');
                        }
                    }}
                    disabled={isLoading}
                >
                    {layout === 'card' ? (
                        relationship.iFollowThem ? '-' : '+'
                    ) : (
                        relationship.iFollowThem ? 'Unfollow' : 'Follow'
                    )}
                </button>
            </div>
        );
    }

    // 3. Pending Requests
    if (relationship.connectionPending) {
        if (relationship.connectionRequesterId === userId) {
            // THEY sent request to ME -> Accept/Decline
            return (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        className="btn-primary"
                        style={{ borderRadius: '24px' }}
                        onClick={() => handleAction(() => acceptConnectionRequest(userId), 'Connection accepted')}
                        disabled={isLoading}
                    >
                        Accept
                    </button>
                    <button
                        className="btn-outline"
                        style={{ borderRadius: '24px' }}
                        onClick={() => handleAction(() => declineConnectionRequest(userId), 'Request declined')}
                        disabled={isLoading}
                    >
                        Decline
                    </button>
                </div>
            );
        } else {
            // I sent request to THEM -> Cancel
            return (
                <button
                    className="btn-outline"
                    style={{ borderRadius: '24px', background: 'rgba(0,0,0,0.05)', border: 'none' }}
                    onClick={() => handleAction(() => cancelConnectionRequest(userId), 'Request cancelled')}
                    disabled={isLoading}
                >
                    Pending
                </button>
            );
        }
    }

    // 4. Default: Not connected
    return (
        <div style={{ display: 'flex', gap: '8px' }}>
            <button
                className="btn-primary"
                style={{ borderRadius: '24px', width: layout === 'profile' ? '100%' : 'auto' }}
                onClick={() => handleAction(() => sendConnectionRequest(userId), 'Connection request sent')}
                disabled={isLoading}
            >
                Connect
            </button>
            {/* Optional Follow button even if not connected */}
            {!relationship.iFollowThem && (
                <button
                    className="btn-outline"
                    style={{ borderRadius: '24px' }}
                    onClick={() => handleAction(() => followUser(userId), 'Following')}
                    disabled={isLoading}
                >
                    Follow
                </button>
            )}
        </div>
    );
};

export default RelationshipManager;
