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
  imageUrlInput: string;
  galleryUrlInput: string;
  setImageUrlInput: React.Dispatch<React.SetStateAction<string>>;
  setGalleryUrlInput: React.Dispatch<React.SetStateAction<string>>;
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
  imageUrlInput,
  galleryUrlInput,
  setImageUrlInput,
  setGalleryUrlInput
}) => {
  // Use either the uploaded preview or the existing image from formData
  const mainImageUrl = imagePreview || formData.image_url;
  // Combine existing gallery with newly uploaded images
  const galleryImages = [...(formData.gallery || []), ...galleryPreview];

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      const mockEvent = {
        target: {
          files: files
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      handleMainImageUpload(mockEvent);
    }
  };

  const handleGalleryFileUpload = (files: File[]) => {
    if (files.length > 0) {
      const mockEvent = {
        target: {
          files: files
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      handleGalleryImageUpload(mockEvent);
    }
  };
  
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Main Image and Gallery Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
        {/* Main Image Section */}
        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border border-gray-100">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Image className="w-4 h-4 sm:w-5 sm:h-5 text-accent-600" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Main Event Image</h3>
          </div>
          
          {!mainImageUrl ? (
            <FileUploadField
              accept="image/*"
              maxSize={5}
              onChange={handleFileUpload}
              helperText="Upload the main image for your event (recommended size: 1200×800px)"
              error={errors.image_url}
              multiple={false}
              disabled={uploading}
            />
          ) : (
            <div className="relative">
              <img 
                src={mainImageUrl} 
                alt="Main event image" 
                className="w-full h-36 sm:h-48 object-cover rounded-lg"
              />
              <button 
                onClick={resetMainImage} 
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          
          {/* Image URL Input Option */}
          <div className="mt-3 sm:mt-4 border-t pt-3 sm:pt-4">
            <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Or add image by URL</h4>
            <div className="flex space-x-2">
              <input
                type="text"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="Paste image URL here"
                className="flex-1 min-w-0 p-2 border rounded-md text-xs sm:text-sm"
                disabled={uploading}
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-2 sm:px-3 py-2 bg-accent-600 text-white rounded-md text-xs sm:text-sm flex items-center whitespace-nowrap"
                disabled={!imageUrlInput || uploading}
              >
                <Link className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Add
              </button>
            </div>
            {errors?.image_url_input && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.image_url_input}
              </p>
            )}
          </div>
        </div>
        
        {/* Gallery Section */}
        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border border-gray-100">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-accent-500" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Image Gallery</h3>
          </div>
          
          <FileUploadField
            accept="image/*"
            maxSize={5}
            onChange={handleGalleryFileUpload}
            helperText="Upload additional images for your event gallery (up to 10 images)"
            error={errors.gallery}
            multiple={true}
            disabled={uploading || (galleryImages.length >= 10)}
          />
          
          {galleryImages.length >= 10 && (
            <p className="text-amber-500 text-xs mt-2 flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              Maximum of 10 gallery images allowed. Remove some images to add more.
            </p>
          )}
          
          {/* Gallery URL Input Option */}
          <div className="mt-3 sm:mt-4 border-t pt-3 sm:pt-4">
            <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Or add gallery image by URL</h4>
            <div className="flex space-x-2">
              <input
                type="text"
                value={galleryUrlInput}
                onChange={(e) => setGalleryUrlInput(e.target.value)}
                placeholder="Paste image URL here"
                className="flex-1 min-w-0 p-2 border rounded-md text-xs sm:text-sm"
                disabled={uploading || (galleryImages.length >= 10)}
              />
              <button
                type="button"
                onClick={handleAddGalleryUrl}
                className="px-2 sm:px-3 py-2 bg-accent-500 text-white rounded-md text-xs sm:text-sm flex items-center whitespace-nowrap"
                disabled={!galleryUrlInput || uploading || (galleryImages.length >= 10)}
              >
                <Link className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Add
              </button>
            </div>
            {errors?.gallery_url_input && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.gallery_url_input}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Gallery Preview Section */}
      {galleryImages.length > 0 && (
        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border border-gray-100">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Gallery Preview</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
            {galleryImages.map((img, index) => (
              <div key={index} className="relative group">
                <img 
                  src={img} 
                  alt={`Gallery image ${index + 1}`} 
                  className="w-full h-24 sm:h-32 object-cover rounded-lg"
                />
                <button 
                  onClick={() => removeGalleryImage(index)} 
                  className="absolute top-1 sm:top-2 right-1 sm:right-2 p-1 bg-red-500 text-white rounded-full opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Upload Progress */}
      {uploading && (
        <div className="bg-accent-50 border border-accent-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <span className="text-xs sm:text-sm font-medium text-accent-700">Uploading...</span>
            <span className="text-xs sm:text-sm text-accent-700">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-accent-100 rounded-full h-1.5 sm:h-2">
            <div 
              className="bg-accent-600 h-1.5 sm:h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {/* Information Messages */}
      {!formData.image_url && !uploading && !mainImageUrl && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-3 sm:px-4 py-2 sm:py-3 rounded-lg flex items-center">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0 text-amber-500" />
          <div>
            <p className="text-xs sm:text-sm font-medium">A main event image is highly recommended</p>
            <p className="text-xs mt-1 text-amber-700">Events with appealing images receive more attendee registrations.</p>
          </div>
        </div>
      )}
      
      {(formData.image_url || mainImageUrl) && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-3 sm:px-4 py-2 sm:py-3 rounded-lg flex items-center">
          <Image className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0 text-green-500" />
          <div>
            <p className="text-xs sm:text-sm font-medium">Main image added successfully!</p>
            <p className="text-xs mt-1 text-green-700">You can add more images to the gallery or proceed to the next step.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagesStep; 