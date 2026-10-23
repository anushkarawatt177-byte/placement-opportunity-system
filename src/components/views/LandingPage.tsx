import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  GitCompare,
  GraduationCap,
  Briefcase,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Building2,
  Users,
  Target,
  Award,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const {
    setActiveTab,
    setShowAuthModal,
    setAuthModalMode,
    loginAsDemoStudent,
    loginAsDemoAdmin,
    opportunities,
  } = useApp();

  return (
    <div className="min-h-full pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-slate-900 to-slate-950 text-white pt-10 pb-16 px-4 sm:px-8 lg:px-12 rounded-2xl mb-12 shadow-xl border border-blue-950">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-800/60 border border-blue-600/40 text-blue-200 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Campus Placement Intelligence Platform</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight font-display">
              Placement Opportunity <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-blue-400">
                Recommendation System
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed">
              Find the Right Opportunity. Build the Right Future.
            </p>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              An intelligent, automated campus recruitment engine that bridges college students with premier tier-1 engineering drives and internships based on technical skills, academic performance, and career aspirations.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  loginAsDemoStudent();
                  setActiveTab('dashboard');
                }}
                className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 flex items-center gap-2"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('recommendations')}
                className="px-6 py-3 text-sm font-semibold text-slate-100 bg-white/10 hover:bg-white/20 active:bg-white/5 border border-white/20 rounded-xl transition-all backdrop-blur-xs flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Explore Opportunities</span>
              </button>
            </div>

            {/* Fast Persona Switcher strip */}
            <div className="pt-4 flex items-center gap-4 text-xs text-slate-400 border-t border-slate-800/80">
              <span className="text-slate-400 font-medium">Quick Demo Entry:</span>
              <button
                onClick={() => loginAsDemoStudent()}
                className="text-blue-300 hover:text-white font-semibold underline underline-offset-4"
              >
                Login as Student (Ananya)
              </button>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => loginAsDemoAdmin()}
                className="text-blue-300 hover:text-white font-semibold underline underline-offset-4"
              >
                Login as TPO Officer
              </button>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-800 group">
              <img
                src="/src/assets/images/hero_students_placement_1792780656038.jpg"
                alt="Engineering students discussing placement opportunities in university career lounge"
                className="w-full h-80 sm:h-96 object-cover transition-transform duration-500 group-hover:scale-102"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 p-3 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700/60 text-xs text-slate-200">
                <div className="flex items-center justify-between font-semibold text-white">
                  <span>NIT Campus Tech Drive 2026-27</span>
                  <span className="text-emerald-400 font-mono">120+ Hiring Partners</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Google · Microsoft · Amazon · Goldman Sachs · Infosys · TCS
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Counter Bar */}
      <section className="max-w-6xl mx-auto mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-700 font-display tabular-nums">
              94.6%
            </div>
            <div className="text-xs font-semibold text-slate-900 mt-1">Campus Placement Rate</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Top engineering branches</div>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tabular-nums">
              ₹ 14.8 LPA
            </div>
            <div className="text-xs font-semibold text-slate-900 mt-1">Average CTC Package</div>
            <div className="text-[11px] text-slate-500 mt-0.5">₹ 52.0 LPA highest offer</div>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-700 font-display tabular-nums">
              120+
            </div>
            <div className="text-xs font-semibold text-slate-900 mt-1">Active Recruiters</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Tier 1 tech & core firms</div>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tabular-nums">
              14,500+
            </div>
            <div className="text-xs font-semibold text-slate-900 mt-1">AI Matches Computed</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Zero student left unmatched</div>
          </div>
        </div>
      </section>

      {/* Four Core Features Grid */}
      <section className="max-w-6xl mx-auto mb-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-display">
            Built for High-Impact Placement Success
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Four specialized modules working in harmony to maximize interview shortlists and eliminate preparation guesswork.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: AI-Based Job Recommendations */}
          <div
            onClick={() => {
              loginAsDemoStudent();
              setActiveTab('recommendations');
            }}
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                AI-Based Job Recommendations
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Multidimensional matching algorithm pairing your CGPA, verified technical skills, and career interests with optimal campus drives.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:text-blue-700">
              <span>View Recommendations</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Skill Gap Analysis */}
          <div
            onClick={() => {
              loginAsDemoStudent();
              setActiveTab('skill-gap');
            }}
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 mb-4 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                <GitCompare className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Skill Gap Analysis
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Compare your current abilities against job requisites. Uncover missing competencies like DSA or Spring Boot with curated learning paths.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-1 text-xs font-semibold text-sky-700 group-hover:text-sky-800">
              <span>Analyze Gaps</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Placement Readiness Score */}
          <div
            onClick={() => {
              loginAsDemoStudent();
              setActiveTab('readiness');
            }}
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Placement Readiness Score
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                A 6-pillar diagnostic score evaluating coding practice, aptitude, communication, and resume quality with actionable recommendations.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
              <span>Test Readiness</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Application Tracking */}
          <div
            onClick={() => {
              loginAsDemoStudent();
              setActiveTab('applications');
            }}
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Application Tracking
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Real-time recruitment pipeline from submission to final offer letter, complete with interview scheduling dates and personalized prep notes.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-1 text-xs font-semibold text-emerald-700 group-hover:text-emerald-800">
              <span>Track Pipeline</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Placement Drives Preview */}
      <section className="max-w-6xl mx-auto mb-16 p-6 sm:p-8 rounded-2xl bg-slate-900 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
              Upcoming Tier-1 Campus Recruitment Drives
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Top corporate hiring partners with active openings on campus.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('recommendations')}
            className="px-4 py-2 text-xs font-semibold text-blue-900 bg-white hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
          >
            View All {opportunities.length} Opportunities →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {opportunities.slice(0, 3).map((opp) => (
            <div
              key={opp.id}
              className="p-5 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-white">{opp.company}</span>
                  <span className="text-xs font-mono font-semibold text-emerald-400">
                    ₹ {opp.ctcLpa} LPA
                  </span>
                </div>
                <div className="text-sm font-semibold text-slate-200">{opp.role}</div>
                <div className="text-xs text-slate-400 mt-1">
                  Min CGPA: {opp.minCgpa} · Closes {opp.applicationDeadline}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-slate-400">{opp.openings} Openings</span>
                <button
                  onClick={() => {
                    loginAsDemoStudent();
                    setActiveTab('recommendations');
                  }}
                  className="font-semibold text-blue-400 hover:text-blue-300"
                >
                  Check Match Score →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
