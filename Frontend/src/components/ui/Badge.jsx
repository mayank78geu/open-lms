import React from 'react';
import { cn } from '../../lib/utils';

export function Badge({ children, variant = 'default', size = 'sm', className, ...props }) {
  const variants = {
    default: 'bg-slate-100 text-ink-muted border border-slate-200',
    primary: 'bg-brand-50 text-brand-600 border border-brand-200 font-medium',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200 font-medium',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200 font-medium',
    violet: 'bg-violet-50 text-violet-700 border border-violet-200 font-medium',
    blue: 'bg-sky-50 text-sky-700 border border-sky-200 font-medium',
    dark: 'bg-navy-900 text-white font-medium',

    // Specific domain badges
    submitted: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    graded: 'bg-blue-50 text-blue-700 border border-blue-200',
    late: 'bg-rose-50 text-rose-700 border border-rose-200',
    missing: 'bg-amber-50 text-amber-700 border border-amber-200',
    draft: 'bg-amber-50 text-amber-700 border border-amber-200',
    quiz: 'bg-amber-50 text-amber-700 border border-amber-200',
    assignment: 'bg-violet-50 text-violet-700 border border-violet-200',
    class: 'bg-sky-50 text-sky-700 border border-sky-200',
    autoGraded: 'bg-slate-100 text-slate-700 border border-slate-200',
  };

  const sizes = {
    xs: 'text-[10px] px-1.5 py-0.5 rounded',
    sm: 'text-xs px-2.5 py-0.5 rounded-full',
    md: 'text-xs px-3 py-1 rounded-full font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center tracking-tight leading-none whitespace-nowrap',
        variants[variant] || variants.default,
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
