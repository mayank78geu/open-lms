import React from 'react';

export function AssignmentsTab({ courseId, course }) {
  return (
    <div className="bg-white rounded-2xl border border-ink-border p-6 shadow-soft space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-ink">Course Assignments</h3>
          <p className="text-xs text-ink-muted">Create assignments and set due dates.</p>
        </div>
      </div>
      <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 text-xs text-ink-muted">
        No assignments created yet.
      </div>
    </div>
  );
}
