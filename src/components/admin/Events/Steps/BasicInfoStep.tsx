import React from 'react';
import { Event } from '../../../../services/events.service';
import {
  Card,
  CardBody,
} from '../../../../components/ui';
import { Calendar, Clock, MapPin, Info, DollarSign } from 'lucide-react';

interface BasicInfoStepProps {
  formValues: {
    values: Partial<Event> & { time?: string };
    onChange: (name: string, value: string | number | boolean) => void;
  };
  eventTypes: {id: string; name: string}[];
  errors?: Record<string, string>;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  formValues,
  eventTypes,
  errors = {}
}) => {
  const { values, onChange } = formValues;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-xl font-semibold text-gray-900 border-b pb-3">Basic Information</h2>
      
      <div className="space-y-4">
        {/* Event Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 required">Event Title</label>
          <input
            type="text"
            name="title"
            value={values.title || ''}
            onChange={handleChange}
            placeholder="Enter event title"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-400"
          />
          {errors?.title && <p className="text-red-500 mt-1 text-sm">{errors.title}</p>}
        </div>
        
        {/* Event Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 required">Event Type</label>
          <select
            name="event_type"
            value={values.event_type || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-400"
          >
            <option value="">Select an Event Type</option>
            {eventTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          {errors?.event_type && <p className="text-red-500 mt-1 text-sm">{errors.event_type}</p>}
        </div>
        
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 required">Description</label>
          <textarea
            name="description"
            value={values.description || ''}
            onChange={handleChange}
            rows={5}
            placeholder="Provide a detailed description of the event"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-400"
          />
          <p className="text-xs text-gray-500 mt-1">Describe what makes this event special, what attendees can expect, and any other important details.</p>
          {errors?.description && <p className="text-red-500 mt-1 text-sm">{errors.description}</p>}
        </div>
        
        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 required">Start Date</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="date"
                name="start_date"
                value={values.start_date || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-400"
              />
            </div>
            {errors?.start_date && <p className="text-red-500 mt-1 text-sm">{errors.start_date}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="date"
                name="end_date"
                value={values.end_date || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-400"
              />
            </div>
            {errors?.end_date && <p className="text-red-500 mt-1 text-sm">{errors.end_date}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 required">Start Time</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="time"
                name="time"
                value={values.time || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-400"
              />
            </div>
            {errors?.time && <p className="text-red-500 mt-1 text-sm">{errors.time}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                name="duration"
                value={values.duration || ''}
                onChange={handleChange}
                placeholder="e.g., 2 hours, 3 days"
                className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-400"
              />
            </div>
            {errors?.duration && <p className="text-red-500 mt-1 text-sm">{errors.duration}</p>}
          </div>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 required">Price</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <DollarSign className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="number"
              name="price"
              min="0"
              step="0.01"
              value={values.price || ''}
              onChange={handleChange}
              placeholder="Enter event price"
              className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-400"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Enter 0 for free events.</p>
          {errors?.price && <p className="text-red-500 mt-1 text-sm">{errors.price}</p>}
        </div>
        
        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 required">Location</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MapPin className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              name="location"
              value={values.location || ''}
              onChange={handleChange}
              placeholder="Enter the event location"
              className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-400"
            />
          </div>
          {errors?.location && <p className="text-red-500 mt-1 text-sm">{errors.location}</p>}
        </div>
        
        {/* Capacity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Attendees</label>
          <input
            type="number"
            name="max_attendees"
            value={values.max_attendees || ''}
            onChange={handleChange}
            placeholder="Maximum number of attendees"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-400"
          />
          <p className="text-xs text-gray-500 mt-1">Leave blank if there's no limit to the number of attendees.</p>
          {errors?.max_attendees && <p className="text-red-500 mt-1 text-sm">{errors.max_attendees}</p>}
        </div>
        
        {/* Tips Card */}
        <Card className="mt-6">
          <CardBody>
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-accent-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Tips for Creating Great Events</h3>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>Use a clear, descriptive title that tells attendees what to expect</li>
                  <li>Include all important details like location, time, and what's included</li>
                  <li>Be specific about the event duration and what activities are planned</li>
                  <li>Add an engaging description that highlights what makes this event special</li>
                  <li>Specify if there are any requirements or things attendees should bring</li>
                </ul>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default BasicInfoStep;