import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { MOCK_QUIZ_DATA } from '../../mocks/mockData';
import { formatTime, cn } from '../../lib/utils';
import {
  Clock,
  CheckCircle2,
  Flag,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  X,
  Sparkles,
  Award,
} from 'lucide-react';

export function QuizTakingPage() {
  const navigate = useNavigate();
  const { courseId, quizId } = useParams();

  const [quizData, setQuizData] = useState(MOCK_QUIZ_DATA);
  const [currentIdx, setCurrentIdx] = useState(3); // Question 4 of 10 (0-indexed 3)
  const [timeLeft, setTimeLeft] = useState(MOCK_QUIZ_DATA.timeLimitSeconds);
  const [savedStatus, setSavedStatus] = useState('Saved');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted]);

  const currentQ = quizData.questions[currentIdx];

  const handleSelectOption = (optionId) => {
    setSavedStatus('Saving...');
    const updated = { ...quizData };
    updated.questions[currentIdx].selectedAnswer = optionId;
    setQuizData(updated);
    setTimeout(() => {
      setSavedStatus('Saved');
    }, 400);
  };

  const handleToggleFlag = () => {
    const updated = { ...quizData };
    updated.questions[currentIdx].isFlagged = !updated.questions[currentIdx].isFlagged;
    setQuizData(updated);
  };

  const handleNext = () => {
    if (currentIdx < quizData.questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsSubmitModalOpen(true);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isSubmitModalOpen || isExitModalOpen || isSubmitted) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key.toLowerCase() === 'f') handleToggleFlag();
      if (['a', 'b', 'c', 'd'].includes(e.key.toLowerCase())) {
        handleSelectOption(e.key.toUpperCase());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIdx, isSubmitModalOpen, isExitModalOpen, isSubmitted]);

  // Statistics
  const answeredCount = quizData.questions.filter((q) => q.selectedAnswer !== null).length;
  const flaggedCount = quizData.questions.filter((q) => q.isFlagged).length;
  const remainingCount = quizData.questions.length - answeredCount;
  const progressPercent = Math.round(((currentIdx + 1) / quizData.questions.length) * 100);

  const handleSubmitQuiz = () => {
    setIsSubmitModalOpen(false);
    setIsSubmitted(true);
    // Grade calculation (in mock: 90% or 18/20)
    setScore({
      points: 18,
      maxPoints: 20,
      percent: 90,
    });
  };

  return (
    <div className="min-h-screen bg-page flex flex-col select-none">
      {/* Focus Mode Top Bar (No Sidebar) */}
      <header className="h-16 px-6 sm:px-10 bg-white border-b border-ink-border sticky top-0 z-30 flex items-center justify-between">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold text-xs">
            CF
          </div>
          <span className="font-bold text-base text-ink hidden sm:inline">CampusFlow</span>
        </div>

        {/* Center: Quiz Metadata */}
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
            {quizData.courseCode}
          </p>
          <h1 className="text-sm font-bold text-ink truncate max-w-xs sm:max-w-md">
            {quizData.title}
          </h1>
        </div>

        {/* Right: Autosave, Timer, Exit */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-ink-muted">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>{savedStatus}</span>
          </div>

          {/* Time Left Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-ink font-mono text-xs font-bold">
            <Clock className="w-3.5 h-3.5 text-brand-600" />
            <span>TIME LEFT</span>
            <span className="text-brand-600">{formatTime(timeLeft)}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsExitModalOpen(true)}
            className="text-xs font-semibold text-ink-muted hover:text-danger transition-colors"
          >
            Exit quiz
          </button>
        </div>
      </header>

      {/* Progress Strip */}
      <div className="bg-white border-b border-ink-border px-6 sm:px-10 py-2.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-ink-muted font-semibold mb-1.5">
          <span>Question {currentIdx + 1} of {quizData.questions.length}</span>
          <span>{progressPercent}% complete</span>
        </div>
        <div className="max-w-6xl mx-auto w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-brand-500 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main 3-Pane Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 sm:px-10 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Pane (3 cols): Question Navigator */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-ink-border p-5 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-ink">Questions</h3>
            <span className="text-xs text-ink-muted">{answeredCount}/{quizData.questions.length}</span>
          </div>

          {/* 10-Question Grid */}
          <div className="grid grid-cols-4 gap-2">
            {quizData.questions.map((q, idx) => {
              const isCurrent = idx === currentIdx;
              const isAnswered = q.selectedAnswer !== null;
              const isFlagged = q.isFlagged;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={cn(
                    'h-10 rounded-xl font-bold text-xs transition-all relative flex items-center justify-center',
                    isCurrent
                      ? 'bg-brand-500 text-white ring-2 ring-brand-300 ring-offset-2'
                      : isAnswered
                      ? 'bg-slate-200/90 text-slate-800 hover:bg-slate-300'
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'
                  )}
                >
                  {q.number}
                  {isFlagged && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 ring-1 ring-white" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-ink-muted">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-slate-300" />
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-brand-500" />
              <span>Current</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-slate-100 border border-slate-300" />
              <span>Not answered</span>
            </div>
          </div>

          <p className="text-[11px] text-ink-muted bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 leading-relaxed">
            Flag a question to revisit before submitting.
          </p>
        </div>

        {/* Center Pane (6 cols): Active Question Card */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-ink-border p-7 shadow-soft space-y-6">
          {/* Question Meta Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
              {currentQ.type}
            </span>
            <button
              type="button"
              onClick={handleToggleFlag}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors',
                currentQ.isFlagged
                  ? 'bg-amber-100 text-amber-800'
                  : 'text-ink-muted hover:bg-slate-100'
              )}
            >
              <Flag
                className={cn('w-3.5 h-3.5', currentQ.isFlagged ? 'fill-amber-600 text-amber-600' : '')}
              />
              <span>{currentQ.isFlagged ? 'Flagged' : 'Flag question'}</span>
            </button>
          </div>

          {/* Question Text */}
          <div className="text-base sm:text-lg font-bold text-ink leading-snug">
            {currentQ.text}
          </div>

          {/* Options A-D Radio-Cards */}
          <div className="space-y-3">
            {currentQ.options.map((opt) => {
              const isSelected = currentQ.selectedAnswer === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={cn(
                    'p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between group',
                    isSelected
                      ? 'border-brand-500 bg-brand-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  )}
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={cn(
                        'w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs transition-colors',
                        isSelected
                          ? 'bg-brand-500 text-white'
                          : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'
                      )}
                    >
                      {opt.id}
                    </span>
                    <span
                      className={cn(
                        'text-sm transition-colors',
                        isSelected ? 'font-bold text-brand-900' : 'text-ink'
                      )}
                    >
                      {opt.text}
                    </span>
                  </div>

                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={currentIdx === 0}
              icon={ArrowLeft}
            >
              Previous
            </Button>

            <button
              type="button"
              onClick={() => setSavedStatus('Saved')}
              className="text-xs font-semibold text-ink-muted hover:text-ink px-3 py-1"
            >
              Save answer
            </button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleNext}
              iconRight={ArrowRight}
            >
              {currentIdx === quizData.questions.length - 1 ? 'Review & submit' : 'Next question'}
            </Button>
          </div>
        </div>

        {/* Right Pane (3 cols): Dark "Before you submit" Card */}
        <div className="lg:col-span-3 bg-navy-900 text-white rounded-2xl p-6 shadow-card border border-navy-800 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white mb-2">Before you submit</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              You've answered {answeredCount} of {quizData.questions.length} questions. Unanswered questions will receive zero points.
            </p>
          </div>

          {/* Counts */}
          <div className="space-y-3 pt-1">
            <div className="flex justify-between items-center text-xs pb-2 border-b border-navy-800">
              <span className="text-slate-400">Answered</span>
              <span className="font-bold text-white">{answeredCount}</span>
            </div>
            <div className="flex justify-between items-center text-xs pb-2 border-b border-navy-800">
              <span className="text-slate-400">Flagged</span>
              <span className="font-bold text-amber-400">{flaggedCount}</span>
            </div>
            <div className="flex justify-between items-center text-xs pb-2 border-b border-navy-800">
              <span className="text-slate-400">Remaining</span>
              <span className="font-bold text-slate-300">{remainingCount}</span>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={() => setIsSubmitModalOpen(true)}
            className="w-full font-bold shadow-md"
          >
            Submit quiz
          </Button>
        </div>
      </main>

      {/* Submit Confirmation Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Ready to submit your quiz?"
        description="Once submitted, your responses will be evaluated and recorded."
      >
        <div className="space-y-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-ink-muted">Total Questions:</span>
              <span className="font-bold text-ink">{quizData.questions.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Answered:</span>
              <span className="font-bold text-emerald-600">{answeredCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Unanswered:</span>
              <span className="font-bold text-rose-600">{remainingCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Flagged for review:</span>
              <span className="font-bold text-amber-600">{flaggedCount}</span>
            </div>
          </div>

          {remainingCount > 0 && (
            <p className="text-xs text-amber-700 font-medium bg-amber-50 p-2.5 rounded-lg border border-amber-200">
              ⚠️ Warning: You have {remainingCount} unanswered questions that will count as 0.
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSubmitModalOpen(false)}
            >
              Return to quiz
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmitQuiz}
              className="font-bold"
            >
              Confirm and submit
            </Button>
          </div>
        </div>
      </Modal>

      {/* Exit Quiz Modal */}
      <Modal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
        title="Exit Quiz"
        description="Are you sure you want to exit? Your answers so far have been auto-saved, but the timer will continue running."
      >
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" size="sm" onClick={() => setIsExitModalOpen(false)}>
            Stay in quiz
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => navigate(`/student/classes/${courseId}`)}
          >
            Exit to course
          </Button>
        </div>
      </Modal>

      {/* Results Modal after Submission */}
      {isSubmitted && score && (
        <Modal
          isOpen={true}
          onClose={() => navigate(`/student/classes/${courseId}`)}
          title="Quiz Submitted Successfully!"
          maxWidth="max-w-md"
        >
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <p className="text-3xl font-extrabold text-ink">
                {score.points} / {score.maxPoints}
              </p>
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mt-1">
                Score: {score.percent}% · Grade: A
              </p>
            </div>

            <p className="text-xs text-ink-muted max-w-sm mx-auto">
              Great work! Your submission has been saved and your grade is now reflected in your course progress.
            </p>

            <Button
              variant="primary"
              size="md"
              className="w-full mt-4 font-bold"
              onClick={() => navigate(`/student/classes/${courseId}`)}
            >
              Return to Cell Biology
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
