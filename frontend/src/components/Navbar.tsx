import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Briefcase, UserCheck, LogOut, PlusCircle, Building2, User, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openCreateModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, openCreateModal }) => {
  const { user, logout, demoLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: string) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="site-header">
      {/* Demo Switcher Banner */}
      <div className="demo-banner">
        <div className="demo-banner-title">
          📌 <strong>Uji Coba Penguji:</strong> Login instan tanpa ketik password!
        </div>
        <div className="demo-banner-buttons">
          <button type="button" className="demo-btn" onClick={() => demoLogin('JOB_SEEKER')}>
            🔑 Job Seeker (Budi)
          </button>
          <button type="button" className="demo-btn" onClick={() => demoLogin('COMPANY')}>
            🏢 Company (TechCorp)
          </button>
        </div>
      </div>

      <nav className="navbar">
        <div className="navbar-inner">
          <div className="brand" onClick={() => handleNavClick('jobs')}>
            <Briefcase color="#38bdf8" size={24} />
            <span>E-Loker<strong>.com</strong></span>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={22} color="#f8fafc" /> : <Menu size={22} color="#f8fafc" />}
          </button>

          {/* Navigation Links / Mobile Drawer */}
          <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            {/* User Profile Card (Visible on Mobile inside drawer when logged in) */}
            {user && (
              <div className="mobile-user-card">
                <div className="mobile-user-avatar">
                  {user.role === 'COMPANY' ? '🏢' : '👨‍💻'}
                </div>
                <div className="mobile-user-details">
                  <div className="mobile-user-name">{user.name}</div>
                  <div className="mobile-user-role">
                    {user.role === 'COMPANY' ? 'Akun Perusahaan' : 'Akun Pencari Kerja'}
                  </div>
                </div>
              </div>
            )}

            {/* Menu Items */}
            <div className="mobile-nav-items">
              <button
                type="button"
                className={`nav-btn ${currentTab === 'jobs' ? 'active' : ''}`}
                onClick={() => handleNavClick('jobs')}
              >
                <Briefcase size={18} />
                Daftar Lowongan
              </button>

              {user && user.role === 'JOB_SEEKER' && (
                <button
                  type="button"
                  className={`nav-btn ${currentTab === 'my-applications' ? 'active' : ''}`}
                  onClick={() => handleNavClick('my-applications')}
                >
                  <UserCheck size={18} />
                  Lamaran Saya
                </button>
              )}

              {user && user.role === 'COMPANY' && (
                <>
                  <button
                    type="button"
                    className={`nav-btn ${currentTab === 'company-dashboard' ? 'active' : ''}`}
                    onClick={() => handleNavClick('company-dashboard')}
                  >
                    <Building2 size={18} />
                    Dashboard Perusahaan
                  </button>
                  {openCreateModal && (
                    <button
                      type="button"
                      className="btn-primary mobile-create-btn"
                      onClick={() => {
                        openCreateModal();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <PlusCircle size={18} />
                      Buat Lowongan Baru
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Auth / Logout Section */}
            {user ? (
              <>
                <div className="desktop-user-info">
                  <div style={{ fontSize: '0.85rem' }}>
                    <div style={{ fontWeight: 700, color: '#f8fafc' }}>{user.name}</div>
                    <div style={{ color: '#38bdf8', fontSize: '0.75rem', fontWeight: 600 }}>
                      {user.role === 'COMPANY' ? '🏢 Perusahaan' : '👨‍💻 Pelamar'}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    title="Keluar"
                  >
                    <LogOut size={16} /> Keluar
                  </button>
                </div>

                <button
                  type="button"
                  className="btn-danger mobile-logout-btn"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut size={16} /> Keluar Akun
                </button>
              </>
            ) : (
              <div className="nav-auth-buttons">
                <button type="button" className="btn-secondary" onClick={() => handleNavClick('login')}>
                  <User size={16} /> Masuk
                </button>
                <button type="button" className="btn-primary" onClick={() => handleNavClick('register')}>
                  Daftar
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
