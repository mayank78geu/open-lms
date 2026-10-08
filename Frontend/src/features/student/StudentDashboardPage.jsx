import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { ProgressBar } from '../../components/ui/ProgressRing';
import { StatCard } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import {
  MOCK_STUDENT_DASHBOARD,
} from '../../mocks/mockData';
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { COURSE_ACCENTS } from '../../lib/utils';

export function StudentDashboardPage() {
  const navigate = useNavigate();
  const data = MOCK_STUDENT_DASHBOARD;
  const [isPlanDrawerOpen, setIsPlanDrawerOpen] = useState(false);

  return (
    <div className="space-y-7">
      {/* Hero Card: "Your week at a glance" */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#5044E4] via-[#5C50EA] to-[#6E4CEB] text-white p-7 sm:p-8 shadow-hero">
        {/* Subtle decorative glowing shapes */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute left-1/2 -top-12 w-64 h-64 rounded-full bg-white/5 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left Text */}
          <div className="max-w-xl space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-violet-200">
              {data.hero.eyebrow}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {data.hero.title}
            </h2>
            <p className="text-sm text-violet-100 font-normal leading-relaxed pr-4">
              {data.hero.body}
            </p>
          </div>

          {/* Right Progress Ring & CTA */}
          <div className="flex items-center gap-6 shrink-0 self-stretch md:self-auto justify-between md:justify-end">
            <ProgressRing
              value={data.hero.weekDonePercent}
              size={100}
              strokeWidth={8}
              label="WEEK DONE"
              trackColor="rgba(255, 255, 255, 0.2)"
              progressColor="#FFFFFF"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPlanDrawerOpen(true)}
              className="bg-white/95 text-brand-700 hover:bg-white hover:text-brand-800 border-none font-bold shadow-md rounded-xl text-xs px-4 py-2.5"
            >
              Review plan
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {data.stats.map((stat, idx) => (
          <StatCard
            key={idx}
            label={stat.label}
            value={stat.value}
            subtext={stat.subtext}
            trend={stat.trend}
            trendPositive={stat.trendPositive}
          />
        ))}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Left Column (8 cols): Continue Learning */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-ink tracking-tight">
              Continue learning
            </h3>
            <Link
              to="/student/classes"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline flex items-center gap-1"
            >
              View all classes
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Course Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {data.continueLearning.map((course) => {
              const accent = COURSE_ACCENTS[course.accent] || COURSE_ACCENTS.violet;
              return (
                <div
                  key={course.id}
                  onClick={() => navigate(`/student/classes/${course.id}`)}
                  className="bg-white rounded-2xl border border-ink-border/80 p-5 shadow-soft hover:shadow-card hover:border-slate-300 transition-all duration-200 cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    {/* Course Code Tile */}
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold ${accent.tile}`}
                      >
                        {course.code}
                      </div>
                      <span className="text-[11px] text-ink-muted group-hover:text-ink font-medium">
                        {course.schedule}
                      </span>
                    </div>

                    {/* Title & Instructor */}
                    <h4 className="text-sm font-bold text-ink group-hover:text-brand-600 transition-colors line-clamp-1 mb-1">
                      {course.title}
                    </h4>
                    <p className="text-xs text-ink-muted mb-6">
                      {course.instructor}
                    </p>
                  </div>

                  {/* Course Progress */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1.5 font-bold">
                      <span className="text-ink-muted uppercase tracking-wider text-[10px]">
                        COURSE PROGRESS
                      </span>
                      <span className="text-ink font-bold">{course.progress}%</span>
                    </div>
                    <ProgressBar
                      value={course.progress}
                      color={accent.bar}
                      height="h-1.5"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (4 cols): Upcoming Tasks */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-ink tracking-tight">Upcoming</h3>
            <Link
              to="/student/calendar"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline flex items-center gap-1"
            >
              Calendar
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-ink-border/80 shadow-soft p-3 divide-y divide-slate-100">
            {data.upcoming.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (item.quizId) {
                    navigate(`/student/classes/${item.courseId}/quizzes/${item.quizId}`);
                  } else {
                    navigate(`/student/classes/${item.courseId}`);
                  }
                }}
                className="py-3 px-2 flex items-center justify-between hover:bg-slate-50/80 rounded-xl transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  {/* Date chip */}
                  <div className="w-12 h-10 rounded-xl bg-slate-100 flex flex-col items-center justify-center text-center font-bold text-[10px] text-ink shrink-0 group-hover:bg-brand-50 group-hover:text-brand-700 transition-colors">
                    {item.dateChip}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-ink group-hover:text-brand-600 transition-colors line-clamp-1">
                      {item.title}
                    </h5>
                    <p className="text-[11px] text-ink-muted leading-tight mt-0.5">
                      {item.timeLabel}
                    </p>
                  </div>
                </div>

                <Badge
                  variant={item.type.toLowerCase()}
                  size="xs"
                  className="font-medium shrink-0 ml-2"
                >
                  {item.type}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Plan Drawer / Modal */}
      <Modal
        isOpen={isPlanDrawerOpen}
        onClose={() => setIsPlanDrawerOpen(false)}
        title="Weekly Learning Plan"
        description="Priority breakdown for Week 6 based on active course syllabi and upcoming deadlines."
      >
        <div className="space-y-3 pt-2">
          <div className="p-3 rounded-xl bg-violet-50 border border-violet-100 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
              1
            </span>
            <div>
              <p className="text-xs font-bold text-violet-900">Cell Biology Quiz 2</p>
              <p className="text-[11px] text-violet-700 mt-0.5">
                Starts at 10:30 AM today. 10 questions on cell structure & microscopy.
              </p>
              <Link
                to="/student/classes/bio-214/quizzes/quiz-2"
                className="text-xs font-semibold text-brand-600 underline mt-2 inline-block"
              >
                Launch quiz now →
              </Link>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
              2
            </span>
            <div>
              <p className="text-xs font-bold text-ink">Lab reflection 03 write-up</p>
              <p className="text-[11px] text-ink-muted mt-0.5">
                Due Monday 11:59 PM. Dialysis tubing data and membrane transport notes.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
              3
            </span>
            <div>
              <p className="text-xs font-bold text-ink">Design sprint critique prep</p>
              <p className="text-[11px] text-ink-muted mt-0.5">
                DES 202 wireframe upload due tomorrow at 2:00 PM.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button variant="primary" size="sm" onClick={() => setIsPlanDrawerOpen(false)}>
            Close plan
          </Button>
        </div>
      </Modal>
    </div>
  );
}
