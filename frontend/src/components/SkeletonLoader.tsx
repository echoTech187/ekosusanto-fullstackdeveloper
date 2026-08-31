import React from 'react';

export const JobCardSkeleton: React.FC = () => {
  return (
    <div className="card skeleton-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div className="skeleton-line" style={{ width: '65%', height: '22px' }} />
        <div className="skeleton-line" style={{ width: '70px', height: '20px', borderRadius: '12px' }} />
      </div>
      <div className="skeleton-line" style={{ width: '40%', height: '16px', marginBottom: '0.85rem' }} />
      <div className="skeleton-line" style={{ width: '35%', height: '14px', marginBottom: '0.4rem' }} />
      <div className="skeleton-line" style={{ width: '50%', height: '14px', marginBottom: '1.25rem' }} />
      <div className="skeleton-line" style={{ width: '100%', height: '36px', marginBottom: '1.25rem' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid #334155' }}>
        <div className="skeleton-line" style={{ width: '70px', height: '18px' }} />
        <div className="skeleton-line" style={{ width: '90px', height: '32px', borderRadius: '6px' }} />
      </div>
    </div>
  );
};

export const PageLoadingFallback: React.FC = () => {
  return (
    <div style={{ padding: '3rem 1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <div className="skeleton-spinner" />
      <div style={{ color: '#38bdf8', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.02em' }}>
        ⚡ Memuat halaman (Lazy Loading)...
      </div>
    </div>
  );
};
