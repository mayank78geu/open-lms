import React, { useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Upload, CheckCircle2, Clock, FileText } from 'lucide-react';

export function StudentAssignmentsPage() {
  const [activeTab, setActiveTab] = useState('todo');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  const assignments = [
    {
      id: 'as-1',
      title: 'Lab reflection 03: Membrane transport',
      course: 'BIO 214 · Cell Biology',
      due: 'Mon, Oct 12 · 11:59 PM',
      points: '20 pts',
      status: 'todo',
    },
    {
      id: 'as-2',
      title: 'Design critique: Figma mobile mockup',
      course: 'DES 202 · Interaction Design',
      due: 'Tomorrow · 2:00 PM',
      points: '15 pts',
      status: 'todo',
    },
    {
      id: 'as-3',
      title: 'Research brief: Qualitative study protocols',
      course: 'SOC 110 · Research Methods',
      due: 'Fri, Oct 9 · 11:59 PM',
      points: '25 pts',
      status: 'todo',
    },
    {
      id: 'as-4',
      title: 'Lab reflection 02: Enzyme kinetics',
      course: 'BIO 214 · Cell Biology',
      due: 'Submitted Sep 22',
      points: '18.5 / 20 pts',
      status: 'graded',
    },
  ];

  const filtered = assignments.filter((a) => {
    if (activeTab === 'todo') return a.status === 'todo';
    if (activeTab === 'graded') return a.status === 'graded';
    return true;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmittedSuccess(true);
    setTimeout(() => {
      setIsSubmittedSuccess(false);
      setSelectedAssignment(null);
      setSubmissionText('');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink tracking-tight">Assignments</h1>
          <p className="text-xs text-ink-muted mt-0.5">
            Track and submit your coursework across all enrolled classes.
          </p>
        </div>

        <div className="flex bg-white p-1 rounded-xl border border-ink-border text-xs font-semibold">
          <button
            onClick={() => setActiveTab('todo')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'todo' ? 'bg-brand-500 text-white' : 'text-ink-muted hover:text-ink'
            }`}
          >
            To do (3)
          </button>
          <button
            onClick={() => setActiveTab('graded')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'graded' ? 'bg-brand-500 text-white' : 'text-ink-muted hover:text-ink'
            }`}
          >
            Graded (1)
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'all' ? 'bg-brand-500 text-white' : 'text-ink-muted hover:text-ink'
            }`}
          >
            All
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white border border-ink-border shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
                  {item.course}
                </span>
                <h3 className="text-sm font-bold text-ink">{item.title}</h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  {item.due} · {item.points}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {item.status === 'todo' ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setSelectedAssignment(item)}
                >
                  Start submission
                </Button>
              ) : (
                <Badge variant="graded" size="md">
                  {item.points}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Submission Modal */}
      {selectedAssignment && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedAssignment(null)}
          title={selectedAssignment.title}
          description={`Submit your response for ${selectedAssignment.course}`}
        >
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-2">
                Written Response
              </label>
              <textarea
                rows={5}
                required
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                placeholder="Type or paste your reflection content here..."
                className="w-full text-xs text-ink p-3 rounded-xl border border-ink-border focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>

            <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center text-xs text-ink-muted hover:border-brand-400 transition-colors cursor-pointer">
              <Upload className="w-5 h-5 mx-auto text-brand-500 mb-1" />
              <span>Attach laboratory report (PDF, DOCX)</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedAssignment(null)}
              >
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                {isSubmittedSuccess ? 'Submitted!' : 'Submit assignment'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
