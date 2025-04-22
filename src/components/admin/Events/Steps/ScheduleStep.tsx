import React, { useState } from 'react';
import { Event } from '../../../../services/events.service';
import { DayItinerary } from '../../../../types/tours';
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
  Button,
  Card,
  CardBody,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui';
import { Plus, Trash2, CalendarDays, Clock, MapPin, ListChecks } from 'lucide-react';

interface ScheduleStepProps {
  formData: Partial<Event>;
  setFieldValue: (name: string, value: any) => void;
  errors: Record<string, string>;
}

const ScheduleStep: React.FC<ScheduleStepProps> = ({
  formData,
  setFieldValue,
  errors
}) => {
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  
  // Initialize itinerary if it doesn't exist
  const itinerary = formData.itinerary || [];

  const handleAddDay = () => {
    const newDay: DayItinerary = {
      day_number: itinerary.length + 1,
      title: `Day ${itinerary.length + 1}`,
      description: '',
      activities: []
    };
    
    const updatedItinerary = [...itinerary, newDay];
    setFieldValue('itinerary', updatedItinerary);
    setExpandedDay(updatedItinerary.length - 1); // Expand newly added day
  };

  const handleRemoveDay = (index: number) => {
    if (window.confirm('Are you sure you want to remove this day?')) {
      const updatedItinerary = [...itinerary];
      updatedItinerary.splice(index, 1);
      
      // Renumber days
      updatedItinerary.forEach((day, i) => {
        day.day_number = i + 1;
        if (day.title === `Day ${index + 1}`) {
          day.title = `Day ${i + 1}`;
        }
      });
      
      setFieldValue('itinerary', updatedItinerary);
      setExpandedDay(null);
    }
  };

  const handleDayChange = (index: number, field: keyof DayItinerary, value: any) => {
    const updatedItinerary = [...itinerary];
    updatedItinerary[index] = {
      ...updatedItinerary[index],
      [field]: value
    };
    setFieldValue('itinerary', updatedItinerary);
  };

  const handleActivityChange = (dayIndex: number, activityIndex: number, value: string) => {
    const updatedItinerary = [...itinerary];
    const activities = [...(updatedItinerary[dayIndex].activities || [])];
    activities[activityIndex] = value;
    updatedItinerary[dayIndex].activities = activities;
    setFieldValue('itinerary', updatedItinerary);
  };

  const handleAddActivity = (dayIndex: number) => {
    const updatedItinerary = [...itinerary];
    const activities = [...(updatedItinerary[dayIndex].activities || []), ''];
    updatedItinerary[dayIndex].activities = activities;
    setFieldValue('itinerary', updatedItinerary);
  };

  const handleRemoveActivity = (dayIndex: number, activityIndex: number) => {
    const updatedItinerary = [...itinerary];
    const activities = [...(updatedItinerary[dayIndex].activities || [])];
    activities.splice(activityIndex, 1);
    updatedItinerary[dayIndex].activities = activities;
    setFieldValue('itinerary', updatedItinerary);
  };

  const toggleDayExpand = (index: number) => {
    setExpandedDay(expandedDay === index ? null : index);
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-xl font-semibold text-gray-900 border-b pb-3">Event Schedule</h2>
      <p className="text-gray-600 mb-6">Create a detailed schedule for your event. Break down each day's activities to help attendees understand what to expect.</p>
      
      {/* Days List */}
      <div className="space-y-4">
        {itinerary.map((day, dayIndex) => (
          <Card key={dayIndex} className={expandedDay === dayIndex ? 'border-accent-300 shadow-md' : ''}>
            <div 
              className="p-4 border-b cursor-pointer hover:bg-gray-50 flex justify-between items-center"
              onClick={() => toggleDayExpand(dayIndex)}
            >
              <div className="flex items-center">
                <CalendarDays className="h-5 w-5 text-accent-500 mr-2" />
                <div>
                  <h3 className="font-medium text-gray-900">
                    {day.title || `Day ${day.day_number}`}
                  </h3>
                  {day.location && (
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {day.location}
                    </p>
                  )}
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveDay(dayIndex);
                }}
                className="text-gray-400 hover:text-red-500 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            {expandedDay === dayIndex && (
              <CardBody className="bg-gray-50 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Day Title */}
                  <FormItem>
                    <FormLabel htmlFor={`day-${dayIndex}-title`}>Day Title</FormLabel>
                    <FormControl>
                      <Input
                        id={`day-${dayIndex}-title`}
                        value={day.title || ''}
                        onChange={(e) => handleDayChange(dayIndex, 'title', e.target.value)}
                        placeholder={`Day ${day.day_number}`}
                      />
                    </FormControl>
                  </FormItem>
                  
                  {/* Location */}
                  <FormItem>
                    <FormLabel htmlFor={`day-${dayIndex}-location`}>Location</FormLabel>
                    <FormControl>
                      <Input
                        id={`day-${dayIndex}-location`}
                        value={day.location || ''}
                        onChange={(e) => handleDayChange(dayIndex, 'location', e.target.value)}
                        placeholder="Where this day's activities will take place"
                      />
                    </FormControl>
                  </FormItem>
                  
                  {/* Description */}
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel htmlFor={`day-${dayIndex}-description`}>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        id={`day-${dayIndex}-description`}
                        value={day.description || ''}
                        onChange={(e) => handleDayChange(dayIndex, 'description', e.target.value)}
                        placeholder="Describe the overall plan for this day"
                        rows={3}
                      />
                    </FormControl>
                  </FormItem>
                </div>
                
                {/* Activities */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <FormLabel className="mb-0">Activities</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddActivity(dayIndex)}
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      Add Activity
                    </Button>
                  </div>
                  
                  {day.activities && day.activities.length > 0 ? (
                    <div className="space-y-3">
                      {day.activities.map((activity, activityIndex) => (
                        <div key={activityIndex} className="flex items-start gap-2">
                          <ListChecks className="h-5 w-5 text-gray-400 mt-2" />
                          <Input
                            value={activity}
                            onChange={(e) => handleActivityChange(dayIndex, activityIndex, e.target.value)}
                            placeholder={`Activity ${activityIndex + 1}`}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveActivity(dayIndex, activityIndex)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                      <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No activities added yet. Add activities to create a detailed schedule.</p>
                    </div>
                  )}
                </div>
              </CardBody>
            )}
          </Card>
        ))}
      </div>
      
      {/* Add Day Button */}
      <div className="flex justify-center mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handleAddDay}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Day to Schedule
        </Button>
      </div>
      
      {/* Tips Card */}
      <Card className="mt-6">
        <CardBody>
          <h3 className="font-semibold text-gray-800 mb-2">Schedule Planning Tips</h3>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>Break each day into clear activities with approximate times</li>
            <li>Include location information where activities will take place</li>
            <li>Allow reasonable time between activities for transitions</li>
            <li>Consider adding meal times and break periods</li>
            <li>Be specific about important timings (e.g., "Registration opens at 8:30 AM")</li>
          </ul>
        </CardBody>
      </Card>
    </div>
  );
};

export default ScheduleStep; 