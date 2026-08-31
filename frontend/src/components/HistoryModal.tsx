import React from 'react';
import { Application } from '../types';
import { StatusBadge } from './StatusBadge';
import { X, Clock, FileText } from 'lucide-react';

interface HistoryModalProps {
  application: Application | null;
  onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ application, onClose }) => {
  if (!application) return null;

  const jobTitle = application.job?.title;
  const companyName = application.job?.companyName;
  const subtitle = jobTitle ? (companyName ? `${jobTitle} • ${companyName}` : jobTitle) : null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-box">
            <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock color="#38bdf8" size={22} /> Riwayat Perubahan Status
            </h2>
            {subtitle && (
              <div style={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: 600, marginTop: '0.2rem' }}>
                {subtitle}
              </div>
            )}
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Tutup Modal">
            <X size={20} />
          </button>
        </div>

        <div style={{ background: '#0f172a', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #334155', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Pelamar</div>
            <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.9rem' }}>{application.seeker?.name || 'Job Seeker'}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'right' }}>Status Saat Ini</div>
            <StatusBadge status={application.status} />
          </div>
        </div>

        <h4 style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
          <FileText size={16} color="#38bdf8" /> Timeline Aktivitas Audit
        </h4>

        {application.histories && application.histories.length > 0 ? (
          <div className="timeline">
            {application.histories.map((history) => (
              <div className="timeline-item" key={history.id}>
                <div className="timeline-dot" />
                <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '0.75rem 0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {history.fromStatus && (
                        <>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{history.fromStatus}</span>
                          <span style={{ color: '#64748b' }}>➔</span>
                        </>
                      )}
                      <StatusBadge status={history.toStatus} />
                    </div>
                    <span style={{ fontSize: '0.725rem', color: '#64748b' }}>
                      {new Date(history.createdAt).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  {history.notes && (
                    <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '0.35rem', background: '#0f172a', padding: '0.45rem 0.65rem', borderRadius: '4px', borderLeft: '3px solid #0284c7' }}>
                      💬 {history.notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#64748b', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>
            Belum ada catatan riwayat perubahan status.
          </p>
        )}

        <div className="modal-footer-actions">
          <button className="btn-secondary" onClick={onClose}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
