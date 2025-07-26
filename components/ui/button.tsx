import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gradient' | 'floating';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  glow?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', glow = false, children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-2xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden group';
    
    const variants = {
      default: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 border border-white/20',
      
      destructive: 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 border border-white/20',
      
      outline: 'glass-card hover:bg-white/20 text-white border border-white/30 hover:border-white/50 hover:-translate-y-0.5',
      
      secondary: 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 border border-white/20',
      
      ghost: 'hover:bg-white/10 text-white/80 hover:text-white hover:-translate-y-0.5 backdrop-blur-sm rounded-2xl',
      
      link: 'text-blue-400 underline-offset-4 hover:underline hover:text-blue-300 transition-colors',
      
      gradient: 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-2xl hover:-translate-y-1 transform transition-all duration-300 border border-white/20',
      
      floating: 'floating-action-btn bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-2xl hover:shadow-3xl hover:scale-110 w-16 h-16 rounded-full border border-white/20 pulse-glow',
    };
    
    const sizes = {
      default: 'h-12 px-8 py-3',
      sm: 'h-10 rounded-xl px-6 text-sm',
      lg: 'h-14 rounded-3xl px-10 text-lg',
      icon: 'h-12 w-12',
    };
    
    const glowClass = glow ? 'shadow-glow' : '';
    const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${glowClass} ${className}`;
    
    return (
      <button
        className={classes}
        ref={ref}
        {...props}
      >
        {/* Shimmer effect for gradient buttons */}
        {(variant === 'default' || variant === 'gradient' || variant === 'floating') && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer" />
          </div>
        )}
        
        {/* Content */}
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };