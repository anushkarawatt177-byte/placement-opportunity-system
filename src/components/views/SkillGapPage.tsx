import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateOpportunityMatch } from '../../services/recommendationEngine';
import {
  GitCompare,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  ExternalLink,
  Clock,
  ArrowRight,
  TrendingUp,
  Award,
  Calendar,
  Building2,
  RotateCcw,
} from 'lucide-react';

export const SkillGapPage: React.FC = () => {
  const {
    currentStudent,
    opportunities,
    skillLibrary,
    updateSkillStatus,
    selectedJobForSkillGap,
    setSelectedJobForSkillGap,
    setSelectedOpportunityForModal,
  } = useApp();

  // Selected opportunity to analyze against (default to first or selected)
  const [selectedOppId, setSelectedOppId] = useState<string>(() => {
    return selectedJobForSkillGap ? selectedJobForSkillGap.id : opportunities[0]?.id || '';
  });

  const selectedOpp = useMemo(() => {
    return opportunities.find((o) => o.id === selectedOppId) || opportunities[0];
  }, [opportunities, selectedOppId]);

  // Compute skill gap details
  const matchResult = useMemo(() => {
    if (!selectedOpp) return null;
    return calculateOpportunityMatch(currentStudent, selectedOpp);
  }, [currentStudent, selectedOpp]);

  if (!selectedOpp || !matchResult) {
    return (
      <div className="p-12 text-center text-slate-500">
        No opportunities available to analyze.
      </div>
    );
  }

  // Find learning resources for missing skills
  const missingSkillObjects = matchResult.missingSkills.map((skillName) => {
    const existingInLib = skillLibrary.find(
      (s) => s.skill.toLowerCase() === skillName.toLowerCase()
    );
    if (existingInLib) return existingInLib;

    // Fallback if not in library
    return {
      skill: skillName,
      category: 'Core Computer Science' as const,
      difficulty: 'Intermediate' as const,
      isPossessed: false,
      isRequired: true,
      userStatus: 'Not Started' as const,
      learningResources: [
        {
          title: `Mastering ${skillName} for SDE Interviews`,
          provider: 'GeeksforGeeks & LeetCode',
          type: 'Interactive Problem' as const,
          estimatedHours: 15,
          link: 'https://leetcode.com',
        },
      ],
    };
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-blue-600" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
              Skill Gap Analysis & Upskilling Roadmap
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Compare your profile against target company requirements, pinpoint missing competencies, and follow tailored learning roadmaps.
          </p>
        </div>

        {/* Target Job Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">
            Analyze for:
          </span>
          <select
            value={selectedOppId}
            onChange={(e) => setSelectedOppId(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 max-w-xs shadow-xs"
          >
            {opportunities.map((opp) => (
              <option key={opp.id} value={opp.id}>
                {opp.company} – {opp.role} ({opp.ctcLpa} LPA)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Target Job Overview Card */}
      <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-slate-50 p-2.5 flex items-center justify-center shrink-0 border border-slate-200">
            {selectedOpp.logo ? (
              <img
                src={selectedOpp.logo}
                alt={selectedOpp.company}
                className="max-h-full max-w-full object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <Building2 className="w-7 h-7 text-slate-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="font-semibold text-slate-800">{selectedOpp.company}</span>
              <span aria-hidden="true">·</span>
              <span>{selectedOpp.jobType}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-emerald-700 font-semibold">₹ {selectedOpp.ctcLpa} LPA</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">{selectedOpp.role}</h2>
            <div className="text-xs text-slate-500 mt-1">
              Minimum Cutoff: {selectedOpp.minCgpa} CGPA · Campus Drive: {selectedOpp.driveDate}
            </div>
          </div>
        </div>

        {/* Skill Match Score Pill and Action */}
        <div className="flex items-center gap-4 shrink-0 self-stretch md:self-auto justify-end">
          <div className="text-right">
            <div className="text-2xl font-extrabold text-blue-700 font-display tabular-nums">
              {matchResult.skillMatchPercentage}%
            </div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Technical Skill Match
            </div>
          </div>

          <button
            onClick={() => setSelectedOpportunityForModal(selectedOpp)}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors whitespace-nowrap"
          >
            View Job Details
          </button>
        </div>
      </div>

      {/* 3-Column Comparison Matrix: Possessed vs Required vs Missing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Column 1: Student Existing Skills */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Your Possessed Skills</h3>
            </div>
            <span className="text-xs font-mono font-semibold text-emerald-700">
              {currentStudent.technicalSkills.length} Verified
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Skills recorded in your verified student placement profile.
          </p>

          <div className="flex flex-wrap gap-1.5">
            {currentStudent.technicalSkills.map((skill) => {
              const isRequiredByThisJob = selectedOpp.requiredSkills.some(
                (req) => req.toLowerCase() === skill.toLowerCase()
              );
              return (
                <span
                  key={skill}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md border ${
                    isRequiredByThisJob
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {skill} {isRequiredByThisJob && '✓'}
                </span>
              );
            })}
          </div>
        </div>

        {/* Column 2: Job Required Skills */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Required by {selectedOpp.company}</h3>
            </div>
            <span className="text-xs font-mono font-semibold text-blue-700">
              {selectedOpp.requiredSkills.length} Mandatory
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Core competencies evaluated in technical screening rounds.
          </p>

          <div className="flex flex-wrap gap-1.5">
            {selectedOpp.requiredSkills.map((skill) => {
              const candidateHasIt = currentStudent.technicalSkills.some(
                (s) => s.toLowerCase() === skill.toLowerCase()
              );
              return (
                <span
                  key={skill}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md border ${
                    candidateHasIt
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {skill} {candidateHasIt ? '✓' : '⚠️'}
                </span>
              );
            })}
          </div>
        </div>

        {/* Column 3: Missing Skill Gaps */}
        <div className="p-5 bg-white rounded-2xl border border-amber-200/80 bg-amber-50/20 shadow-xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-amber-200/60">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-amber-950">Missing Skill Gaps</h3>
            </div>
            <span className="text-xs font-mono font-semibold text-amber-800">
              {matchResult.missingSkills.length} Needed
            </span>
          </div>
          <p className="text-xs text-amber-800/80 mb-3">
            Acquiring these skills will directly boost your shortlist probability.
          </p>

          {matchResult.missingSkills.length === 0 ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium text-center">
              🎉 Perfect match! You possess all mandatory technical skills for this role!
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {matchResult.missingSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 text-xs font-semibold rounded-md bg-amber-100 text-amber-900 border border-amber-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recommended Learning Resources for Missing Skills */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900 font-display">
                Recommended Learning Resources & Courses
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Curated materials, coding problem lists, and video guides tailored for {selectedOpp.company} recruitment.
            </p>
          </div>
        </div>

        {missingSkillObjects.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">
            No skill gaps found for this opportunity! You are ready to ace the interview.
          </div>
        ) : (
          <div className="space-y-4">
            {missingSkillObjects.map((item) => {
              const currentLibStatus = skillLibrary.find(
                (s) => s.skill.toLowerCase() === item.skill.toLowerCase()
              )?.userStatus || 'Not Started';

              return (
                <div
                  key={item.skill}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{item.skill}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-medium">
                        {item.difficulty}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {item.category}
                      </span>
                    </div>

                    {/* Interactive Learning Status Buttons */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Status:</span>
                      <button
                        onClick={() => updateSkillStatus(item.skill, 'In Progress')}
                        className={`px-3 py-1 text-xs font-semibold rounded-md border transition-colors ${
                          currentLibStatus === 'In Progress'
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        In Progress
                      </button>
                      <button
                        onClick={() => updateSkillStatus(item.skill, 'Mastered')}
                        className={`px-3 py-1 text-xs font-semibold rounded-md border transition-colors ${
                          currentLibStatus === 'Mastered'
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        Mark Mastered ✓
                      </button>
                    </div>
                  </div>

                  {/* Course Cards inside skill */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    {item.learningResources.map((res, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white rounded-lg border border-slate-200 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                            <span className="font-semibold text-blue-600">{res.provider}</span>
                            <span className="flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3 text-slate-400" />
                              ~{res.estimatedHours} hrs
                            </span>
                          </div>
                          <div className="text-xs font-semibold text-slate-900 leading-snug">
                            {res.title}
                          </div>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 uppercase tracking-wide">
                            {res.type}
                          </span>
                          <a
                            href={res.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
                          >
                            <span>Start Learning</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Personalized 4-Week Improvement Roadmap */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              Personalized 4-Week Placement Acceleration Roadmap
            </h3>
            <p className="text-xs text-slate-500">
              Structured preparation schedule to qualify for {selectedOpp.company} ({selectedOpp.ctcLpa} LPA)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">
              Week 1: Core Foundation
            </div>
            <div className="text-xs font-bold text-slate-900 mb-2">
              Advanced DSA & Recursion
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-3.5">
              <li>Solve 15 LeetCode Mediums on Trees, Graphs & Dynamic Programming.</li>
              <li>Revisit time/space complexity analysis for interview rounds.</li>
              <li>Practice dry runs on whiteboard/paper.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">
              Week 2: Framework Mastery
            </div>
            <div className="text-xs font-bold text-slate-900 mb-2">
              Spring Boot & Microservices
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-3.5">
              <li>Build a production-style REST service with Spring Data JPA.</li>
              <li>Implement JWT authentication and unit tests in JUnit.</li>
              <li>Connect PostgreSQL database and write optimized SQL queries.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">
              Week 3: System Design
            </div>
            <div className="text-xs font-bold text-slate-900 mb-2">
              Scalability & Architecture
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-3.5">
              <li>Study Rate Limiters, URL Shortener, and Distributed Caching.</li>
              <li>Brush up on CAP theorem, database sharding, and message queues.</li>
              <li>Participate in mock system design interviews with peers.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">
              Week 4: Final Rehearsal
            </div>
            <div className="text-xs font-bold text-slate-900 mb-2">
              Mock Tests & Leadership
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-3.5">
              <li>Timed Codility / HackerRank mock assessments.</li>
              <li>Prepare STAR method answers for behavioral & leadership rounds.</li>
              <li>Resume bullet points refinement with quantified metrics.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
