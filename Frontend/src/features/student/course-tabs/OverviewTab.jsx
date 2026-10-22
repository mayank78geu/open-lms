import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ExternalLink,
  FileText,
  Download,
  CheckCircle2,
  Lock,
  ChevronRight,
  MessageSquare,
  AlertCircle,
  BookOpen,
  Calendar,
  Users,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Avatar } from '../../../components/ui/Avatar';

export function OverviewTab({ course, setActiveTab }) {
  const navigate = useNavigate();

  const instructorName = course?.instructor || course?.professorName || 'Faculty Instructor';
  const instructorInitials = instructorName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'FI';

  const defaultNextClass = {
    title: 'Upcoming Lecture: Advanced Problem Solving & Discussion',
    time: 'Next Session · Scheduled Office & Lecture Hours',
    description: course?.description || 'Active class session covering core syllabus fundamentals.',
    prepare: 'Review previous lecture notes and submit pending assignments prior to class.',
  };

  const nextClass = course?.nextClass || defaultNextClass;

  const defaultModules = course?.modules || [
    {
      id: 1,
      number: '01',
      title: 'Module 1: Foundations & Core Concepts',
      summary: 'Introduction, theoretical foundations, and syllabus review.',
      status: 'complete',
    },
    {
      id: 2,
      number: '02',
      title: 'Module 2: Practical Applications & Core Analysis',
      summary: 'Practical implementations, analytical methods, and problem sets.',
      status: 'in_progress',
    },
    {
      id: 3,
      number: '03',
      title: 'Module 3: Advanced Architectures & Case Studies',
      summary: 'Optimization, synthesis, and final project preparations.',
      status: 'locked',
    },
  ];

  const thisWeekItems = course?.thisWeek || [
    {
      id: 'w1',
      title: 'View Active Course Assignments',
      time: 'Check Deadlines & Rubrics',
      tab: 'Assignments',
    },
    {
      id: 'w2',
      title: 'Browse Syllabus & Course Files',
      time: 'Lecture Slides & Resources',
      tab: 'Resources',
    },
    {
      id: 'w3',
      title: 'Take Course Quizzes',
      time: 'Knowledge Check & Practice',
      tab: 'Quizzes',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Course Overview & Summary Banner */}
      <div className="bg-white rounded-2xl border border-ink-border p-6 shadow-soft space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-violet-100 text-violet-700">
              {course?.code || course?.courseCode}
            </span>
            <span className="text-xs font-semibold text-ink-muted">
              {course?.section || 'Section 01'}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-ink-muted">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              {course?.enrollmentCount ?? 0} enrolled students
            </span>
            <span>•</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Course
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-ink mb-1">About this course</h3>
          <p className="text-xs text-ink-muted leading-relaxed">
            {course?.description || 'Comprehensive university curriculum designed for deep conceptual mastery and practical problem solving.'}
          </p>
        </div>
      </div>

      {/* Main Grid: Left Column & Right Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Left Column (8 cols): Next Class & Modules */}
        <div className="lg:col-span-8 space-y-6">
          {/* Work in Progress notice for demonstrative lecture notes viewer */}
          <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 flex items-start gap-3 text-amber-900 shadow-soft">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                Work in Progress · Syllabus Pacing & Lecture Deck Viewer
              </h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                Real-time syllabus milestone tracking and in-app slide deck rendering are currently under development. The interactive lecture notes and module checkpoints below are demonstrative preview data.
              </p>
            </div>
          </div>

          {/* Next Class Card */}
          <div className="bg-white rounded-2xl border border-ink-border p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
                {nextClass.time}
              </span>
              <button
                type="button"
                onClick={() => setActiveTab('Resources')}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                View course resources
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bold text-ink">
                {nextClass.title}
              </h3>
              <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                {nextClass.description}
              </p>
            </div>

            {/* Lecture Material Bar */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-ink">Course Reference Deck</p>
                  <div className="flex items-center gap-2 text-[10px] text-ink-muted mt-0.5">
                    <span className="text-emerald-600 font-semibold">Available for study</span>
                    <span>•</span>
                    <span>PDF Document</span>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                size="xs"
                onClick={() => setActiveTab('Resources')}
                icon={Download}
                className="font-medium text-xs bg-white"
              >
                Browse Resources
              </Button>
            </div>

            {/* Prepare Note */}
            <div className="text-xs text-ink-muted bg-amber-50/70 p-3 rounded-xl border border-amber-200/80">
              <strong className="text-amber-900 font-semibold">Prepare:</strong>{' '}
              <span className="text-amber-800">{nextClass.prepare}</span>
            </div>
          </div>

          {/* Course Modules */}
          <div className="bg-white rounded-2xl border border-ink-border p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-ink">Course modules</h3>
              <span className="text-[11px] font-semibold text-ink-muted">
                Curriculum Structure
              </span>
            </div>

            <div className="space-y-3">
              {defaultModules.map((mod) => (
                <div
                  key={mod.id}
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="text-sm font-bold text-ink-muted w-6">
                      {mod.number}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-ink">{mod.title}</h4>
                      <p className="text-[11px] text-ink-muted mt-0.5">
                        {mod.summary}
                      </p>
                    </div>
                  </div>

                  <div>
                    {mod.status === 'complete' && (
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                    {mod.status === 'in_progress' && (
                      <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                        In progress
                      </span>
                    )}
                    {mod.status === 'locked' && (
                      <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Course Actions & Instructor */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-ink-border p-5 shadow-soft space-y-3">
            <h3 className="text-sm font-bold text-ink mb-1">Quick actions</h3>
            <div className="space-y-2.5">
              {thisWeekItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.tab) setActiveTab(item.tab);
                    else if (item.link) navigate(item.link);
                  }}
                  className="p-3 rounded-xl border-l-4 border-l-brand-500 bg-slate-50 hover:bg-brand-50/60 transition-colors cursor-pointer group flex items-center justify-between"
                >
                  <div>
                    <h5 className="text-xs font-bold text-ink group-hover:text-brand-600 transition-colors">
                      {item.title}
                    </h5>
                    <p className="text-[11px] text-ink-muted mt-0.5">
                      {item.time}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-ink-muted group-hover:text-brand-600 group-hover:translate-x-0.5 transition-transform" />
                </div>
              ))}
            </div>
          </div>

          {/* Your Instructor Card */}
          <div className="bg-white rounded-2xl border border-ink-border p-5 shadow-soft space-y-4">
            <h3 className="text-sm font-bold text-ink">Your instructor</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar
                  initials={instructorInitials}
                  size="md"
                  color="violet"
                />
                <div>
                  <h4 className="text-xs font-bold text-ink">{instructorName}</h4>
                  <p className="text-[11px] text-ink-muted mt-0.5">
                    Faculty Department Office Hours
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/messages')}
                className="p-2 rounded-xl bg-slate-100 hover:bg-brand-50 text-ink-muted hover:text-brand-600 transition-colors"
                title="Send message to instructor"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
