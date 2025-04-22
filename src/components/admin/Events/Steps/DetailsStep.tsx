import React from 'react';
import { Event } from '../../../../services/events.service';
import {
  Button,
  Card,
  CardBody
} from '../../../../components/ui';
import { Plus, X } from 'lucide-react';

interface DetailsStepProps {
  formData: Partial<Event>;
  errors: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  setHighlights: React.Dispatch<React.SetStateAction<string[]>>;
  setInclusions: React.Dispatch<React.SetStateAction<string[]>>;
  setExclusions: React.Dispatch<React.SetStateAction<string[]>>;
}

const DetailsStep: React.FC<DetailsStepProps> = ({
  formData,
  errors,
  handleChange,
  highlights,
  inclusions,
  exclusions,
  setHighlights,
  setInclusions,
  setExclusions
}) => {
  // Dynamic list item handlers
  const handleAddItem = (listType: 'highlights' | 'inclusions' | 'exclusions') => {
    const setList = {
      highlights: setHighlights,
      inclusions: setInclusions,
      exclusions: setExclusions
    }[listType];
    
    setList(prev => [...prev, '']);
  };

  const handleRemoveItem = (listType: 'highlights' | 'inclusions' | 'exclusions', index: number) => {
    const setList = {
      highlights: setHighlights,
      inclusions: setInclusions,
      exclusions: setExclusions
    }[listType];
    
    setList(prev => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (
    listType: 'highlights' | 'inclusions' | 'exclusions',
    index: number,
    value: string
  ) => {
    const setList = {
      highlights: setHighlights,
      inclusions: setInclusions,
      exclusions: setExclusions
    }[listType];
    
    setList(prev => prev.map((item, i) => (i === index ? value : item)));
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-xl font-semibold text-gray-900 border-b pb-3">Event Details</h2>
      
      <div className="space-y-8">
        {/* Event Highlights */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Event Highlights</label>
          <p className="text-sm text-gray-500 mb-4">List the key highlights of your event that will attract attendees.</p>
          
          <div className="space-y-3">
            {highlights.map((highlight, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={highlight}
                  onChange={(e) => handleItemChange('highlights', index, e.target.value)}
                  placeholder="Add a highlight"
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-400"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveItem('highlights', index)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={() => handleAddItem('highlights')}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Highlight
            </Button>
          </div>
          {errors?.highlights && <p className="text-red-500 mt-2 text-sm">{errors.highlights}</p>}
        </div>
        
        {/* Pricing Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 required">Pricing Details</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Regular Price (TZS)</label>
              <input
                type="number"
                name="price"
                value={formData.price || ''}
                onChange={handleChange}
                placeholder="e.g., 250000"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-400"
              />
              {errors?.price && <p className="text-red-500 mt-1 text-sm">{errors.price}</p>}
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Discounted Price (Optional)</label>
              <input
                type="number"
                name="discounted_price"
                value={formData.discounted_price || ''}
                onChange={handleChange}
                placeholder="e.g., 200000"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-400"
              />
            </div>
          </div>
        </div>
        
        {/* What's Included */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">What's Included</label>
          <p className="text-sm text-gray-500 mb-4">List items that are included in the event price.</p>
          
          <div className="space-y-3">
            {inclusions.map((inclusion, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={inclusion}
                  onChange={(e) => handleItemChange('inclusions', index, e.target.value)}
                  placeholder="e.g., Transportation, Meals, Accommodation"
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-400"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveItem('inclusions', index)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={() => handleAddItem('inclusions')}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Inclusion
            </Button>
          </div>
        </div>
        
        {/* What's Not Included */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">What's Not Included</label>
          <p className="text-sm text-gray-500 mb-4">List items that are not included in the event price.</p>
          
          <div className="space-y-3">
            {exclusions.map((exclusion, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={exclusion}
                  onChange={(e) => handleItemChange('exclusions', index, e.target.value)}
                  placeholder="e.g., Personal expenses, Alcoholic beverages"
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-400"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveItem('exclusions', index)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={() => handleAddItem('exclusions')}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Exclusion
            </Button>
          </div>
        </div>
        
        {/* Tips for Writing Great Event Details */}
        <Card>
          <CardBody>
            <h3 className="font-semibold text-gray-800 mb-2">Tips for Writing Great Event Details</h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Be specific about what makes your event unique</li>
              <li>Highlight the main activities and experiences attendees will enjoy</li>
              <li>Clearly outline what's included in the price to avoid confusion</li>
              <li>Mention any special equipment, preparation, or requirements</li>
              <li>Be transparent about what costs extra to set proper expectations</li>
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default DetailsStep; 