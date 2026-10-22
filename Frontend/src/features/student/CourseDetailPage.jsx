import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MOCK_COURSE_DETAIL } from '../../mocks/mockData';
import { ProgressBar } from '../../components/ui/ProgressRing';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { MessageSquare, BookOpen } from 'lucide-react';
import { OverviewTab } from './course-tabs/OverviewTab';
import { ResourcesTab } from './course-tabs/ResourcesTab';
import { AssignmentsTab } from './course-tabs/AssignmentsTab';
import { QuizzesTab } from './course-tabs/QuizzesTab';
import { getCourse } from '../../lib/api/coursesApi';

export function CourseDetailPage() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState('Overview');
  const [course, setCourse] = useState(MOCK_COURSE_DETAIL);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;
    setIsLoading(true);
    getCourse(courseId)
      .then((data) => {
        if (data) {
          setCourse({
            ...MOCK_COURSE_DETAIL,
            ...data,
            id: data.courseId,
            title: data.courseName || data.title,
            code: data.courseCode || data.code,
            section: data.section || 'Section 01',
            instructor: data.professorName || data.instructor || 'Professor',
          });
        }
      })
      .catch((err) => console.error('Failed to get course:', err))
      .finally(() => setIsLoading(false));
  }, [courseId]);

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
      {activeTab === 'Overview' && <OverviewTab course={course} setActiveTab={setActiveTab} />}
      {activeTab === 'Modules' && <ResourcesTab course={course} courseId={courseId} />}
      {activeTab === 'Assignments' && <AssignmentsTab course={course} />}
      {activeTab === 'Quizzes' && <QuizzesTab course={course} />}

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
