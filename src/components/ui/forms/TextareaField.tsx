import React, { useState } from 'react';

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  className?: string;
  containerClassName?: string;
}

const TextareaField: React.FC<TextareaFieldProps> = ({
  label,
  error,
  helperText,
  fullWidth = true,
  className = '',
  containerClassName = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);
    if (props.onFocus) props.onFocus(e);
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    if (props.onBlur) props.onBlur(e);
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <div className={`${widthClass} ${containerClassName}`}>
      {label && (
        <label 
          htmlFor={props.id || props.name} 
          className={`block text-sm font-medium mb-1.5 ${error ? 'text-red-600' : 'text-dark-700'}`}
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        className={`
          rounded-lg shadow-sm border transition-all duration-200
          px-4 py-2.5 
          ${error 
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 focus:ring-brand-500 focus:border-brand-500'
          }
          ${isFocused ? 'ring-2 ring-brand-500/20' : ''}
          ${widthClass}
          ${className}
        `}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      
      {(error || helperText) && (
        <p className={`mt-1.5 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default TextareaField;