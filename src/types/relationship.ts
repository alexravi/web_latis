export interface RelationshipStatus {
    isConnected: boolean;
    connectionStatus: 'pending' | 'connected' | null;
    connectionRequesterId: number | null;
    connectionPending: boolean;
    iFollowThem: boolean;
    theyFollowMe: boolean;
    iBlocked: boolean;
    blockedMe: boolean;
}
