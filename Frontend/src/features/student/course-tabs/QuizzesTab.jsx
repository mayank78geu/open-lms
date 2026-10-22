import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';

export function QuizzesTab({ course }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-ink-border p-6 shadow-soft space-y-4">
      <h3 className="text-base font-bold text-ink">Course Quizzes & Assessments</h3>
      <div className="p-4 rounded-xl border border-brand-200 bg-brand-50/50 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
            Active Assessment
          </span>
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
  );
}
