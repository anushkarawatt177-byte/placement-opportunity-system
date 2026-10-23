import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Application, ApplicationStatus } from '../../types';
import {
  Briefcase,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building2,
  ChevronRight,
  Plus,
  Send,
  Award,
  XCircle,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

const STATUS_COLUMNS: { status: ApplicationStatus; label: string; color: string; badge: string }[] = [
  { status: 'Applied', label: 'Applied', color: 'border-slate-300 bg-slate-50', badge: 'bg-slate-100 text-slate-700' },
  { status: 'Under Review', label: 'Under Review', color: 'border-blue-300 bg-blue-50/30', badge: 'bg-blue-100 text-blue-800' },
  { status: 'Shortlisted', label: 'Shortlisted', color: 'border-indigo-300 bg-indigo-50/30', badge: 'bg-indigo-100 text-indigo-800' },
  { status: 'Interview Scheduled', label: 'Interview Scheduled', color: 'border-amber-300 bg-amber-50/30', badge: 'bg-amber-100 text-amber-900' },
  { status: 'Selected', label: 'Offer Received 🎉', color: 'border-emerald-300 bg-emerald-50/30', badge: 'bg-emerald-100 text-emerald-800 font-bold' },
  { status: 'Rejected', label: 'Not Selected', color: 'border-rose-200 bg-rose-50/20', badge: 'bg-rose-100 text-rose-700' },
];

export const ApplicationTrackerPage: React.FC = () => {
  const {
    applications,
    updateApplicationStatus,
    addApplicationNote,
    setActiveTab,
    setSelectedOpportunityForModal,
    opportunities,
  } = useApp();

  const [activeView, setActiveView] = useState<'board' | 'timeline'>('board');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [interviewDateInput, setInterviewDateInput] = useState('');

  const handleUpdateStatus = (appId: string, status: ApplicationStatus) => {
    updateApplicationStatus(appId, status);
    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp || !newNoteText.trim()) return;

    addApplicationNote(selectedApp.id, newNoteText.trim());
    setNewNoteText('');
  };

  const handleScheduleInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp || !interviewDateInput) return;

    updateApplicationStatus(
      selectedApp.id,
      'Interview Scheduled',
      `Virtual Interview confirmed for ${interviewDateInput}.`
    );
    setInterviewDateInput('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Title & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
              Recruitment Application Tracker
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Monitor stages from initial drive application through online tests, technical interviews, and final offers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveView('board')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeView === 'board'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kanban Board
            </button>
            <button
              onClick={() => setActiveView('timeline')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeView === 'timeline'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Timeline View
            </button>
          </div>

          <button
            onClick={() => setActiveTab('recommendations')}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Apply to New Drive</span>
          </button>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <Briefcase className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No applications submitted yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Explore recommended jobs and submit your campus drive applications with one click.
          </p>
          <button
            onClick={() => setActiveTab('recommendations')}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Explore AI Recommendations
          </button>
        </div>
      ) : activeView === 'board' ? (
        /* KANBAN BOARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 overflow-x-auto pb-4">
          {STATUS_COLUMNS.map((col) => {
            const columnApps = applications.filter((a) => a.status === col.status);

            return (
              <div
                key={col.status}
                className={`rounded-2xl border ${col.color} p-3.5 flex flex-col justify-between min-h-[520px]`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/80">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {col.label}
                    </span>
                    <span className="px-1.5 py-0.5 text-[11px] font-mono font-bold bg-white rounded-md border border-slate-200 text-slate-700">
                      {columnApps.length}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {columnApps.map((app) => (
                      <div
                        key={app.id}
                        onClick={() => setSelectedApp(app)}
                        className="p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer space-y-2"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="text-xs font-bold text-slate-900">{app.company}</span>
                          <span className="text-[11px] font-mono font-semibold text-emerald-700">
                            {app.salaryLpa} LPA
                          </span>
                        </div>

                        <div className="text-xs font-medium text-slate-700 leading-snug">
                          {app.role}
                        </div>

                        {app.interviewDate && (
                          <div className="flex items-center gap-1 text-[11px] font-medium text-amber-800 bg-amber-50 p-1.5 rounded-md border border-amber-200">
                            <Clock className="w-3 h-3 shrink-0" />
                            <span className="truncate">{app.interviewDate}</span>
                          </div>
                        )}

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                          <span>Applied {app.appliedDate}</span>
                          <span className="text-blue-600 font-semibold hover:underline">
                            Details →
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 text-[11px] text-slate-400 text-center font-medium">
                  {columnApps.length === 0 ? 'No applications' : `${columnApps.length} candidate(s)`}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TIMELINE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs divide-y divide-slate-100">
          {applications.map((app) => (
            <div key={app.id} className="py-5 first:pt-0 last:pb-0 flex flex-col md:flex-row gap-6">
              {/* Left Column: Job & Company Info */}
              <div className="md:w-1/3 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{app.company}</h3>
                  <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    ₹ {app.salaryLpa} LPA
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-700">{app.role}</div>
                <div className="text-xs text-slate-500">{app.location}</div>
                <div className="text-xs text-slate-400">Applied on {app.appliedDate}</div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedApp(app)}
                    className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                  >
                    Manage & Update Status
                  </button>
                </div>
              </div>

              {/* Right Column: Timeline Progression */}
              <div className="md:w-2/3">
                <div className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">
                  Recruitment Progression
                </div>
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {app.timeline.map((step, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white" />
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">{step.status}</span>
                        <span className="text-slate-400 font-mono text-[11px]">{step.date}</span>
                      </div>
                      {step.note && (
                        <p className="text-xs text-slate-600 mt-0.5">{step.note}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Application Details & Status Management Drawer/Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Application Dossier
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {selectedApp.company} – {selectedApp.role}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5 font-mono">
                  Applied Date: {selectedApp.appliedDate} · Package: ₹ {selectedApp.salaryLpa} LPA
                </div>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Quick Status Advance Control */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Update Demo Stage
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {STATUS_COLUMNS.map((col) => (
                  <button
                    key={col.status}
                    onClick={() => handleUpdateStatus(selectedApp.id, col.status)}
                    className={`py-2 px-2.5 rounded-lg border text-left transition-colors font-medium flex items-center justify-between ${
                      selectedApp.status === col.status
                        ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="truncate">{col.status}</span>
                    {selectedApp.status === col.status && <CheckCircle2 className="w-3.5 h-3.5 shrink-0 ml-1" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Schedule / Reschedule Interview */}
            <form onSubmit={handleScheduleInterview} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-900">
                Schedule Interview Date & Time
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={interviewDateInput}
                  onChange={(e) => setInterviewDateInput(e.target.value)}
                  placeholder="e.g. 2026-11-04 at 02:30 PM (Google Meet)"
                  className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap"
                >
                  Confirm Date
                </button>
              </div>
            </form>

            {/* Notes Section */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Personal Interview Prep & Recruiter Notes
              </label>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 whitespace-pre-line max-h-40 overflow-y-auto mb-2 font-sans">
                {selectedApp.notes || 'No notes added yet for this recruitment process.'}
              </div>

              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Add round feedback, coding questions asked, or interviewer notes..."
                  className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors whitespace-nowrap"
                >
                  Add Note
                </button>
              </form>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  const targetOpp = opportunities.find((o) => o.id === selectedApp.opportunityId);
                  if (targetOpp) {
                    setSelectedOpportunityForModal(targetOpp);
                    setSelectedApp(null);
                  }
                }}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Inspect Original Job Specification →
              </button>

              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
