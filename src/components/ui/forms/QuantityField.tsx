import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantityFieldProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
}

const QuantityField: React.FC<QuantityFieldProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  error,
  helperText,
  disabled = false,
  className = '',
  containerClassName = ''
}) => {
  const increment = () => {
    if (max !== undefined && value >= max) return;
    onChange(value + step);
  };
  
  const decrement = () => {
    if (value <= min) return;
    onChange(value - step);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (isNaN(newValue)) return;
    
    if (max !== undefined && newValue > max) {
      onChange(max);
    } else if (newValue < min) {
      onChange(min);
    } else {
      onChange(newValue);
    }
  };
  
  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label className={`block text-sm font-medium mb-1.5 ${error ? 'text-red-600' : 'text-dark-700'}`}>
          {label}
        </label>
      )}
      
      <div className={`flex items-center ${className}`}>
        <button
          type="button"
          onClick={decrement}
          disabled={disabled || value <= min}
          className={`
            h-10 w-10 flex items-center justify-center rounded-l-lg border border-r-0
            ${disabled || value <= min 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }
            ${error ? 'border-red-300' : 'border-gray-300'}
          `}
        >
          <Minus className="w-4 h-4" />
        </button>
        
        <input
          type="number"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={`
            h-10 w-16 text-center border-y focus:outline-none focus:ring-0
            ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'}
            ${error ? 'border-red-300' : 'border-gray-300'}
          `}
        />
        
        <button
          type="button"
          onClick={increment}
          disabled={disabled || (max !== undefined && value >= max)}
          className={`
            h-10 w-10 flex items-center justify-center rounded-r-lg border border-l-0
            ${disabled || (max !== undefined && value >= max)
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }
            ${error ? 'border-red-300' : 'border-gray-300'}
          `}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      {(error || helperText) && (
        <p className={`mt-1.5 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default QuantityField;