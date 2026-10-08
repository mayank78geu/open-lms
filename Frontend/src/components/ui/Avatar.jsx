import React from 'react';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

export function Avatar({
  name,
  initials,
  src,
  size = 'md',
  color = 'brand',
  className,
}) {
  const sizeStyles = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm font-semibold',
    lg: 'w-12 h-12 text-base font-semibold',
    xl: 'w-16 h-16 text-lg font-bold',
  };

  const colorStyles = {
    brand: 'bg-brand-100 text-brand-700 border border-brand-200',
    violet: 'bg-violet-100 text-violet-700 border border-violet-200',
    coral: 'bg-rose-100 text-rose-700 border border-rose-200',
    blue: 'bg-sky-100 text-sky-700 border border-sky-200',
    emerald: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    amber: 'bg-amber-100 text-amber-700 border border-amber-200',
    navy: 'bg-navy-800 text-white border border-navy-700',
  };

  const displayText =
    initials ||
    (name ? name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'CF');

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={cn(
          'rounded-full object-cover shrink-0 border border-ink-border',
          sizeStyles[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-medium shrink-0 select-none shadow-2xs',
        colorStyles[color] || colorStyles.brand,
        sizeStyles[size],
        className
      )}
    >
      {displayText}
    </div>
  );
}

export function Modal({ isOpen, onClose, title, description, children, maxWidth = 'max-w-md' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={cn(
          'relative w-full bg-white rounded-2xl shadow-hero border border-ink-border p-6 z-10 transition-all transform animate-in fade-in zoom-in-95 duration-200',
          maxWidth
        )}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && <h3 className="text-lg font-bold text-ink">{title}</h3>}
            {description && (
              <p className="text-sm text-ink-muted mt-1">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-ink-muted hover:text-ink hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
