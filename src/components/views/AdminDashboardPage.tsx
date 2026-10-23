import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Opportunity, StudentProfile } from '../../types';
import {
  ShieldCheck,
  Building2,
  Users,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Download,
  Calendar,
  Sparkles,
  Briefcase,
  TrendingUp,
  FileText,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const AdminDashboardPage: React.FC = () => {
  const {
    opportunities,
    addOpportunity,
    updateOpportunity,
    allStudents,
    applications,
    showToast,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'drives' | 'students' | 'analytics'>('drives');

  // Search & Filters for Students
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [studentBranchFilter, setStudentBranchFilter] = useState('all');
  const [studentMinCgpa, setStudentMinCgpa] = useState<number>(0);
  const [targetCompanyFilter, setTargetCompanyFilter] = useState<string>('all');

  // Add Drive Modal state
  const [showAddDriveModal, setShowAddDriveModal] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newCtc, setNewCtc] = useState('18.0');
  const [newStipend, setNewStipend] = useState('75000');
  const [newLocation, setNewLocation] = useState('Bangalore / Hyderabad');
  const [newMinCgpa, setNewMinCgpa] = useState('7.5');
  const [newBranches, setNewBranches] = useState('Computer Science & Engineering, Information Technology');
  const [newSkills, setNewSkills] = useState('Java, Python, Data Structures & Algorithms, SQL');
  const [newDeadline, setNewDeadline] = useState('2026-11-30');
  const [newDriveDate, setNewDriveDate] = useState('2026-12-05');
  const [newOpenings, setNewOpenings] = useState('20');
  const [newTier, setNewTier] = useState<Opportunity['tier']>('Super Dream (10-20 LPA)');
  const [newDesc, setNewDesc] = useState('Software engineering recruitment drive for core systems and platform scaling.');

  // Placement KPIs
  const totalOffers = applications.filter((a) => a.status === 'Selected').length;
  const highestCtc = Math.max(...opportunities.map((o) => o.ctcLpa), 0);
  const averageCtc = (
    opportunities.reduce((acc, o) => acc + o.ctcLpa, 0) / Math.max(1, opportunities.length)
  ).toFixed(1);

  // Filtered Students list
  const filteredStudents = useMemo(() => {
    return allStudents.filter((student) => {
      if (studentSearchQuery.trim()) {
        const q = studentSearchQuery.toLowerCase();
        const matchesName = student.fullName.toLowerCase().includes(q);
        const matchesEmail = student.email.toLowerCase().includes(q);
        const matchesSkills = student.technicalSkills.some((s) => s.toLowerCase().includes(q));
        if (!matchesName && !matchesEmail && !matchesSkills) return false;
      }

      if (studentBranchFilter !== 'all' && student.branch !== studentBranchFilter) {
        return false;
      }

      if (student.cgpa < studentMinCgpa) {
        return false;
      }

      // If specific company eligibility is selected
      if (targetCompanyFilter !== 'all') {
        const targetOpp = opportunities.find((o) => o.id === targetCompanyFilter);
        if (targetOpp) {
          if (student.cgpa < targetOpp.minCgpa) return false;
          const isBranchEligible = targetOpp.eligibleBranches.some((b) =>
            b.toLowerCase().includes(student.branch.toLowerCase()) || b === 'All Engineering Branches'
          );
          if (!isBranchEligible) return false;
        }
      }

      return true;
    });
  }, [allStudents, studentSearchQuery, studentBranchFilter, studentMinCgpa, targetCompanyFilter, opportunities]);

  // Chart data: Applications per company
  const companyAppChartData = useMemo(() => {
    const map: Record<string, { company: string; Applied: number; Selected: number }> = {};
    opportunities.forEach((o) => {
      map[o.company] = { company: o.company, Applied: 0, Selected: 0 };
    });

    applications.forEach((app) => {
      if (map[app.company]) {
        map[app.company].Applied += 1;
        if (app.status === 'Selected') map[app.company].Selected += 1;
      } else {
        map[app.company] = { company: app.company, Applied: 1, Selected: app.status === 'Selected' ? 1 : 0 };
      }
    });

    return Object.values(map).slice(0, 6);
  }, [opportunities, applications]);

  // Chart data: Status breakdown
  const statusDistribution = useMemo(() => {
    const counts: Record<string, number> = {
      Applied: 0,
      'Under Review': 0,
      Shortlisted: 0,
      'Interview Scheduled': 0,
      Selected: 0,
      Rejected: 0,
    };
    applications.forEach((a) => {
      counts[a.status] = (counts[a.status] || 0) + 1;
    });

    return [
      { name: 'Applied', value: counts['Applied'], color: '#94a3b8' },
      { name: 'Under Review', value: counts['Under Review'], color: '#38bdf8' },
      { name: 'Shortlisted', value: counts['Shortlisted'], color: '#6366f1' },
      { name: 'Interview Scheduled', value: counts['Interview Scheduled'], color: '#f59e0b' },
      { name: 'Selected (Offers)', value: counts['Selected'], color: '#10b981' },
      { name: 'Rejected', value: counts['Rejected'], color: '#f43f5e' },
    ];
  }, [applications]);

  const handleCreateDriveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim() || !newRole.trim()) {
      showToast('Please provide company name and job role.', 'error');
      return;
    }

    const ctcParsed = parseFloat(newCtc) || 10;
    const minCgpaParsed = parseFloat(newMinCgpa) || 7.0;
    const branchesArr = newBranches.split(',').map((b) => b.trim()).filter(Boolean);
    const skillsArr = newSkills.split(',').map((s) => s.trim()).filter(Boolean);

    addOpportunity({
      company: newCompany.trim(),
      logo: '',
      companyColor: '#2563eb',
      role: newRole.trim(),
      jobType: 'Full Time',
      ctcLpa: ctcParsed,
      stipendPerMonth: parseInt(newStipend) || 50000,
      location: newLocation.trim(),
      eligibleBranches: branchesArr.length > 0 ? branchesArr : ['Computer Science & Engineering', 'Information Technology'],
      minCgpa: minCgpaParsed,
      requiredSkills: skillsArr.length > 0 ? skillsArr : ['Java', 'SQL', 'Data Structures & Algorithms'],
      preferredSkills: ['Problem Solving', 'Git'],
      applicationDeadline: newDeadline,
      driveDate: newDriveDate,
      description: newDesc,
      openings: parseInt(newOpenings) || 15,
      selectionProcess: ['Online Assessment', 'Technical Interview', 'HR Round'],
      perks: ['Health Insurance', 'Signing Bonus'],
      tier: newTier,
      isActive: true,
    });

    setShowAddDriveModal(false);
    // Reset inputs
    setNewCompany('');
    setNewRole('');
  };

  const handleExportCSV = () => {
    const headers = 'ID,Name,Email,Branch,Year,CGPA,Skills\n';
    const rows = allStudents
      .map(
        (s) =>
          `"${s.id}","${s.fullName}","${s.email}","${s.branch}","${s.currentYear}","${s.cgpa}","${s.technicalSkills.join(';')}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `placement_candidates_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Student recruitment roster exported to CSV successfully.', 'success');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Officer Header Banner */}
      <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-800 shrink-0 border-2 border-indigo-400/40 shadow-md">
            <img
              src="/src/assets/images/placement_officer_avatar_1792780655390.jpg"
              alt="Placement Director"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Training & Placement Cell (TPO)</span>
              <span aria-hidden="true">·</span>
              <span>Administrative Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5 font-display">
              Placement Officer Management Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Oversee campus recruitment drives, configure hiring criteria, track student eligibility cutoffs, and monitor institutional placement analytics.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-stretch md:self-auto justify-end">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-semibold text-slate-200 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Roster (CSV)</span>
          </button>

          <button
            onClick={() => setShowAddDriveModal(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Placement Drive</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Registered Candidates</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-display tabular-nums">
            {allStudents.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Profiles active in matching engine</div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Active Placement Drives</span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-indigo-600 font-display tabular-nums">
            {opportunities.filter((o) => o.isActive).length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">{opportunities.length} Total corporate listings</div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Average Package (CTC)</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 font-display tabular-nums">
            ₹ {averageCtc} LPA
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Highest offer: ₹ {highestCtc} LPA</div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Offers Confirmed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-display tabular-nums">
            {totalOffers}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Across premier software recruiters</div>
        </div>
      </div>

      {/* Sub Tabs Selector */}
      <div className="flex border-b border-slate-200 space-x-6 text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('drives')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeSubTab === 'drives'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Manage Drives ({opportunities.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('students')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeSubTab === 'students'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Student Eligibility Directory ({allStudents.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeSubTab === 'analytics'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Application Analytics & Pipeline</span>
        </button>
      </div>

      {/* SUB-TAB 1: MANAGE DRIVES */}
      {activeSubTab === 'drives' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 font-display">
              Active & Scheduled Campus Recruitment Drives
            </h2>
            <button
              onClick={() => setShowAddDriveModal(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Company Drive</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Company & Role</th>
                    <th className="py-3 px-4">Package (CTC)</th>
                    <th className="py-3 px-4">Min CGPA</th>
                    <th className="py-3 px-4">Eligible Branches</th>
                    <th className="py-3 px-4">Drive Date</th>
                    <th className="py-3 px-4">Openings</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {opportunities.map((opp) => (
                    <tr key={opp.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{opp.company}</div>
                        <div className="text-slate-500">{opp.role}</div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                        ₹ {opp.ctcLpa} LPA
                      </td>
                      <td className="py-3 px-4 font-mono font-medium">
                        {opp.minCgpa}
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate text-slate-600">
                        {opp.eligibleBranches.join(', ')}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {opp.driveDate}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {opp.openings}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => updateOpportunity(opp.id, { isActive: !opp.isActive })}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                            opp.isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {opp.isActive ? 'Active Drive' : 'Inactive'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setTargetCompanyFilter(opp.id);
                            setActiveSubTab('students');
                          }}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline"
                        >
                          Check Eligible Students
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: REGISTERED STUDENTS & ELIGIBILITY DIRECTORY */}
      {activeSubTab === 'students' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={studentSearchQuery}
                onChange={(e) => setStudentSearchQuery(e.target.value)}
                placeholder="Search student name or skill..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
              />
            </div>

            <div>
              <select
                value={studentBranchFilter}
                onChange={(e) => setStudentBranchFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="all">All Branches</option>
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
              </select>
            </div>

            <div>
              <select
                value={studentMinCgpa}
                onChange={(e) => setStudentMinCgpa(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value={0}>Any CGPA</option>
                <option value={7.0}>CGPA ≥ 7.0</option>
                <option value={8.0}>CGPA ≥ 8.0</option>
                <option value={8.5}>CGPA ≥ 8.5 (Tier-1)</option>
              </select>
            </div>

            <div>
              <select
                value={targetCompanyFilter}
                onChange={(e) => setTargetCompanyFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-blue-300 bg-blue-50/50 text-blue-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="all">Check Eligibility For: All Drives</option>
                {opportunities.map((o) => (
                  <option key={o.id} value={o.id}>
                    Eligible for: {o.company} (Cutoff {o.minCgpa})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Branch & Year</th>
                    <th className="py-3 px-4">CGPA</th>
                    <th className="py-3 px-4">Verified Technical Skills</th>
                    <th className="py-3 px-4">Preferred Roles</th>
                    <th className="py-3 px-4 text-center">Drive Eligibility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredStudents.map((std) => {
                    const isFullyEligible =
                      targetCompanyFilter === 'all'
                        ? true
                        : (() => {
                            const opp = opportunities.find((o) => o.id === targetCompanyFilter);
                            if (!opp) return true;
                            return (
                              std.cgpa >= opp.minCgpa &&
                              opp.eligibleBranches.some((b) =>
                                b.toLowerCase().includes(std.branch.toLowerCase()) ||
                                b === 'All Engineering Branches'
                              )
                            );
                          })();

                    return (
                      <tr key={std.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{std.fullName}</div>
                          <div className="text-slate-500 font-mono text-[11px]">{std.email}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-900">{std.branch}</div>
                          <div className="text-slate-500 text-[11px]">{std.currentYear}</div>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-blue-700">
                          {std.cgpa}
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <div className="flex flex-wrap gap-1">
                            {std.technicalSkills.slice(0, 4).map((s) => (
                              <span
                                key={s}
                                className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 text-[10px]"
                              >
                                {s}
                              </span>
                            ))}
                            {std.technicalSkills.length > 4 && (
                              <span className="text-[10px] text-slate-400">
                                +{std.technicalSkills.length - 4}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {std.preferredJobRoles.join(', ')}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {isFullyEligible ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 bg-emerald-50 rounded border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Eligible
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-rose-800 bg-rose-50 rounded border border-rose-200">
                              <AlertCircle className="w-3 h-3 text-rose-600" />
                              Cutoff Below
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: APPLICATION STATISTICS & ANALYTICS */}
      {activeSubTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Applications by Company Chart */}
          <div className="lg:col-span-8 p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Applications & Offers by Company Drive
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Real-time submission volumes vs successful selections
            </p>

            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={companyAppChartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="company" tick={{ fill: '#475569', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="Applied" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Selected" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Breakdown Donut/Pie Chart */}
          <div className="lg:col-span-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Candidate Pipeline Funnel
              </h3>
              <p className="text-xs text-slate-500 mb-2">
                Overall application progression across recruitment stages
              </p>

              <div className="w-full h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-1 text-xs pt-2 border-t border-slate-100">
              {statusDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-mono font-semibold text-slate-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ADD PLACEMENT DRIVE MODAL */}
      {showAddDriveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Publish New Campus Recruitment Drive
                </h3>
                <p className="text-xs text-slate-500">
                  New drives are immediately indexed by the AI matching engine for students.
                </p>
              </div>
              <button
                onClick={() => setShowAddDriveModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDriveSubmit} className="space-y-3 max-h-[70vh] overflow-y-auto pr-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="e.g. Adobe, Uber, Cisco"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Job Role Title *</label>
                  <input
                    type="text"
                    required
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="e.g. Member of Technical Staff"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">CTC (LPA) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newCtc}
                    onChange={(e) => setNewCtc(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Min CGPA Cutoff</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={newMinCgpa}
                    onChange={(e) => setNewMinCgpa(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Openings</label>
                  <input
                    type="number"
                    value={newOpenings}
                    onChange={(e) => setNewOpenings(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Drive Category Tier</label>
                  <select
                    value={newTier}
                    onChange={(e) => setNewTier(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Dream (20+ LPA)">Dream (20+ LPA)</option>
                    <option value="Super Dream (10-20 LPA)">Super Dream (10-20 LPA)</option>
                    <option value="Core / Mass (3-10 LPA)">Core / Mass (3-10 LPA)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Job Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Required Skills (comma-separated) *
                </label>
                <input
                  type="text"
                  required
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  placeholder="Java, React, SQL, DSA, System Design"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Eligible Branches (comma-separated)
                </label>
                <input
                  type="text"
                  value={newBranches}
                  onChange={(e) => setNewBranches(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Application Deadline</label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Campus Drive Date</label>
                  <input
                    type="date"
                    value={newDriveDate}
                    onChange={(e) => setNewDriveDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Job Description</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddDriveModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                >
                  Publish Placement Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
