import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import api from '../api/client';
import { UserPlus, AlertCircle } from 'lucide-react';

interface RegisterPageProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSuccess, onSwitchToLogin }) => {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('JOB_SEEKER');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password,
        role,
      });
      login(res.data.data.token, res.data.data.user);
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Registrasi gagal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '3rem auto' }}>
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: '50%', background: 'rgba(2, 132, 199, 0.15)', color: '#38bdf8', marginBottom: '0.75rem' }}>
            <UserPlus size={28} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>Daftar Akun Baru</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Bergabunglah dengan E-Loker.com sebagai Pencari Kerja atau Perusahaan.
          </p>
        </div>

        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
            <AlertCircle size={18} /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tipe Akun</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                className={`btn-secondary ${role === 'JOB_SEEKER' ? 'active' : ''}`}
                style={{
                  justifyContent: 'center',
                  borderColor: role === 'JOB_SEEKER' ? '#0284c7' : '#475569',
                  background: role === 'JOB_SEEKER' ? 'rgba(2, 132, 199, 0.2)' : '#1e293b',
                  color: role === 'JOB_SEEKER' ? '#38bdf8' : '#94a3b8'
                }}
                onClick={() => setRole('JOB_SEEKER')}
              >
                👨‍💻 Job Seeker
              </button>
              <button
                type="button"
                className={`btn-secondary ${role === 'COMPANY' ? 'active' : ''}`}
                style={{
                  justifyContent: 'center',
                  borderColor: role === 'COMPANY' ? '#0284c7' : '#475569',
                  background: role === 'COMPANY' ? 'rgba(2, 132, 199, 0.2)' : '#1e293b',
                  color: role === 'COMPANY' ? '#38bdf8' : '#94a3b8'
                }}
                onClick={() => setRole('COMPANY')}
              >
                🏢 Company
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{role === 'COMPANY' ? 'Nama Perusahaan' : 'Nama Lengkap'}</label>
            <input
              type="text"
              className="form-input"
              placeholder={role === 'COMPANY' ? 'PT Teknologi Bersama' : 'Budi Santoso'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Alamat Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Mendaftar...' : 'Buat Akun Sekarang'}
          </button>
        </form>

        <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.85rem', color: '#94a3b8' }}>
          Sudah punya akun?{' '}
          <button
            onClick={onSwitchToLogin}
            style={{ background: 'none', border: 'none', color: '#38bdf8', fontWeight: 700, cursor: 'pointer' }}
          >
            Masuk disini
          </button>
        </div>
      </div>
    </div>
  );
};
