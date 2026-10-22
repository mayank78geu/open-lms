import React from 'react';
import { Badge } from '../../../components/ui/Badge';

export function AssignmentsTab({ course }) {
  return (
    <div className="bg-white rounded-2xl border border-ink-border p-6 shadow-soft space-y-3">
      <h3 className="text-base font-bold text-ink">Course Assignments</h3>
      <div className="p-4 rounded-xl border border-slate-200 flex justify-between items-center">
        <div>
          <h4 className="text-sm font-bold text-ink">Lab reflection 03: Membrane transport</h4>
          <p className="text-xs text-ink-muted mt-0.5">Due Mon Oct 12 · 20 points</p>
        </div>
        <Badge variant="submitted">Submitted</Badge>
      </div>
    </div>
  );
}
