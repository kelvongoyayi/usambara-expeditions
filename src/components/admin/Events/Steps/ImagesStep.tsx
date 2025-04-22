import React from 'react';
import { Event } from '../../../../services/events.service';
import {
  Button,
  Card,
  CardBody
} from '../../../../components/ui';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';

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
  resetMainImage
}) => {
  // Use either the uploaded preview or the existing image from formData
  const mainImageUrl = imagePreview || formData.image_url;
  // Combine existing gallery with newly uploaded images
  const galleryImages = [...(formData.gallery || []), ...galleryPreview];

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
                <div className="relative">
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
                    className="relative"
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
              </div>
            ) : (
              <div className="relative">
                <img
                  src={mainImageUrl}
                  alt="Main event"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={resetMainImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                  disabled={uploading}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
          {errors?.image_url && <p className="text-red-500 mt-2 text-sm">{errors.image_url}</p>}
        </div>

        {/* Gallery Images Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gallery Images (Optional)</label>
          <p className="text-sm text-gray-500 mb-4">Add additional images to showcase your event. These will appear in a gallery view.</p>
          
          <div className="mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {galleryImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                    disabled={uploading}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              {/* Upload Button */}
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-accent-400 transition-colors h-40">
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