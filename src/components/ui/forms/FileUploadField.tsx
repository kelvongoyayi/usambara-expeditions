import React, { useState, useRef } from 'react';
import { Upload, X, File, Image, Check } from 'lucide-react';

interface FileUploadFieldProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  onChange: (files: File[]) => void;
  value?: File[];
  error?: string;
  helperText?: string;
  className?: string;
  containerClassName?: string;
  disabled?: boolean;
  preview?: boolean;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  accept,
  multiple = false,
  maxSize = 5, // Default 5MB
  onChange,
  value = [],
  error,
  helperText,
  className = '',
  containerClassName = '',
  disabled = false,
  preview = true
}) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const validateFiles = (files: File[]): { valid: File[], invalid: { file: File, reason: string }[] } => {
    const valid: File[] = [];
    const invalid: { file: File, reason: string }[] = [];
    
    for (const file of files) {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        invalid.push({ file, reason: `File size exceeds ${maxSize}MB limit` });
        continue;
      }
      
      // Check file type if accept is specified
      if (accept) {
        const acceptedTypes = accept.split(',').map(type => type.trim());
        const fileType = file.type;
        
        // Check if file type matches any of the accepted types
        const isAccepted = acceptedTypes.some(type => {
          if (type.startsWith('.')) {
            // Check file extension
            return file.name.toLowerCase().endsWith(type.toLowerCase());
          } else if (type.includes('*')) {
            // Handle wildcards like image/*
            return fileType.startsWith(type.split('*')[0]);
          } else {
            // Exact match
            return fileType === type;
          }
        });
        
        if (!isAccepted) {
          invalid.push({ file, reason: 'File type not accepted' });
          continue;
        }
      }
      
      valid.push(file);
    }
    
    return { valid, invalid };
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;
    
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const filesToProcess = multiple ? droppedFiles : [droppedFiles[0]];
      
      const { valid, invalid } = validateFiles(filesToProcess);
      
      if (invalid.length > 0) {
        console.error('Invalid files:', invalid);
        // You could add error handling here, like showing a toast
      }
      
      if (valid.length > 0) {
        onChange(multiple ? [...value, ...valid] : valid);
      }
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const filesToProcess = multiple ? selectedFiles : [selectedFiles[0]];
      
      const { valid, invalid } = validateFiles(filesToProcess);
      
      if (invalid.length > 0) {
        console.error('Invalid files:', invalid);
        // You could add error handling here, like showing a toast
      }
      
      if (valid.length > 0) {
        onChange(multiple ? [...value, ...valid] : valid);
      }
    }
  };
  
  const handleButtonClick = () => {
    if (inputRef.current && !disabled) {
      inputRef.current.click();
    }
  };
  
  const removeFile = (index: number) => {
    const newFiles = [...value];
    newFiles.splice(index, 1);
    onChange(newFiles);
  };
  
  const isImageFile = (file: File) => {
    return file.type.startsWith('image/');
  };
  
  const getFileIcon = (file: File) => {
    if (isImageFile(file)) {
      return <Image className="w-5 h-5 text-brand-600" />;
    }
    return <File className="w-5 h-5 text-brand-600" />;
  };
  
  const getFilePreview = (file: File) => {
    if (isImageFile(file) && preview) {
      return (
        <div className="relative w-16 h-16 rounded-md overflow-hidden mr-3">
          <img 
            src={URL.createObjectURL(file)} 
            alt={file.name} 
            className="w-full h-full object-cover"
            onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
          />
        </div>
      );
    }
    
    return (
      <div className="w-10 h-10 rounded-md bg-brand-50 flex items-center justify-center mr-3">
        {getFileIcon(file)}
      </div>
    );
  };
  
  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label className={`block text-xs sm:text-sm font-medium mb-1 sm:mb-1.5 ${error ? 'text-red-600' : 'text-dark-700'}`}>
          {label}
        </label>
      )}
      
      <div
        className={`
          border-2 border-dashed rounded-lg p-2 sm:p-4 transition-colors
          ${dragActive ? 'border-brand-500 bg-brand-50/50' : 'border-gray-300 hover:border-gray-400'}
          ${error ? 'border-red-300 bg-red-50/50' : ''}
          ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'cursor-pointer'}
          ${className}
        `}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />
        
        <div className="flex flex-col items-center justify-center py-2 sm:py-4">
          <div className="mb-2 sm:mb-3 p-1.5 sm:p-2 bg-brand-100 rounded-full">
            <Upload className="w-4 h-4 sm:w-6 sm:h-6 text-brand-600" />
          </div>
          <p className="text-xs sm:text-sm font-medium text-dark-700 mb-0.5 sm:mb-1">
            {multiple ? 'Upload files' : 'Upload a file'}
          </p>
          <p className="text-xs text-gray-500 text-center">
            {multiple ? 'Drag & drop files or click to browse' : 'Drag & drop a file or click to browse'}
          </p>
          {accept && (
            <p className="text-xs text-gray-500 mt-0.5 sm:mt-1 text-center">
              Accepted formats: {accept.split(',').join(', ')}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">
            Max size: {maxSize}MB
          </p>
        </div>
      </div>
      
      {/* File List */}
      {value.length > 0 && (
        <div className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2">
          {value.map((file, index) => (
            <div key={index} className="flex items-center bg-gray-50 p-1.5 sm:p-2 rounded-md">
              {getFilePreview(file)}
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-dark-700 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                disabled={disabled}
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {(error || helperText) && (
        <p className={`mt-1 sm:mt-1.5 text-xs sm:text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default FileUploadField;