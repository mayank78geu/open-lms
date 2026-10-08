import React, { useState } from 'react';
import { MOCK_SUBMISSIONS_DATA } from '../../mocks/mockData';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import {
  Search,
  ChevronDown,
  Download,
  FileText,
  ExternalLink,
  MessageSquare,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function SubmissionsGradingPage() {
  const data = MOCK_SUBMISSIONS_DATA;
  const [selectedStudentId, setSelectedStudentId] = useState('s-maya-chen');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('all');

  // Grading states for current student
  const [students, setStudents] = useState(data.students);
  const currentStudent =
    students.find((s) => s.id === selectedStudentId) || students[0];

  const [score, setScore] = useState(currentStudent.grade.score);
  const [rubricScores, setRubricScores] = useState(
    currentStudent.grade.rubric.map((r) => r.score)
  );
  const [feedback, setFeedback] = useState(currentStudent.grade.feedback);
  const [gradeStatus, setGradeStatus] = useState(currentStudent.grade.status);
  const [isReturnSuccessModal, setIsReturnSuccessModal] = useState(false);

  // Sync state when switching student
  const handleSelectStudent = (student) => {
    setSelectedStudentId(student.id);
    setScore(student.grade.score);
    setRubricScores(student.grade.rubric.map((r) => r.score));
    setFeedback(student.grade.feedback);
    setGradeStatus(student.grade.status);
  };

  const handleRubricScoreChange = (idx, newScore) => {
    const updated = [...rubricScores];
    updated[idx] = Math.min(5, Math.max(0, Number(newScore)));
    setRubricScores(updated);
    const newTotal = updated.reduce((a, b) => a + b, 0);
    setScore(newTotal);
  };

  const handleReturnGrade = () => {
    setGradeStatus('Graded');
    setStudents((prev) =>
      prev.map((s) =>
        s.id === currentStudent.id
          ? {
              ...s,
              grade: {
                ...s.grade,
                score,
                feedback,
                status: 'Graded',
              },
            }
          : s
      )
    );
    setIsReturnSuccessModal(true);
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterTab === 'needs-grading') {
      return matchesSearch && s.status === 'Submitted' && s.grade.status === 'Draft';
    }
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Summary Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-ink tracking-tight">
              Submissions
            </h1>
            <span className="text-sm font-semibold text-ink-muted">
              {data.courseCode}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Summary tiles */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-ink-border text-xs font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>43 Submitted</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-ink-border text-xs font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>31 Graded</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-ink-border text-xs font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>3 Late</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-ink-border text-xs font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>2 Missing</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={Download}
            onClick={() => alert('Exporting all grades to CSV...')}
            className="font-medium text-xs bg-white"
          >
            Export grades
          </Button>
        </div>
      </div>

      {/* 3-Pane Workspace Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Pane 1 (3 cols): Students List */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-ink-border shadow-soft p-4 space-y-4">
          {/* Assignment Meta */}
          <div className="pb-3 border-b border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 block mb-0.5">
              {data.assignment.module}
            </span>
            <h3 className="text-xs font-bold text-ink leading-snug">
              {data.assignment.title}
            </h3>
            <p className="text-[11px] text-ink-muted mt-1 leading-tight">
              {data.assignment.dueLabel}
            </p>
          </div>

          {/* Search & Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-ink-muted" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs py-2 pl-8 pr-3 rounded-lg border border-ink-border focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>

            <div className="flex gap-1.5 text-[11px]">
              <button
                onClick={() => setFilterTab('all')}
                className={cn(
                  'px-2.5 py-1 rounded-md font-semibold transition-colors',
                  filterTab === 'all'
                    ? 'bg-slate-200 text-ink'
                    : 'text-ink-muted hover:text-ink'
                )}
              >
                All (48)
              </button>
              <button
                onClick={() => setFilterTab('needs-grading')}
                className={cn(
                  'px-2.5 py-1 rounded-md font-semibold transition-colors',
                  filterTab === 'needs-grading'
                    ? 'bg-amber-100 text-amber-800'
                    : 'text-ink-muted hover:text-ink'
                )}
              >
                Needs grading
              </button>
            </div>
          </div>

          {/* Students List */}
          <div className="space-y-1 divide-y divide-slate-50 max-h-[520px] overflow-y-auto">
            {filteredStudents.map((s) => {
              const isSelected = s.id === currentStudent.id;
              return (
                <div
                  key={s.id}
                  onClick={() => handleSelectStudent(s)}
                  className={cn(
                    'p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between',
                    isSelected
                      ? 'bg-brand-50/80 border border-brand-200 shadow-2xs'
                      : 'hover:bg-slate-50'
                  )}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <Avatar initials={s.initials} size="sm" color="brand" />
                    <div className="overflow-hidden">
                      <p
                        className={cn(
                          'text-xs truncate font-semibold',
                          isSelected ? 'text-brand-900 font-bold' : 'text-ink'
                        )}
                      >
                        {s.name}
                      </p>
                      <p className="text-[10px] text-ink-muted truncate">
                        {s.submittedAt}
                      </p>
                    </div>
                  </div>

                  <Badge
                    variant={
                      s.status === 'Submitted'
                        ? 'submitted'
                        : s.status === 'Late'
                        ? 'late'
                        : 'missing'
                    }
                    size="xs"
                  >
                    {s.status}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pane 2 (5 cols): Submission Document Viewer */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-ink-border shadow-soft p-6 space-y-5">
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <h2 className="text-base font-bold text-ink">{currentStudent.name}</h2>
              <p className="text-xs text-ink-muted mt-0.5">
                Submitted {currentStudent.submittedAt} · {currentStudent.onTimeText} ·{' '}
                {currentStudent.wordCount} words
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="xs"
                icon={FileText}
                onClick={() => alert('Viewing raw student file attachment.')}
                className="bg-white"
              >
                File
              </Button>
              <Button
                variant="outline"
                size="xs"
                icon={ExternalLink}
                onClick={() => alert('Opening full screen preview.')}
                className="bg-white"
              >
                Open
              </Button>
            </div>
          </div>

          {/* Submission Text Content */}
          <div className="prose prose-sm max-w-none text-ink space-y-4">
            <h3 className="text-sm font-bold text-ink leading-snug">
              {currentStudent.title}
            </h3>

            {currentStudent.id === 's-maya-chen' ? (
              <>
                <p className="text-xs text-ink leading-relaxed">
                  In our dialysis tubing investigation, the movement of iodine into the
                  model cell demonstrated passive transport across a selectively
                  permeable membrane. The color change was strongest in the sample with
                  the steepest concentration gradient, which aligned with our prediction.
                </p>

                <p className="text-xs text-ink leading-relaxed">
                  The evidence also helped me distinguish equilibrium from an absence of
                  molecular movement: particles continue moving randomly even when there
                  is no net change.
                </p>

                {/* Inline Comment Highlight Area as shown in Figma */}
                <div className="relative my-3 p-3 rounded-xl bg-amber-50/80 border-l-4 border-l-amber-500 border border-amber-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-200 px-2 py-0.5 rounded">
                      COMMENT 1
                    </span>
                    <span className="text-[10px] text-amber-700">Dr. Elena Park</span>
                  </div>
                  <p className="text-xs text-amber-950 italic leading-relaxed">
                    “If we repeated the investigation, I would use a broader range of
                    solute concentrations and measure mass at shorter intervals. This
                    would give us a clearer curve for the changing rate of osmosis over
                    time.”
                  </p>
                </div>
              </>
            ) : (
              <p className="text-xs text-ink leading-relaxed whitespace-pre-line">
                {currentStudent.content}
              </p>
            )}
          </div>
        </div>

        {/* Pane 3 (4 cols): Grade & Rubric Panel */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-ink-border shadow-soft p-6 space-y-6">
          {/* Big Grade Input Header */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                Grade
              </span>
              <Badge
                variant={gradeStatus === 'Graded' ? 'graded' : 'draft'}
                size="sm"
              >
                {gradeStatus}
              </Badge>
            </div>

            <div className="flex items-baseline gap-2">
              <input
                type="number"
                min={0}
                max={20}
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-20 text-3xl font-extrabold text-ink text-center py-1 border border-ink-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
              <span className="text-sm font-semibold text-ink-muted">
                / 20 points
              </span>
            </div>
          </div>

          {/* Rubric Breakdown */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-ink block mb-1">
              Grading Rubric
            </span>
            {currentStudent.grade.rubric.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs py-1.5 border-b border-slate-50"
              >
                <span className="text-ink font-medium">{item.name}</span>
                <div className="flex items-center gap-1 font-semibold text-ink">
                  <input
                    type="number"
                    min={0}
                    max={item.max}
                    value={rubricScores[idx] ?? item.score}
                    onChange={(e) => handleRubricScoreChange(idx, e.target.value)}
                    className="w-10 text-center py-0.5 rounded border border-ink-border font-bold text-brand-700"
                  />
                  <span className="text-ink-muted">/ {item.max}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Feedback Textarea */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-ink">Feedback</label>
              <span className="text-[10px] text-ink-muted">
                {feedback.length} / 2,000
              </span>
            </div>

            <textarea
              rows={4}
              maxLength={2000}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full text-xs text-ink p-3 rounded-xl border border-ink-border focus:outline-none focus:ring-2 focus:ring-brand-400 leading-relaxed"
              placeholder="Add personal feedback for the student..."
            />
          </div>

          {/* Return Grade Button */}
          <Button
            variant="primary"
            size="lg"
            onClick={handleReturnGrade}
            className="w-full font-bold shadow-sm"
          >
            Return grade to {currentStudent.name.split(' ')[0]}
          </Button>
        </div>
      </div>

      {/* Return Grade Success Modal */}
      <Modal
        isOpen={isReturnSuccessModal}
        onClose={() => setIsReturnSuccessModal(false)}
        title="Grade Returned Successfully"
        description={`The grade of ${score} / 20 points and your feedback have been sent to ${currentStudent.name}.`}
      >
        <div className="pt-4 flex justify-end">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsReturnSuccessModal(false)}
          >
            Done
          </Button>
        </div>
      </Modal>
    </div>
  );
}
