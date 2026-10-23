import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Sparkles,
  GitCompare,
  GraduationCap,
  Briefcase,
  User,
  ShieldCheck,
  Home,
  LogOut,
  ChevronRight,
  TrendingUp,
  Building2,
  Users,
} from 'lucide-react';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const {
    activeTab,
    setActiveTab,
    userRole,
    setUserRole,
    currentStudent,
    applications,
    opportunities,
    logout,
    placementReadinessScore,
  } = useApp();

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    onCloseMobile();
  };

  const pendingAppsCount = applications.filter(
    (a) => a.status !== 'Selected' && a.status !== 'Rejected'
  ).length;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="px-5 py-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-tight leading-tight">
                Placement System
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                AI Career Portal
              </div>
            </div>
          </div>
        </div>

        {/* Role Switcher Mode Bar */}
        <div className="px-4 py-3 border-b border-slate-800/80 bg-slate-950/40">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Current Workspace
          </div>
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-800/70 rounded-lg text-xs font-medium">
            <button
              onClick={() => {
                setUserRole('student');
                if (activeTab === 'admin') setActiveTab('dashboard');
              }}
              className={`py-1.5 px-2 rounded-md transition-colors ${
                userRole === 'student'
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => {
                setUserRole('admin');
                setActiveTab('admin');
              }}
              className={`py-1.5 px-2 rounded-md transition-colors ${
                userRole === 'admin'
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Admin / TPO
            </button>
          </div>
        </div>

        {/* Main Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Public / Landing Section */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Overview
            </div>
            <button
              onClick={() => handleNavClick('landing')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'landing'
                  ? 'bg-blue-600/15 text-blue-400 font-semibold'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Home className="w-4 h-4 shrink-0" />
              <span>Landing Page</span>
            </button>
          </div>

          {/* Student Portal Navigation */}
          {userRole === 'student' && (
            <div>
              <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Student Features
              </div>
              <nav className="space-y-1">
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'dashboard'
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className="w-4 h-4 shrink-0" />
                    <span>Dashboard</span>
                  </div>
                  <span className="text-[11px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                    {placementReadinessScore}%
                  </span>
                </button>

                <button
                  onClick={() => handleNavClick('recommendations')}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'recommendations'
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>AI Recommendations</span>
                  </div>
                  <span className="text-[11px] bg-blue-950 text-blue-300 border border-blue-800/60 px-1.5 py-0.5 rounded">
                    {opportunities.length}
                  </span>
                </button>

                <button
                  onClick={() => handleNavClick('skill-gap')}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'skill-gap'
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <GitCompare className="w-4 h-4 shrink-0" />
                  <span>Skill Gap Analysis</span>
                </button>

                <button
                  onClick={() => handleNavClick('readiness')}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'readiness'
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 shrink-0" />
                  <span>Readiness Score</span>
                </button>

                <button
                  onClick={() => handleNavClick('applications')}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'applications'
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4 shrink-0" />
                    <span>Application Tracker</span>
                  </div>
                  {pendingAppsCount > 0 && (
                    <span className="text-[11px] bg-emerald-900/80 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
                      {pendingAppsCount} Active
                    </span>
                  )}
                </button>

                <button
                  onClick={() => handleNavClick('profile')}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4 shrink-0" />
                  <span>Student Profile</span>
                </button>
              </nav>
            </div>
          )}

          {/* Placement Officer / Admin Section */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Placement Cell
            </div>
            <nav className="space-y-1">
              <button
                onClick={() => {
                  setUserRole('admin');
                  handleNavClick('admin');
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'admin'
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Admin Dashboard</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">TPO</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Student Profile Card Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                <img
                  src={
                    userRole === 'student'
                      ? currentStudent.avatarUrl || '/src/assets/images/student_avatar_main_1792780655897.jpg'
                      : '/src/assets/images/placement_officer_avatar_1792780655390.jpg'
                  }
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-white truncate">
                  {userRole === 'student' ? currentStudent.fullName : 'Dr. Radhika Menon'}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {userRole === 'student'
                    ? `${currentStudent.branch.split(' ')[0]} · CGPA ${currentStudent.cgpa}`
                    : 'Placement Director'}
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
