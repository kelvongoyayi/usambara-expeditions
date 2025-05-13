import React from 'react';
import { Image, Camera, AlertCircle, Link, X } from 'lucide-react';
import { FileUploadField } from '../../../../components/ui';
import { Event } from '../../../../services/events.service';

interface ImagesStepProps {
  formData: Partial<Event>;
  errors: Record<string, string>;
  imagePreview: string | null;
  galleryPreview: string[];
  uploading: boolean;
  progress: number;
  handleMainImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleGalleryImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  removeGalleryImage: (index: number) => void;
  resetMainImage: () => void;
  handleAddImageUrl: () => void;
  handleAddGalleryUrl: () => void;
  setImageUrlInput: (url: string) => void;
  setGalleryUrlInput: (url: string) => void;
  imageUrlInput: string;
  galleryUrlInput: string;
}

const ImagesStep: React.FC<ImagesStepProps> = ({
  formData,
  errors,
  imagePreview,
  galleryPreview,
  uploading,
  progress,
  handleMainImageUpload,
  handleGalleryImageUpload,
  removeGalleryImage,
  resetMainImage,
  handleAddImageUrl,
  handleAddGalleryUrl,
  setImageUrlInput,
  setGalleryUrlInput,
  imageUrlInput,
  galleryUrlInput
}) => {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-xl font-semibold text-gray-900 border-b pb-3">Event Images</h2>
      
      {/* Main Image Section */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 required">Main Event Image</label>
          <p className="text-sm text-gray-500 mb-4">This image will be displayed as the primary image for your event.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Upload */}
            <div>
              <FileUploadField
                accept="image/*"
                label="Upload Image"
                onChange={handleMainImageUpload}
                loading={uploading}
                progress={progress}
                Icon={Camera}
                hint="Upload a high-quality image (JPEG, PNG)"
                className="bg-white border border-accent-200 hover:border-accent-300"
              />
              
              {/* URL Input Option */}
              <div className="mt-4 space-y-2">
                <label className="block text-sm font-medium text-gray-700">Or use an image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 rounded-md border border-gray-300 focus:border-accent-300 focus:ring focus:ring-accent-200 focus:ring-opacity-50"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-3 py-2 border border-accent-300 rounded-md bg-accent-50 text-accent-700 hover:bg-accent-100 transition-colors flex items-center"
                  >
                    <Link className="w-4 h-4 mr-1" />
                    Add
                  </button>
                </div>
              </div>
            </div>
            
            {/* Image Preview */}
            <div>
              {imagePreview ? (
                <div className="relative rounded-lg overflow-hidden border border-gray-200 aspect-video bg-gray-50">
                  <img
                    src={imagePreview}
                    alt="Event main image preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={resetMainImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 aspect-video text-gray-400">
                  <div className="text-center p-4">
                    <Image className="w-10 h-10 mx-auto mb-2 opacity-25" />
                    <p>No image uploaded yet</p>
                  </div>
                </div>
              )}
              {errors?.image_url && <p className="text-red-500 mt-1 text-sm">{errors.image_url}</p>}
            </div>
          </div>
        </div>
        
        {/* Gallery Images Section */}
        <div className="mt-8">
          <label className="block text-sm font-medium text-gray-700 mb-1">Gallery Images</label>
          <p className="text-sm text-gray-500 mb-4">Add additional images to showcase more aspects of your event. These will appear in the gallery section.</p>
          
          {/* Upload Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <FileUploadField
                accept="image/*"
                label="Upload Gallery Image"
                onChange={handleGalleryImageUpload}
                loading={uploading}
                progress={progress}
                Icon={Camera}
                hint="Upload multiple images (JPEG, PNG)"
                multiple
                className="bg-white border border-accent-200 hover:border-accent-300"
              />
            </div>
            
            {/* URL Input Option */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Or use an image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={galleryUrlInput}
                  onChange={(e) => setGalleryUrlInput(e.target.value)}
                  placeholder="https://example.com/gallery-image.jpg"
                  className="flex-1 rounded-md border border-gray-300 focus:border-accent-300 focus:ring focus:ring-accent-200 focus:ring-opacity-50"
                />
                <button
                  type="button"
                  onClick={handleAddGalleryUrl}
                  className="px-3 py-2 border border-accent-300 rounded-md bg-accent-50 text-accent-700 hover:bg-accent-100 transition-colors flex items-center"
                >
                  <Link className="w-4 h-4 mr-1" />
                  Add
                </button>
              </div>
            </div>
          </div>
          
          {/* Gallery Preview */}
          {galleryPreview && galleryPreview.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {galleryPreview.map((image, index) => (
                <div key={index} className="relative rounded-lg overflow-hidden border border-gray-200 aspect-square bg-gray-50">
                  <img
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
              <Image className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">No gallery images added yet</p>
              <p className="text-sm text-gray-400 mt-1">Images will appear here after uploading</p>
            </div>
          )}
          {errors?.gallery && <p className="text-red-500 mt-1 text-sm">{errors.gallery}</p>}
        </div>
      </div>
      
      {/* Tips Section */}
      <div className="mt-8 bg-accent-50 rounded-lg p-4 border border-accent-100">
        <h3 className="font-medium text-accent-800 mb-2 flex items-center">
          <AlertCircle className="w-4 h-4 mr-2" />
          Tips for Great Event Images
        </h3>
        <ul className="text-sm text-accent-700 space-y-1 list-disc list-inside">
          <li>Use high-quality, well-lit images that showcase your event clearly</li>
          <li>Main image should be landscape orientation (16:9 ratio works best)</li>
          <li>Include images that show different aspects of the event experience</li>
          <li>Avoid text overlays in images - add important information in the description</li>
          <li>Optimize image size (1-2MB per image) for faster loading</li>
        </ul>
      </div>
    </div>
  );
};

export default ImagesStep; 