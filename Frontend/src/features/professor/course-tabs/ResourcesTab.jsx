import React from 'react';

export function ResourcesTab({ courseId, course }) {
  return (
    <div className="bg-white rounded-2xl border border-ink-border p-6 shadow-soft space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-ink">Course Resources</h3>
          <p className="text-xs text-ink-muted">Upload and organize slide decks, syllabi, and readings.</p>
        </div>
      </div>
      <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 text-xs text-ink-muted">
        No resources uploaded yet.
      </div>
    </div>
  );
}
