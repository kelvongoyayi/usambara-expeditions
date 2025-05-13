import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Trash2, ChevronUp, ChevronDown, X, Info, AlertCircle } from 'lucide-react';

// Define the itinerary day type to match database requirements
interface ItineraryDay {
  id: string;
  day_number: number;
  day?: number;  // Add day field for backward compatibility
  title: string;
  description: string;
  location?: string;
  distance?: string;
  difficulty?: string;
  accommodation?: string;
  meals: string[]; // Always an array of strings
  activities: string[]; // Always an array of strings
  elevation?: string;
}

interface ItineraryStepProps {
  formValues: {
    itinerary?: ItineraryDay[];
    [key: string]: any;
  };
  onChange: (values: any) => void;
  errors: Record<string, string>;
  onValidation?: (isValid: boolean) => void;
}

const ItineraryStep: React.FC<ItineraryStepProps> = ({
  formValues,
  onChange,
  errors,
  onValidation
}) => {
  // Main state for itinerary data
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  
  // Track which day is expanded
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Track form input values locally for each day to prevent flickering 
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  
  // Create a unique ID for new itinerary items
  const createId = () => `day_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  
  // Initialize itinerary data from props
  useEffect(() => {
    let initialItinerary: ItineraryDay[] = [];
    let initialInputs: Record<string, string> = {};
    let initialExpandedId: string | null = expandedId; // Start with current expanded state

    // Check if formValues.itinerary EXISTS and is an array before processing
    if (formValues.itinerary && Array.isArray(formValues.itinerary)) {
        if (formValues.itinerary.length > 0) {
            // Process non-empty itinerary
            initialItinerary = formValues.itinerary.map((day, index) => {
                const dayId = day.id || `day_${Date.now()}_${index}`; // Ensure ID exists
                
                // Handle both day and day_number formats
                const dayNumber = day.day_number || day.day || index + 1;
                
                const processedDay = {
                  ...day,
                  id: dayId,
                  day_number: dayNumber,
                  title: day.title || `Day ${dayNumber}`,
                  description: day.description || '',
                  location: day.location || '',
                  distance: day.distance || '',
                  difficulty: day.difficulty || '',
                  accommodation: day.accommodation || '',
                  meals: Array.isArray(day.meals) ? [...day.meals] : 
                         (typeof day.meals === 'string' ? day.meals.split(',').map(m => m.trim()).filter(Boolean) : []),
                  activities: Array.isArray(day.activities) ? [...day.activities] : 
                              (typeof day.activities === 'string' ? day.activities.split(',').map(a => a.trim()).filter(Boolean) : []),
                  elevation: day.elevation || ''
                };
                
                // Populate initialInputs here directly
                initialInputs[`title_${dayId}`] = processedDay.title;
                initialInputs[`description_${dayId}`] = processedDay.description;
                initialInputs[`location_${dayId}`] = processedDay.location || '';
                initialInputs[`accommodation_${dayId}`] = processedDay.accommodation || '';
                initialInputs[`distance_${dayId}`] = processedDay.distance || '';
                initialInputs[`difficulty_${dayId}`] = processedDay.difficulty || '';
                initialInputs[`elevation_${dayId}`] = processedDay.elevation || '';
                
                return processedDay;
            });
            
            console.log('Processed itinerary in form:', initialItinerary);
            
            // Expand the first day only if nothing was previously expanded or the expanded item is gone
            if (!initialExpandedId || !initialItinerary.some(d => d.id === initialExpandedId)) {
                initialExpandedId = initialItinerary[0]?.id || null;
            }
            
        } else {
            // Handle explicitly empty itinerary array
            initialItinerary = [];
            initialInputs = {};
            initialExpandedId = null;
        }
    } else {
        // Handle case where formValues.itinerary is initially undefined or not an array
        console.warn("ItineraryStep received undefined or non-array itinerary prop.");
        initialItinerary = [];
        initialInputs = {};
        initialExpandedId = null;
    }

    // Set all states together AFTER processing
    setItinerary(initialItinerary);
    setInputValues(initialInputs);
    
    // Only update expandedId if it needs to change
    if (expandedId !== initialExpandedId) { // Check if the calculated expandedId is different
      setExpandedId(initialExpandedId);
    }

  }, [formValues.itinerary]); // Dependency is the itinerary array itself
  
  // Update parent component when itinerary changes
  useEffect(() => {
    if (itinerary.length === 0 && formValues.itinerary?.length === 0) {
      // Don't update if both are empty
      return;
    }
    
    // Prepare itinerary data for parent component
    const processedItinerary = itinerary.map(day => ({
      ...day,
      // Use input values for text fields to get the latest values
      title: inputValues[`title_${day.id}`] || day.title,
      description: inputValues[`description_${day.id}`] || day.description,
      location: inputValues[`location_${day.id}`] || day.location,
      accommodation: inputValues[`accommodation_${day.id}`] || day.accommodation,
      distance: inputValues[`distance_${day.id}`] || day.distance,
      difficulty: inputValues[`difficulty_${day.id}`] || day.difficulty,
      elevation: inputValues[`elevation_${day.id}`] || day.elevation
    }));
    
    // Update parent state
    onChange({
      ...formValues,
      itinerary: processedItinerary
    });
    
    // Run validation if provided
    if (onValidation) {
      onValidation(itinerary.length > 0);
    }
  }, [itinerary, inputValues]);
  
  // Handle text input changes
  const handleInputChange = (dayId: string, field: string, value: string) => {
    setInputValues(prev => ({
      ...prev,
      [`${field}_${dayId}`]: value
    }));
  };
  
  // Add a new day to the itinerary
  const addDay = () => {
    const newId = createId();
    const dayNumber = itinerary.length + 1;
    const newDay: ItineraryDay = {
      id: newId,
      day_number: dayNumber,
      title: `Day ${dayNumber}`,
      description: '',
      location: '',
      distance: '',
      difficulty: '',
      accommodation: '',
      meals: [],
      activities: [],
      elevation: ''
    };
    
    // Update itinerary state
    const updatedItinerary = [...itinerary, newDay];
    setItinerary(updatedItinerary);
    
    // Add initial input values
    setInputValues(prev => ({
      ...prev,
      [`title_${newId}`]: newDay.title,
      [`description_${newId}`]: '',
      [`location_${newId}`]: '',
      [`accommodation_${newId}`]: '',
      [`distance_${newId}`]: '',
      [`difficulty_${newId}`]: '',
      [`elevation_${newId}`]: ''
    }));
    
    // Expand the new day
    setExpandedId(newId);
  };
  
  // Remove a day from the itinerary
  const removeDay = (id: string) => {
    // Filter out the removed day and update day numbers
    const updatedItinerary = itinerary
      .filter(day => day.id !== id)
      .map((day, index) => ({
        ...day,
        day_number: index + 1,
        // Update the title if it's a default title
        title: day.title.startsWith('Day ') ? `Day ${index + 1}` : day.title
      }));
    
    setItinerary(updatedItinerary);
    
    // If the expanded day was removed, expand another one or collapse all
    if (expandedId === id) {
      if (updatedItinerary.length > 0) {
        setExpandedId(updatedItinerary[0].id);
      } else {
        setExpandedId(null);
      }
    }
  };
  
  // Move a day up in the order
  const moveUp = (index: number) => {
    if (index === 0) return; // Can't move up the first item
    
    const updatedItinerary = [...itinerary];
    // Swap current day with the one above it
    [updatedItinerary[index - 1], updatedItinerary[index]] = 
    [updatedItinerary[index], updatedItinerary[index - 1]];
    
    // Update day numbers and titles
    updatedItinerary.forEach((day, i) => {
      day.day_number = i + 1;
      if (day.title.startsWith('Day ')) {
        day.title = `Day ${i + 1}`;
        setInputValues(prev => ({
          ...prev,
          [`title_${day.id}`]: `Day ${i + 1}`
        }));
      }
    });
    
    setItinerary(updatedItinerary);
  };
  
  // Move a day down in the order
  const moveDown = (index: number) => {
    if (index === itinerary.length - 1) return; // Can't move down the last item
    
    const updatedItinerary = [...itinerary];
    // Swap current day with the one below it
    [updatedItinerary[index], updatedItinerary[index + 1]] = 
    [updatedItinerary[index + 1], updatedItinerary[index]];
    
    // Update day numbers and titles
    updatedItinerary.forEach((day, i) => {
      day.day_number = i + 1;
      if (day.title.startsWith('Day ')) {
        day.title = `Day ${i + 1}`;
        setInputValues(prev => ({
          ...prev,
          [`title_${day.id}`]: `Day ${i + 1}`
        }));
      }
    });
    
    setItinerary(updatedItinerary);
  };
  
  // Add a meal to a day
  const addMeal = (dayId: string, meal: string) => {
    if (!meal || !meal.trim()) return;
    
    setItinerary(prev => prev.map(day => {
      if (day.id === dayId) {
        const currentMeals = [...day.meals];
        // Only add if it doesn't already exist
        if (!currentMeals.includes(meal.trim())) {
          return {
            ...day,
            meals: [...currentMeals, meal.trim()]
          };
        }
      }
      return day;
    }));
  };
  
  // Remove a meal from a day
  const removeMeal = (dayId: string, index: number) => {
    setItinerary(prev => prev.map(day => {
      if (day.id === dayId) {
        const updatedMeals = [...day.meals];
        updatedMeals.splice(index, 1);
        return {
          ...day,
          meals: updatedMeals
        };
      }
      return day;
    }));
  };
  
  // Add an activity to a day
  const addActivity = (dayId: string, activity: string) => {
    if (!activity || !activity.trim()) return;
    
    setItinerary(prev => prev.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          activities: [...day.activities, activity.trim()]
        };
      }
      return day;
    }));
  };
  
  // Remove an activity from a day
  const removeActivity = (dayId: string, index: number) => {
    setItinerary(prev => prev.map(day => {
      if (day.id === dayId) {
        const updatedActivities = [...day.activities];
        updatedActivities.splice(index, 1);
        return {
          ...day,
          activities: updatedActivities
        };
      }
      return day;
    }));
  };
  
  // Get error class for an input field
  const getErrorClass = (dayIndex: number, field: string) => {
    return errors[`itinerary[${dayIndex}].${field}`] ? 'border-red-300' : 'border-gray-300';
  };
  
  // Get value for an input field from local state or fallback to prop value
  const getInputValue = (dayId: string, field: string, fallback: string = '') => {
    return inputValues[`${field}_${dayId}`] !== undefined 
      ? inputValues[`${field}_${dayId}`] 
      : fallback;
  };
  
  // Render component
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Empty State - Show if no days */}
      {itinerary.length === 0 && (
        <div className="bg-white p-8 text-center border border-gray-200 rounded-lg">
          <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-gray-800 font-semibold text-lg mb-2">Create Your Tour Itinerary</h3>
          <p className="text-gray-500 mb-6 max-w-lg mx-auto">
            Add day-by-day details to help travelers understand what they'll experience on your tour.
          </p>
          <button
            type="button"
            onClick={addDay}
            className="inline-flex items-center px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add First Day
          </button>
        </div>
      )}
      
      {/* Validation error */}
      {errors.itinerary && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error: {errors.itinerary}</p>
            <p className="text-sm mt-1">Please add at least one day to your itinerary with title and description.</p>
          </div>
        </div>
      )}
      
      {/* Itinerary Days */}
      {itinerary.map((day, index) => (
        <div
          key={day.id}
          className={`border rounded-lg transition-all duration-200 ${
            expandedId === day.id 
              ? 'border-brand-300 shadow-md' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          {/* Day Header - Always visible */}
          <div className="p-3 sm:p-4 bg-white flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                {day.day_number}
              </div>
              
              {expandedId === day.id ? (
                <input
                  type="text"
                  value={getInputValue(day.id, 'title', day.title)}
                  onChange={(e) => handleInputChange(day.id, 'title', e.target.value)}
                  className={`flex-1 min-w-0 px-2 py-1 text-sm sm:text-base font-medium border rounded focus:outline-none focus:ring-1 focus:ring-brand-500 ${
                    getErrorClass(index, 'title')
                  }`}
                  placeholder="Day title"
                />
              ) : (
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm sm:text-base text-gray-900 truncate">
                    {getInputValue(day.id, 'title', day.title)}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">
                    {day.activities.length} activities
                    {day.location ? ` • ${day.location}` : ''}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Reorder Controls */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className={`p-1 ${index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-gray-600'}`}
                  aria-label="Move day up"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveDown(index)}
                  disabled={index === itinerary.length - 1}
                  className={`p-1 ${index === itinerary.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-gray-600'}`}
                  aria-label="Move day down"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
              
              <button
                type="button"
                onClick={() => setExpandedId(expandedId === day.id ? null : day.id)}
                className={`p-1 rounded-md ${expandedId === day.id ? 'bg-brand-100 text-brand-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                aria-label={expandedId === day.id ? "Collapse day" : "Expand day"}
              >
                {expandedId === day.id ? (
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </button>
              
              <button
                type="button"
                onClick={() => removeDay(day.id)}
                className="p-1 text-gray-400 hover:text-red-500 rounded-md"
                aria-label="Remove day"
              >
                <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
          
          {/* Day Details - Only visible when expanded */}
          {expandedId === day.id && (
            <div className="p-3 sm:p-4 border-t border-gray-100">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left Column - Description and Activities */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Description */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <span className="text-xs text-gray-500">
                        {(getInputValue(day.id, 'description', day.description).length)}/500
                      </span>
                    </div>
                    <textarea
                      value={getInputValue(day.id, 'description', day.description)}
                      onChange={(e) => handleInputChange(day.id, 'description', e.target.value)}
                      rows={4}
                      maxLength={500}
                      className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-500 ${
                        getErrorClass(index, 'description')
                      }`}
                      placeholder="Describe what travelers will experience on this day..."
                    />
                    {errors[`itinerary[${index}].description`] && (
                      <p className="mt-1 text-xs text-red-600">{errors[`itinerary[${index}].description`]}</p>
                    )}
                  </div>
                  
                  {/* Activities */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Activities
                    </label>
                    
                    {/* Quick-Add Activities */}
                    <div className="mb-2">
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {['Hiking', 'Guided Tour', 'Cultural Visit', 'Sightseeing', 'Local Meal', 'Nature Walk'].map((activity) => (
                          <button
                            key={activity}
                            type="button"
                            onClick={() => addActivity(day.id, activity)}
                            className="px-2 py-1 text-xs bg-brand-50 text-brand-600 border border-brand-100 rounded hover:bg-brand-100 transition-colors"
                          >
                            <Plus className="h-3 w-3 inline-block mr-1" />
                            {activity}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Activities List */}
                    <div className="space-y-2 mb-3">
                      {day.activities.map((activity, activityIndex) => (
                        <div 
                          key={activityIndex} 
                          className="flex items-center space-x-2 bg-green-50 border border-green-100 rounded-md p-2"
                        >
                          <div className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs">{activityIndex + 1}</span>
                          </div>
                          <span className="text-sm flex-1">{activity}</span>
                          <button
                            type="button"
                            onClick={() => removeActivity(day.id, activityIndex)}
                            className="text-gray-400 hover:text-red-500"
                            aria-label="Remove activity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    {/* Add Activity Form */}
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Add an activity..."
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                            e.preventDefault();
                            addActivity(day.id, e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          if (input && input.value.trim()) {
                            addActivity(day.id, input.value);
                            input.value = '';
                          }
                        }}
                        className="px-3 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-sm"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Location and Meals */}
                <div className="space-y-4">
                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={getInputValue(day.id, 'location', day.location || '')}
                      onChange={(e) => handleInputChange(day.id, 'location', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-500"
                      placeholder="e.g., Usambara Mountains"
                    />
                  </div>
                  
                  {/* Meals */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meals
                    </label>
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      {day.meals.map((meal, mealIndex) => (
                        <div 
                          key={mealIndex} 
                          className="flex items-center space-x-1 bg-blue-50 text-blue-700 border border-blue-100 rounded px-2 py-1 text-xs"
                        >
                          <span>{meal}</span>
                          <button
                            type="button"
                            onClick={() => removeMeal(day.id, mealIndex)}
                            className="text-blue-400 hover:text-blue-600"
                            aria-label={`Remove ${meal}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    {/* Quick-Add Meals */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((meal) => (
                        <button
                          key={meal}
                          type="button"
                          onClick={() => addMeal(day.id, meal)}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-600 border border-gray-300 rounded hover:bg-gray-200 transition-colors"
                        >
                          <Plus className="h-3 w-3 inline-block mr-1" />
                          {meal}
                        </button>
                      ))}
                    </div>
                    
                    {/* Add Meal Form */}
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Add a meal..."
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                            e.preventDefault();
                            addMeal(day.id, e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          if (input && input.value.trim()) {
                            addMeal(day.id, input.value);
                            input.value = '';
                          }
                        }}
                        className="px-3 py-2 bg-brand-500 text-white rounded hover:bg-brand-600 text-sm"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
      
      {/* Add Another Day Button */}
      {itinerary.length > 0 && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={addDay}
            className="inline-flex items-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors text-sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Another Day
          </button>
        </div>
      )}
      
      {/* Summary Info */}
      {itinerary.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-center text-green-800">
          <Info className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">
              {itinerary.length} {itinerary.length === 1 ? 'day' : 'days'} in your itinerary
            </p>
            <p className="text-xs mt-0.5 text-green-700">
              A detailed itinerary helps travelers visualize their journey and increases booking conversion.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryStep; 