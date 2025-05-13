import React from 'react';
import { Event } from '../../../../services/events.service';
import { Card, CardBody } from '../../../../components/ui';
import { DollarSign, Tag, Calendar, User, Clock } from 'lucide-react';

interface PricingStepProps {
  formData: Partial<Event>;
  errors: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  setFieldValue: (name: string, value: unknown) => void;
}

const PricingStep: React.FC<PricingStepProps> = ({ 
  formData, 
  errors, 
  handleChange, 
  setFieldValue 
}) => {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-xl font-semibold text-gray-900 border-b pb-3">Event Pricing</h2>
      
      <div className="space-y-6">
        {/* Standard Pricing */}
        <div>
          <h4 className="text-lg font-medium mb-3">Standard Pricing</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 required">Regular Price (TZS)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="price"
                  value={formData.price || ''}
                  onChange={handleChange}
                  placeholder="e.g., 250000"
                  min="0"
                  step="1"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-accent-500 focus:border-accent-500"
                />
              </div>
              {errors?.price && <p className="text-red-500 mt-1 text-sm">{errors.price}</p>}
              <p className="text-xs text-gray-500 mt-1">Set to 0 for free events</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discounted Price (Optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Tag className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="discounted_price"
                  value={formData.discounted_price || ''}
                  onChange={handleChange}
                  placeholder="e.g., 200000"
                  min="0"
                  step="1"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-accent-500 focus:border-accent-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Leave empty if there's no discount</p>
            </div>
          </div>
        </div>
        
        {/* Capacity and Dates */}
        <div>
          <h4 className="text-lg font-medium mb-3">Capacity & Timing</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Attendees</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="min_attendees"
                  value={formData.min_attendees || ''}
                  onChange={handleChange}
                  placeholder="Minimum"
                  min="1"
                  step="1"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-accent-500 focus:border-accent-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum required to run the event</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Attendees</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="max_attendees"
                  value={formData.max_attendees || ''}
                  onChange={handleChange}
                  placeholder="Maximum"
                  min="1"
                  step="1"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-accent-500 focus:border-accent-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Maximum capacity for the event</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Registration Deadline</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="date"
                  name="registration_deadline"
                  value={formData.registration_deadline || ''}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-accent-500 focus:border-accent-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Last day to register</p>
            </div>
          </div>
        </div>
        
        {/* Event Duration */}
        <div>
          <h4 className="text-lg font-medium mb-3">Duration</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Clock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration || ''}
                  onChange={handleChange}
                  placeholder="e.g., 3 days, 2 hours"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-accent-500 focus:border-accent-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">How long the event lasts</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Featured Event</label>
              <div className="relative mt-1">
                <select
                  name="featured"
                  value={formData.featured ? 'true' : 'false'}
                  onChange={(e) => setFieldValue('featured', e.target.value === 'true')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-accent-500 focus:border-accent-500"
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
              <p className="text-xs text-gray-500 mt-1">Show on home page and featured sections</p>
            </div>
          </div>
        </div>
        
        {/* Pricing Notes */}
        <Card className="mt-6">
          <CardBody className="bg-gray-50">
            <h4 className="font-medium mb-2">Pricing Tips</h4>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Set competitive prices that reflect the value of your event</li>
              <li>Consider offering early bird discounts to encourage early registrations</li>
              <li>Be clear about what's included in the price to set proper expectations</li>
              <li>If applicable, include information about group discounts in the description</li>
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default PricingStep; 