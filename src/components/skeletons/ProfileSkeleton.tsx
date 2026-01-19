import React from 'react';

const ProfileSkeleton: React.FC = () => {
  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-grid)',
        borderRadius: '16px',
        padding: '24px',
      }}
    >
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <div
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'var(--color-grid)',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
        <div style={{ flex: 1 }}>
          <div
            style={{
              height: '24px',
              width: '200px',
              background: 'var(--color-grid)',
              borderRadius: '4px',
              marginBottom: '12px',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
          <div
            style={{
              height: '16px',
              width: '150px',
              background: 'var(--color-grid)',
              borderRadius: '4px',
              marginBottom: '8px',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
          <div
            style={{
              height: '16px',
              width: '180px',
              background: 'var(--color-grid)',
              borderRadius: '4px',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
        </div>
      </div>
      <div style={{ borderTop: '1px solid var(--color-grid)', paddingTop: '24px' }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              height: '16px',
              width: '100%',
              background: 'var(--color-grid)',
              borderRadius: '4px',
              marginBottom: '12px',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default ProfileSkeleton;
