import React, { ReactNode, SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';

// Select Trigger Component
interface SelectTriggerProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const SelectTrigger: React.FC<SelectTriggerProps> = ({ 
  children, 
  className = '',
  onClick
}) => {
  return (
    <div 
      className={`flex items-center justify-between w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white cursor-pointer ${className}`}
      onClick={onClick}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </div>
  );
};

// Select Value Component 
interface SelectValueProps {
  children?: ReactNode;
  placeholder?: string;
}

export const SelectValue: React.FC<SelectValueProps> = ({ 
  children,
  placeholder
}) => {
  return (
    <span className="text-sm">
      {children || <span className="text-gray-400">{placeholder}</span>}
    </span>
  );
};

// Select Content Component
interface SelectContentProps {
  children: ReactNode;
  className?: string;
}

export const SelectContent: React.FC<SelectContentProps> = ({ 
  children,
  className = ''
}) => {
  return (
    <div className={`mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg border border-gray-300 ${className}`}>
      {children}
    </div>
  );
};

// Select Item Component
interface SelectItemProps {
  children: ReactNode;
  value: string;
  className?: string;
  onClick?: () => void;
}

export const SelectItem: React.FC<SelectItemProps> = ({ 
  children,
  value,
  className = '',
  onClick
}) => {
  return (
    <div
      className={`relative flex w-full cursor-pointer select-none items-center py-2 px-3 hover:bg-gray-100 ${className}`}
      onClick={onClick}
      data-value={value}
    >
      {children}
    </div>
  );
};

// Main Select Component
interface SelectProps {
  children: ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

const Select: React.FC<SelectProps> = ({ 
  children,
  value,
  onValueChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(value || '');
  
  const toggleOpen = () => setIsOpen(!isOpen);
  
  const handleSelect = (newValue: string) => {
    setSelectedValue(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
    setIsOpen(false);
  };
  
  // Clone and modify children to handle selection
  const modifiedChildren = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      if (child.type === SelectTrigger) {
        return React.cloneElement(child, {
          onClick: toggleOpen
        });
      }
      
      if (child.type === SelectContent && isOpen) {
        const contentChildren = React.Children.map(child.props.children, contentChild => {
          if (React.isValidElement(contentChild) && contentChild.type === SelectItem) {
            return React.cloneElement(contentChild, {
              onClick: () => handleSelect(contentChild.props.value)
            });
          }
          return contentChild;
        });
        
        return React.cloneElement(child, {}, contentChildren);
      }
    }
    return child;
  });
  
  return (
    <div className={`relative inline-block text-left ${className}`}>
      {isOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
      {modifiedChildren}
    </div>
  );
};

export default Select;