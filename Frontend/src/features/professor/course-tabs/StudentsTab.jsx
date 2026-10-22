import React from 'react';

export function StudentsTab({ courseId, course }) {
  return (
    <div className="bg-white rounded-2xl border border-ink-border p-6 shadow-soft space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-ink">Enrolled Students</h3>
          <p className="text-xs text-ink-muted">Manage roster and active students for this course.</p>
        </div>
      </div>
      <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 text-xs text-ink-muted">
        No student roster modifications currently pending.
      </div>
    </div>
  );
}
