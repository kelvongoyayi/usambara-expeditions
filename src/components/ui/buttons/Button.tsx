import React from 'react';
import { Link } from 'react-router-dom';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  onClick?: () => void;
  as?: 'button' | 'a';
  href?: string;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  type = 'button',
  className = '',
  onClick,
  as = 'button',
  href,
  rightIcon,
  leftIcon,
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-full';
  
  const variantClasses = {
    primary: 'bg-brand-600 hover:bg-brand-700 text-white focus:ring-brand-500 shadow-md hover:shadow-lg hover:-translate-y-1',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-dark-800 focus:ring-gray-300 shadow-sm hover:shadow hover:-translate-y-1',
    accent: 'bg-accent-500 hover:bg-accent-600 text-white focus:ring-accent-400 shadow-md hover:shadow-lg hover:-translate-y-1',
    outline: 'border-2 border-brand-600 text-brand-600 hover:bg-brand-50 focus:ring-brand-500 hover:-translate-y-1',
    ghost: 'text-brand-600 hover:bg-brand-50 focus:ring-brand-500',
    link: 'text-brand-600 hover:text-brand-700 underline focus:ring-brand-500 p-0'
  };
  
  const sizeClasses = {
    sm: 'text-sm px-4 py-1.5',
    md: 'text-base px-5 py-2.5',
    lg: 'text-lg px-7 py-3'
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';
  const widthClasses = fullWidth ? 'w-full' : '';
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${widthClasses} ${className}`;
  
  if (as === 'a' && href) {
    return (
      <Link to={href} className={classes} onClick={onClick}>
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">{rightIcon}</span>}
      </Link>
    );
  }
  
  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">{rightIcon}</span>}
    </button>
  );
};

export default Button;