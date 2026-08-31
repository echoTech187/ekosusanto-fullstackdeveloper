import React, { useState } from 'react';
import { Job } from '../types';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { MapPin, DollarSign, Building, X, CheckCircle, AlertCircle } from 'lucide-react';

interface JobDetailModalProps {
  job: Job | null;
  onClose: () => void;
  isApplied: boolean;
  onAppliedSuccess: () => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  onClose,
  isApplied,
  onAppliedSuccess,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!job) return null;

  const handleApply = async () => {
    if (!user) {
      setErrorMsg('Silahkan login terlebih dahulu sebagai Job Seeker untuk melamar.');
      return;
    }

    if (user.role !== 'JOB_SEEKER') {
      setErrorMsg('Hanya akun Job Seeker yang dapat melamar pekerjaan.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await api.post('/applications/apply', { jobId: job.id });
      setSuccessMsg('Selamat! Lamaran Anda telah berhasil dikirim.');
      onAppliedSuccess();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Gagal mengirim lamaran.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-box">
            <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
              {job.jobType}
            </span>
            <h2 className="modal-title">{job.title}</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Tutup Modal">
            <X size={20} />
          </button>
        </div>

        {/* Info Card */}
        <div className="modal-info-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#f8fafc', fontSize: '0.95rem' }}>
            <Building size={18} color="#38bdf8" /> {job.companyName}
          </div>
          <div className="modal-info-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={16} color="#38bdf8" /> <span>{job.location}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <DollarSign size={16} color="#10b981" /> <span style={{ color: '#34d399', fontWeight: 600 }}>{job.salary}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '1.25rem' }}>
          <h4 style={{ color: '#cbd5e1', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.95rem' }}>Deskripsi Pekerjaan</h4>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
            {job.description}
          </p>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', padding: '0.65rem 0.85rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            <AlertCircle size={18} /> {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', padding: '0.65rem 0.85rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            <CheckCircle size={18} /> {successMsg}
          </div>
        )}

        {/* Modal Actions */}
        <div className="modal-footer-actions">
          <button className="btn-secondary" onClick={onClose}>
            Tutup
          </button>

          {isApplied ? (
            <button className="btn-secondary" disabled style={{ opacity: 0.7, cursor: 'not-allowed', borderColor: '#3b82f6', color: '#60a5fa' }}>
              ✓ Sudah Dilamar
            </button>
          ) : user && user.role === 'JOB_SEEKER' ? (
            <button className="btn-primary" onClick={handleApply} disabled={loading}>
              {loading ? 'Mengirim...' : 'Lamar Pekerjaan Sekarang'}
            </button>
          ) : !user ? (
            <button className="btn-primary" onClick={handleApply}>
              Login Untuk Melamar
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
