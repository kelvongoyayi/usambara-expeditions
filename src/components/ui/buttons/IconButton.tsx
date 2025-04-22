import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { ButtonVariant, ButtonSize } from './Button';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  label: string;
  rounded?: 'full' | 'md' | 'lg';
  isLoading?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = 'primary',
  size = 'md',
  label,
  rounded = 'md',
  className = '',
  isLoading = false,
  disabled,
  ...props
}) => {
  const getVariantClasses = (): string => {
    switch (variant) {
      case 'primary':
        return 'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500';
      case 'secondary':
        return 'bg-gray-200 text-dark-800 hover:bg-gray-300 focus:ring-gray-300';
      case 'outline':
        return 'border-2 border-brand-600 text-brand-600 hover:bg-brand-50 focus:ring-brand-500';
      case 'text':
        return 'bg-transparent text-brand-600 hover:bg-brand-50 focus:ring-brand-500';
      case 'glass':
        return 'backdrop-blur-md bg-white/20 text-white border border-white/30 hover:bg-white/30 focus:ring-white';
      case 'accent':
        return 'bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-400';
      case 'danger':
        return 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400';
      default:
        return 'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500';
    }
  };

  const getSizeClasses = (): string => {
    switch (size) {
      case 'xs':
        return 'p-1';
      case 'sm':
        return 'p-1.5';
      case 'md':
        return 'p-2';
      case 'lg':
        return 'p-2.5';
      default:
        return 'p-2';
    }
  };

  const getIconSizeClasses = (): string => {
    switch (size) {
      case 'xs':
        return 'w-3 h-3';
      case 'sm':
        return 'w-4 h-4';
      case 'md':
        return 'w-5 h-5';
      case 'lg':
        return 'w-6 h-6';
      default:
        return 'w-5 h-5';
    }
  };

  const getRoundedClasses = (): string => {
    switch (rounded) {
      case 'full':
        return 'rounded-full';
      case 'md':
        return 'rounded-md';
      case 'lg':
        return 'rounded-lg';
      default:
        return 'rounded-md';
    }
  };

  const isDisabled = disabled || isLoading;
  
  return (
    <button
      className={`
        inline-flex items-center justify-center
        ${getRoundedClasses()}
        transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${isDisabled ? 'opacity-70 cursor-not-allowed' : ''}
        ${className}
      `}
      aria-label={label}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <span className={getIconSizeClasses()}>{icon}</span>
      )}
    </button>
  );
};

export default IconButton;