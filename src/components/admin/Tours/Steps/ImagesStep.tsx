import React, { useEffect } from 'react';
import { Image, Upload, Camera, AlertCircle, Link, X } from 'lucide-react';
import { FileUploadField } from '../../../../components/ui';
import useMediaUploader from '../../../../hooks/useMediaUploader';

// Define the Tour type inline to avoid import issues
interface Tour {
  id?: string;
  title: string;
  description: string;
  price: number;
  included?: string[];
  excluded?: string[];
  [key: string]: any;
}

// Define FormErrors type inline
type FormErrors = Record<string, string>;

interface ImagesStepProps {
  formValues: any;
  onChange: (values: any) => void;
  errors: FormErrors;
  onValidation?: (isValid: boolean) => void;
}

const ImagesStep: React.FC<ImagesStepProps> = ({ formValues, onChange, errors, onValidation }) => {
  const {
    imagePreview,
    imageUrlInput,
    setImageUrlInput,
    galleryPreview,
    galleryUrlInput,
    setGalleryUrlInput,
    uploading,
    progress,
    handleMainImageUpload,
    handleGalleryImageUpload,
    removeGalleryImage,
    resetMainImage,
    handleAddImageUrl,
    handleAddGalleryUrl,
    setInitialValues
  } = useMediaUploader({ 
    bucketName: 'tours',
    mainImageFieldName: 'image_url',
    galleryFieldName: 'gallery'
  });

  useEffect(() => {
    // Initialize with existing values if present
    setInitialValues(formValues);
  }, []);

  useEffect(() => {
    // Validate if we have at least a main image
    if (onValidation) {
      onValidation(!!formValues.image_url);
    }
  }, [formValues.image_url, onValidation]);

  const handleChange = (field: string, value: any) => {
    onChange({
      ...formValues,
      [field]: value,
    });
  };

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      const mockEvent = {
        target: {
          files: files
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      handleMainImageUpload(mockEvent, handleChange);
    }
  };

  const handleGalleryFileUpload = (files: File[]) => {
    if (files.length > 0) {
      const mockEvent = {
        target: {
          files: files
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      handleGalleryImageUpload(mockEvent, handleChange, formValues.gallery || []);
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Main Image Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Image className="w-5 h-5 text-brand-600" />
            <h3 className="text-lg font-semibold text-gray-800">Main Tour Image</h3>
          </div>
          
          {!imagePreview ? (
            <FileUploadField
              accept="image/*"
              maxSize={5}
              onChange={handleFileUpload}
              helperText="Upload the main image for your tour (recommended size: 1200×800px)"
              error={errors.image_url}
              multiple={false}
              disabled={uploading}
            />
          ) : (
            <div className="relative">
              <img 
                src={imagePreview} 
                alt="Main tour image" 
                className="w-full h-48 object-cover rounded-lg"
              />
              <button 
                onClick={() => resetMainImage(handleChange)} 
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          
          {/* Image URL Input Option */}
          <div className="mt-4 border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Or add image by URL</h4>
            <div className="flex space-x-2">
              <input
                type="text"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="Paste image URL here"
                className="flex-1 p-2 border rounded-md text-sm"
                disabled={uploading}
              />
              <button
                type="button"
                onClick={() => handleAddImageUrl(handleChange)}
                className="px-3 py-2 bg-brand-600 text-white rounded-md text-sm flex items-center"
                disabled={!imageUrlInput || uploading}
              >
                <Link className="w-4 h-4 mr-1" />
                Add
              </button>
            </div>
            {errors.image_url_input && <p className="text-red-500 text-xs mt-1">{errors.image_url_input}</p>}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Camera className="w-5 h-5 text-accent-500" />
            <h3 className="text-lg font-semibold text-gray-800">Image Gallery</h3>
          </div>
          
          <FileUploadField
            accept="image/*"
            maxSize={5}
            onChange={handleGalleryFileUpload}
            helperText="Upload additional images for your tour gallery (up to 10 images)"
            error={errors.gallery}
            multiple={true}
            disabled={uploading || (galleryPreview.length >= 10)}
          />
          
          {galleryPreview.length >= 10 && (
            <p className="text-amber-500 text-xs mt-2">
              Maximum of 10 gallery images allowed. Remove some images to add more.
            </p>
          )}
          
          {/* Gallery URL Input Option */}
          <div className="mt-4 border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Or add gallery image by URL</h4>
            <div className="flex space-x-2">
              <input
                type="text"
                value={galleryUrlInput}
                onChange={(e) => setGalleryUrlInput(e.target.value)}
                placeholder="Paste image URL here"
                className="flex-1 p-2 border rounded-md text-sm"
                disabled={uploading || (galleryPreview.length >= 10)}
              />
              <button
                type="button"
                onClick={() => handleAddGalleryUrl(handleChange, formValues.gallery || [])}
                className="px-3 py-2 bg-accent-500 text-white rounded-md text-sm flex items-center"
                disabled={!galleryUrlInput || uploading || (galleryPreview.length >= 10)}
              >
                <Link className="w-4 h-4 mr-1" />
                Add
              </button>
            </div>
            {errors.gallery_url_input && <p className="text-red-500 text-xs mt-1">{errors.gallery_url_input}</p>}
          </div>
        </div>
      </div>
      
      {/* Gallery Preview Section */}
      {galleryPreview.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Gallery Preview</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {galleryPreview.map((img, index) => (
              <div key={index} className="relative group">
                <img 
                  src={img} 
                  alt={`Gallery image ${index + 1}`} 
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button 
                  onClick={() => removeGalleryImage(index, handleChange, formValues.gallery || [])} 
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Upload Progress */}
      {uploading && (
        <div className="bg-brand-50 border border-brand-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-brand-700">Uploading...</span>
            <span className="text-sm text-brand-700">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-brand-100 rounded-full h-2">
            <div 
              className="bg-brand-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {/* Information Messages */}
      {!formValues.image_url && !uploading && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 text-amber-500" />
          <div>
            <p className="text-sm font-medium">A main tour image is highly recommended</p>
            <p className="text-xs mt-1">Tours with appealing images receive more bookings.</p>
          </div>
        </div>
      )}
      
      {formValues.image_url && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded flex items-center">
          <Image className="w-5 h-5 mr-2 flex-shrink-0 text-green-500" />
          <div>
            <p className="text-sm font-medium">Main image added successfully!</p>
            <p className="text-xs mt-1">You can add more images to the gallery or proceed to the next step.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagesStep; 