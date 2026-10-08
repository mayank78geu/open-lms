import React from 'react';
import { cn } from '../../lib/utils';

export function ProgressRing({
  value = 0,
  size = 110,
  strokeWidth = 9,
  label = 'WEEK DONE',
  showPercent = true,
  className,
  trackColor = 'rgba(255, 255, 255, 0.25)',
  progressColor = '#FFFFFF',
  textColor = 'text-white',
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedValue = Math.min(100, Math.max(0, value));
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="rotate-[-90deg] transition-all duration-500 ease-out"
      >
        {/* Background track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Dynamic progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className={cn('absolute inset-0 flex flex-col items-center justify-center text-center', textColor)}>
        {showPercent && (
          <span className="text-2xl font-bold tracking-tight leading-none">
            {clampedValue}%
          </span>
        )}
        {label && (
          <span className="text-[10px] font-semibold uppercase tracking-wider mt-0.5 opacity-90 leading-tight">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

export function ProgressBar({
  value = 0,
  max = 100,
  height = 'h-2',
  color = 'bg-brand-500',
  trackColor = 'bg-slate-100',
  showLabel = false,
  className,
}) {
  const percent = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-ink-muted mb-1 font-medium">
          <span>Progress</span>
          <span>{percent}%</span>
        </div>
      )}
      <div className={cn('w-full rounded-full overflow-hidden', trackColor, height)}>
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', color)}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
