import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Trash2, ChevronUp, ChevronDown, X, Info } from 'lucide-react';

// Define the itinerary day type to match database requirements
interface ItineraryDay {
  id: string;
  day_number: number;
  title: string;
  description: string;
  location?: string;
  distance?: string;
  difficulty?: string;
  accommodation?: string;
  meals?: string[]; // Changed to always be string[] internally
  activities?: string[];
  // Additional fields for database compatibility
  elevation?: string;
}

interface ItineraryStepProps {
  formValues: any;
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
  const [itinerary, setItinerary] = useState<ItineraryDay[]>(formValues.itinerary || []);
  const [expanded, setExpanded] = useState<string | null>(null);
  
  // Create a unique ID for new itinerary items
  const createId = () => `day_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  
  // Initialize with any existing itinerary data
  useEffect(() => {
    if (formValues.itinerary && formValues.itinerary.length > 0) {
      // Ensure proper structure for itinerary
      const formattedItinerary = Array.isArray(formValues.itinerary) 
        ? formValues.itinerary.map(ensureItineraryDayStructure)
        : convertJsonToArray(formValues.itinerary);
      
      setItinerary(formattedItinerary);
      // Expand the first day by default
      if (formattedItinerary.length > 0) {
        setExpanded(formattedItinerary[0].id);
      }
    }
  }, [formValues.itinerary]);
  
  // Convert JSON object to array if needed
  const convertJsonToArray = (itineraryJson: any): ItineraryDay[] => {
    if (!itineraryJson) return [];
    
    if (Array.isArray(itineraryJson)) return itineraryJson.map(ensureItineraryDayStructure);
    
    // Convert from JSON object format to array
    try {
      return Object.entries(itineraryJson).map(([key, value]: [string, any], index) => {
        const dayNumber = parseInt(key.replace('day', '')) || index + 1;
        return {
          id: createId(),
          day_number: dayNumber,
          title: value.title || `Day ${dayNumber}`,
          description: value.description || '',
          location: value.location || '',
          activities: Array.isArray(value.activities) 
            ? value.activities 
            : (value.activities ? value.activities.split(',').map((a: string) => a.trim()) : []),
          meals: Array.isArray(value.meals) 
            ? value.meals 
            : (value.meals ? value.meals.split(',').map((m: string) => m.trim()) : []),
          accommodation: value.accommodation || '',
          distance: value.distance || '',
          difficulty: value.difficulty || 'Moderate',
          elevation: value.elevation || ''
        };
      });
    } catch (e) {
      console.error('Error converting itinerary JSON to array:', e);
      return [];
    }
  };
  
  // Ensure each itinerary day has the proper structure
  const ensureItineraryDayStructure = (day: any): ItineraryDay => {
    // Ensure meals is always an array of strings
    let processedMeals: string[] = [];
    if (Array.isArray(day.meals)) {
      processedMeals = day.meals.filter((m): m is string => typeof m === 'string' && m.trim() !== '');
    } else if (typeof day.meals === 'string' && day.meals.trim()) {
      processedMeals = day.meals.split(',').map((m: string) => m.trim()).filter(Boolean);
    }

    // Ensure activities is always an array of strings
    let processedActivities: string[] = [];
    if (Array.isArray(day.activities)) {
        processedActivities = day.activities.filter((a): a is string => typeof a === 'string' && a.trim() !== '');
    } else if (typeof day.activities === 'string' && day.activities.trim()) {
        processedActivities = day.activities.split(',').map((a: string) => a.trim()).filter(Boolean);
    }

    return {
      id: day.id || createId(),
      day_number: day.day_number || day.day || 1,
      title: day.title || `Day ${day.day_number || 1}`,
      description: day.description || '',
      location: day.location || '',
      distance: day.distance || '',
      difficulty: day.difficulty || 'Moderate',
      accommodation: day.accommodation || '',
      meals: processedMeals, // Use processed array
      activities: processedActivities, // Use processed array
      elevation: day.elevation || ''
    };
  };
  
  // Update parent form values when itinerary changes
  useEffect(() => {
    const formattedItinerary = prepareItineraryForDatabase(itinerary);
    
    onChange({
      ...formValues,
      itinerary: formattedItinerary
    });
    
    // Validate - we require at least one day in the itinerary
    if (onValidation) {
      onValidation(itinerary.length > 0);
    }
  }, [itinerary]);
  
  // Format itinerary data for database storage
  const prepareItineraryForDatabase = (itineraryArray: ItineraryDay[]) => {
    // Create a clean version of the itinerary array with properly formatted fields
    return itineraryArray.map(day => ({
      ...day,
      // Ensure day_number is a number, not a string
      day_number: typeof day.day_number === 'string' ? parseInt(day.day_number as string) : day.day_number,
      // Ensure meals is always an array of strings
      meals: Array.isArray(day.meals) ? day.meals : [],
      // Ensure activities is always an array of strings
      activities: Array.isArray(day.activities) ? day.activities : []
    }));
  };
  
  // Add a new day to the itinerary
  const addDay = () => {
    const newDay: ItineraryDay = {
      id: createId(),
      day_number: itinerary.length + 1,
      title: `Day ${itinerary.length + 1}`,
      description: '',
      location: '',
      distance: '',
      difficulty: 'Moderate',
      accommodation: '',
      meals: [],
      activities: [],
      elevation: ''
    };
    
    const updatedItinerary = [...itinerary, newDay];
    setItinerary(updatedItinerary);
    setExpanded(newDay.id);
  };
  
  // Remove a day from the itinerary
  const removeDay = (id: string) => {
    const updatedItinerary = itinerary
      .filter(day => day.id !== id)
      .map((day, index) => ({
        ...day,
        day_number: index + 1,
        title: day.title.startsWith('Day ') ? `Day ${index + 1}` : day.title
      }));
    
    setItinerary(updatedItinerary);
    
    // If the expanded item was removed, expand another one
    if (expanded === id && updatedItinerary.length > 0) {
      setExpanded(updatedItinerary[0].id);
    } else {
      setExpanded(null);
    }
  };
  
  // Update a specific day's data (modified for meals/activities array)
  const updateDay = (id: string, field: keyof ItineraryDay, value: any) => {
    const updatedItinerary = itinerary.map(day => {
      if (day.id === id) {
        // Handle array updates separately if needed, otherwise direct assignment
        return { ...day, [field]: value };
      }
      return day;
    });
    setItinerary(updatedItinerary);
  };
  
  // Add meal tag
  const addMeal = (dayId: string, meal: string) => {
    if (!meal || !meal.trim()) return;
    setItinerary(prevItinerary => 
      prevItinerary.map(day => {
        if (day.id === dayId) {
          const currentMeals = Array.isArray(day.meals) ? day.meals : [];
          if (!currentMeals.includes(meal.trim())) { // Avoid duplicates
            return { ...day, meals: [...currentMeals, meal.trim()] };
          }
        }
        return day;
      })
    );
  };

  // Remove meal tag
  const removeMeal = (dayId: string, indexToRemove: number) => {
    setItinerary(prevItinerary => 
      prevItinerary.map(day => {
        if (day.id === dayId) {
          const currentMeals = Array.isArray(day.meals) ? [...day.meals] : [];
          if (indexToRemove >= 0 && indexToRemove < currentMeals.length) {
            currentMeals.splice(indexToRemove, 1);
            return { ...day, meals: currentMeals };
          }
        }
        return day;
      })
    );
  };
  
  // Move a day up in the order
  const moveUp = (index: number) => {
    if (index === 0) return;
    
    const updatedItinerary = [...itinerary];
    const temp = updatedItinerary[index];
    updatedItinerary[index] = updatedItinerary[index - 1];
    updatedItinerary[index - 1] = temp;
    
    // Update day numbers
    updatedItinerary.forEach((day, i) => {
      day.day_number = i + 1;
      if (day.title.startsWith('Day ')) {
        day.title = `Day ${i + 1}`;
      }
    });
    
    setItinerary(updatedItinerary);
  };
  
  // Move a day down in the order
  const moveDown = (index: number) => {
    if (index === itinerary.length - 1) return;
    
    const updatedItinerary = [...itinerary];
    const temp = updatedItinerary[index];
    updatedItinerary[index] = updatedItinerary[index + 1];
    updatedItinerary[index + 1] = temp;
    
    // Update day numbers
    updatedItinerary.forEach((day, i) => {
      day.day_number = i + 1;
      if (day.title.startsWith('Day ')) {
        day.title = `Day ${i + 1}`;
      }
    });
    
    setItinerary(updatedItinerary);
  };
  
  // Fix the addActivity implementation to be more robust
  const addActivity = (dayId: string, activity: string) => {
    // Don't add empty activities
    if (!activity || !activity.trim()) return;
    
    try {
      const updatedItinerary = itinerary.map(day => {
        if (day.id === dayId) {
          // Ensure activities is always an array
          const activities = Array.isArray(day.activities) ? [...day.activities] : [];
          
          // Ensure meals is always an array to prevent type errors
          const meals = Array.isArray(day.meals) ? day.meals : 
            (typeof day.meals === 'string' ? 
              day.meals.split(',').map((m: string) => m.trim()).filter(Boolean) : 
              []);
          
          return {
            ...day,
            activities: [...activities, activity.trim()],
            meals
          };
        }
        return day;
      });
      
      setItinerary(updatedItinerary);
    } catch (error) {
      console.error("Error adding activity:", error);
      // Could add a toast notification here
    }
  };
  
  // Create a more robust removeActivity function
  const removeActivity = (dayId: string, indexToRemove: number) => {
    try {
      const updatedItinerary = itinerary.map(day => {
        if (day.id === dayId) {
          // Create defensive copies of arrays
          const activities = Array.isArray(day.activities) ? [...day.activities] : [];
          
          // Only remove if index is valid
          if (indexToRemove >= 0 && indexToRemove < activities.length) {
            activities.splice(indexToRemove, 1);
          }
          
          // Ensure meals is preserved as an array
          const meals = Array.isArray(day.meals) ? [...day.meals] : 
            (typeof day.meals === 'string' ? 
              day.meals.split(',').map((m: string) => m.trim()).filter(Boolean) : 
              []);
          
          return {
            ...day,
            activities,
            meals
          };
        }
        return day;
      });
      
      setItinerary(updatedItinerary);
    } catch (error) {
      console.error("Error removing activity:", error);
      // Could add a toast notification here
    }
  };
  
  return (
    <div className="space-y-5">
      {/* Itinerary Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-600" />
            <h3 className="text-lg font-semibold text-gray-800">Tour Itinerary</h3>
          </div>
          <button 
            onClick={addDay}
            className="px-4 py-2 flex items-center gap-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Day
          </button>
        </div>
        
        <p className="mt-2 text-gray-500 text-sm">
          Create a detailed day-by-day itinerary to help travelers understand what to expect
        </p>
        
        {errors.itinerary && (
          <p className="mt-2 text-red-500 text-sm">{errors.itinerary}</p>
        )}
      </div>
      
      {/* Empty State */}
      {itinerary.length === 0 && (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-brand-50 mx-auto flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-brand-600" />
          </div>
          <h4 className="text-base font-medium text-gray-800 mb-2">No Itinerary Days Added</h4>
          <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
            Add days to your tour itinerary to help travelers understand what they'll experience each day.
          </p>
          <button 
            onClick={addDay}
            className="px-5 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors active:scale-95 transform shadow-sm hover:shadow"
          >
            <Plus className="w-4 h-4 inline mr-1.5" />
            Add First Day
          </button>
        </div>
      )}
      
      {/* Itinerary Days */}
      {itinerary.map((day, index) => (
        <div 
          key={day.id} 
          className={`bg-white rounded-xl shadow-sm overflow-hidden border ${expanded === day.id ? 'border-brand-200 ring-1 ring-brand-100' : 'border-gray-100'} transition-all duration-200`}
        >
          <div className={`p-4 flex justify-between items-center border-b ${expanded === day.id ? 'bg-brand-100 border-brand-200' : 'bg-brand-50 border-brand-100'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm ${expanded === day.id ? 'bg-brand-700' : 'bg-brand-600'} shadow-sm transition-colors`}>
                {day.day_number}
              </div>
              
              {expanded === day.id ? (
                <input
                  type="text"
                  value={day.title}
                  onChange={(e) => updateDay(day.id, 'title', e.target.value)}
                  className="font-medium text-gray-900 border border-brand-200 bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 rounded px-2 py-1 shadow-sm"
                  placeholder="Day title"
                />
              ) : (
                <div>
                  <h4 className="font-medium text-gray-900">{day.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {day.activities?.length || 0} activities
                    {day.location ? ` • ${day.location}` : ''}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {/* Reorder Controls */}
              <div className="flex items-center">
                <button 
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className={`p-1.5 text-gray-400 hover:text-gray-600 ${index === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => moveDown(index)}
                  disabled={index === itinerary.length - 1}
                  className={`p-1.5 text-gray-400 hover:text-gray-600 ${index === itinerary.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              
              <button 
                onClick={() => setExpanded(expanded === day.id ? null : day.id)}
                className={`p-1.5 rounded-md ${expanded === day.id ? 'bg-brand-100 text-brand-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
              >
                {expanded === day.id ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Clock className="w-5 h-5" />
                )}
              </button>
              
              <button 
                onClick={() => removeDay(day.id)}
                className="p-1.5 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Add a smooth transition for the expanded content */}
          <div className={`transition-all duration-300 ${expanded === day.id ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            {expanded === day.id && (
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex justify-between">
                      <span>Description <span className="text-red-500">*</span></span>
                      <span className={`text-xs ${day.description.length > 300 ? 'text-amber-600' : 'text-gray-500'}`}>
                        {day.description.length}/500 characters
                      </span>
                    </label>
                    <textarea
                      value={day.description}
                      onChange={(e) => updateDay(day.id, 'description', e.target.value)}
                      placeholder="Describe this day's activities and highlights..."
                      className={`w-full h-40 p-3 border rounded-md text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 ${day.description.length > 500 ? 'border-red-300' : 'border-gray-300'}`}
                      maxLength={500}
                      required
                    />
                    
                    <div className="mt-1 text-xs text-gray-500">
                      Tip: Include key highlights, what travelers will experience, and any special features of this day.
                    </div>

                    {/* Activities Section */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Activities
                      </label>
                      
                      <div className="space-y-2 mb-3">
                        {day.activities && day.activities.map((activity, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-green-50 border border-green-100 p-2 rounded-md">
                            <div className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-medium">{idx + 1}</span>
                            </div>
                            <span className="flex-1 text-sm">{activity}</span>
                            <button
                              onClick={() => removeActivity(day.id, idx)}
                              className="p-1 text-gray-400 hover:text-red-500"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      {/* Add this in the Activities Section before the Add Activity Form */}
                      <div className="mb-4">
                        <label className="block text-xs text-gray-500 mb-2">Quick-Add Common Activities</label>
                        <div className="flex flex-wrap gap-2">
                          {['Hiking', 'Guided Tour', 'Cultural Visit', 'Sightseeing', 'Local Meal', 'Nature Walk'].map((activity) => (
                            <button
                              key={activity}
                              type="button"
                              onClick={() => addActivity(day.id, activity)}
                              className="px-2 py-1 text-xs bg-brand-50 text-brand-600 border border-brand-100 rounded-md hover:bg-brand-100 transition-colors"
                            >
                              + {activity}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Improved Add Activity Form */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Add an activity..."
                            className="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                e.preventDefault(); // Prevent form submission
                                addActivity(day.id, e.currentTarget.value);
                                e.currentTarget.value = '';
                              }
                            }}
                          />
                          <button
                            type="button" // Explicitly set button type to prevent form submission
                            onClick={(e) => {
                              try {
                                const input = e.currentTarget.previousSibling as HTMLInputElement;
                                if (input && input.value.trim()) {
                                  addActivity(day.id, input.value);
                                  input.value = '';
                                }
                              } catch (error) {
                                console.error("Error in add activity button:", error);
                              }
                            }}
                            className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm hover:bg-gray-200 transition-colors hover:text-brand-600"
                          >
                            Add
                          </button>
                        </div>
                        <p className="text-xs text-gray-400">Press Enter to add or click the Add button</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meals Section - Updated UI
                    </label>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Meals Included</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {day.meals && day.meals.map((meal, idx) => (
                          <div key={idx} className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-100 rounded px-2 py-1 text-sm">
                            <span>{meal}</span>
                            <button 
                              type="button"
                              onClick={() => removeMeal(day.id, idx)}
                              className="text-blue-400 hover:text-blue-600"
                              aria-label={`Remove ${meal}`}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Add meal (e.g., Breakfast)"
                          className="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                          id={`add-meal-${day.id}`}
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
                          onClick={() => {
                            const input = document.getElementById(`add-meal-${day.id}`) as HTMLInputElement;
                            if (input && input.value.trim()) {
                              addMeal(day.id, input.value);
                              input.value = '';
                            }
                          }}
                          className="p-2 bg-brand-500 text-white rounded-md hover:bg-brand-600"
                          aria-label="Add Meal"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Quick-Add Common Meals */}
                      <div className="mt-3 flex flex-wrap gap-1">
                        <span className="text-xs text-gray-500 mr-1">Quick add:</span>
                        {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((meal) => (
                          <button
                            key={meal}
                            type="button"
                            onClick={() => addMeal(day.id, meal)}
                            className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 border border-gray-200 rounded hover:bg-gray-200 transition-colors"
                          >
                            + {meal}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
      
      {/* Improve Add Day Button */}
      {itinerary.length > 0 && (
        <div className="flex justify-center mt-4">
          <button 
            onClick={addDay}
            className="px-5 py-2.5 flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors hover:text-brand-600 hover:border-brand-300 active:scale-95 transform"
          >
            <Plus className="w-4 h-4" />
            Add Another Day
          </button>
        </div>
      )}
      
      {/* Summary Alert */}
      {itinerary.length > 0 && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded flex items-center">
          <Info className="w-5 h-5 mr-2 flex-shrink-0 text-green-500" />
          <div>
            <p className="text-sm font-medium">
              {itinerary.length} {itinerary.length === 1 ? 'day' : 'days'} in your itinerary
            </p>
            <p className="text-xs mt-1">
              A detailed itinerary helps travelers visualize their journey and increases booking conversion.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryStep; 