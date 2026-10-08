import React from 'react';
import { Button } from '../../components/ui/Button';
import { Download, Search } from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';

export function ProfessorGradebookPage() {
  const students = [
    { name: 'Maya Chen', initials: 'MC', q1: 19, q2: 18, lab1: 20, lab2: 18, avg: '92.4%' },
    { name: 'Jonah Lee', initials: 'JL', q1: 17, q2: 16, lab1: 18, lab2: 16, avg: '84.2%' },
    { name: 'Amara Reyes', initials: 'AR', q1: 20, q2: 19, lab1: 19, lab2: 17, avg: '94.0%' },
    { name: 'Theo Kim', initials: 'TK', q1: 18, q2: 17, lab1: 18, lab2: 18, avg: '88.5%' },
    { name: 'Nora Shah', initials: 'NS', q1: 16, q2: 0, lab1: 17, lab2: 0, avg: '68.0%' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink tracking-tight">Gradebook</h1>
          <p className="text-xs text-ink-muted mt-0.5">
            BIO 214 · Cell Biology · Fall 2026 Comprehensive Scores
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            icon={Download}
            onClick={() => alert('Exporting full gradebook CSV')}
            className="bg-white"
          >
            Export CSV
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-ink-border shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-ink-border text-ink-muted uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-3 text-center">Quiz 1 (20)</th>
                <th className="py-3 px-3 text-center">Quiz 2 (20)</th>
                <th className="py-3 px-3 text-center">Lab 01 (20)</th>
                <th className="py-3 px-3 text-center">Lab 02 (20)</th>
                <th className="py-3 px-4 text-right">Running Average</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {students.map((st, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar initials={st.initials} size="xs" color="brand" />
                      <span className="font-semibold text-ink">{st.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center font-mono">{st.q1}</td>
                  <td className="py-3 px-3 text-center font-mono">{st.q2}</td>
                  <td className="py-3 px-3 text-center font-mono">{st.lab1}</td>
                  <td className="py-3 px-3 text-center font-mono">{st.lab2}</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-600 font-mono">
                    {st.avg}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50 border-t border-ink-border font-bold text-ink">
              <tr>
                <td className="py-3 px-4">Class Average</td>
                <td className="py-3 px-3 text-center font-mono">18.0</td>
                <td className="py-3 px-3 text-center font-mono">14.0</td>
                <td className="py-3 px-3 text-center font-mono">18.4</td>
                <td className="py-3 px-3 text-center font-mono">13.8</td>
                <td className="py-3 px-4 text-right font-mono text-brand-600">88.4%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
