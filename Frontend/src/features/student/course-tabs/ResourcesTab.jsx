import React from 'react';
import { Button } from '../../../components/ui/Button';

export function ResourcesTab({ course }) {
  return (
    <div className="bg-white rounded-2xl border border-ink-border p-6 shadow-soft space-y-4">
      <h3 className="text-base font-bold text-ink">Course Curriculum & Syllabus</h3>
      <p className="text-xs text-ink-muted">
        All 14 weeks of lecture modules, readings, and laboratory protocols for {course.code}.
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
  );
}
