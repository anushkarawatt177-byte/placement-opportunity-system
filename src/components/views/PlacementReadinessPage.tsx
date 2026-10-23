import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CircularProgress } from '../common/CircularProgress';
import {
  GraduationCap,
  Sparkles,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Sliders,
  FileCheck,
  RefreshCw,
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

export const PlacementReadinessPage: React.FC = () => {
  const { currentStudent, updateStudentProfile, placementReadinessScore, showToast } = useApp();

  const [scores, setScores] = useState(currentStudent.readinessScores);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Quick assessment questionnaire state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({
    q1_dsa: 4, // 1 to 5
    q2_core: 4,
    q3_aptitude: 4,
    q4_comm: 4,
    q5_resume: 5,
    q6_interview: 3,
  });

  const handleScoreChange = (pillar: keyof typeof scores, value: number) => {
    const updated = { ...scores, [pillar]: value };
    setScores(updated);
    updateStudentProfile({ readinessScores: updated });
  };

  const handleSaveQuizAssessment = () => {
    // Map quiz answers to percentages
    const mapped = {
      codingPractice: Math.min(100, quizAnswers.q1_dsa * 20),
      technicalSkills: Math.min(100, quizAnswers.q2_core * 20),
      aptitude: Math.min(100, quizAnswers.q3_aptitude * 20),
      communicationSkills: Math.min(100, quizAnswers.q4_comm * 20),
      resumeQuality: Math.min(100, quizAnswers.q5_resume * 20),
      interviewPrep: Math.min(100, quizAnswers.q6_interview * 20),
    };

    setScores(mapped);
    updateStudentProfile({ readinessScores: mapped });
    setShowAssessmentModal(false);
    showToast('Placement Readiness Score recalibrated from diagnostic test!', 'success');
  };

  // Radar chart data structure
  const radarData = [
    { subject: 'Technical Skills', student: scores.technicalSkills, benchmark: 85, fullMark: 100 },
    { subject: 'Coding Practice', student: scores.codingPractice, benchmark: 88, fullMark: 100 },
    { subject: 'Aptitude & Math', student: scores.aptitude, benchmark: 80, fullMark: 100 },
    { subject: 'Communication', student: scores.communicationSkills, benchmark: 80, fullMark: 100 },
    { subject: 'Resume Quality', student: scores.resumeQuality, benchmark: 85, fullMark: 100 },
    { subject: 'Interview Prep', student: scores.interviewPrep, benchmark: 82, fullMark: 100 },
  ];

  // Bar chart comparison data
  const comparisonData = [
    { name: 'Coding (DSA)', You: scores.codingPractice, BatchAvg: 68, Target: 88 },
    { name: 'Tech Core', You: scores.technicalSkills, BatchAvg: 70, Target: 85 },
    { name: 'Aptitude', You: scores.aptitude, BatchAvg: 74, Target: 80 },
    { name: 'Communication', You: scores.communicationSkills, BatchAvg: 75, Target: 80 },
    { name: 'Resume', You: scores.resumeQuality, BatchAvg: 65, Target: 85 },
    { name: 'Interview', You: scores.interviewPrep, BatchAvg: 62, Target: 82 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
              Placement Readiness Assessment
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Multifactorial evaluation of candidate interview preparedness across technical and soft competencies.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAssessmentModal(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Take 2-Min Readiness Quiz</span>
          </button>
        </div>
      </div>

      {/* Top Overview Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Overall Readiness Gauge */}
        <div className="lg:col-span-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Diagnostic Index
            </span>
            <span
              className={`px-2 py-0.5 text-xs font-semibold rounded font-mono ${
                placementReadinessScore >= 85
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}
            >
              {placementReadinessScore >= 85 ? 'Tier-1 Ready' : 'Competitive Candidate'}
            </span>
          </div>

          <div className="py-4">
            <CircularProgress
              score={placementReadinessScore}
              size={150}
              strokeWidth={12}
              sublabel="Overall Score"
              label=""
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 space-y-1">
            <div className="flex justify-between font-medium">
              <span>Tier-1 Dream Company Cutoff:</span>
              <strong className="text-slate-900 font-mono">85+ / 100</strong>
            </div>
            <div className="flex justify-between font-medium">
              <span>Super Dream (10-20 LPA) Cutoff:</span>
              <strong className="text-slate-900 font-mono">75+ / 100</strong>
            </div>
          </div>
        </div>

        {/* Right: Radar Chart Visualization */}
        <div className="lg:col-span-8 p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                6-Pillar Competency Radar vs Tier-1 Benchmark
              </h2>
              <p className="text-xs text-slate-500">
                Blue area indicates your profile; dotted line indicates top corporate target.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-blue-600">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                Your Score
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                Benchmark (85)
              </span>
            </div>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Radar
                  name="Your Score"
                  dataKey="student"
                  stroke="#2563eb"
                  fill="#3b82f6"
                  fillOpacity={0.4}
                />
                <Radar
                  name="Tier-1 Benchmark"
                  dataKey="benchmark"
                  stroke="#94a3b8"
                  strokeDasharray="3 3"
                  fill="#cbd5e1"
                  fillOpacity={0.15}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Interactive 6 Pillars Breakdown & Tuning */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-display">
              Detailed Pillar Performance & Calibration
            </h2>
            <p className="text-xs text-slate-500">
              Adjust sliders below or take the assessment quiz to reflect your latest mock test results.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Real-time sync</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Pillar 1: Coding Practice */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900">1. Coding Practice & DSA</span>
                <span className="text-xs font-mono font-bold text-blue-700 tabular-nums">
                  {scores.codingPractice}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={scores.codingPractice}
                onChange={(e) => handleScoreChange('codingPractice', Number(e.target.value))}
                className="w-full accent-blue-600 mb-2"
              />
              <p className="text-xs text-slate-500 leading-snug">
                LeetCode/HackerRank consistency, dynamic programming, and complexity awareness.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-emerald-700 font-medium">
              💡 Tip: Solve 3 graph & recursion questions this week to reach 92%.
            </div>
          </div>

          {/* Pillar 2: Technical Skills */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900">2. Technical Fundamentals</span>
                <span className="text-xs font-mono font-bold text-blue-700 tabular-nums">
                  {scores.technicalSkills}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={scores.technicalSkills}
                onChange={(e) => handleScoreChange('technicalSkills', Number(e.target.value))}
                className="w-full accent-blue-600 mb-2"
              />
              <p className="text-xs text-slate-500 leading-snug">
                Core CS subjects: DBMS, OOPs, Operating Systems, and Computer Networks.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-emerald-700 font-medium">
              💡 Tip: Review SQL query indexing & normalization questions.
            </div>
          </div>

          {/* Pillar 3: Aptitude & Problem Solving */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900">3. Aptitude & Quantitative</span>
                <span className="text-xs font-mono font-bold text-blue-700 tabular-nums">
                  {scores.aptitude}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={scores.aptitude}
                onChange={(e) => handleScoreChange('aptitude', Number(e.target.value))}
                className="w-full accent-blue-600 mb-2"
              />
              <p className="text-xs text-slate-500 leading-snug">
                Logical reasoning, probability, data interpretation, and speed math.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-blue-700 font-medium">
              💡 Tip: High score qualifies for Goldman Sachs and TCS Digital test cutoffs.
            </div>
          </div>

          {/* Pillar 4: Communication Skills */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900">4. Communication & Soft Skills</span>
                <span className="text-xs font-mono font-bold text-blue-700 tabular-nums">
                  {scores.communicationSkills}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={scores.communicationSkills}
                onChange={(e) => handleScoreChange('communicationSkills', Number(e.target.value))}
                className="w-full accent-blue-600 mb-2"
              />
              <p className="text-xs text-slate-500 leading-snug">
                Clarity in thought expression, technical explanation, and articulation.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-slate-600 font-medium">
              💡 Tip: Practice explaining your college projects in 90 seconds.
            </div>
          </div>

          {/* Pillar 5: Resume Quality */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900">5. Resume Quality & Impact</span>
                <span className="text-xs font-mono font-bold text-blue-700 tabular-nums">
                  {scores.resumeQuality}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={scores.resumeQuality}
                onChange={(e) => handleScoreChange('resumeQuality', Number(e.target.value))}
                className="w-full accent-blue-600 mb-2"
              />
              <p className="text-xs text-slate-500 leading-snug">
                ATS compliance, quantifiable metric bullets (e.g. "improved latency by 35%").
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-emerald-700 font-medium">
              💡 Tip: Strong rating! Resume passes 92% of corporate ATS filters.
            </div>
          </div>

          {/* Pillar 6: Interview Preparation */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900">6. Interview Preparation</span>
                <span className="text-xs font-mono font-bold text-blue-700 tabular-nums">
                  {scores.interviewPrep}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={scores.interviewPrep}
                onChange={(e) => handleScoreChange('interviewPrep', Number(e.target.value))}
                className="w-full accent-blue-600 mb-2"
              />
              <p className="text-xs text-slate-500 leading-snug">
                STAR technique competency, culture fit preparedness, and behavioral confidence.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-amber-700 font-medium">
              ⚠️ Room for growth: Schedule a peer mock interview before Microsoft drive.
            </div>
          </div>
        </div>
      </div>

      {/* Performance Comparison Bar Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-display">
              Comparative Analysis: You vs College Batch Average vs Tier-1 Target
            </h2>
            <p className="text-xs text-slate-500">
              Benchmark analysis against the 2026-27 graduating batch.
            </p>
          </div>
        </div>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="You" fill="#2563eb" radius={[4, 4, 0, 0]} />
              <Bar dataKey="BatchAvg" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Target" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Diagnostic Assessment Quiz Modal */}
      {showAssessmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Placement Readiness 2-Minute Diagnostic
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Rate your honest level for each of the 6 core recruitment criteria (1 = Beginner, 5 = Mastered).
              </p>
            </div>

            <div className="space-y-3 text-xs max-h-96 overflow-y-auto pr-1">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  1. Data Structures & Algorithms problem-solving comfort
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setQuizAnswers((p) => ({ ...p, q1_dsa: lvl }))}
                      className={`flex-1 py-1.5 rounded-lg border font-semibold ${
                        quizAnswers.q1_dsa === lvl
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  2. Core CS Fundamentals (DBMS, OS, Networks, OOPs)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setQuizAnswers((p) => ({ ...p, q2_core: lvl }))}
                      className={`flex-1 py-1.5 rounded-lg border font-semibold ${
                        quizAnswers.q2_core === lvl
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  3. Speed in Aptitude & Quantitative tests
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setQuizAnswers((p) => ({ ...p, q3_aptitude: lvl }))}
                      className={`flex-1 py-1.5 rounded-lg border font-semibold ${
                        quizAnswers.q3_aptitude === lvl
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  4. Spoken English & articulation in technical discussions
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setQuizAnswers((p) => ({ ...p, q4_comm: lvl }))}
                      className={`flex-1 py-1.5 rounded-lg border font-semibold ${
                        quizAnswers.q4_comm === lvl
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  5. Resume format, project impact & ATS compliance
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setQuizAnswers((p) => ({ ...p, q5_resume: lvl }))}
                      className={`flex-1 py-1.5 rounded-lg border font-semibold ${
                        quizAnswers.q5_resume === lvl
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  6. Mock interview & behavioral (STAR) preparedness
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setQuizAnswers((p) => ({ ...p, q6_interview: lvl }))}
                      className={`flex-1 py-1.5 rounded-lg border font-semibold ${
                        quizAnswers.q6_interview === lvl
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAssessmentModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveQuizAssessment}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
              >
                Recalculate Readiness Score
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
