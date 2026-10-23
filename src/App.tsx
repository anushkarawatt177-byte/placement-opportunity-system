import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { ToastContainer } from './components/common/ToastContainer';
import { AuthModal } from './components/modals/AuthModal';
import { JobDetailsModal } from './components/modals/JobDetailsModal';

// Views
import { LandingPage } from './components/views/LandingPage';
import { StudentDashboard } from './components/views/StudentDashboard';
import { RecommendationsPage } from './components/views/RecommendationsPage';
import { SkillGapPage } from './components/views/SkillGapPage';
import { PlacementReadinessPage } from './components/views/PlacementReadinessPage';
import { ApplicationTrackerPage } from './components/views/ApplicationTrackerPage';
import { StudentProfilePage } from './components/views/StudentProfilePage';
import { AdminDashboardPage } from './components/views/AdminDashboardPage';

const MainLayout: React.FC = () => {
  const { activeTab, userRole } = useApp();
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage />;
      case 'dashboard':
        return <StudentDashboard />;
      case 'recommendations':
        return <RecommendationsPage />;
      case 'skill-gap':
        return <SkillGapPage />;
      case 'readiness':
        return <PlacementReadinessPage />;
      case 'applications':
        return <ApplicationTrackerPage />;
      case 'profile':
        return <StudentProfilePage />;
      case 'admin':
        return <AdminDashboardPage />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
      />

      {/* Main Content Area (offset by 16rem / 256px on lg screens) */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <TopHeader onOpenMobileMenu={() => setIsOpenMobile(true)} />

        {/* Viewport Content Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Modals & Toasts */}
      <AuthModal />
      <JobDetailsModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
