import React from 'react';
import { useApp } from '../../context/AppContext';
import { CircularProgress } from '../common/CircularProgress';
import { getRecommendedOpportunities } from '../../services/recommendationEngine';
import {
  Sparkles,
  Briefcase,
  Calendar,
  Bell,
  ArrowRight,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
  Award,
  BookOpen,
  MapPin,
  ExternalLink,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    currentStudent,
    opportunities,
    applications,
    notifications,
    skillLibrary,
    setActiveTab,
    setSelectedOpportunityForModal,
    markNotificationAsRead,
    placementReadinessScore,
  } = useApp();

  const recommendations = getRecommendedOpportunities(currentStudent, opportunities);
  const eligibleRecommendations = recommendations.filter((r) => r.overallEligibility === 'Eligible');

  // Stats
  const totalApplied = applications.length;
  const inReviewOrShortlisted = applications.filter(
    (a) => a.status === 'Shortlisted' || a.status === 'Interview Scheduled'
  ).length;
  const offersReceived = applications.filter((a) => a.status === 'Selected').length;

  // Mastered skills vs total
  const masteredSkillsCount = skillLibrary.filter((s) => s.userStatus === 'Mastered').length;
  const inProgressSkillsCount = skillLibrary.filter((s) => s.userStatus === 'In Progress').length;
  const skillProgressPercent = Math.round((masteredSkillsCount / Math.max(1, skillLibrary.length)) * 100);

  // Upcoming placement drives (sorted by driveDate)
  const upcomingDrives = [...opportunities]
    .filter((o) => o.isActive)
    .sort((a, b) => new Date(a.driveDate).getTime() - new Date(b.driveDate).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Welcome & Profile Summary Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-900 via-slate-900 to-slate-900 text-white shadow-lg border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-800 shrink-0 border-2 border-blue-400/40 shadow-md">
            <img
              src={currentStudent.avatarUrl || '/src/assets/images/student_avatar_main_1792780655897.jpg'}
              alt={currentStudent.fullName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-300">
              <span>{currentStudent.currentYear} Candidate</span>
              <span aria-hidden="true">·</span>
              <span>{currentStudent.collegeName}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5 font-display">
              Welcome back, {currentStudent.fullName}!
            </h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-300 mt-2">
              <span className="font-medium text-white">{currentStudent.branch}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono font-semibold text-emerald-300">
                CGPA: {currentStudent.cgpa}
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-300">
                {currentStudent.technicalSkills.length} Technical Skills Verified
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-stretch md:self-auto justify-end">
          <button
            onClick={() => setActiveTab('profile')}
            className="px-4 py-2 text-xs font-semibold text-slate-200 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors"
          >
            Edit Profile & Skills
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors shadow-md flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>View AI Matches</span>
          </button>
        </div>
      </div>

      {/* Primary KPI & Readiness Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Placement Readiness Score with Circular Gauge */}
        <div className="md:col-span-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Placement Readiness Score</h2>
              <p className="text-xs text-slate-500">6-pillar evaluation model</p>
            </div>
            <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-50 text-blue-700 rounded border border-blue-200 font-mono">
              AI Diagnostic
            </span>
          </div>

          <div className="py-2">
            <CircularProgress
              score={placementReadinessScore}
              size={135}
              strokeWidth={10}
              sublabel="out of 100"
              label=""
            />
          </div>

          <div className="mt-3 space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Coding Practice & DSA</span>
              <span className="font-semibold text-slate-900 font-mono">
                {currentStudent.readinessScores.codingPractice}%
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Technical Fundamentals</span>
              <span className="font-semibold text-slate-900 font-mono">
                {currentStudent.readinessScores.technicalSkills}%
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span>Interview Preparation</span>
              <span className="font-semibold text-slate-900 font-mono">
                {currentStudent.readinessScores.interviewPrep}%
              </span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('readiness')}
            className="mt-4 w-full py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Take Readiness Assessment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Key Metrics Counters (8 Columns) */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Recommended Opportunities */}
          <div
            onClick={() => setActiveTab('recommendations')}
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold">Recommended Drives</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl font-extrabold text-blue-700 font-display tabular-nums">
                {recommendations.length}
              </div>
              <div className="text-xs text-slate-600 mt-1">
                <strong className="text-emerald-700 font-semibold">{eligibleRecommendations.length}</strong> strictly eligible based on CGPA & branch
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-blue-600">
              <span>Explore All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Applications Submitted */}
          <div
            onClick={() => setActiveTab('applications')}
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold">Applications Submitted</span>
                <Briefcase className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900 font-display tabular-nums">
                {totalApplied}
              </div>
              <div className="text-xs text-slate-600 mt-1">
                <strong className="text-blue-700 font-semibold">{inReviewOrShortlisted}</strong> in active interview pipeline
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-blue-600">
              <span>View Tracking Pipeline</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Offers Received */}
          <div
            onClick={() => setActiveTab('applications')}
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold">Offers Confirmed</span>
                <Award className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-extrabold text-emerald-600 font-display tabular-nums">
                {offersReceived}
              </div>
              <div className="text-xs text-slate-600 mt-1">
                Infosys Specialist Programmer (9.5 LPA)
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-emerald-700">
              <span>Review Offers</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Skill Progress Bar Block */}
          <div className="sm:col-span-3 p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Skill Competency Progress</h3>
                <p className="text-xs text-slate-500">
                  {masteredSkillsCount} of {skillLibrary.length} core industry placement skills mastered
                </p>
              </div>
              <button
                onClick={() => setActiveTab('skill-gap')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                Analyze Skill Gaps →
              </button>
            </div>

            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex mb-2">
              <div
                style={{ width: `${skillProgressPercent}%` }}
                className="bg-emerald-500 transition-all duration-500"
                title={`Mastered: ${skillProgressPercent}%`}
              />
              <div
                style={{ width: `${Math.round((inProgressSkillsCount / skillLibrary.length) * 100)}%` }}
                className="bg-blue-400 transition-all duration-500"
                title={`In Progress`}
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Mastered ({masteredSkillsCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                <span>In Learning ({inProgressSkillsCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                <span>Unexplored ({skillLibrary.length - masteredSkillsCount - inProgressSkillsCount})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Placement Drives & Recent Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upcoming Placement Drives */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display">Upcoming Placement Drives</h2>
              <p className="text-xs text-slate-500">Campus on-site & virtual recruitment dates</p>
            </div>
            <button
              onClick={() => setActiveTab('recommendations')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              See All Drives →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {upcomingDrives.map((opp) => {
              const match = recommendations.find((r) => r.opportunity.id === opp.id);
              const matchScore = match ? match.matchScore : 75;

              return (
                <div
                  key={opp.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 rounded-lg px-2 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 p-2 flex items-center justify-center shrink-0 border border-slate-200">
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
                        <Briefcase className="w-5 h-5 text-slate-500" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{opp.company}</span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="text-xs text-slate-500">{opp.role}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                        <span className="font-mono text-emerald-700 font-semibold">₹ {opp.ctcLpa} LPA</span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          Drive: {opp.driveDate}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>Cutoff: {opp.minCgpa} CGPA</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <div className="text-right hidden sm:block">
                      <div className="text-xs font-bold text-blue-700 font-mono">
                        {matchScore}%
                      </div>
                      <div className="text-[10px] text-slate-400">Match</div>
                    </div>
                    <button
                      onClick={() => setSelectedOpportunityForModal(opp)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors whitespace-nowrap"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Recent Placement Cell Notifications */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-600" />
                <h2 className="text-base font-bold text-slate-900 font-display">Recent Notifications</h2>
              </div>
              <span className="text-[11px] font-mono text-slate-400">TPO Desk</span>
            </div>

            <div className="space-y-3">
              {notifications.slice(0, 4).map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markNotificationAsRead(notif.id)}
                  className={`p-3 rounded-xl border text-xs transition-colors cursor-pointer ${
                    notif.read
                      ? 'border-slate-200 bg-slate-50/50 text-slate-600'
                      : 'border-blue-200 bg-blue-50/40 text-slate-800 font-medium'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">{notif.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{notif.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{notif.message}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('applications')}
              className="w-full py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-center"
            >
              Open Application Timeline & Notes →
            </button>
          </div>
        </div>
      </div>

      {/* Top AI Recommendations Carousel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900 font-display">
                Top AI Placement Matches for You
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Ranked dynamically by your CGPA ({currentStudent.cgpa}) and skill overlap
            </p>
          </div>
          <button
            onClick={() => setActiveTab('recommendations')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            Explore All Recommendations →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.slice(0, 3).map((rec) => (
            <div
              key={rec.opportunity.id}
              className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="font-bold text-slate-900 text-sm">{rec.opportunity.company}</div>
                  <span className="px-2 py-0.5 text-xs font-bold font-mono rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {rec.matchScore}% Match
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-700">{rec.opportunity.role}</div>
                <div className="text-xs text-emerald-700 font-mono font-semibold mt-1">
                  ₹ {rec.opportunity.ctcLpa} LPA · {rec.opportunity.location}
                </div>
                <div className="mt-2 text-[11px] text-slate-500 line-clamp-2">
                  Required: {rec.opportunity.requiredSkills.slice(0, 4).join(', ')}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span
                  className={`text-[11px] font-semibold ${
                    rec.overallEligibility === 'Eligible'
                      ? 'text-emerald-700'
                      : 'text-amber-700'
                  }`}
                >
                  {rec.overallEligibility === 'Eligible' ? '✓ Eligible' : 'Needs Preparation'}
                </span>
                <button
                  onClick={() => setSelectedOpportunityForModal(rec.opportunity)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
