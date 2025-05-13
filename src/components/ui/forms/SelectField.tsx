import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label?: string;
  name: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  containerClassName?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  options,
  value,
  onChange,
  error,
  helperText,
  icon,
  required = false,
  disabled = false,
  placeholder,
  className = '',
  containerClassName = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };
  
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  
  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label 
          htmlFor={name} 
          className={`block text-xs sm:text-sm font-medium mb-1 sm:mb-1.5 ${error ? 'text-red-600' : 'text-dark-700'}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500">{icon}</span>
          </div>
        )}
        
        <select
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          className={`
            appearance-none rounded-lg shadow-sm border transition-all duration-200 text-sm
            ${icon ? 'pl-8 sm:pl-10' : 'pl-3 sm:pl-4'} 
            pr-8 sm:pr-10 py-2 sm:py-2.5 
            ${error 
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:ring-brand-500 focus:border-brand-500'
            }
            ${isFocused ? 'ring-2 ring-brand-500/20' : ''}
            ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}
            w-full
            ${className}
          `}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
          <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
        </div>
      </div>
      
      {(error || helperText) && (
        <p className={`mt-1 sm:mt-1.5 text-xs sm:text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default SelectField;