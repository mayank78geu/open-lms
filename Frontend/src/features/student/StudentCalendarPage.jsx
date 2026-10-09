import React, { useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';

export function StudentCalendarPage() {
  const [currentWeek, setCurrentWeek] = useState('Week 6 (Oct 1 – Oct 7)');

  const events = [
    {
      id: 1,
      day: 'Thursday, Oct 1',
      items: [
        {
          time: '10:30 AM – 11:45 AM',
          title: 'BIO 214: Cell Biology Lecture & Quiz 2',
          location: 'Lang Hall 204',
          type: 'quiz',
          color: 'bg-amber-500',
        },
        {
          time: '2:00 PM – 4:00 PM',
          title: 'COG 301: Cognitive Science Lab Study',
          location: 'Science 412',
          type: 'class',
          color: 'bg-emerald-500',
        },
      ],
    },
    {
      day: 'Friday, Oct 2',
      items: [
        {
          time: '9:00 AM – 11:30 AM',
          title: 'SOC 110: Research Methods Discussion',
          location: 'Hall 101',
          type: 'class',
          color: 'bg-sky-500',
        },
        {
          time: '2:00 PM – 3:30 PM',
          title: 'DES 202: Prototype Critique Session',
          location: 'Studio 4B',
          type: 'assignment',
          color: 'bg-rose-500',
        },
      ],
    },
    {
      day: 'Monday, Oct 5',
      items: [
        {
          time: '11:59 PM',
          title: 'BIO 214: Lab Reflection 03 Due',
          location: 'Online submission',
          type: 'assignment',
          color: 'bg-violet-500',
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink tracking-tight">Calendar</h1>
          <p className="text-xs text-ink-muted mt-0.5">
            Fall 2026 Semester Schedule and Deadlines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-ink-border text-xs font-semibold">
            <CalendarIcon className="w-4 h-4 text-brand-600" />
            <span>{currentWeek}</span>
          </div>
          <div className="flex gap-1">
            <button className="p-2 rounded-lg bg-white border border-ink-border hover:bg-slate-50 text-ink">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg bg-white border border-ink-border hover:bg-slate-50 text-ink">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {events.map((ev, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-ink-border p-6 shadow-soft space-y-3">
            <h3 className="text-sm font-bold text-ink pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-500" />
              {ev.day}
            </h3>

            <div className="space-y-3 pt-1">
              {ev.items.map((it, itemIdx) => (
                <div
                  key={itemIdx}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex items-start gap-3">
                    <span className={`w-3 h-3 rounded-full mt-1 shrink-0 ${it.color}`} />
                    <div>
                      <h4 className="text-xs font-bold text-ink">{it.title}</h4>
                      <p className="text-[11px] text-ink-muted flex items-center gap-2 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{it.time}</span>
                        <span>•</span>
                        <span>{it.location}</span>
                      </p>
                    </div>
                  </div>

                  <Badge variant={it.type} size="xs">
                    {it.type.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
