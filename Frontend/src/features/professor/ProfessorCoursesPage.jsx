import React, { useState } from 'react';
import { ProgressBar } from '../../components/ui/ProgressRing';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Plus, Users, Clock, BookOpen } from 'lucide-react';
import { COURSE_ACCENTS } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

export function ProfessorCoursesPage() {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [courses, setCourses] = useState([
    {
      id: 'bio-214',
      code: 'BIO 214',
      title: 'Cell Biology',
      section: 'Section 02',
      enrolled: 48,
      nextClass: 'Today · 10:30 AM',
      progress: 64,
      accent: 'violet',
      classCode: 'BIO214',
    },
    {
      id: 'bio-311',
      code: 'BIO 311',
      title: 'Molecular Genetics',
      section: 'Section 01',
      enrolled: 36,
      nextClass: 'Tomorrow · 1:00 PM',
      progress: 72,
      accent: 'emerald',
      classCode: 'BIO311',
    },
    {
      id: 'bio-101',
      code: 'BIO 101',
      title: 'Foundations of Biology',
      section: 'Section 01',
      enrolled: 42,
      nextClass: 'Friday · 9:00 AM',
      progress: 81,
      accent: 'blue',
      classCode: 'BIO101',
    },
  ]);

  const [newCourse, setNewCourse] = useState({
    code: '',
    title: '',
    section: 'Section 01',
    schedule: 'Mon / Wed 10:00 AM',
  });

  const handleCreateCourse = (e) => {
    e.preventDefault();
    const created = {
      id: newCourse.code.toLowerCase().replace(/\s+/g, '-'),
      code: newCourse.code,
      title: newCourse.title,
      section: newCourse.section,
      enrolled: 0,
      nextClass: 'Next week',
      progress: 0,
      accent: 'violet',
      classCode: newCourse.code.replace(/\s+/g, '').toUpperCase(),
    };
    setCourses([...courses, created]);
    setIsCreateModalOpen(false);
    setNewCourse({ code: '', title: '', section: 'Section 01', schedule: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink tracking-tight">
            My Courses
          </h1>
          <p className="text-xs text-ink-muted mt-0.5">
            Manage your courses, syllabi, enrolled students, and class codes.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setIsCreateModalOpen(true)}
          className="font-bold text-xs"
        >
          Create course
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const accent = COURSE_ACCENTS[course.accent] || COURSE_ACCENTS.violet;
          return (
            <div
              key={course.id}
              onClick={() => navigate('/professor/submissions')}
              className="bg-white rounded-2xl border border-ink-border p-6 shadow-soft hover:shadow-card hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${accent.tile}`}>
                    {course.code}
                  </span>
                  <span className="text-xs font-mono font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                    Code: {course.classCode}
                  </span>
                </div>

                <h3 className="text-base font-bold text-ink group-hover:text-brand-600 transition-colors mb-1">
                  {course.title}
                </h3>
                <p className="text-xs text-ink-muted mb-4">{course.section}</p>

                <div className="space-y-2 text-xs text-ink-muted mb-6 bg-slate-50 p-3 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      Enrolled Students
                    </span>
                    <span className="font-bold text-ink">{course.enrolled}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Next Class
                    </span>
                    <span className="font-semibold text-ink">{course.nextClass}</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-ink-muted uppercase tracking-wider text-[10px]">
                    TERM PROGRESS
                  </span>
                  <span className="text-ink">{course.progress}%</span>
                </div>
                <ProgressBar value={course.progress} color={accent.bar} height="h-2" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Course Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Course"
        description="Add a new academic course to your teaching workspace."
      >
        <form onSubmit={handleCreateCourse} className="space-y-4 pt-2">
          <Input
            label="Course Code"
            placeholder="e.g. BIO 402"
            required
            value={newCourse.code}
            onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
          />
          <Input
            label="Course Title"
            placeholder="e.g. Advanced Cellular Biochemistry"
            required
            value={newCourse.title}
            onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
          />
          <Input
            label="Section"
            placeholder="e.g. Section 01"
            value={newCourse.section}
            onChange={(e) => setNewCourse({ ...newCourse, section: e.target.value })}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Create course
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
