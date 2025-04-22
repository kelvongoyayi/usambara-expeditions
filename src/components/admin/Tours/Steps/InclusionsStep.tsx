import React, { useEffect } from 'react';
import { Plus, Minus, Check, AlertCircle, ShieldCheck, ShieldX, ArrowRight } from 'lucide-react';

// Define the Tour type inline to avoid import issues
interface Tour {
  id?: string;
  title: string;
  slug?: string;
  description: string;
  price: number;
  included?: string[];
  excluded?: string[];
  [key: string]: any;
}

// Define FormErrors type inline
type FormErrors = Record<string, string>;

interface InclusionsStepProps {
  tour: Partial<Tour>;
  setTour: React.Dispatch<React.SetStateAction<Partial<Tour>>>;
  errors: FormErrors;
  isLoading: boolean;
}

const InclusionsStep: React.FC<InclusionsStepProps> = ({ tour, setTour, errors, isLoading }) => {
  // Filter out empty strings from arrays on component mount
  useEffect(() => {
    setTour(prev => {
      // Ensure included is always an array of non-empty strings
      const included = Array.isArray(prev.included) 
        ? prev.included.filter(item => item && item.trim()) 
        : [];
      
      // Ensure excluded is always an array of non-empty strings
      const excluded = Array.isArray(prev.excluded) 
        ? prev.excluded.filter(item => item && item.trim()) 
        : [];
      
      return {
        ...prev,
        included,
        excluded
      };
    });
  }, []);
  
  // Helper function to add items to arrays (inclusions/exclusions)
  const addItem = (field: 'included' | 'excluded') => {
    setTour((prev: Partial<Tour>) => {
      // Ensure we're working with an array
      const currentItems = Array.isArray(prev[field]) ? [...prev[field] as string[]] : [];
      
      return {
        ...prev,
        [field]: [...currentItems, '']
      };
    });
  };
  
  // Helper function to add a predefined item if it doesn't already exist
  const addPredefinedItem = (field: 'included' | 'excluded', item: string) => {
    setTour((prev: Partial<Tour>) => {
      // Ensure we're working with an array
      const currentItems = Array.isArray(prev[field]) ? [...prev[field] as string[]] : [];
      
      // Only add if not already in the list (case insensitive check)
      if (!currentItems.some(existing => existing.toLowerCase() === item.toLowerCase())) {
        return {
          ...prev,
          [field]: [...currentItems, item]
        };
      }
      return prev;
    });
  };
  
  // Helper function to remove items from arrays
  const removeItem = (field: 'included' | 'excluded', index: number) => {
    setTour((prev: Partial<Tour>) => {
      // Ensure we're working with an array
      const currentItems = Array.isArray(prev[field]) ? [...prev[field] as string[]] : [];
      
      // Only remove if index is valid
      if (index >= 0 && index < currentItems.length) {
        const updated = [...currentItems];
        updated.splice(index, 1);
        return { ...prev, [field]: updated };
      }
      
      return prev;
    });
  };
  
  // Helper function to update array items
  const updateItem = (field: 'included' | 'excluded', index: number, value: string) => {
    setTour((prev: Partial<Tour>) => {
      // Ensure we're working with an array
      const currentItems = Array.isArray(prev[field]) ? [...prev[field] as string[]] : [];
      
      // Only update if index is valid
      if (index >= 0 && index < currentItems.length) {
        const updated = [...currentItems];
        updated[index] = value;
        return { ...prev, [field]: updated };
      }
      
      return prev;
    });
  };
  
  // Helper function to add all common items at once
  const addAllCommonItems = (field: 'included' | 'excluded', items: string[]) => {
    setTour((prev: Partial<Tour>) => {
      // Ensure we're working with an array
      const currentItems = Array.isArray(prev[field]) ? [...prev[field] as string[]] : [];
      
      // Add only items that don't already exist
      const newItems = items.filter(item => 
        !currentItems.some(existing => existing.toLowerCase() === item.toLowerCase())
      );
      
      return {
        ...prev,
        [field]: [...currentItems, ...newItems]
      };
    });
  };
  
  // Common inclusions
  const commonInclusions = [
    'Professional guide', 
    'Transportation', 
    'Accommodation', 
    'Meals (Breakfast, Lunch, Dinner)', 
    'Entrance fees',
    'Water'
  ];
  
  // Common exclusions
  const commonExclusions = [
    'International flights', 
    'Travel insurance', 
    'Personal expenses', 
    'Alcoholic beverages', 
    'Tips & gratuities',
    'Visa fees'
  ];
  
  return (
    <div className="space-y-8">
      {/* Confirmation Info Box */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start mb-6">
        <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-medium text-green-800 mb-1">Your Tour Information Will Be Saved</h4>
          <p className="text-sm text-green-700">
            Any information you add here will be saved with your tour. Even though some features are marked as "coming soon", 
            your inclusions and exclusions will be saved and displayed on the tour details page.
          </p>
        </div>
      </div>
      
      {/* Inclusions Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-800">What's Included</h3>
        </div>
        
        <p className="text-gray-500 text-sm mb-6">
          List everything that is included in the tour package. Be specific to set clear expectations.
        </p>
        
        {/* Quick-add common inclusions */}
        <div className="mb-6 bg-green-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-green-800 mb-2">Quick Add Common Inclusions</p>
          <div className="flex flex-wrap gap-2">
            {commonInclusions.map(item => (
              <button
                key={item}
                type="button"
                onClick={() => addPredefinedItem('included', item)}
                className="px-3 py-1.5 bg-white text-green-700 border border-green-200 rounded hover:bg-green-100 text-sm flex items-center gap-1 transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                {item}
              </button>
            ))}
          </div>
        </div>
        
        <div className="space-y-3">
          {/* Inclusion items */}
          {(Array.isArray(tour.included) ? tour.included : []).map((item: string, index: number) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                value={item}
                onChange={(e) => updateItem('included', index, e.target.value)}
                className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                placeholder="e.g. Professional tour guide"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => removeItem('included', index)}
                disabled={isLoading}
                className="p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          {/* Add button */}
          <button
            type="button"
            onClick={() => addItem('included')}
            disabled={isLoading}
            className="mt-2 flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-800"
          >
            <Plus className="w-4 h-4" />
            Add Included Item
          </button>
          
          {/* Empty state with quick add button */}
          {(!Array.isArray(tour.included) || tour.included.length === 0) && (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-gray-500 text-sm mb-4">No inclusions added yet</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => addAllCommonItems('included', commonInclusions)}
                  className="px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 text-sm flex items-center gap-2 transition-colors mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Add All Common Inclusions
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Exclusions Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <ShieldX className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-800">What's Not Included</h3>
        </div>
        
        <p className="text-gray-500 text-sm mb-6">
          Clearly state what is NOT included in the tour price to avoid misunderstandings.
        </p>
        
        {/* Quick-add common exclusions */}
        <div className="mb-6 bg-red-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-red-800 mb-2">Quick Add Common Exclusions</p>
          <div className="flex flex-wrap gap-2">
            {commonExclusions.map(item => (
              <button
                key={item}
                type="button"
                onClick={() => addPredefinedItem('excluded', item)}
                className="px-3 py-1.5 bg-white text-red-700 border border-red-200 rounded hover:bg-red-100 text-sm flex items-center gap-1 transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                {item}
              </button>
            ))}
          </div>
        </div>
        
        <div className="space-y-3">
          {/* Exclusion items */}
          {(Array.isArray(tour.excluded) ? tour.excluded : []).map((item: string, index: number) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0">
                <Minus className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                value={item}
                onChange={(e) => updateItem('excluded', index, e.target.value)}
                className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                placeholder="e.g. International flights"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => removeItem('excluded', index)}
                disabled={isLoading}
                className="p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          {/* Add button */}
          <button
            type="button"
            onClick={() => addItem('excluded')}
            disabled={isLoading}
            className="mt-2 flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-800"
          >
            <Plus className="w-4 h-4" />
            Add Excluded Item
          </button>
          
          {/* Empty state with quick add button */}
          {(!Array.isArray(tour.excluded) || tour.excluded.length === 0) && (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-gray-500 text-sm mb-4">No exclusions added yet</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => addAllCommonItems('excluded', commonExclusions)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm flex items-center gap-2 transition-colors mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Add All Common Exclusions
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Tips Section with specific example */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start">
        <AlertCircle className="w-5 h-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-medium text-amber-800 mb-1">Ready to Submit Your Tour?</h4>
          <p className="text-sm text-amber-700 mb-2">
            Your inclusions and exclusions will help travelers understand what to expect. 
            If you're satisfied with the information, click "Create Tour" to save your new tour.
          </p>
          <div className="flex items-center gap-1 text-sm text-amber-800">
            <ArrowRight className="w-4 h-4" />
            <span className="font-medium">Tip:</span> Try using the quick-add buttons to save time!
          </div>
        </div>
      </div>
    </div>
  );
};

export default InclusionsStep; 