import React from 'react';
import { DollarSign, MapPin, Clock, Star, Mountain, Users, Globe } from 'lucide-react';
import { Tour } from '../../../../services/tours.service';

interface TourBasicInfoProps {
  formData: Partial<Tour>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  errors: Record<string, string>;
  categories: { id: string; name: string }[];
  loadingCategories: boolean;
}

const TourBasicInfo: React.FC<TourBasicInfoProps> = ({ 
  formData, 
  handleInputChange, 
  errors,
  categories,
  loadingCategories
}) => {
  const DIFFICULTY_LEVELS = [
    { id: 'easy', name: 'Easy' },
    { id: 'moderate', name: 'Moderate' },
    { id: 'challenging', name: 'Challenging' }
  ];

  return (
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Tour Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title || ''}
            onChange={handleInputChange}
            required
            className={`block w-full rounded-md shadow-sm sm:text-sm ${
              errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-brand-500 focus:ring-brand-500'
            }`}
            placeholder="e.g. Usambara Mountain Hiking Adventure"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
            Slug <span className="text-gray-400 text-xs font-normal ml-1">(Optional - will be auto-generated)</span>
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
              placeholder="e.g. usambara-mountain-hiking"
              className={`pl-10 block w-full rounded-md shadow-sm sm:text-sm ${
                errors.slug ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-brand-500 focus:ring-brand-500'
              }`}
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
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            {loadingCategories ? (
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
                <div className="animate-pulse bg-gray-200 h-5 w-24 rounded"></div>
              </div>
            ) : (
              <select
                id="category"
                name="category"
                value={formData.category || ''}
                onChange={handleInputChange}
                required
                className={`block w-full rounded-md shadow-sm sm:text-sm ${
                  errors.category ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-brand-500 focus:ring-brand-500'
                }`}
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            )}
          </div>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            The category helps classify your tour for easier search and filtering
          </p>
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
            placeholder="Provide a compelling description of your tour..."
            className={`block w-full rounded-md shadow-sm sm:text-sm ${
              errors.description ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-brand-500 focus:ring-brand-500'
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Describe your tour in detail. Include what makes it special, what travelers will experience, and why they should choose this tour.
          </p>
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
              placeholder="e.g. Usambara Mountains, Tanzania"
              className={`pl-10 block w-full rounded-md shadow-sm sm:text-sm ${
                errors.location ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-brand-500 focus:ring-brand-500'
              }`}
            />
          </div>
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
            Duration <span className="text-red-500">*</span>
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
              required
              className={`pl-10 block w-full rounded-md shadow-sm sm:text-sm ${
                errors.duration ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-brand-500 focus:ring-brand-500'
              }`}
            />
          </div>
          {errors.duration && (
            <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Specify the tour duration (e.g., "3 days", "5 days 4 nights")
          </p>
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
              placeholder="0.00"
              className={`pl-10 block w-full rounded-md shadow-sm sm:text-sm ${
                errors.price ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-brand-500 focus:ring-brand-500'
              }`}
            />
          </div>
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Price per person in USD
          </p>
        </div>
        
        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
            Rating <span className="text-gray-400 text-xs font-normal ml-1">(Optional)</span>
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
              value={formData.rating || '4.5'}
              onChange={handleInputChange}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
              placeholder="4.5"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Tour rating from 1.0 to 5.0. Default is 4.5 for new tours.
          </p>
        </div>
        
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
            Difficulty Level <span className="text-gray-400 text-xs font-normal ml-1">(Optional)</span>
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mountain className="h-4 w-4 text-gray-400" />
            </div>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty || 'moderate'}
              onChange={handleInputChange}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
            >
              <option value="">Select difficulty</option>
              {DIFFICULTY_LEVELS.map(level => (
                <option key={level.id} value={level.id}>{level.name}</option>
              ))}
            </select>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Set the difficulty level to help visitors gauge if the tour matches their abilities
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="min_group_size" className="block text-sm font-medium text-gray-700 mb-1">
              Min Group Size <span className="text-gray-400 text-xs font-normal ml-1">(Optional)</span>
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="number"
                id="min_group_size"
                name="min_group_size"
                min="1"
                placeholder="Min"
                value={formData.min_group_size || ''}
                onChange={handleInputChange}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="max_group_size" className="block text-sm font-medium text-gray-700 mb-1">
              Max Group Size <span className="text-gray-400 text-xs font-normal ml-1">(Optional)</span>
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="number"
                id="max_group_size"
                name="max_group_size"
                min={formData.min_group_size || 1}
                placeholder="Max"
                value={formData.max_group_size || ''}
                onChange={handleInputChange}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
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
              className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
            />
            <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
              Feature this tour on the website
            </label>
          </div>
          <p className="mt-2 text-xs text-gray-500 ml-6">
            Featured tours will be highlighted on the homepage and may appear at the top of search results.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TourBasicInfo;