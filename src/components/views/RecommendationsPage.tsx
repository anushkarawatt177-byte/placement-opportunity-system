import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { getRecommendedOpportunities } from '../../services/recommendationEngine';
import { Opportunity } from '../../types';
import {
  Sparkles,
  Search,
  Filter,
  Briefcase,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Building2,
  ArrowUpDown,
  ChevronDown,
  X,
  SlidersHorizontal,
  ExternalLink,
  GraduationCap,
} from 'lucide-react';

export const RecommendationsPage: React.FC = () => {
  const {
    currentStudent,
    opportunities,
    applications,
    setSelectedOpportunityForModal,
    setSelectedJobForSkillGap,
    applyToOpportunity,
    setActiveTab,
  } = useApp();

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [selectedRoleCategory, setSelectedRoleCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [minSalaryLpa, setMinSalaryLpa] = useState<number>(0);
  const [maxCgpaCutoff, setMaxCgpaCutoff] = useState<number>(10);
  const [onlyEligible, setOnlyEligible] = useState<boolean>(false);
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'match' | 'salary' | 'deadline'>('match');

  // Compute recommendation results
  const allRecommendations = useMemo(() => {
    return getRecommendedOpportunities(currentStudent, opportunities);
  }, [currentStudent, opportunities]);

  // Extract unique companies, locations, and skills for filters
  const uniqueCompanies = useMemo(() => {
    return Array.from(new Set(opportunities.map((o) => o.company))).sort();
  }, [opportunities]);

  const uniqueLocations = useMemo(() => {
    const locs = opportunities.map((o) => o.location.split('/')[0].trim());
    return Array.from(new Set(locs)).sort();
  }, [opportunities]);

  const uniqueSkills = useMemo(() => {
    const skills = new Set<string>();
    opportunities.forEach((o) => o.requiredSkills.forEach((s) => skills.add(s)));
    return Array.from(skills).sort();
  }, [opportunities]);

  // Filtered & Sorted Recommendations
  const filteredRecommendations = useMemo(() => {
    return allRecommendations
      .filter((rec) => {
        const opp = rec.opportunity;

        // Search text
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchCompany = opp.company.toLowerCase().includes(q);
          const matchRole = opp.role.toLowerCase().includes(q);
          const matchSkills = opp.requiredSkills.some((s) => s.toLowerCase().includes(q));
          if (!matchCompany && !matchRole && !matchSkills) return false;
        }

        // Company filter
        if (selectedCompany !== 'all' && opp.company !== selectedCompany) return false;

        // Location filter
        if (selectedLocation !== 'all' && !opp.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
          return false;
        }

        // Skill filter
        if (selectedSkillFilter !== 'all') {
          const hasSkill = opp.requiredSkills.some(
            (s) => s.toLowerCase() === selectedSkillFilter.toLowerCase()
          );
          if (!hasSkill) return false;
        }

        // Salary cutoff
        if (opp.ctcLpa < minSalaryLpa) return false;

        // CGPA filter
        if (opp.minCgpa > maxCgpaCutoff) return false;

        // Eligibility filter
        if (onlyEligible && rec.overallEligibility !== 'Eligible') return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'salary') return b.opportunity.ctcLpa - a.opportunity.ctcLpa;
        if (sortBy === 'deadline') {
          return new Date(a.opportunity.applicationDeadline).getTime() - new Date(b.opportunity.applicationDeadline).getTime();
        }
        return b.matchScore - a.matchScore; // default AI match
      });
  }, [
    allRecommendations,
    searchQuery,
    selectedCompany,
    selectedLocation,
    selectedSkillFilter,
    minSalaryLpa,
    maxCgpaCutoff,
    onlyEligible,
    sortBy,
  ]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCompany('all');
    setSelectedLocation('all');
    setSelectedSkillFilter('all');
    setMinSalaryLpa(0);
    setMaxCgpaCutoff(10);
    setOnlyEligible(false);
    setSortBy('match');
  };

  const handleApplyClick = (opp: Opportunity) => {
    applyToOpportunity(opp);
  };

  const handleSkillGapClick = (opp: Opportunity) => {
    setSelectedJobForSkillGap(opp);
    setActiveTab('skill-gap');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Title & Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
              AI Placement Opportunity Recommendations
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Matching engine evaluating technical skill overlap, CGPA cutoff ({currentStudent.cgpa}), branch, and dream career roles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-900 font-semibold">{filteredRecommendations.length}</strong> opportunities
          </div>
          <button
            onClick={() => setActiveTab('profile')}
            className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span>Update Skills ({currentStudent.technicalSkills.length})</span>
          </button>
        </div>
      </div>

      {/* Filter Control Console */}
      <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
        {/* Top Search & Primary Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search company, role, or skill..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Company Filter */}
          <div>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">All Companies</option>
              {uniqueCompanies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">All Locations</option>
              {uniqueLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
            >
              <option value="match">Sort by: AI Match %</option>
              <option value="salary">Sort by: Package (LPA)</option>
              <option value="deadline">Sort by: Deadline (Soonest)</option>
            </select>
          </div>
        </div>

        {/* Second Filter Row: Skill filter, Salary range, and Eligibility Toggle */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Skill Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Skill:</span>
              <select
                value={selectedSkillFilter}
                onChange={(e) => setSelectedSkillFilter(e.target.value)}
                className="text-xs px-2.5 py-1 rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="all">Any Skill</option>
                {uniqueSkills.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Minimum CTC Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Min Package:</span>
              <select
                value={minSalaryLpa}
                onChange={(e) => setMinSalaryLpa(Number(e.target.value))}
                className="text-xs px-2.5 py-1 rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value={0}>Any CTC</option>
                <option value={8}>8+ LPA</option>
                <option value={15}>15+ LPA</option>
                <option value={20}>20+ LPA (Dream)</option>
              </select>
            </div>

            {/* Only Eligible Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer select-none px-2 py-1 bg-slate-50 hover:bg-slate-100 rounded-md border border-slate-200">
              <input
                type="checkbox"
                checked={onlyEligible}
                onChange={(e) => setOnlyEligible(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="font-semibold text-slate-800">Only Show 100% Eligible</span>
            </label>
          </div>

          {/* Reset Filters button */}
          <button
            onClick={resetFilters}
            className="text-xs text-slate-500 hover:text-slate-800 underline font-medium"
          >
            Reset All Filters
          </button>
        </div>
      </div>

      {/* Opportunity Cards List */}
      {filteredRecommendations.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <Briefcase className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No matching placement opportunities found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search query, lowering the minimum salary package requirement, or resetting the filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRecommendations.map((rec) => {
            const opp = rec.opportunity;
            const isApplied = applications.some(
              (a) => a.opportunityId === opp.id && a.studentId === currentStudent.id
            );

            // Determine badge style
            let badgeStyle = 'text-emerald-700 bg-emerald-50 border-emerald-200';
            let badgeText = 'Fully Eligible';
            if (rec.overallEligibility === 'Borderline') {
              badgeStyle = 'text-amber-700 bg-amber-50 border-amber-200';
              badgeText = 'Needs Improvement';
            } else if (rec.overallEligibility === 'Ineligible') {
              badgeStyle = 'text-rose-700 bg-rose-50 border-rose-200';
              badgeText = 'Not Eligible';
            }

            return (
              <div
                key={opp.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between p-5"
              >
                <div>
                  {/* Top card row: Logo, Company & Role, and AI Match Score */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 p-2 flex items-center justify-center shrink-0 border border-slate-200">
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
                          <Building2 className="w-6 h-6 text-slate-500" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{opp.company}</div>
                        <h3 className="text-sm font-bold text-slate-900 leading-snug">
                          {opp.role}
                        </h3>
                      </div>
                    </div>

                    {/* AI Match Gauge Pill */}
                    <div className="text-right shrink-0">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-bold">
                        <Sparkles className="w-3 h-3 text-blue-600" />
                        <span>{rec.matchScore}% Match</span>
                      </div>
                    </div>
                  </div>

                  {/* Metadata Row: Salary, Location, Cutoff */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mb-3 pt-1 border-t border-slate-100">
                    <span className="font-mono font-bold text-emerald-700">
                      ₹ {opp.ctcLpa} LPA
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {opp.location}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-slate-500">Min CGPA: {opp.minCgpa}</span>
                  </div>

                  {/* Required Skills list */}
                  <div className="space-y-1.5 mb-3">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Required Skills
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {opp.requiredSkills.slice(0, 5).map((skill) => {
                        const hasSkill = currentStudent.technicalSkills.some(
                          (s) => s.toLowerCase() === skill.toLowerCase()
                        );
                        return (
                          <span
                            key={skill}
                            className={`px-2 py-0.5 text-[11px] font-medium rounded border ${
                              hasSkill
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}
                          >
                            {skill} {hasSkill && '✓'}
                          </span>
                        );
                      })}
                      {opp.requiredSkills.length > 5 && (
                        <span className="px-1.5 py-0.5 text-[10px] text-slate-400">
                          +{opp.requiredSkills.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Eligible Branches & Deadline */}
                  <div className="text-xs text-slate-500 space-y-1 mb-3">
                    <div className="truncate">
                      <strong className="text-slate-700 font-medium">Branches:</strong>{' '}
                      {opp.eligibleBranches.join(', ')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>Deadline: <strong className="font-mono text-slate-800">{opp.applicationDeadline}</strong></span>
                    </div>
                  </div>

                  {/* Status Indicator Bar */}
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <span className={`px-2 py-0.5 text-[11px] font-semibold rounded border ${badgeStyle}`}>
                      {badgeText}
                    </span>

                    {rec.missingSkills.length > 0 ? (
                      <button
                        onClick={() => handleSkillGapClick(opp)}
                        className="text-[11px] font-medium text-blue-600 hover:text-blue-800 underline"
                      >
                        {rec.missingSkills.length} missing skill(s)
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-700 font-medium">
                        All mandatory skills met!
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Actions: View Details and Apply Now */}
                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedOpportunityForModal(opp)}
                    className="w-full py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors text-center"
                  >
                    View Details
                  </button>

                  {isApplied ? (
                    <span className="w-full py-2 px-3 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-lg text-center inline-flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Applied
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApplyClick(opp)}
                      className="w-full py-2 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs text-center"
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
