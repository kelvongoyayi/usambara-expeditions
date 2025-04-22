import React from 'react';
import { DollarSign, MapPin, Clock, Star, Users, Calendar, Globe } from 'lucide-react';
import { Event } from '../../../../services/events.service';

interface EventBasicInfoProps {
  formData: Partial<Event>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  errors: Record<string, string>;
  eventTypes: { id: string; name: string }[];
}

const EventBasicInfo: React.FC<EventBasicInfoProps> = ({ 
  formData, 
  handleInputChange, 
  errors,
  eventTypes
}) => {
  // Handle min/max date for date inputs
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Event Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title || ''}
            onChange={handleInputChange}
            required
            className={`block w-full rounded-md shadow-sm sm:text-sm ${
              errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-accent-500 focus:ring-accent-500'
            }`}
            placeholder="e.g. Corporate Team Building Retreat"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
            Slug <span className="text-gray-400 text-xs font-normal">(Optional - will be auto-generated)</span>
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug || ''}
              onChange={handleInputChange}
              placeholder="event-slug-for-url"
              className="pl-10 block w-full rounded-md border-gray-300 focus:border-accent-500 focus:ring-accent-500 sm:text-sm"
            />
          </div>
          {errors.slug ? (
            <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
          ) : (
            <p className="mt-1 text-xs text-gray-500">
              Used in URLs. Leave empty for automatic generation from title.
            </p>
          )}
        </div>
        
        <div>
          <label htmlFor="event_type" className="block text-sm font-medium text-gray-700 mb-1">
            Event Type <span className="text-red-500">*</span>
          </label>
          <select
            id="event_type"
            name="event_type"
            value={formData.event_type || ''}
            onChange={handleInputChange}
            required
            className={`block w-full rounded-md shadow-sm sm:text-sm ${
              errors.event_type ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-accent-500 focus:ring-accent-500'
            }`}
          >
            <option value="">Select an event type</option>
            {eventTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
          {errors.event_type && (
            <p className="mt-1 text-sm text-red-600">{errors.event_type}</p>
          )}
        </div>
        
        <div className="lg:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description || ''}
            onChange={handleInputChange}
            required
            className={`block w-full rounded-md shadow-sm sm:text-sm ${
              errors.description ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-accent-500 focus:ring-accent-500'
            }`}
            placeholder="Detailed description of the event"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location <span className="text-red-500">*</span>
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location || ''}
              onChange={handleInputChange}
              required
              placeholder="e.g. Lushoto Valley Resort"
              className={`pl-10 block w-full rounded-md shadow-sm sm:text-sm ${
                errors.location ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-accent-500 focus:ring-accent-500'
              }`}
            />
          </div>
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Price <span className="text-red-500">*</span>
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="number"
              id="price"
              name="price"
              min="0"
              step="0.01"
              value={formData.price || ''}
              onChange={handleInputChange}
              required
              className={`pl-10 block w-full rounded-md shadow-sm sm:text-sm ${
                errors.price ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-accent-500 focus:ring-accent-500'
              }`}
              placeholder="0.00"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Price per attendee in USD
          </p>
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
          )}
        </div>
        
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Dates <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="start_date" className="block text-xs font-medium text-gray-500 mb-1">
                Start Date
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  min={today}
                  value={formData.start_date?.split('T')[0] || ''}
                  onChange={handleInputChange}
                  required
                  className={`pl-10 block w-full rounded-md shadow-sm sm:text-sm ${
                    errors.start_date ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-accent-500 focus:ring-accent-500'
                  }`}
                />
              </div>
              {errors.start_date && (
                <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="end_date" className="block text-xs font-medium text-gray-500 mb-1">
                End Date
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  min={formData.start_date?.split('T')[0] || today}
                  value={formData.end_date?.split('T')[0] || ''}
                  onChange={handleInputChange}
                  required
                  className={`pl-10 block w-full rounded-md shadow-sm sm:text-sm ${
                    errors.end_date ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-accent-500 focus:ring-accent-500'
                  }`}
                />
              </div>
              {errors.end_date && (
                <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
            Duration
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              id="duration"
              name="duration"
              value={formData.duration || ''}
              onChange={handleInputChange}
              placeholder="e.g. 3 days"
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm"
              disabled={Boolean(formData.start_date && formData.end_date)}
            />
          </div>
          {(formData.start_date && formData.end_date) ? (
            <p className="mt-1 text-xs text-gray-500">
              Auto-calculated based on start and end dates
            </p>
          ) : (
            <p className="mt-1 text-xs text-gray-500">
              Will be calculated from dates when provided
            </p>
          )}
        </div>
        
        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
            Rating
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Star className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="number"
              id="rating"
              name="rating"
              min="1"
              max="5"
              step="0.1"
              value={formData.rating || ''}
              onChange={handleInputChange}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Event rating from 1.0 to 5.0
          </p>
        </div>
        
        <div className="flex items-center">
          <input
            id="featured"
            name="featured"
            type="checkbox"
            checked={formData.featured || false}
            onChange={e => {
              const target = e.target as HTMLInputElement;
              handleInputChange({
                target: {
                  name: 'featured',
                  value: target.checked,
                  type: 'checkbox',
                  checked: target.checked
                }
              } as React.ChangeEvent<HTMLInputElement>);
            }}
            className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-gray-300 rounded"
          />
          <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
            Feature this event (will be highlighted on the website)
          </label>
        </div>
        
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Attendee Capacity
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="min_attendees" className="block text-xs font-medium text-gray-500 mb-1">
                Minimum Attendees
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="number"
                  id="min_attendees"
                  name="min_attendees"
                  min="1"
                  value={formData.min_attendees || ''}
                  onChange={handleInputChange}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="max_attendees" className="block text-xs font-medium text-gray-500 mb-1">
                Maximum Attendees
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="number"
                  id="max_attendees"
                  name="max_attendees"
                  min={formData.min_attendees || 1}
                  value={formData.max_attendees || ''}
                  onChange={handleInputChange}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventBasicInfo;