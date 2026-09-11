import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'success' | 'outline' | 'secondary' | 'ghost' | 'sos';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  let baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none';

  let variantStyles = '';
  switch (variant) {
    case 'danger':
      variantStyles = 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/25 active:bg-red-800';
      break;
    case 'sos':
      variantStyles = 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:to-rose-800 text-white shadow-xl shadow-red-600/40 border-2 border-red-400/50 animate-pulse-fast tracking-wider font-extrabold';
      break;
    case 'success':
      variantStyles = 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 active:bg-emerald-800';
      break;
    case 'secondary':
      variantStyles = 'bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600';
      break;
    case 'outline':
      variantStyles = 'border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800';
      break;
    case 'ghost':
      variantStyles = 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800';
      break;
    case 'primary':
    default:
      variantStyles = 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 active:bg-blue-800';
      break;
  }

  let sizeStyles = '';
  switch (size) {
    case 'sm':
      sizeStyles = 'px-3 py-1.5 text-xs gap-1.5';
      break;
    case 'lg':
      sizeStyles = 'px-5 py-3 text-base gap-2.5';
      break;
    case 'xl':
      sizeStyles = 'px-6 py-4 text-lg gap-3';
      break;
    case 'md':
    default:
      sizeStyles = 'px-4 py-2.5 text-sm gap-2';
      break;
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
