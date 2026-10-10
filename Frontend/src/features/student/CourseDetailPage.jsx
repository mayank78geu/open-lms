import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  MOCK_COURSE_DETAIL,
} from '../../mocks/mockData';
import { ProgressBar } from '../../components/ui/ProgressRing';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import {
  MessageSquare,
  FileText,
  Clock,
  CheckCircle2,
  Lock,
  ArrowRight,
  Download,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Calendar,
  Users,
  Award,
} from 'lucide-react';

export function CourseDetailPage() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState('Overview');
  const course = MOCK_COURSE_DETAIL;

  const tabs = ['Overview', 'Modules', 'Assignments', 'Quizzes', 'People', 'Grades'];

  return (
    <div className="space-y-6">
      {/* Top Header / Breadcrumb Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-ink-muted mb-1">
            <Link to="/student/classes" className="hover:text-brand-600">
              My classes
            </Link>
            <span>/</span>
            <span className="text-ink font-semibold">{course.code}</span>
          </div>
          <div className="flex items-baseline gap-3">
            <h1 className="text-2xl font-extrabold text-ink tracking-tight">
              {course.title}
            </h1>
            <span className="text-xs font-semibold text-ink-muted">
              {course.code} · {course.term}
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={MessageSquare}
          onClick={() => navigate('/messages')}
          className="border-slate-300 font-semibold text-xs"
        >
          Class discussion
        </Button>
      </div>

      {/* Dark Navy Course Header Card */}
      <div className="rounded-3xl bg-navy-900 text-white p-6 sm:p-8 shadow-card border border-navy-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          {/* Tile Icon */}
          <div className="w-14 h-14 rounded-2xl bg-violet-600 flex items-center justify-center text-white shrink-0 shadow-md">
            <BookOpen className="w-7 h-7" />
          </div>

          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-violet-400 mb-1">
              {course.code} · {course.section}
            </div>
            <h2 className="text-2xl font-bold text-white mb-1.5">{course.title}</h2>
            <p className="text-xs text-slate-300 font-normal">{course.schedule}</p>
          </div>
        </div>

        {/* Right Course Progress */}
        <div className="w-full md:w-64 space-y-2 shrink-0 bg-navy-800/80 p-4 rounded-2xl border border-navy-700/60">
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              COURSE PROGRESS
            </span>
            <span className="text-lg font-bold text-white">{course.progress}%</span>
          </div>
          <ProgressBar
            value={course.progress}
            color="bg-violet-500"
            trackColor="bg-navy-950"
            height="h-2"
          />
          <p className="text-[11px] text-slate-400 text-right">{course.weekStatus}</p>
        </div>
      </div>

      {/* Course Sub Navigation Tabs */}
      <div className="border-b border-ink-border flex gap-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-semibold transition-colors relative ${
              activeTab === tab
                ? 'text-brand-600 font-bold'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'Overview' && (
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
      )}

      {/* Modules tab preview */}
      {activeTab === 'Modules' && (
        <div className="bg-white rounded-2xl border border-ink-border p-6 shadow-soft space-y-4">
          <h3 className="text-base font-bold text-ink">Course Curriculum & Syllabus</h3>
          <p className="text-xs text-ink-muted">
            All 14 weeks of lecture modules, readings, and laboratory protocols for BIO 214.
          </p>
          <div className="space-y-3 pt-2">
            {course.modules.map((m) => (
              <div key={m.id} className="p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-brand-600">Module {m.number}</span>
                  <h4 className="text-sm font-bold text-ink">{m.title}</h4>
                  <p className="text-xs text-ink-muted mt-1">{m.summary}</p>
                </div>
                <Button variant="outline" size="xs">View Content</Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quizzes tab preview */}
      {activeTab === 'Quizzes' && (
        <div className="bg-white rounded-2xl border border-ink-border p-6 shadow-soft space-y-4">
          <h3 className="text-base font-bold text-ink">Course Quizzes & Assessments</h3>
          <div className="p-4 rounded-xl border border-brand-200 bg-brand-50/50 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Active Assessment</span>
              <h4 className="text-sm font-bold text-ink mt-1">Quiz 2: Cell structure & microscopy</h4>
              <p className="text-xs text-ink-muted mt-0.5">10 questions · 20 points · 25 minutes limit</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/student/classes/${course.id}/quizzes/quiz-2`)}
            >
              Start Quiz
            </Button>
          </div>
        </div>
      )}

      {/* Assignments tab preview */}
      {activeTab === 'Assignments' && (
        <div className="bg-white rounded-2xl border border-ink-border p-6 shadow-soft space-y-3">
          <h3 className="text-base font-bold text-ink">Course Assignments</h3>
          <div className="p-4 rounded-xl border border-slate-200 flex justify-between items-center">
            <div>
              <h4 className="text-sm font-bold text-ink">Lab reflection 03: Membrane transport</h4>
              <p className="text-xs text-ink-muted mt-0.5">Due Mon Oct 12 · 20 points</p>
            </div>
            <Badge variant="submitted">Submitted</Badge>
          </div>
        </div>
      )}

      {/* People tab */}
      {activeTab === 'People' && (
        <div className="bg-white rounded-2xl border border-ink-border p-6 shadow-soft space-y-3">
          <h3 className="text-base font-bold text-ink">Classmates & Faculty (48 Enrolled)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl border border-slate-200 flex items-center gap-3">
              <Avatar initials="PS" color="violet" size="sm" />
              <div>
                <p className="text-xs font-bold text-ink">Dr. Priya Sharma</p>
                <p className="text-[10px] text-ink-muted">Instructor</p>
              </div>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 flex items-center gap-3">
              <Avatar initials="RS" color="brand" size="sm" />
              <div>
                <p className="text-xs font-bold text-ink">Rahul Sharma</p>
                <p className="text-[10px] text-ink-muted">Student</p>
              </div>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 flex items-center gap-3">
              <Avatar initials="AV" color="blue" size="sm" />
              <div>
                <p className="text-xs font-bold text-ink">Arjun Verma</p>
                <p className="text-[10px] text-ink-muted">Student</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grades tab */}
      {activeTab === 'Grades' && (
        <div className="bg-white rounded-2xl border border-ink-border p-6 shadow-soft space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-ink">Grades & Weightings</h3>
              <p className="text-xs text-ink-muted">Total course grade: 92% (A)</p>
            </div>
          </div>
          <table className="w-full text-xs text-left">
            <thead className="border-b border-ink-border text-ink-muted uppercase">
              <tr>
                <th className="py-2">Item</th>
                <th className="py-2">Due</th>
                <th className="py-2">Score</th>
                <th className="py-2">Weight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 font-semibold text-ink">Quiz 1: Organelles</td>
                <td className="py-3 text-ink-muted">Sep 15</td>
                <td className="py-3 font-bold text-emerald-600">19 / 20</td>
                <td className="py-3 text-ink-muted">10%</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-ink">Lab reflection 02</td>
                <td className="py-3 text-ink-muted">Sep 22</td>
                <td className="py-3 font-bold text-emerald-600">18.5 / 20</td>
                <td className="py-3 text-ink-muted">15%</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
