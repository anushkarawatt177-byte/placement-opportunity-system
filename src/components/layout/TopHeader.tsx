import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Bell,
  Search,
  Sparkles,
  CheckCircle,
  ExternalLink,
  ChevronDown,
  UserCheck,
  Shield,
  Briefcase,
  X,
} from 'lucide-react';

interface TopHeaderProps {
  onOpenMobileMenu: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenMobileMenu }) => {
  const {
    activeTab,
    setActiveTab,
    userRole,
    setUserRole,
    currentStudent,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    loginAsDemoStudent,
    loginAsDemoAdmin,
    setShowAuthModal,
    setAuthModalMode,
    isAuthenticated,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (demoRef.current && !demoRef.current.contains(e.target as Node)) {
        setShowDemoMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getBreadcrumbLabel = () => {
    switch (activeTab) {
      case 'landing':
        return 'Overview · Welcome';
      case 'dashboard':
        return 'Student Portal · Dashboard';
      case 'recommendations':
        return 'AI Match Engine · Job Recommendations';
      case 'skill-gap':
        return 'Career Analytics · Skill Gap Analysis';
      case 'readiness':
        return 'Evaluation · Placement Readiness Score';
      case 'applications':
        return 'Recruitment Pipeline · Application Tracker';
      case 'profile':
        return 'Student Profile · Resume & Skills';
      case 'admin':
        return 'Placement Office · Officer Dashboard';
      default:
        return 'Placement Opportunity Recommendation System';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile menu button & breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-600 truncate">
          <span className="text-slate-400 hidden sm:inline">NIT Campus Placements</span>
          <span className="text-slate-300 hidden sm:inline">/</span>
          <span className="text-slate-900 font-semibold truncate">{getBreadcrumbLabel()}</span>
        </div>
      </div>

      {/* Right Action Zone */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Quick Demo Persona Switcher Dropdown */}
        <div className="relative" ref={demoRef}>
          <button
            onClick={() => setShowDemoMenu(!showDemoMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 whitespace-nowrap"
          >
            {userRole === 'student' ? (
              <>
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden md:inline">Demo Student:</span>
                <span className="font-bold text-slate-900">{currentStudent.fullName.split(' ')[0]}</span>
              </>
            ) : (
              <>
                <Shield className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden md:inline">Demo:</span>
                <span className="font-bold text-slate-900">Placement Officer</span>
              </>
            )}
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showDemoMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 text-xs">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Switch Demo Profile
              </div>

              <button
                onClick={() => {
                  loginAsDemoStudent('std_101');
                  setShowDemoMenu(false);
                }}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-slate-900">Ananya Sharma</div>
                  <div className="text-[11px] text-slate-500">CSE · 8.82 CGPA · SDE Aspirant</div>
                </div>
                {userRole === 'student' && currentStudent.id === 'std_101' && (
                  <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                )}
              </button>

              <button
                onClick={() => {
                  loginAsDemoStudent('std_102');
                  setShowDemoMenu(false);
                }}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-slate-900">Rohan Mehta</div>
                  <div className="text-[11px] text-slate-500">IT · 9.15 CGPA · ML & SDE Aspirant</div>
                </div>
                {userRole === 'student' && currentStudent.id === 'std_102' && (
                  <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                )}
              </button>

              <div className="border-t border-slate-100 my-1" />

              <button
                onClick={() => {
                  loginAsDemoAdmin();
                  setShowDemoMenu(false);
                }}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-slate-900">Dr. Radhika Menon</div>
                  <div className="text-[11px] text-slate-500">Head of Training & Placement Cell</div>
                </div>
                {userRole === 'admin' && (
                  <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-700 rounded-full font-mono">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={`p-3.5 hover:bg-slate-50/80 transition-colors cursor-pointer ${
                        !notif.read ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-xs font-semibold text-slate-900">
                          {notif.title}
                        </div>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap font-mono">
                          {notif.timestamp}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                        {notif.message}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    setActiveTab('applications');
                    setShowNotifications(false);
                  }}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  View Application Pipeline →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Explore Opportunities Quick CTA (if on landing page) */}
        {activeTab === 'landing' ? (
          <button
            onClick={() => setActiveTab('recommendations')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Find Opportunities</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('recommendations')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Matches</span>
          </button>
        )}
      </div>
    </header>
  );
};
