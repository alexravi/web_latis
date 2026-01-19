import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: '#ff6b6b',
        color: 'white',
        padding: '12px 24px',
        textAlign: 'center',
        zIndex: 10000,
        fontSize: '0.9rem',
        fontWeight: 600,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      ⚠️ You are currently offline. Some features may be unavailable.
    </div>
  );
};

export default OfflineBanner;
