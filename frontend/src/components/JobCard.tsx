import React from 'react';
import { Job } from '../types';
import { MapPin, DollarSign, Building } from 'lucide-react';

interface JobCardProps {
  job: Job;
  onSelect: (job: Job) => void;
  isApplied?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onSelect, isApplied }) => {
  return (
    <div className="card">
      <div>
        <div className="card-header">
          <h3 className="card-title">{job.title}</h3>
          <span className="badge card-badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
            {job.jobType}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.85rem' }}>
          <Building size={16} color="#94a3b8" />
          <strong style={{ color: '#cbd5e1' }}>{job.companyName}</strong>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={15} color="#38bdf8" />
            <span>{job.location}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <DollarSign size={15} color="#10b981" />
            <span style={{ color: '#34d399', fontWeight: 600 }}>{job.salary}</span>
          </div>
        </div>

        <p style={{
          color: '#94a3b8',
          fontSize: '0.85rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          marginBottom: '1.25rem',
          lineHeight: '1.45'
        }}>
          {job.description}
        </p>
      </div>

      <div className="card-footer">
        {isApplied ? (
          <span className="badge status-applied">
            ✓ Sudah Dilamar
          </span>
        ) : (
          <span className="applicant-count">
            👥 {job._count?.applications || 0} Pelamar
          </span>
        )}

        <button className="btn-primary card-action-btn" onClick={() => onSelect(job)}>
          Lihat Detail
        </button>
      </div>
    </div>
  );
};
