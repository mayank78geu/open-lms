import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StatCard } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressRing';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import {
  MOCK_PROFESSOR_DASHBOARD,
} from '../../mocks/mockData';
import {
  Clock,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { COURSE_ACCENTS } from '../../lib/utils';

export function ProfessorDashboardPage() {
  const navigate = useNavigate();
  const data = MOCK_PROFESSOR_DASHBOARD;

  return (
    <div className="space-y-7">
      {/* Hero Card: Teaching Overview */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#5044E4] via-[#5C50EA] to-[#6E4CEB] text-white p-7 sm:p-8 shadow-hero">
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

          {/* Right Mini Card: Next Class */}
          <div className="shrink-0 w-full md:w-auto">
            <div
              onClick={() => navigate('/professor/courses')}
              className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 transition-all cursor-pointer flex items-center justify-between gap-6"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-violet-200">
                    {data.hero.nextClass.time}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">
                  {data.hero.nextClass.course}
                </h4>
                <p className="text-xs text-violet-200 mt-0.5">
                  {data.hero.nextClass.location}
                </p>
              </div>

              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
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
        {/* Left Column (8 cols): Your Courses */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-ink tracking-tight">Your courses</h3>
            <Link
              to="/professor/courses"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline flex items-center gap-1"
            >
              Manage all
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-ink-border/80 shadow-soft p-5 divide-y divide-slate-100">
            {data.yourCourses.map((c) => {
              const accent = COURSE_ACCENTS[c.accent] || COURSE_ACCENTS.violet;
              return (
                <div
                  key={c.id}
                  onClick={() => navigate('/professor/courses')}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold ${accent.tile} shrink-0`}
                    >
                      {c.code}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-ink group-hover:text-brand-600 transition-colors">
                        {c.title}
                      </h4>
                      <p className="text-xs text-ink-muted mt-0.5">{c.meta}</p>
                    </div>
                  </div>

                  <div className="w-full sm:w-48 space-y-1">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-ink-muted uppercase tracking-wider text-[10px]">
                        TERM PROGRESS
                      </span>
                      <span className="text-ink">{c.progress}%</span>
                    </div>
                    <ProgressBar
                      value={c.progress}
                      color={accent.bar}
                      height="h-1.5"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (4 cols): Needs Attention & Recent Activity */}
        <div className="lg:col-span-4 space-y-6">
          {/* Needs Attention */}
          <div className="bg-white rounded-2xl border border-ink-border/80 shadow-soft p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink">Needs attention</h3>
              <Badge variant="default" size="xs">
                {data.needsAttention.badge}
              </Badge>
            </div>

            <div className="space-y-2.5">
              {data.needsAttention.items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate('/professor/submissions')}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-brand-50/60 transition-colors border border-slate-100 flex items-center justify-between cursor-pointer group"
                >
                  <div>
                    <h5 className="text-xs font-bold text-ink group-hover:text-brand-600 transition-colors">
                      {item.title}
                    </h5>
                    <p className="text-[11px] text-ink-muted mt-0.5">{item.meta}</p>
                  </div>
                  <Badge variant={item.badgeType} size="xs">
                    {item.badge}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-white rounded-2xl border border-ink-border/80 shadow-soft p-5 space-y-4">
            <h3 className="text-sm font-bold text-ink">Recent activity</h3>
            <div className="space-y-3.5">
              {data.recentActivity.map((act) => (
                <div key={act.id} className="flex items-start gap-3">
                  <Avatar
                    initials={act.initials}
                    size="sm"
                    color={act.color}
                  />
                  <div className="text-xs">
                    <p className="text-ink">
                      <strong className="font-bold">{act.name}</strong> {act.text}
                    </p>
                    <p className="text-[10px] text-ink-muted mt-0.5">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
