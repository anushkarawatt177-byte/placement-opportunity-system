import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  StudentProfile,
  Opportunity,
  Application,
  SkillGapItem,
  PlacementNotification,
  UserRole,
  ApplicationStatus,
} from '../types';
import {
  DEFAULT_STUDENT_PROFILE,
  DEFAULT_OPPORTUNITIES,
  DEFAULT_APPLICATIONS,
  SKILL_LIBRARY,
  DEFAULT_NOTIFICATIONS,
  DEMO_STUDENT_PROFILES,
} from '../data/mockData';
import { calculateOverallReadiness } from '../services/recommendationEngine';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  currentStudent: StudentProfile;
  updateStudentProfile: (updates: Partial<StudentProfile>) => void;
  allStudents: StudentProfile[];
  opportunities: Opportunity[];
  addOpportunity: (opp: Omit<Opportunity, 'id'>) => void;
  updateOpportunity: (id: string, updates: Partial<Opportunity>) => void;
  applications: Application[];
  applyToOpportunity: (opportunity: Opportunity, customNote?: string) => boolean;
  updateApplicationStatus: (applicationId: string, newStatus: ApplicationStatus, note?: string) => void;
  addApplicationNote: (applicationId: string, note: string) => void;
  notifications: PlacementNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  skillLibrary: SkillGapItem[];
  updateSkillStatus: (skillName: string, status: 'Not Started' | 'In Progress' | 'Mastered') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authModalMode: 'login' | 'register' | 'forgot';
  setAuthModalMode: (mode: 'login' | 'register' | 'forgot') => void;
  selectedOpportunityForModal: Opportunity | null;
  setSelectedOpportunityForModal: (opp: Opportunity | null) => void;
  selectedJobForSkillGap: Opportunity | null;
  setSelectedJobForSkillGap: (opp: Opportunity | null) => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  loginAsDemoStudent: (studentId?: string) => void;
  loginAsDemoAdmin: () => void;
  logout: () => void;
  placementReadinessScore: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication & Role
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('prs_is_auth') !== 'false';
  });
  const [userRole, setUserRole] = useState<UserRole>(() => {
    return (localStorage.getItem('prs_role') as UserRole) || 'student';
  });

  // Current active navigation tab
  const [activeTab, setActiveTab] = useState<string>(() => {
    return localStorage.getItem('prs_active_tab') || 'dashboard';
  });

  // Modals & Navigation helpers
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [selectedOpportunityForModal, setSelectedOpportunityForModal] = useState<Opportunity | null>(null);
  const [selectedJobForSkillGap, setSelectedJobForSkillGap] = useState<Opportunity | null>(null);

  // Student Profile
  const [currentStudent, setCurrentStudent] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('prs_student_profile');
    return saved ? JSON.parse(saved) : DEFAULT_STUDENT_PROFILE;
  });

  // All registered students (for placement officers)
  const [allStudents, setAllStudents] = useState<StudentProfile[]>(() => {
    const saved = localStorage.getItem('prs_all_students');
    return saved ? JSON.parse(saved) : DEMO_STUDENT_PROFILES;
  });

  // Placement Opportunities
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    const saved = localStorage.getItem('prs_opportunities');
    return saved ? JSON.parse(saved) : DEFAULT_OPPORTUNITIES;
  });

  // Student Applications
  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('prs_applications');
    return saved ? JSON.parse(saved) : DEFAULT_APPLICATIONS;
  });

  // Notifications
  const [notifications, setNotifications] = useState<PlacementNotification[]>(() => {
    const saved = localStorage.getItem('prs_notifications');
    return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
  });

  // Skill Library
  const [skillLibrary, setSkillLibrary] = useState<SkillGapItem[]>(() => {
    const saved = localStorage.getItem('prs_skill_library');
    return saved ? JSON.parse(saved) : SKILL_LIBRARY;
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persistent storage synchronizer
  useEffect(() => {
    localStorage.setItem('prs_is_auth', String(isAuthenticated));
    localStorage.setItem('prs_role', userRole);
    localStorage.setItem('prs_active_tab', activeTab);
  }, [isAuthenticated, userRole, activeTab]);

  useEffect(() => {
    localStorage.setItem('prs_student_profile', JSON.stringify(currentStudent));
  }, [currentStudent]);

  useEffect(() => {
    localStorage.setItem('prs_opportunities', JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    localStorage.setItem('prs_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('prs_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('prs_skill_library', JSON.stringify(skillLibrary));
  }, [skillLibrary]);

  useEffect(() => {
    localStorage.setItem('prs_all_students', JSON.stringify(allStudents));
  }, [allStudents]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const updateStudentProfile = (updates: Partial<StudentProfile>) => {
    setCurrentStudent((prev) => {
      const updated = { ...prev, ...updates };
      // Also update in allStudents list
      setAllStudents((list) => list.map((s) => (s.id === updated.id ? updated : s)));
      return updated;
    });
    showToast('Profile information successfully saved.', 'success');
  };

  const addOpportunity = (oppData: Omit<Opportunity, 'id'>) => {
    const id = 'opp_' + Date.now();
    const newOpp: Opportunity = {
      ...oppData,
      id,
    };
    setOpportunities((prev) => [newOpp, ...prev]);
    showToast(`New recruitment drive for ${newOpp.company} published!`, 'success');

    // Notify students
    const newNotif: PlacementNotification = {
      id: 'notif_' + Date.now(),
      title: `New Drive: ${newOpp.company} (${newOpp.role})`,
      message: `Applications are now open for ${newOpp.role} offering ${newOpp.ctcLpa} LPA. Deadline: ${newOpp.applicationDeadline}.`,
      timestamp: 'Just now',
      read: false,
      type: 'drive',
      opportunityId: newOpp.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const updateOpportunity = (id: string, updates: Partial<Opportunity>) => {
    setOpportunities((prev) => prev.map((o) => (o.id === id ? { ...o, ...updates } : o)));
    showToast('Opportunity details updated.', 'success');
  };

  const applyToOpportunity = (opportunity: Opportunity, customNote?: string): boolean => {
    // Check if already applied
    const existing = applications.find(
      (a) => a.opportunityId === opportunity.id && a.studentId === currentStudent.id
    );
    if (existing) {
      showToast(`You have already applied to ${opportunity.company} for ${opportunity.role}.`, 'warning');
      return false;
    }

    const today = new Date().toISOString().split('T')[0];
    const newApp: Application = {
      id: 'app_' + Date.now(),
      studentId: currentStudent.id,
      opportunityId: opportunity.id,
      company: opportunity.company,
      role: opportunity.role,
      appliedDate: today,
      status: 'Applied',
      salaryLpa: opportunity.ctcLpa,
      location: opportunity.location,
      notes: customNote || `Applied via College AI Placement Recommendation Portal. CGPA: ${currentStudent.cgpa}.`,
      timeline: [
        {
          status: 'Applied',
          date: today,
          note: 'Application submitted successfully to placement cell repository.',
        },
      ],
    };

    setApplications((prev) => [newApp, ...prev]);

    // Add notification
    const newNotif: PlacementNotification = {
      id: 'notif_' + Date.now(),
      title: `Application Submitted: ${opportunity.company}`,
      message: `Your application for ${opportunity.role} has been received. Status: Applied.`,
      timestamp: 'Just now',
      read: false,
      type: 'drive',
      opportunityId: opportunity.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(`Application successfully submitted to ${opportunity.company}!`, 'success');
    return true;
  };

  const updateApplicationStatus = (
    applicationId: string,
    newStatus: ApplicationStatus,
    note?: string
  ) => {
    const today = new Date().toISOString().split('T')[0];
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== applicationId) return app;

        // If status moved to Selected, trigger confetti celebration!
        if (newStatus === 'Selected' && app.status !== 'Selected') {
          try {
            confetti({
              particleCount: 120,
              spread: 80,
              origin: { y: 0.6 },
            });
          } catch {
            // ignore
          }
        }

        const newTimeline = [
          ...app.timeline,
          {
            status: newStatus,
            date: today,
            note: note || `Application status updated to ${newStatus}.`,
          },
        ];

        return {
          ...app,
          status: newStatus,
          timeline: newTimeline,
          notes: note ? `${app.notes || ''}\n[${today}]: ${note}`.trim() : app.notes,
        };
      })
    );

    showToast(`Application status updated to '${newStatus}'.`, 'info');
  };

  const addApplicationNote = (applicationId: string, note: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === applicationId ? { ...app, notes: note } : app))
    );
    showToast('Application notes updated.', 'success');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read.', 'info');
  };

  const updateSkillStatus = (skillName: string, status: 'Not Started' | 'In Progress' | 'Mastered') => {
    setSkillLibrary((prev) =>
      prev.map((item) => {
        if (item.skill.toLowerCase() === skillName.toLowerCase()) {
          return {
            ...item,
            userStatus: status,
            isPossessed: status === 'Mastered',
          };
        }
        return item;
      })
    );

    // If marked mastered, add to student technical skills list if not present!
    if (status === 'Mastered') {
      if (!currentStudent.technicalSkills.includes(skillName)) {
        setCurrentStudent((prev) => ({
          ...prev,
          technicalSkills: [...prev.technicalSkills, skillName],
          readinessScores: {
            ...prev.readinessScores,
            technicalSkills: Math.min(100, prev.readinessScores.technicalSkills + 2),
            codingPractice: Math.min(100, prev.readinessScores.codingPractice + 1),
          },
        }));
        showToast(`Congratulations! Added '${skillName}' to your technical skill profile. AI match scores recalculated!`, 'success');
      }
    } else {
      showToast(`Skill '${skillName}' status updated to ${status}.`, 'info');
    }
  };

  const loginAsDemoStudent = (studentId?: string) => {
    const student = allStudents.find((s) => s.id === (studentId || 'std_101')) || DEFAULT_STUDENT_PROFILE;
    setCurrentStudent(student);
    setUserRole('student');
    setIsAuthenticated(true);
    setActiveTab('dashboard');
    setShowAuthModal(false);
    showToast(`Logged in as ${student.fullName} (Student Mode)`, 'success');
  };

  const loginAsDemoAdmin = () => {
    setUserRole('admin');
    setIsAuthenticated(true);
    setActiveTab('admin');
    setShowAuthModal(false);
    showToast('Logged in as Dr. Radhika Menon (Placement Officer)', 'success');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setActiveTab('landing');
    showToast('You have been signed out.', 'info');
  };

  const placementReadinessScore = calculateOverallReadiness(currentStudent.readinessScores);

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        isAuthenticated,
        setIsAuthenticated,
        currentStudent,
        updateStudentProfile,
        allStudents,
        opportunities,
        addOpportunity,
        updateOpportunity,
        applications,
        applyToOpportunity,
        updateApplicationStatus,
        addApplicationNote,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        skillLibrary,
        updateSkillStatus,
        activeTab,
        setActiveTab,
        showAuthModal,
        setShowAuthModal,
        authModalMode,
        setAuthModalMode,
        selectedOpportunityForModal,
        setSelectedOpportunityForModal,
        selectedJobForSkillGap,
        setSelectedJobForSkillGap,
        toasts,
        showToast,
        loginAsDemoStudent,
        loginAsDemoAdmin,
        logout,
        placementReadinessScore,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
