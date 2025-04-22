import { useState } from 'react';

export interface DayItinerary {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: string[];
  accommodation: string;
  distance?: string;
  elevation?: string;
}

const useItineraryEditor = (initialItinerary: DayItinerary[] = []) => {
  const [itinerary, setItinerary] = useState<DayItinerary[]>(
    initialItinerary.length > 0 
      ? initialItinerary 
      : [createEmptyDay(1)]
  );

  // Create an empty day item
  function createEmptyDay(dayNumber: number): DayItinerary {
    return {
      day: dayNumber,
      title: `Day ${dayNumber}`,
      description: '',
      activities: [''],
      meals: [],
      accommodation: ''
    };
  }

  // Add a new day to the itinerary
  const addItineraryDay = () => {
    const newDay = itinerary.length + 1;
    setItinerary([...itinerary, createEmptyDay(newDay)]);
  };
  
  // Remove a day from the itinerary
  const removeItineraryDay = (index: number) => {
    if (itinerary.length <= 1) return;
    
    const updatedItinerary = [...itinerary];
    updatedItinerary.splice(index, 1);
    
    // Renumber days
    updatedItinerary.forEach((day, idx) => {
      day.day = idx + 1;
      if (day.title === `Day ${index + 1}`) {
        day.title = `Day ${idx + 1}`;
      }
    });
    
    setItinerary(updatedItinerary);
  };
  
  // Update a field for a specific day
  const handleItineraryChange = (index: number, field: keyof DayItinerary, value: any) => {
    const updatedItinerary = [...itinerary];
    (updatedItinerary[index] as any)[field] = value;
    setItinerary(updatedItinerary);
  };
  
  // Add an activity to a day
  const addItineraryActivity = (dayIndex: number) => {
    const updatedItinerary = [...itinerary];
    updatedItinerary[dayIndex].activities.push('');
    setItinerary(updatedItinerary);
  };
  
  // Remove an activity from a day
  const removeItineraryActivity = (dayIndex: number, activityIndex: number) => {
    if (itinerary[dayIndex].activities.length <= 1) return;
    
    const updatedItinerary = [...itinerary];
    updatedItinerary[dayIndex].activities.splice(activityIndex, 1);
    setItinerary(updatedItinerary);
  };
  
  // Update an activity for a day
  const handleItineraryActivityChange = (dayIndex: number, activityIndex: number, value: string) => {
    const updatedItinerary = [...itinerary];
    updatedItinerary[dayIndex].activities[activityIndex] = value;
    setItinerary(updatedItinerary);
  };
  
  // Toggle a meal for a day
  const handleMealToggle = (dayIndex: number, meal: string) => {
    const updatedItinerary = [...itinerary];
    const currentMeals = updatedItinerary[dayIndex].meals;
    
    if (currentMeals.includes(meal)) {
      // Remove meal
      updatedItinerary[dayIndex].meals = currentMeals.filter(m => m !== meal);
    } else {
      // Add meal
      updatedItinerary[dayIndex].meals = [...currentMeals, meal];
    }
    
    setItinerary(updatedItinerary);
  };
  
  return {
    itinerary,
    setItinerary,
    addItineraryDay,
    removeItineraryDay,
    handleItineraryChange,
    addItineraryActivity,
    removeItineraryActivity,
    handleItineraryActivityChange,
    handleMealToggle
  };
};

export default useItineraryEditor;