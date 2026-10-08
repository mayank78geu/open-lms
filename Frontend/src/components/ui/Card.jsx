import React from 'react';
import { cn } from '../../lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function Card({ children, className, hoverable = false, ...props }) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-ink-border/80 shadow-soft p-5',
        hoverable && 'transition-all duration-200 hover:shadow-card hover:border-slate-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  subtext,
  trend,
  trendPositive = true,
  icon: Icon,
  className,
}) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-ink-border/80 p-5 shadow-soft transition-all duration-200 hover:shadow-card',
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
          {label}
        </span>
        {Icon && (
          <div className="w-7 h-7 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-1.5">
        <div className="text-3xl font-extrabold text-ink tracking-tight">{value}</div>
        {trend && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 text-xs font-semibold',
              trendPositive ? 'text-success' : 'text-danger'
            )}
          >
            {trendPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {trend}
          </span>
        )}
      </div>

      {subtext && (
        <p className="text-xs text-ink-muted font-normal leading-relaxed">
          {subtext}
        </p>
      )}
    </div>
  );
}
