import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  variant?: 'default' | 'dots' | 'minimal';
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  variant = 'default',
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // For dot pagination
  if (variant === 'dots') {
    return (
      <div className={`flex justify-center items-center gap-2 ${className}`}>
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="bg-brand-800/50 hover:bg-brand-700/60 w-8 h-8 rounded-full flex items-center justify-center text-white transition-all duration-300 disabled:opacity-50"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex gap-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => onPageChange(index + 1)}
              className={`transition-all duration-300 rounded-full ${
                currentPage === index + 1
                  ? 'bg-accent-500 w-8 h-2 hover:bg-accent-600'
                  : 'bg-brand-800/50 w-2 h-2 hover:bg-brand-700/60'
              }`}
              aria-label={`Go to page ${index + 1}`}
              aria-current={currentPage === index + 1 ? 'page' : undefined}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="bg-brand-800/50 hover:bg-brand-700/60 w-8 h-8 rounded-full flex items-center justify-center text-white transition-all duration-300 disabled:opacity-50"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // For minimal pagination (just prev/next)
  if (variant === 'minimal') {
    return (
      <div className={`flex justify-between items-center ${className}`}>
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="flex items-center py-2 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </button>
        
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="flex items-center py-2 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    );
  }

  // Default pagination with numbers
  return (
    <div className={`flex justify-center items-center space-x-2 ${className}`}>
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index + 1)}
          className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors ${
            currentPage === index + 1
              ? 'bg-brand-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
          aria-current={currentPage === index + 1 ? 'page' : undefined}
          aria-label={`Page ${index + 1}`}
        >
          {index + 1}
        </button>
      ))}

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;