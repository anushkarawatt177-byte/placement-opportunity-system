import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentProfile } from '../../types';
import {
  User,
  GraduationCap,
  Code,
  Award,
  FolderGit2,
  FileText,
  Briefcase,
  Heart,
  Plus,
  Trash2,
  CheckCircle2,
  Save,
  Upload,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

const COMMON_SKILL_SUGGESTIONS = [
  'Java',
  'Python',
  'C++',
  'React',
  'Node.js',
  'Spring Boot',
  'SQL',
  'PostgreSQL',
  'MongoDB',
  'Data Structures & Algorithms',
  'System Design',
  'AWS',
  'Docker',
  'Kubernetes',
  'Git',
  'Computer Networks',
  'Operating Systems',
  'DBMS',
  'Machine Learning',
  'TypeScript',
];

export const StudentProfilePage: React.FC = () => {
  const { currentStudent, updateStudentProfile, showToast } = useApp();

  const [formData, setFormData] = useState<StudentProfile>(currentStudent);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [newRoleInput, setNewRoleInput] = useState('');
  const [newInterestInput, setNewInterestInput] = useState('');

  // New Project Form Modal / Inline State
  const [showAddProject, setShowAddProject] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectTech, setProjectTech] = useState('');
  const [projectLink, setProjectLink] = useState('');

  // New Cert Form State
  const [showAddCert, setShowAddCert] = useState(false);
  const [certTitle, setCertTitle] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certYear, setCertYear] = useState('2025');

  // Compute profile completion percentage
  const calculateCompletion = () => {
    let score = 0;
    if (formData.fullName && formData.email) score += 15;
    if (formData.collegeName && formData.branch && formData.cgpa > 0) score += 15;
    if (formData.technicalSkills.length >= 3) score += 25;
    if (formData.projects.length > 0) score += 15;
    if (formData.certifications.length > 0) score += 10;
    if (formData.preferredJobRoles.length > 0) score += 10;
    if (formData.resumeName) score += 10;
    return Math.min(100, score);
  };

  const profileCompletion = calculateCompletion();

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentProfile(formData);
  };

  const handleAddSkill = (skillToAdd?: string) => {
    const s = (skillToAdd || newSkillInput).trim();
    if (!s) return;

    if (formData.technicalSkills.some((existing) => existing.toLowerCase() === s.toLowerCase())) {
      showToast(`Skill '${s}' is already in your profile.`, 'warning');
      return;
    }

    const updatedSkills = [...formData.technicalSkills, s];
    const updated = { ...formData, technicalSkills: updatedSkills };
    setFormData(updated);
    updateStudentProfile(updated);
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = formData.technicalSkills.filter((s) => s !== skillToRemove);
    const updated = { ...formData, technicalSkills: updatedSkills };
    setFormData(updated);
    updateStudentProfile(updated);
  };

  const handleAddRole = () => {
    if (!newRoleInput.trim()) return;
    const updated = {
      ...formData,
      preferredJobRoles: [...formData.preferredJobRoles, newRoleInput.trim()],
    };
    setFormData(updated);
    updateStudentProfile(updated);
    setNewRoleInput('');
  };

  const handleRemoveRole = (role: string) => {
    const updated = {
      ...formData,
      preferredJobRoles: formData.preferredJobRoles.filter((r) => r !== role),
    };
    setFormData(updated);
    updateStudentProfile(updated);
  };

  const handleAddProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim()) return;

    const newProject = {
      id: 'proj_' + Date.now(),
      title: projectTitle.trim(),
      description: projectDesc.trim(),
      technologies: projectTech
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      link: projectLink.trim() || undefined,
    };

    const updated = {
      ...formData,
      projects: [newProject, ...formData.projects],
    };

    setFormData(updated);
    updateStudentProfile(updated);
    setShowAddProject(false);
    setProjectTitle('');
    setProjectDesc('');
    setProjectTech('');
    setProjectLink('');
  };

  const handleRemoveProject = (id: string) => {
    const updated = {
      ...formData,
      projects: formData.projects.filter((p) => p.id !== id),
    };
    setFormData(updated);
    updateStudentProfile(updated);
  };

  const handleAddCertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitle.trim()) return;

    const newCert = {
      id: 'cert_' + Date.now(),
      title: certTitle.trim(),
      issuer: certIssuer.trim() || 'Verified University',
      year: certYear.trim(),
    };

    const updated = {
      ...formData,
      certifications: [newCert, ...formData.certifications],
    };

    setFormData(updated);
    updateStudentProfile(updated);
    setShowAddCert(false);
    setCertTitle('');
    setCertIssuer('');
  };

  const handleRemoveCert = (id: string) => {
    const updated = {
      ...formData,
      certifications: formData.certifications.filter((c) => c.id !== id),
    };
    setFormData(updated);
    updateStudentProfile(updated);
  };

  const handleResumeSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const updated = {
        ...formData,
        resumeName: file.name,
      };
      setFormData(updated);
      updateStudentProfile(updated);
      showToast(`Resume '${file.name}' attached and verified.`, 'success');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
              Student Placement Profile
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Keep your academic criteria, technical skills, projects, and resume synchronized to maximize AI recruitment matching.
          </p>
        </div>

        <button
          onClick={handleSaveProfile}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Profile Completion Meter Banner */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Profile Completeness Score
            </h2>
          </div>
          <div className="text-xs font-bold text-blue-700 font-mono">
            {profileCompletion}% Completed
          </div>
        </div>

        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2">
          <div
            style={{ width: `${profileCompletion}%` }}
            className="h-full bg-blue-600 rounded-full transition-all duration-700"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Personal & Academics
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Technical Skills ({formData.technicalSkills.length})
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Projects ({formData.projects.length})
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Resume Uploaded
          </span>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Section 1: Personal & Contact Information */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <User className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Personal Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                College Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Phone Number
              </label>
              <input
                type="text"
                value={formData.phoneNumber || ''}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                College / Institution Name
              </label>
              <input
                type="text"
                value={formData.collegeName}
                onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Academic Details */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Academic Details & Cutoff Criteria</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Engineering Branch
              </label>
              <select
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                Current Year of Study
              </label>
              <select
                value={formData.currentYear}
                onChange={(e) => setFormData({ ...formData, currentYear: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="4th Year">4th Year (Graduating Batch)</option>
                <option value="3rd Year">3rd Year (Pre-Final)</option>
                <option value="2nd Year">2nd Year</option>
                <option value="1st Year">1st Year</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cumulative CGPA (out of 10)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={formData.cgpa}
                onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) || 0 })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono font-bold text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Technical Skills Cloud Manager */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Technical Skills</h3>
            </div>
            <span className="text-xs font-mono font-semibold text-blue-700">
              {formData.technicalSkills.length} Skills Listed
            </span>
          </div>

          {/* Add skill input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              placeholder="Type a skill and hit Enter (e.g. Next.js, Docker, Microservices)..."
              className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="button"
              onClick={() => handleAddSkill()}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap"
            >
              Add Skill
            </button>
          </div>

          {/* Currently selected skill chips */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Your Verified Skill Tags (Click × to remove)
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.technicalSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-xs font-medium"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-blue-500 hover:text-rose-600 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Quick Add Suggestions */}
          <div className="pt-2 border-t border-slate-100">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Quick Suggestions (Click to Add)
            </div>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_SKILL_SUGGESTIONS.filter(
                (s) => !formData.technicalSkills.some((ts) => ts.toLowerCase() === s.toLowerCase())
              ).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleAddSkill(s)}
                  className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Projects */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Technical Projects</h3>
            </div>
            <button
              type="button"
              onClick={() => setShowAddProject(!showAddProject)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Project</span>
            </button>
          </div>

          {/* Add project form inline */}
          {showAddProject && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-900">Add Project Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g. Distributed Key-Value Store"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    GitHub / Live Demo Link
                  </label>
                  <input
                    type="text"
                    value={projectLink}
                    onChange={(e) => setProjectLink(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Technologies Used (comma separated)
                </label>
                <input
                  type="text"
                  value={projectTech}
                  onChange={(e) => setProjectTech(e.target.value)}
                  placeholder="e.g. Java, Raft, gRPC, Docker"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description & Impact
                </label>
                <textarea
                  rows={2}
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  placeholder="Explain architecture, throughput benchmark, and your key contributions..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddProject(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddProjectSubmit}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Save Project
                </button>
              </div>
            </div>
          )}

          {/* Existing Projects List */}
          <div className="space-y-3">
            {formData.projects.map((proj) => (
              <div
                key={proj.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{proj.title}</span>
                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {proj.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {proj.technologies.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 text-[10px] font-medium rounded bg-white border border-slate-200 text-slate-600"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveProject(proj.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Certifications */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Certifications & Licenses</h3>
            </div>
            <button
              type="button"
              onClick={() => setShowAddCert(!showAddCert)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Certification</span>
            </button>
          </div>

          {showAddCert && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Certification Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={certTitle}
                    onChange={(e) => setCertTitle(e.target.value)}
                    placeholder="e.g. AWS Certified Developer Associate"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Issuing Authority
                  </label>
                  <input
                    type="text"
                    value={certIssuer}
                    onChange={(e) => setCertIssuer(e.target.value)}
                    placeholder="e.g. Amazon Web Services"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCert(false)}
                  className="px-3 py-1.5 text-xs text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddCertSubmit}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg"
                >
                  Save Certificate
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {formData.certifications.map((cert) => (
              <div
                key={cert.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{cert.title}</div>
                  <div className="text-[11px] text-slate-500">
                    {cert.issuer} · {cert.year}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveCert(cert.id)}
                  className="text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Resume & Career Preferences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Resume Upload */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <FileText className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Resume / CV Document</h3>
            </div>

            <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center space-y-2 hover:border-blue-400 transition-colors">
              <FileText className="w-8 h-8 text-blue-600 mx-auto" />
              <div className="text-xs font-semibold text-slate-900">
                {formData.resumeName || 'No resume uploaded yet'}
              </div>
              <p className="text-[11px] text-slate-500">
                PDF format recommended (Max 5MB). ATS pre-checked.
              </p>
              <label className="inline-block px-4 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg cursor-pointer transition-colors">
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleResumeSimulatedUpload}
                  className="hidden"
                />
                Upload New Resume
              </label>
            </div>
          </div>

          {/* Preferred Roles */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Preferred Job Roles</h3>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newRoleInput}
                onChange={(e) => setNewRoleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddRole();
                  }
                }}
                placeholder="e.g. SDE, Cloud Engineer..."
                className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-slate-300"
              />
              <button
                type="button"
                onClick={handleAddRole}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {formData.preferredJobRoles.map((role) => (
                <span
                  key={role}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-medium"
                >
                  <span>{role}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRole(role)}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile & Update Recommendation Rankings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
