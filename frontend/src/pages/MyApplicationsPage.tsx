import React, { useState, useEffect } from 'react';
import { Application, Job } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { HistoryModal } from '../components/HistoryModal';
import { JobDetailModal } from '../components/JobDetailModal';
import api from '../api/client';
import { UserCheck, Building, MapPin, DollarSign, Clock, FileText, ExternalLink } from 'lucide-react';

export const MyApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/applications/my-applications');
      if (Array.isArray(res.data?.data)) {
        setApplications(res.data.data);
      } else if (Array.isArray(res.data)) {
        setApplications(res.data);
      } else {
        setApplications([]);
      }
    } catch (err) {
      console.error('Failed to fetch my applications:', err);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const safeApps = Array.isArray(applications) ? applications : [];

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <UserCheck color="#38bdf8" size={32} /> Pekerjaan Yang Saya Lamar
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '0.25rem' }}>
          Pantau progres lamaran dan riwayat pembaruan status secara real-time.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
          🔄 Memuat daftar lamaran...
        </div>
      ) : safeApps.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
          <FileText size={48} color="#64748b" style={{ marginBottom: '1rem' }} />
          <h3 style={{ color: '#f8fafc', fontWeight: 700 }}>Belum Ada Lamaran Pekerjaan</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Anda belum melamar pekerjaan apapun. Silahkan cari lowongan menarik di daftar pekerjaan!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {safeApps.map((app) => (
            <div key={app.id} className="card application-card-row">
              <div style={{ flex: 1, minWidth: '220px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                  <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                    {app.job?.jobType}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Dilamar pada: {new Date(app.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                {/* Clickable Job Title */}
                <h3
                  className="job-title-clickable"
                  onClick={() => app.job && setSelectedJob(app.job)}
                  title="Klik untuk melihat detail lowongan"
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: '#f8fafc',
                    marginBottom: '0.4rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  {app.job?.title} <ExternalLink size={14} color="#38bdf8" />
                </h3>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#cbd5e1', fontWeight: 600 }}>
                    <Building size={14} color="#38bdf8" /> {app.job?.companyName}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={14} color="#38bdf8" /> {app.job?.location}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#34d399', fontWeight: 600 }}>
                    <DollarSign size={14} color="#10b981" /> {app.job?.salary}
                  </span>
                </div>
              </div>

              <div className="application-card-actions">
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Status Lamaran</div>
                  <StatusBadge status={app.status} />
                </div>

                <button
                  className="btn-secondary"
                  style={{ fontSize: '0.85rem', padding: '0.5rem 0.9rem' }}
                  onClick={() => setSelectedApp(app)}
                >
                  <Clock size={16} /> Timeline Riwayat
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Job Detail Modal */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          isApplied={true}
          onAppliedSuccess={fetchApplications}
        />
      )}

      {/* History Timeline Modal */}
      {selectedApp && (
        <HistoryModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}
    </div>
  );
};
