import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, FileText, Download, CheckCircle2, Lock, ChevronRight, MessageSquare } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Avatar } from '../../../components/ui/Avatar';

export function OverviewTab({ course, setActiveTab }) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
      {/* Left Column (8 cols): Next Class & Modules */}
      <div className="lg:col-span-8 space-y-6">
        {/* Next Class Card */}
        <div className="bg-white rounded-2xl border border-ink-border p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
              {course.nextClass.time}
            </span>
            <a
              href="#notes"
              onClick={(e) => {
                e.preventDefault();
                alert('Opening Lecture Notes & Slide deck viewer.');
              }}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              Open notes
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div>
            <h3 className="text-lg font-bold text-ink">
              {course.nextClass.title}
            </h3>
            <p className="text-xs text-ink-muted mt-1 leading-relaxed">
              {course.nextClass.description}
            </p>
          </div>

          {/* Lecture Material Bar */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-ink">Lecture 9 Slides</p>
                <div className="flex items-center gap-2 text-[10px] text-ink-muted mt-0.5">
                  <span className="text-emerald-600 font-semibold">Slides ready</span>
                  <span>•</span>
                  <span>45 min presentation</span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="xs"
              onClick={() => alert('Downloading Lecture 9 slides PDF.')}
              icon={Download}
              className="font-medium text-xs bg-white"
            >
              Download
            </Button>
          </div>

          {/* Prepare Note */}
          <div className="text-xs text-ink-muted bg-amber-50/70 p-3 rounded-xl border border-amber-200/80">
            <strong className="text-amber-900 font-semibold">Prepare:</strong>{' '}
            <span className="text-amber-800">{course.nextClass.prepare}</span>
          </div>
        </div>

        {/* Course Modules */}
        <div className="bg-white rounded-2xl border border-ink-border p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-ink">Course modules</h3>
            <button
              onClick={() => setActiveTab('Modules')}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              View all
            </button>
          </div>

          <div className="space-y-3">
            {course.modules.map((mod) => (
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

      {/* Right Column (4 cols): This Week & Instructor */}
      <div className="lg:col-span-4 space-y-6">
        {/* This Week */}
        <div className="bg-white rounded-2xl border border-ink-border p-5 shadow-soft space-y-3">
          <h3 className="text-sm font-bold text-ink mb-1">This week</h3>
          <div className="space-y-2.5">
            {course.thisWeek.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(item.link)}
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
                initials={course.instructorInitials}
                size="md"
                color="violet"
              />
              <div>
                <h4 className="text-xs font-bold text-ink">{course.instructor}</h4>
                <p className="text-[11px] text-ink-muted mt-0.5">
                  {course.instructorOfficeHours}
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
  );
}
