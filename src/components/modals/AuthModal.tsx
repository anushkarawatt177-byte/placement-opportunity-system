import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentProfile } from '../../types';
import {
  X,
  Lock,
  Mail,
  User,
  GraduationCap,
  Sparkles,
  BookOpen,
  Briefcase,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    showAuthModal,
    setShowAuthModal,
    authModalMode,
    setAuthModalMode,
    loginAsDemoStudent,
    loginAsDemoAdmin,
    updateStudentProfile,
    setIsAuthenticated,
    setUserRole,
    setActiveTab,
    showToast,
  } = useApp();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCollegeName, setRegCollegeName] = useState('National Institute of Technology (NIT)');
  const [regBranch, setRegBranch] = useState('Computer Science & Engineering');
  const [regCurrentYear, setRegCurrentYear] = useState('4th Year');
  const [regCgpa, setRegCgpa] = useState('8.50');
  const [regSkills, setRegSkills] = useState('Java, Python, React, SQL, DSA');
  const [regPreferredRole, setRegPreferredRole] = useState('Software Development Engineer');

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Validation errors
  const [errorMsg, setErrorMsg] = useState('');

  if (!showAuthModal) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginEmail || !loginPassword) {
      setErrorMsg('Please enter your email and password.');
      return;
    }

    if (loginEmail.includes('admin') || loginEmail.includes('tpo')) {
      loginAsDemoAdmin();
    } else {
      loginAsDemoStudent();
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regFullName.trim() || !regEmail.trim()) {
      setErrorMsg('Please fill in your name and university email.');
      return;
    }

    const parsedCgpa = parseFloat(regCgpa);
    if (isNaN(parsedCgpa) || parsedCgpa < 0 || parsedCgpa > 10) {
      setErrorMsg('Please enter a valid CGPA between 0.0 and 10.0.');
      return;
    }

    const skillsArray = regSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const newProfile: StudentProfile = {
      id: 'std_' + Date.now(),
      fullName: regFullName.trim(),
      email: regEmail.trim(),
      collegeName: regCollegeName.trim(),
      branch: regBranch,
      currentYear: regCurrentYear,
      cgpa: parsedCgpa,
      technicalSkills: skillsArray.length > 0 ? skillsArray : ['Data Structures', 'Java', 'SQL'],
      preferredJobRoles: [regPreferredRole],
      certifications: [],
      projects: [],
      careerInterests: ['Software Engineering', 'Cloud Platforms'],
      readinessScores: {
        technicalSkills: 80,
        codingPractice: 78,
        aptitude: 82,
        communicationSkills: 80,
        resumeQuality: 75,
        interviewPrep: 70,
      },
    };

    updateStudentProfile(newProfile);
    setIsAuthenticated(true);
    setUserRole('student');
    setShowAuthModal(false);
    setActiveTab('dashboard');
    showToast(`Welcome ${newProfile.fullName}! Your placement account is now active.`, 'success');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setErrorMsg('Please provide your registered university email.');
      return;
    }
    setForgotSent(true);
    showToast('Password reset link sent to your university inbox.', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {authModalMode === 'login' && 'Student & Officer Sign In'}
              {authModalMode === 'register' && 'Student Placement Registration'}
              {authModalMode === 'forgot' && 'Reset Account Password'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Placement Opportunity Recommendation System
            </p>
          </div>
          <button
            onClick={() => setShowAuthModal(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher for Login / Register */}
        {authModalMode !== 'forgot' && (
          <div className="px-6 pt-3">
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('login');
                  setErrorMsg('');
                }}
                className={`py-2 rounded-md transition-colors ${
                  authModalMode === 'login'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('register');
                  setErrorMsg('');
                }}
                className={`py-2 rounded-md transition-colors ${
                  authModalMode === 'register'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Register Student
              </button>
            </div>
          </div>
        )}

        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick 1-Click Demo Buttons */}
          <div className="mb-5 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Instant Demo Access (No Typing Required)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => loginAsDemoStudent()}
                className="px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors text-left flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <div className="font-bold">Demo Student</div>
                  <div className="text-[10px] text-blue-600/80">Ananya Sharma (8.82 CGPA)</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => loginAsDemoAdmin()}
                className="px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors text-left flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                <div>
                  <div className="font-bold">Placement Officer</div>
                  <div className="text-[10px] text-indigo-600/80">Admin TPO Dashboard</div>
                </div>
              </button>
            </div>
          </div>

          {/* LOGIN FORM */}
          {authModalMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="student@college.edu or admin@tpo.edu"
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalMode('forgot');
                      setErrorMsg('');
                    }}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors shadow-xs"
              >
                Sign In to Campus Portal
              </button>
            </form>
          )}

          {/* REGISTRATION FORM */}
          {authModalMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="e.g. Priyanshu Das"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    College Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="student@college.edu"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  College / University Name
                </label>
                <input
                  type="text"
                  value={regCollegeName}
                  onChange={(e) => setRegCollegeName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Engineering Branch
                  </label>
                  <select
                    value={regBranch}
                    onChange={(e) => setRegBranch(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current Year
                  </label>
                  <select
                    value={regCurrentYear}
                    onChange={(e) => setRegCurrentYear(e.target.value)}
                    className="w-full text-xs px-2 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="4th Year">4th Year (Final)</option>
                    <option value="3rd Year">3rd Year (Pre-Final)</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="1st Year">1st Year</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current CGPA (out of 10) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    required
                    value={regCgpa}
                    onChange={(e) => setRegCgpa(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Job Role
                  </label>
                  <select
                    value={regPreferredRole}
                    onChange={(e) => setRegPreferredRole(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Software Development Engineer">Software Development Engineer</option>
                    <option value="Full Stack Developer">Full Stack Developer</option>
                    <option value="Systems Engineer">Systems Engineer</option>
                    <option value="Data Analyst / Engineer">Data Analyst / Engineer</option>
                    <option value="Cloud / DevOps Engineer">Cloud / DevOps Engineer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Technical Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={regSkills}
                  onChange={(e) => setRegSkills(e.target.value)}
                  placeholder="Java, Python, C++, React, SQL, Git"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  AI will use these skills to compute your match score for live campus drives.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors shadow-xs mt-2"
              >
                Complete Registration & View Matches
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {authModalMode === 'forgot' && (
            <div className="space-y-4">
              {forgotSent ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h3 className="text-sm font-bold text-emerald-900">Check Your Email</h3>
                  <p className="text-xs text-emerald-700">
                    We sent password recovery instructions to <strong>{forgotEmail}</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalMode('login');
                      setForgotSent(false);
                    }}
                    className="mt-2 text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Enter your college email address and we will dispatch a password reset link to verify your university credentials.
                  </p>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      University Email
                    </label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="student@college.edu"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAuthModalMode('login')}
                      className="w-1/3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      Send Reset Instructions
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
