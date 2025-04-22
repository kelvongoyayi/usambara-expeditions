import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface ArrayItemsEditorProps {
  title: string;
  items: string[];
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
}

const ArrayItemsEditor: React.FC<ArrayItemsEditorProps> = ({
  title,
  items,
  onChange,
  onAdd,
  onRemove,
  placeholder = "Enter item...",
  icon,
  className = ""
}) => {
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium text-gray-700 flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </label>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center p-1.5 border border-transparent rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand-500"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex items-center">
              <span className="text-xs font-medium text-gray-500 w-6 flex-shrink-0">{index + 1}.</span>
              <div className="flex-grow">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => onChange(index, e.target.value)}
                  placeholder={placeholder}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                />
              </div>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="ml-2 p-1.5 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-100 hover:text-red-500"
              >
                <Minus className="h-3 w-3" />
              </button>
            </div>
          ))}
          {!items.length && (
            <div className="text-center py-4 text-sm text-gray-500 italic">
              <p>No items added yet</p>
              <button
                type="button"
                onClick={onAdd}
                className="mt-2 text-brand-600 font-medium hover:text-brand-700"
              >
                Add your first item
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArrayItemsEditor;