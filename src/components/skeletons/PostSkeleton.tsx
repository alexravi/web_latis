import React from 'react';

const PostSkeleton: React.FC = () => {
  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-grid)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '16px',
      }}
    >
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--color-grid)',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
        <div style={{ flex: 1 }}>
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
              height: '12px',
              width: '100px',
              background: 'var(--color-grid)',
              borderRadius: '4px',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
        </div>
      </div>
      <div
        style={{
          height: '16px',
          width: '100%',
          background: 'var(--color-grid)',
          borderRadius: '4px',
          marginBottom: '8px',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}
      />
      <div
        style={{
          height: '16px',
          width: '80%',
          background: 'var(--color-grid)',
          borderRadius: '4px',
          marginBottom: '16px',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}
      />
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              height: '24px',
              width: '80px',
              background: 'var(--color-grid)',
              borderRadius: '4px',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--color-grid)' }}>
        <div
          style={{
            height: '32px',
            width: '100px',
            background: 'var(--color-grid)',
            borderRadius: '16px',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
        <div
          style={{
            height: '32px',
            width: '80px',
            background: 'var(--color-grid)',
            borderRadius: '16px',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
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

export default PostSkeleton;
