import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgressBar } from '../../components/ui/ProgressRing';
import { Button } from '../../components/ui/Button';
import { Search, Plus, BookOpen, Clock, Users } from 'lucide-react';
import { COURSE_ACCENTS } from '../../lib/utils';

export function StudentClassesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const classes = [
    {
      id: 'bio-214',
      code: 'BIO 214',
      section: 'Section 02',
      title: 'Cell Biology',
      instructor: 'Dr. Elena Park',
      schedule: 'Tue / Thu · 10:30 AM',
      location: 'Lang Hall 204',
      progress: 72,
      accent: 'violet',
      term: 'Fall 2026',
    },
    {
      id: 'des-202',
      code: 'DES 202',
      section: 'Section 01',
      title: 'Interaction Design',
      instructor: 'Prof. Amir Solis',
      schedule: 'Mon / Wed · 2:00 PM',
      location: 'Studio 4B',
      progress: 48,
      accent: 'coral',
      term: 'Fall 2026',
    },
    {
      id: 'soc-110',
      code: 'SOC 110',
      section: 'Section 04',
      title: 'Research Methods',
      instructor: 'Dr. Nadia Brooks',
      schedule: 'Friday · 9:00 AM',
      location: 'Hall 101',
      progress: 86,
      accent: 'blue',
      term: 'Fall 2026',
    },
    {
      id: 'cog-301',
      code: 'COG 301',
      section: 'Section 01',
      title: 'Cognitive Neuroscience',
      instructor: 'Dr. Marcus Vance',
      schedule: 'Wed / Fri · 11:00 AM',
      location: 'Science 412',
      progress: 60,
      accent: 'emerald',
      term: 'Fall 2026',
    },
  ];

  const filtered = classes.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink tracking-tight">My Classes</h1>
          <p className="text-xs text-ink-muted mt-0.5">
            You are enrolled in {classes.length} active courses for Fall 2026.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-ink-muted" />
            <input
              type="text"
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs py-2 pl-8 pr-3 rounded-xl border border-ink-border focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((course) => {
          const accent = COURSE_ACCENTS[course.accent] || COURSE_ACCENTS.violet;
          return (
            <div
              key={course.id}
              onClick={() => navigate(`/student/classes/${course.id}`)}
              className="bg-white rounded-2xl border border-ink-border p-6 shadow-soft hover:shadow-card hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${accent.tile}`}>
                    {course.code}
                  </span>
                  <span className="text-xs text-ink-muted font-medium">{course.term}</span>
                </div>

                <h3 className="text-base font-bold text-ink group-hover:text-brand-600 transition-colors mb-1">
                  {course.title}
                </h3>
                <p className="text-xs text-ink-muted mb-4">{course.instructor}</p>

                <div className="space-y-1.5 text-xs text-ink-muted mb-6 bg-slate-50 p-3 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-brand-500" />
                    <span>{course.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>{course.location}</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-ink-muted uppercase tracking-wider text-[10px]">
                    Progress
                  </span>
                  <span className="text-ink">{course.progress}%</span>
                </div>
                <ProgressBar value={course.progress} color={accent.bar} height="h-2" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
