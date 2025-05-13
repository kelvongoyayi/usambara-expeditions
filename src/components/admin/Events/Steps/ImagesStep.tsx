import React from 'react';
import { Event } from '../../../../services/events.service';
import {
  Button,
  Card,
  CardBody
} from '../../../../components/ui';
import { Upload, X, Loader2, ImageIcon, Link as LinkIcon, AlertCircle } from 'lucide-react';

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
  // Local state for URL error messages
  const [urlErrors, setUrlErrors] = React.useState({ main: '', gallery: '' });

  // Use either the uploaded preview or the existing image from formData
  const mainImageUrl = imagePreview || formData.image_url;
  // Combine existing gallery with newly uploaded images
  const galleryImages = [...(formData.gallery || []), ...galleryPreview];

  // Function to validate URL
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Handle validation for main image URL
  const validateAndAddImageUrl = () => {
    if (!imageUrlInput.trim()) {
      setUrlErrors(prev => ({ ...prev, main: 'Please enter a URL' }));
      return;
    }

    if (!isValidUrl(imageUrlInput)) {
      setUrlErrors(prev => ({ ...prev, main: 'Please enter a valid URL' }));
      return;
    }

    setUrlErrors(prev => ({ ...prev, main: '' }));
    handleAddImageUrl();
  };

  // Handle validation for gallery image URL
  const validateAndAddGalleryUrl = () => {
    if (!galleryUrlInput.trim()) {
      setUrlErrors(prev => ({ ...prev, gallery: 'Please enter a URL' }));
      return;
    }

    if (!isValidUrl(galleryUrlInput)) {
      setUrlErrors(prev => ({ ...prev, gallery: 'Please enter a valid URL' }));
      return;
    }

    setUrlErrors(prev => ({ ...prev, gallery: '' }));
    handleAddGalleryUrl();
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-xl font-semibold text-gray-900 border-b pb-3">Event Images</h2>
      
      <div className="space-y-8">
        {/* Main Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 required">Main Event Image</label>
          <p className="text-sm text-gray-500 mb-4">This image will appear as the featured image for your event.</p>
          
          <div className="mt-2">
            {!mainImageUrl ? (
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-accent-400 transition-colors">
                <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
                <div className="text-sm text-gray-600 mb-4">No image selected</div>
                
                {/* Tabs for upload methods */}
                <div className="w-full max-w-md mb-4">
                  <div className="flex border-b border-gray-200">
                    <button 
                      type="button" 
                      className="py-2 px-4 text-sm font-medium text-accent-600 border-b-2 border-accent-500"
                    >
                      Upload File
                    </button>
                    <button 
                      type="button" 
                      className="py-2 px-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                      onClick={() => document.getElementById('url-input')?.focus()}
                    >
                      Use URL
                    </button>
                  </div>
                </div>
                
                <div className="relative w-full max-w-md">
                  <input
                    id="main-image"
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageUpload}
                    disabled={uploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    className="relative w-full"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading {progress}%
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Select Image
                      </>
                    )}
                  </Button>
                </div>
                
                {/* URL input */}
                <div className="relative w-full max-w-md mt-4">
                  <div className="flex items-center">
                    <input
                      id="url-input"
                      type="text"
                      value={imageUrlInput}
                      onChange={(e) => {
                        setImageUrlInput(e.target.value);
                        if (urlErrors.main) setUrlErrors(prev => ({ ...prev, main: '' }));
                      }}
                      placeholder="Or paste image URL here"
                      className="w-full border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-400"
                      disabled={uploading}
                    />
                    <Button
                      type="button"
                      onClick={validateAndAddImageUrl}
                      disabled={uploading || !imageUrlInput.trim()}
                      className="rounded-l-none"
                    >
                      <LinkIcon className="mr-1 h-4 w-4" />
                      Add
                    </Button>
                  </div>
                  {urlErrors.main && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {urlErrors.main}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={mainImageUrl}
                  alt="Main event"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-opacity flex items-center justify-center opacity-0 hover:opacity-100">
                  <button
                    type="button"
                    onClick={resetMainImage}
                    className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                    disabled={uploading}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="absolute top-2 right-2">
                  <button
                    type="button"
                    onClick={resetMainImage}
                    className="p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                    disabled={uploading}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
          {errors?.image_url && (
            <p className="text-red-500 mt-2 text-sm flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.image_url}
            </p>
          )}
        </div>

        {/* Gallery Images Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gallery Images (Optional)</label>
          <p className="text-sm text-gray-500 mb-4">Add additional images to showcase your event. These will appear in a gallery view.</p>
          
          <div className="mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {galleryImages.map((image, index) => (
                <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      disabled={uploading}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Upload Button */}
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-accent-400 transition-colors h-40">
                {/* Tabs for gallery upload methods */}
                <div className="w-full mb-2">
                  <div className="flex justify-center space-x-4 text-xs mb-2">
                    <span className="text-accent-600 border-b border-accent-500 pb-1">File Upload</span>
                    <span className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => document.getElementById('gallery-url-input')?.focus()}>URL</span>
                  </div>
                </div>
              
                <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                <div className="text-sm text-gray-600 mb-2">Add to gallery</div>
                <div className="relative">
                  <input
                    id="gallery-images"
                    type="file"
                    accept="image/*"
                    onChange={handleGalleryImageUpload}
                    disabled={uploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="relative"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        Uploading
                      </>
                    ) : (
                      <>
                        <Upload className="mr-1 h-3 w-3" />
                        Upload
                      </>
                    )}
                  </Button>
                </div>
                
                {/* Gallery URL input */}
                <div className="w-full mt-2">
                  <div className="flex items-center">
                    <input
                      id="gallery-url-input"
                      type="text"
                      value={galleryUrlInput}
                      onChange={(e) => {
                        setGalleryUrlInput(e.target.value);
                        if (urlErrors.gallery) setUrlErrors(prev => ({ ...prev, gallery: '' }));
                      }}
                      placeholder="Or paste image URL"
                      className="w-full text-xs border border-gray-300 rounded-l-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-accent-400"
                      disabled={uploading}
                    />
                    <Button
                      type="button"
                      onClick={validateAndAddGalleryUrl}
                      disabled={uploading || !galleryUrlInput.trim()}
                      size="sm"
                      className="rounded-l-none h-[26px] px-2"
                    >
                      Add
                    </Button>
                  </div>
                  {urlErrors.gallery && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {urlErrors.gallery}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Guidelines */}
        <Card>
          <CardBody>
            <h3 className="font-semibold text-gray-800 mb-2">Best Practices for Event Images</h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Use high-resolution images (recommended: 1920 x 1080 pixels)</li>
              <li>Keep file sizes under 5MB for optimal performance</li>
              <li>Use well-lit photos that clearly showcase the event</li>
              <li>Include images that highlight key features of your event</li>
              <li>Avoid text overlay on images - add this information in the description</li>
              <li>Include images showing the venue, activities, and atmosphere</li>
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ImagesStep; 