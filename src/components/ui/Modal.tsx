import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md' // Default size
}) => {

  // Effect to lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset'; // Or 'auto' if needed
    }

    // Cleanup function to ensure scroll is restored when component unmounts
    return () => {
      document.body.style.overflow = 'unset'; // Or 'auto'
    };
  }, [isOpen]); // Dependency array ensures this runs only when isOpen changes

  if (!isOpen) return null;

  // Determine modal width based on size prop
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  }[size];

  return (
    // Overlay
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out"
      onClick={onClose} // Close modal on overlay click
      aria-modal="true"
      role="dialog"
    >
      {/* Modal Content */}
      <div 
        className={`bg-white rounded-lg shadow-xl overflow-hidden transform transition-all duration-300 ease-in-out w-full m-4 ${sizeClasses}`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal content
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          {title && (
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          )}
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 -mr-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal; 