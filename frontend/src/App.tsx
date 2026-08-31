import React, { useState, lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { PageLoadingFallback } from './components/SkeletonLoader';

// Lazy-Loaded Page Components (Code Splitting)
const JobsPage = lazy(() => import('./pages/JobsPage').then((m) => ({ default: m.JobsPage })));
const MyApplicationsPage = lazy(() => import('./pages/MyApplicationsPage').then((m) => ({ default: m.MyApplicationsPage })));
const CompanyDashboardPage = lazy(() => import('./pages/CompanyDashboardPage').then((m) => ({ default: m.CompanyDashboardPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then((m) => ({ default: m.RegisterPage })));

// Lazy-Loaded Modal Component
const CreateJobModal = lazy(() => import('./components/CreateJobModal').then((m) => ({ default: m.CreateJobModal })));

const MainApp: React.FC = () => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('jobs');
  const [isCreateJobOpen, setIsCreateJobOpen] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const renderContent = () => {
    switch (currentTab) {
      case 'jobs':
        return <JobsPage key={refreshKey} />;
      case 'my-applications':
        return user?.role === 'JOB_SEEKER' ? <MyApplicationsPage /> : <JobsPage />;
      case 'company-dashboard':
        return user?.role === 'COMPANY' ? (
          <CompanyDashboardPage onOpenCreateJob={() => setIsCreateJobOpen(true)} />
        ) : (
          <JobsPage />
        );
      case 'login':
        return (
          <LoginPage
            onSuccess={() => setCurrentTab('jobs')}
            onSwitchToRegister={() => setCurrentTab('register')}
          />
        );
      case 'register':
        return (
          <RegisterPage
            onSuccess={() => setCurrentTab('jobs')}
            onSwitchToLogin={() => setCurrentTab('login')}
          />
        );
      default:
        return <JobsPage />;
    }
  };

  return (
    <div className="app-container">
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openCreateModal={() => setIsCreateJobOpen(true)}
      />

      <main className="main-content">
        <Suspense fallback={<PageLoadingFallback />}>
          {renderContent()}
        </Suspense>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #334155', padding: '1.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
        © 2026 IndoKerja.id - Platform Lowongan Kerja Terstruktur Indonesia.
      </footer>

      {/* Lazy-Loaded Modal Create Job */}
      {isCreateJobOpen && (
        <Suspense fallback={null}>
          <CreateJobModal
            onClose={() => setIsCreateJobOpen(false)}
            onSuccess={() => setRefreshKey((prev) => prev + 1)}
          />
        </Suspense>
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
};

export default App;
