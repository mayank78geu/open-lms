import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export const Button = React.forwardRef(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      children,
      disabled,
      type = 'button',
      icon: Icon,
      iconRight: IconRight,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none';

    const variants = {
      primary:
        'bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white shadow-sm focus:ring-brand-400',
      secondary:
        'bg-brand-50 text-brand-600 hover:bg-brand-100 hover:text-brand-700 focus:ring-brand-300',
      outline:
        'border border-ink-border bg-white text-ink hover:bg-slate-50 focus:ring-brand-300 shadow-sm',
      ghost:
        'text-ink-muted hover:text-ink hover:bg-slate-100/70 focus:ring-slate-300',
      danger:
        'bg-danger text-white hover:bg-red-600 active:bg-red-700 focus:ring-red-400 shadow-sm',
      dark:
        'bg-navy-900 text-white hover:bg-navy-800 active:bg-black focus:ring-navy-600 shadow-sm',
    };

    const sizes = {
      xs: 'text-xs px-2.5 py-1 rounded-md gap-1.5 h-7',
      sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5 h-8 font-medium',
      md: 'text-sm px-4 py-2 rounded-lg gap-2 h-10',
      lg: 'text-base px-6 py-2.5 rounded-xl gap-2.5 h-12',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          Icon && <Icon className="w-4 h-4 shrink-0" />
        )}
        {children}
        {!isLoading && IconRight && <IconRight className="w-4 h-4 shrink-0" />}
      </button>
    );
  }
);

Button.displayName = 'Button';
