import React from 'react';
import { X, Plus, Minus } from 'lucide-react';

interface DayItinerary {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: string[];
  accommodation: string;
  distance?: string;
  elevation?: string;
}

interface ItinerarySectionProps {
  itinerary: DayItinerary[];
  addItineraryDay: () => void;
  removeItineraryDay: (index: number) => void;
  handleItineraryChange: (index: number, field: keyof DayItinerary, value: any) => void;
  addItineraryActivity: (dayIndex: number) => void;
  removeItineraryActivity: (dayIndex: number, activityIndex: number) => void;
  handleItineraryActivityChange: (dayIndex: number, activityIndex: number, value: string) => void;
  handleMealToggle: (dayIndex: number, meal: string) => void;
}

const ItinerarySection: React.FC<ItinerarySectionProps> = ({
  itinerary,
  addItineraryDay,
  removeItineraryDay,
  handleItineraryChange,
  addItineraryActivity,
  removeItineraryActivity,
  handleItineraryActivityChange,
  handleMealToggle
}) => {
  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Tour Itinerary</h2>
        <button
          type="button"
          onClick={addItineraryDay}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Day
        </button>
      </div>
      
      <div>
        {itinerary.map((day, dayIndex) => (
          <div 
            key={dayIndex}
            className="mb-6 border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center">
                <span className="flex items-center justify-center w-6 h-6 bg-brand-600 text-white text-xs font-medium rounded-full mr-3">
                  {day.day}
                </span>
                <h3 className="font-medium text-gray-900">
                  {day.title || `Day ${day.day}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => removeItineraryDay(dayIndex)}
                className="p-1.5 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-100 hover:text-red-500"
                disabled={itinerary.length <= 1}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Day Title
                  </label>
                  <input
                    type="text"
                    value={day.title}
                    onChange={(e) => handleItineraryChange(dayIndex, 'title', e.target.value)}
                    placeholder={`Day ${day.day}`}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Accommodation
                  </label>
                  <input
                    type="text"
                    value={day.accommodation}
                    onChange={(e) => handleItineraryChange(dayIndex, 'accommodation', e.target.value)}
                    placeholder="e.g. Mountain Lodge"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={day.description}
                  onChange={(e) => handleItineraryChange(dayIndex, 'description', e.target.value)}
                  placeholder="Describe what happens on this day"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                />
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Activities
                  </label>
                  <button
                    type="button"
                    onClick={() => addItineraryActivity(dayIndex)}
                    className="inline-flex items-center p-1.5 border border-transparent rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand-500"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  {day.activities.map((activity, activityIndex) => (
                    <div key={activityIndex} className="flex items-center">
                      <span className="text-xs font-medium text-gray-500 w-6 flex-shrink-0">{activityIndex + 1}.</span>
                      <div className="flex-grow">
                        <input
                          type="text"
                          value={activity}
                          onChange={(e) => handleItineraryActivityChange(dayIndex, activityIndex, e.target.value)}
                          placeholder="e.g. Morning hike to the summit"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItineraryActivity(dayIndex, activityIndex)}
                        className="ml-2 p-1.5 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-100 hover:text-red-500"
                        disabled={day.activities.length <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meals Included
                </label>
                <div className="flex flex-wrap gap-4">
                  {['breakfast', 'lunch', 'dinner'].map((meal) => (
                    <div key={meal} className="flex items-center">
                      <input
                        id={`${dayIndex}-${meal}`}
                        type="checkbox"
                        checked={day.meals.includes(meal)}
                        onChange={() => handleMealToggle(dayIndex, meal)}
                        className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`${dayIndex}-${meal}`} className="ml-2 block text-sm text-gray-900 capitalize">
                        {meal}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Distance (optional)
                  </label>
                  <input
                    type="text"
                    value={day.distance || ''}
                    onChange={(e) => handleItineraryChange(dayIndex, 'distance', e.target.value)}
                    placeholder="e.g. 8 km"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Elevation Gain (optional)
                  </label>
                  <input
                    type="text"
                    value={day.elevation || ''}
                    onChange={(e) => handleItineraryChange(dayIndex, 'elevation', e.target.value)}
                    placeholder="e.g. 500m"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {itinerary.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 mb-2">No itinerary days added yet</p>
            <button
              type="button"
              onClick={addItineraryDay}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700 focus:outline-none"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add First Day
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItinerarySection;