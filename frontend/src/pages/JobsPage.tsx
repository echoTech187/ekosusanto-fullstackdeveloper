import React, { useState, useEffect } from 'react';
import { Job, Application } from '../types';
import { JobCard } from '../components/JobCard';
import { JobDetailModal } from '../components/JobDetailModal';
import { JobCardSkeleton } from '../components/SkeletonLoader';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { Search, Filter, Briefcase, Zap } from 'lucide-react';

export const JobsPage: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [search, setSearch] = useState('');
  const [jobType, setJobType] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/jobs', {
        params: {
          search: search.trim() || undefined,
          jobType: jobType !== 'ALL' ? jobType : undefined,
        },
      });
      setJobs(res.data.data);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    if (!user || user.role !== 'JOB_SEEKER') {
      setAppliedJobIds(new Set());
      return;
    }
    try {
      const res = await api.get('/applications/my-applications');
      const ids = new Set<string>(res.data.data.map((app: Application) => app.jobId));
      setAppliedJobIds(ids);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [search, jobType]);

  useEffect(() => {
    fetchMyApplications();
  }, [user]);

  const handleAppliedSuccess = () => {
    fetchMyApplications();
    fetchJobs();
  };

  return (
    <div>
      {/* Header Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">
          Temukan Karir Impian Anda di <span style={{ color: '#38bdf8' }}>E-Loker.com</span>
        </h1>
        <p className="hero-subtitle">
          Eksplorasi ribuan kesempatan kerja dari perusahaan terkemuka Indonesia.
        </p>
      </div>

      {/* Responsive Filter and Search Bar */}
      <div className="search-filter-container">
        <div className="search-input-wrapper">
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.75rem' }}
            placeholder="Cari judul pekerjaan, perusahaan, atau lokasi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-select-wrapper">
          <Filter size={18} color="#38bdf8" />
          <select
            className="form-select"
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
          >
            <option value="ALL">Semua Tipe Kerja</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Contract">Contract</option>
          </select>
        </div>
      </div>

      {/* Lazy Loading Skeleton Loader or Job Cards */}
      {loading ? (
        <div className="grid-cards">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <JobCardSkeleton key={idx} />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
          <Briefcase size={48} color="#64748b" style={{ marginBottom: '1rem' }} />
          <h3 style={{ color: '#f8fafc', fontWeight: 700 }}>Tidak ada lowongan ditemukan</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Coba ubah kata kunci pencarian atau filter tipe pekerjaan.
          </p>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', color: '#64748b', fontSize: '0.8rem' }}>
            <span>Menampilkan {jobs.length} lowongan pekerjaan</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#10b981', fontWeight: 600 }}>
              <Zap size={14} /> Lazy Loading Aktif
            </span>
          </div>

          <div className="grid-cards">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isApplied={appliedJobIds.has(job.id)}
                onSelect={(selected) => setSelectedJob(selected)}
              />
            ))}
          </div>
        </>
      )}

      {/* Modal Detail */}
      <JobDetailModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        isApplied={selectedJob ? appliedJobIds.has(selectedJob.id) : false}
        onAppliedSuccess={handleAppliedSuccess}
      />
    </div>
  );
};
