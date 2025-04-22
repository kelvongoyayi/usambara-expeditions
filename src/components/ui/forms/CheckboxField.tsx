import React from 'react';

interface CheckboxFieldProps {
  label: React.ReactNode;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  containerClassName?: string;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  name,
  checked,
  onChange,
  error,
  disabled = false,
  required = false,
  className = '',
  containerClassName = ''
}) => {
  return (
    <div className={`${containerClassName}`}>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id={name}
            name={name}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            required={required}
            className={`
              h-4 w-4 rounded border-gray-300 text-brand-600 
              focus:ring-brand-500 focus:ring-offset-0
              ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
              ${error ? 'border-red-300' : ''}
              ${className}
            `}
          />
        </div>
        <div className="ml-3 text-sm">
          <label 
            htmlFor={name} 
            className={`
              font-medium 
              ${disabled ? 'text-gray-500' : 'text-dark-700'} 
              ${error ? 'text-red-600' : ''}
              ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {label}
          </label>
        </div>
      </div>
      
      {error && (
        <p className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default CheckboxField;