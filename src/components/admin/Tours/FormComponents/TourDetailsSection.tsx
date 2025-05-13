import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { Tour } from '../../../../services/tours.service';

interface TourDetailsSectionProps {
  formData: Partial<Tour>;
  handleArrayItemChange: (arrayName: 'highlights' | 'requirements' | 'included' | 'excluded', index: number, value: string) => void;
  addArrayItem: (arrayName: 'highlights' | 'requirements' | 'included' | 'excluded') => void;
  removeArrayItem: (arrayName: 'highlights' | 'requirements' | 'included' | 'excluded', index: number) => void;
}

const TourDetailsSection: React.FC<TourDetailsSectionProps> = ({
  formData,
  handleArrayItemChange,
  addArrayItem,
  removeArrayItem
}) => {
  return (
    <div className="p-4 sm:p-6 border-b border-gray-200">
      <h2 className="text-lg font-medium text-gray-900 mb-4 sm:mb-6">Tour Details</h2>
      
      {/* Highlights */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <label className="block text-sm font-medium text-gray-700">Highlights</label>
          <button
            type="button"
            onClick={() => addArrayItem('highlights')}
            className="inline-flex items-center p-1.5 border border-transparent rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand-500"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="space-y-3">
            {formData.highlights?.map((highlight, index) => (
              <div key={index} className="flex items-center gap-2 sm:gap-3">
                <span className="text-xs font-medium text-gray-500 w-6 flex-shrink-0">{index + 1}.</span>
                <div className="flex-grow min-w-0">
                  <input
                    type="text"
                    value={highlight}
                    onChange={(e) => handleArrayItemChange('highlights', index, e.target.value)}
                    placeholder="e.g. Breathtaking mountain views"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm px-3 py-2"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeArrayItem('highlights', index)}
                  className="p-1.5 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-100 hover:text-red-500 flex-shrink-0"
                >
                  <Minus className="h-3 w-3" />
                </button>
              </div>
            ))}
            {!formData.highlights?.length && (
              <div className="text-center py-6 text-sm text-gray-500 italic">
                <p>No highlights added yet</p>
                <button
                  type="button"
                  onClick={() => addArrayItem('highlights')}
                  className="mt-2 text-brand-600 font-medium hover:text-brand-700"
                >
                  Add your first highlight
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Requirements */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <label className="block text-sm font-medium text-gray-700">Requirements</label>
          <button
            type="button"
            onClick={() => addArrayItem('requirements')}
            className="inline-flex items-center p-1.5 border border-transparent rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand-500"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="space-y-3">
            {formData.requirements?.map((requirement, index) => (
              <div key={index} className="flex items-center gap-2 sm:gap-3">
                <span className="text-xs font-medium text-gray-500 w-6 flex-shrink-0">{index + 1}.</span>
                <div className="flex-grow min-w-0">
                  <input
                    type="text"
                    value={requirement}
                    onChange={(e) => handleArrayItemChange('requirements', index, e.target.value)}
                    placeholder="e.g. Comfortable hiking shoes"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm px-3 py-2"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeArrayItem('requirements', index)}
                  className="p-1.5 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-100 hover:text-red-500 flex-shrink-0"
                >
                  <Minus className="h-3 w-3" />
                </button>
              </div>
            ))}
            {!formData.requirements?.length && (
              <div className="text-center py-6 text-sm text-gray-500 italic">
                <p>No requirements added yet</p>
                <button
                  type="button"
                  onClick={() => addArrayItem('requirements')}
                  className="mt-2 text-brand-600 font-medium hover:text-brand-700"
                >
                  Add your first requirement
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Included */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <label className="block text-sm font-medium text-gray-700">What's Included</label>
          <button
            type="button"
            onClick={() => addArrayItem('included')}
            className="inline-flex items-center p-1.5 border border-transparent rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand-500"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="space-y-3">
            {formData.included?.map((included, index) => (
              <div key={index} className="flex items-center gap-2 sm:gap-3">
                <span className="text-xs font-medium text-gray-500 w-6 flex-shrink-0">{index + 1}.</span>
                <div className="flex-grow min-w-0">
                  <input
                    type="text"
                    value={included}
                    onChange={(e) => handleArrayItemChange('included', index, e.target.value)}
                    placeholder="e.g. Professional guide"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm px-3 py-2"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeArrayItem('included', index)}
                  className="p-1.5 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-100 hover:text-red-500 flex-shrink-0"
                >
                  <Minus className="h-3 w-3" />
                </button>
              </div>
            ))}
            {!formData.included?.length && (
              <div className="text-center py-6 text-sm text-gray-500 italic">
                <p>No inclusions added yet</p>
                <button
                  type="button"
                  onClick={() => addArrayItem('included')}
                  className="mt-2 text-brand-600 font-medium hover:text-brand-700"
                >
                  Add your first inclusion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Excluded */}
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <label className="block text-sm font-medium text-gray-700">What's Not Included</label>
          <button
            type="button"
            onClick={() => addArrayItem('excluded')}
            className="inline-flex items-center p-1.5 border border-transparent rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand-500"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="space-y-3">
            {formData.excluded?.map((excluded, index) => (
              <div key={index} className="flex items-center gap-2 sm:gap-3">
                <span className="text-xs font-medium text-gray-500 w-6 flex-shrink-0">{index + 1}.</span>
                <div className="flex-grow min-w-0">
                  <input
                    type="text"
                    value={excluded}
                    onChange={(e) => handleArrayItemChange('excluded', index, e.target.value)}
                    placeholder="e.g. Travel insurance"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm px-3 py-2"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeArrayItem('excluded', index)}
                  className="p-1.5 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-100 hover:text-red-500 flex-shrink-0"
                >
                  <Minus className="h-3 w-3" />
                </button>
              </div>
            ))}
            {!formData.excluded?.length && (
              <div className="text-center py-6 text-sm text-gray-500 italic">
                <p>No exclusions added yet</p>
                <button
                  type="button"
                  onClick={() => addArrayItem('excluded')}
                  className="mt-2 text-brand-600 font-medium hover:text-brand-700"
                >
                  Add your first exclusion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetailsSection;