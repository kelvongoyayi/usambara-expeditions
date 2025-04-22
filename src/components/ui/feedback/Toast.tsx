import React, { ReactNode, useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';

type ToastVariant = 'info' | 'success' | 'warning' | 'error';

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  duration?: number;
  onClose: () => void;
  className?: string;
  visible?: boolean;
}

const Toast: React.FC<ToastProps> = ({
  message,
  variant = 'info',
  duration = 5000,
  onClose,
  className = '',
  visible = true,
}) => {
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  useEffect(() => {
    if (isVisible && duration) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for transition to finish
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for transition to finish
  };

  const getVariantClasses = (): { bgClass: string; iconComponent: ReactNode } => {
    switch (variant) {
      case 'info':
        return { 
          bgClass: 'bg-blue-50 border-blue-200 text-blue-800',
          iconComponent: <Info className="w-5 h-5 text-blue-400" />
        };
      case 'success':
        return { 
          bgClass: 'bg-green-50 border-green-200 text-green-800',
          iconComponent: <CheckCircle className="w-5 h-5 text-green-400" />
        };
      case 'warning':
        return { 
          bgClass: 'bg-yellow-50 border-yellow-200 text-yellow-800',
          iconComponent: <AlertTriangle className="w-5 h-5 text-yellow-400" />
        };
      case 'error':
        return { 
          bgClass: 'bg-red-50 border-red-200 text-red-800',
          iconComponent: <XCircle className="w-5 h-5 text-red-400" />
        };
      default:
        return { 
          bgClass: 'bg-blue-50 border-blue-200 text-blue-800',
          iconComponent: <Info className="w-5 h-5 text-blue-400" />
        };
    }
  };

  const { bgClass, iconComponent } = getVariantClasses();

  return (
    <div
      className={`
        max-w-sm w-full rounded-lg shadow-lg border p-4
        transform transition-all duration-300 ease-in-out
        ${bgClass}
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0 pointer-events-none'}
        ${className}
      `}
      role="alert"
    >
      <div className="flex">
        <div className="flex-shrink-0">
          {iconComponent}
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm">{message}</p>
        </div>
        <button
          type="button"
          className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 focus:outline-none focus:ring-2 focus:ring-gray-300"
          onClick={handleClose}
          aria-label="Close"
        >
          <span className="sr-only">Close</span>
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;