import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateOpportunityMatch } from '../../services/recommendationEngine';
import {
  X,
  Briefcase,
  MapPin,
  Calendar,
  Building2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  Users,
  Award,
  ChevronRight,
  Send,
} from 'lucide-react';

export const JobDetailsModal: React.FC = () => {
  const {
    selectedOpportunityForModal,
    setSelectedOpportunityForModal,
    currentStudent,
    applyToOpportunity,
    applications,
    setActiveTab,
    setSelectedJobForSkillGap,
  } = useApp();

  const [applicationNote, setApplicationNote] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  if (!selectedOpportunityForModal) return null;

  const opp = selectedOpportunityForModal;
  const matchResult = calculateOpportunityMatch(currentStudent, opp);
  const alreadyApplied = applications.some(
    (a) => a.opportunityId === opp.id && a.studentId === currentStudent.id
  );

  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => {
      applyToOpportunity(opp, applicationNote);
      setIsApplying(false);
      setSelectedOpportunityForModal(null);
    }, 600);
  };

  const handleOpenSkillGap = () => {
    setSelectedJobForSkillGap(opp);
    setSelectedOpportunityForModal(null);
    setActiveTab('skill-gap');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header Banner */}
        <div className="p-6 bg-slate-900 text-white flex items-start justify-between relative overflow-hidden">
          <div className="relative z-10 flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-white p-2.5 flex items-center justify-center shadow-md shrink-0">
              {opp.logo ? (
                <img
                  src={opp.logo}
                  alt={opp.company}
                  className="max-h-full max-w-full object-contain"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <Building2 className="w-8 h-8 text-blue-600" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                <span>{opp.company}</span>
                <span aria-hidden="true">·</span>
                <span>{opp.jobType}</span>
                <span aria-hidden="true">·</span>
                <span className="text-blue-300 font-mono">{opp.tier}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                {opp.role}
              </h2>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-300">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {opp.location}
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 font-mono font-semibold text-emerald-400">
                  ₹ {opp.ctcLpa} LPA
                </span>
                {opp.stipendPerMonth && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-300 font-mono">
                      Stipend: ₹{opp.stipendPerMonth.toLocaleString()}/mo
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setSelectedOpportunityForModal(null)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors relative z-10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-700">
          {/* AI Match Overview Banner */}
          <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200">
            <div className="flex items-center justify-between gap-4 mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-bold text-blue-950">
                  AI Fit Analysis for {currentStudent.fullName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">Match Score:</span>
                <span className="text-base font-bold text-blue-700 tabular-nums">
                  {matchResult.matchScore}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2 border-y border-blue-100 text-xs">
              <div className="flex items-center gap-1.5">
                {matchResult.isCgpaEligible ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                )}
                <span>CGPA: {currentStudent.cgpa} (Cutoff: {opp.minCgpa})</span>
              </div>
              <div className="flex items-center gap-1.5">
                {matchResult.isBranchEligible ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                )}
                <span className="truncate">Branch Eligible</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Skills: {matchResult.matchedSkills.length}/{opp.requiredSkills.length} Matched</span>
              </div>
            </div>

            <div className="mt-2 text-xs text-blue-900 leading-relaxed">
              {matchResult.reasoningNotes.join(' ')}
            </div>

            {matchResult.missingSkills.length > 0 && (
              <div className="mt-3 pt-2 border-t border-blue-200/70 flex items-center justify-between">
                <div className="text-xs text-slate-700">
                  Missing skills for this role: <strong className="text-blue-900">{matchResult.missingSkills.join(', ')}</strong>
                </div>
                <button
                  onClick={handleOpenSkillGap}
                  className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1 underline"
                >
                  Analyze Skill Gap →
                </button>
              </div>
            )}
          </div>

          {/* Job Description */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Role Overview</h3>
            <p className="text-slate-600 leading-relaxed">{opp.description}</p>
          </div>

          {/* Required & Nice-to-have Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                Mandatory Required Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {opp.requiredSkills.map((skill) => {
                  const hasSkill = currentStudent.technicalSkills.some(
                    (s) => s.toLowerCase() === skill.toLowerCase()
                  );
                  return (
                    <span
                      key={skill}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md border ${
                        hasSkill
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {skill} {hasSkill && '✓'}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                Preferred / Bonus Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {opp.preferredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 text-xs font-medium rounded-md bg-white text-slate-700 border border-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Eligibility & Selection Process */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Eligibility Criteria
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">Minimum CGPA:</span> {opp.minCgpa}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-slate-900 shrink-0">Branches:</span>
                  <span>{opp.eligibleBranches.join(', ')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">Application Closes:</span>
                  <span className="font-mono text-slate-800">{opp.applicationDeadline}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">Campus Drive Date:</span>
                  <span className="font-mono text-slate-800">{opp.driveDate}</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Selection Process Rounds
              </h4>
              <ol className="space-y-1.5 text-xs text-slate-600 list-decimal pl-4">
                {opp.selectionProcess.map((round, idx) => (
                  <li key={idx} className="leading-snug">
                    <span className="text-slate-800 font-medium">{round}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Optional Application Note */}
          {!alreadyApplied && (
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Note for Placement Officer / Recruiter (Optional)
              </label>
              <textarea
                value={applicationNote}
                onChange={(e) => setApplicationNote(e.target.value)}
                placeholder="Briefly state your key technical highlights or relevant project experiences..."
                rows={2}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={() => setSelectedOpportunityForModal(null)}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenSkillGap}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 bg-slate-100 rounded-lg transition-colors border border-slate-300"
            >
              Analyze Skill Gap
            </button>

            {alreadyApplied ? (
              <span className="px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-100 border border-emerald-300 rounded-lg inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Already Applied
              </span>
            ) : (
              <button
                onClick={handleApply}
                disabled={isApplying}
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {isApplying ? 'Submitting...' : 'Confirm & Apply Now'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
