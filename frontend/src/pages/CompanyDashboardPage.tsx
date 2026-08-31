import React, { useState, useEffect } from 'react';
import { Job, Application, ApplicationStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { HistoryModal } from '../components/HistoryModal';
import api from '../api/client';
import { Building2, Users, Clock, AlertCircle } from 'lucide-react';

interface CompanyDashboardPageProps {
  onOpenCreateJob: () => void;
}

export const CompanyDashboardPage: React.FC<CompanyDashboardPageProps> = ({ onOpenCreateJob }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<Application[]>([]);
  const [selectedAppForHistory, setSelectedAppForHistory] = useState<Application | null>(null);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [notes, setNotes] = useState<{ [appId: string]: string }>({});

  const fetchCompanyJobs = async () => {
    setLoadingJobs(true);
    try {
      const res = await api.get('/jobs/company');
      setJobs(res.data.data);
      if (res.data.data.length > 0 && !selectedJobId) {
        setSelectedJobId(res.data.data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch company jobs:', err);
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchCandidates = async (jobId: string) => {
    setLoadingCandidates(true);
    try {
      const res = await api.get(`/applications/job/${jobId}/candidates`);
      setCandidates(res.data.data);
    } catch (err) {
      console.error('Failed to fetch candidates:', err);
    } finally {
      setLoadingCandidates(false);
    }
  };

  useEffect(() => {
    fetchCompanyJobs();
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      fetchCandidates(selectedJobId);
    }
  }, [selectedJobId]);

  const handleStatusChange = async (appId: string, newStatus: ApplicationStatus) => {
    setUpdatingStatusId(appId);
    try {
      await api.patch(`/applications/${appId}/status`, {
        status: newStatus,
        notes: notes[appId] || `Status diubah oleh HR menjadi ${newStatus}`,
      });
      if (selectedJobId) {
        fetchCandidates(selectedJobId);
      }
      fetchCompanyJobs();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal mengubah status kandidat.');
    } finally {
      setUpdatingStatusId(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Building2 color="#38bdf8" size={32} /> Dashboard Perusahaan
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Kelola lowongan pekerjaan dan pantau lamaran kandidat.
          </p>
        </div>
        <button className="btn-primary" onClick={onOpenCreateJob}>
          + Buat Lowongan Baru
        </button>
      </div>

      {loadingJobs ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
          🔄 Memuat lowongan perusahaan...
        </div>
      ) : jobs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
          <Building2 size={48} color="#64748b" style={{ marginBottom: '1rem' }} />
          <h3 style={{ color: '#f8fafc', fontWeight: 700 }}>Belum Ada Lowongan Pekerjaan</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem', marginBottom: '1.5rem' }}>
            Perusahaan Anda belum mempublikasikan lowongan pekerjaan.
          </p>
          <button className="btn-primary" onClick={onOpenCreateJob}>
            Buat Lowongan Pertama
          </button>
        </div>
      ) : (
        <div className="company-dashboard-grid">
          {/* Left Column: Job Selector List */}
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.75rem' }}>
              Daftar Lowongan ({jobs.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {jobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => setSelectedJobId(job.id)}
                  style={{
                    background: selectedJobId === job.id ? 'rgba(2, 132, 199, 0.15)' : '#1e293b',
                    border: `1px solid ${selectedJobId === job.id ? '#0284c7' : '#334155'}`,
                    borderRadius: '8px',
                    padding: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ fontWeight: 700, color: selectedJobId === job.id ? '#38bdf8' : '#f8fafc', fontSize: '0.95rem' }}>
                    {job.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{job.jobType}</span>
                    <span style={{ color: '#38bdf8', fontWeight: 600 }}>{job._count?.applications || 0} Pelamar</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Candidate Applications Table */}
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} color="#38bdf8" /> Kandidat Melamar
            </h3>

            {loadingCandidates ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                🔄 Memuat daftar kandidat...
              </div>
            ) : candidates.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', background: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
                <AlertCircle size={36} color="#64748b" style={{ marginBottom: '0.5rem' }} />
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                  Belum ada kandidat yang melamar pada lowongan ini.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {candidates.map((app) => (
                  <div key={app.id} className="card" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>{app.seeker?.name}</h4>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{app.seeker?.email}</div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <StatusBadge status={app.status} />
                        <button
                          className="btn-secondary"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                          onClick={() => setSelectedAppForHistory(app)}
                        >
                          <Clock size={14} /> Audit History
                        </button>
                      </div>
                    </div>

                    {/* Status Changer Form */}
                    <div style={{ background: '#0f172a', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #334155' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.5rem' }}>
                        Ubah Status & Tambahkan Catatan HR:
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <input
                          type="text"
                          className="form-input"
                          style={{ fontSize: '0.85rem', padding: '0.4rem 0.75rem' }}
                          placeholder="Catatan HR (Opsional, contoh: Lolos seleksi berkas)"
                          value={notes[app.id] || ''}
                          onChange={(e) => setNotes({ ...notes, [app.id]: e.target.value })}
                        />
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {(['APPLIED', 'REVIEWING', 'SHORTLISTED', 'REJECTED', 'ACCEPTED'] as ApplicationStatus[]).map((st) => (
                          <button
                            key={st}
                            className="btn-secondary"
                            disabled={updatingStatusId === app.id || app.status === st}
                            style={{
                              fontSize: '0.75rem',
                              padding: '0.3rem 0.6rem',
                              opacity: app.status === st ? 0.5 : 1,
                              borderColor: app.status === st ? '#0284c7' : '#475569',
                            }}
                            onClick={() => handleStatusChange(app.id, st)}
                          >
                            Set {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Audit History Modal */}
      <HistoryModal
        application={selectedAppForHistory}
        onClose={() => setSelectedAppForHistory(null)}
      />
    </div>
  );
};
