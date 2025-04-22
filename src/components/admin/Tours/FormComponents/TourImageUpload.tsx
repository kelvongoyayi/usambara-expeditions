import React from 'react';
import { X, Upload, Link, ExternalLink } from 'lucide-react';

interface TourImageUploadProps {
  imagePreview: string;
  galleryPreview: string[];
  errors: Record<string, string>;
  handleMainImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGalleryImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeGalleryImage: (index: number) => void;
  resetMainImage: () => void;
  uploading: boolean;
  progress: number;
  imageUrlInput: string;
  setImageUrlInput: (value: string) => void;
  handleAddImageUrl: () => void;
  galleryUrlInput: string;
  setGalleryUrlInput: (value: string) => void;
  handleAddGalleryUrl: () => void;
}

const TourImageUpload: React.FC<TourImageUploadProps> = ({
  imagePreview,
  galleryPreview,
  errors,
  handleMainImageUpload,
  handleGalleryImageUpload,
  removeGalleryImage,
  resetMainImage,
  uploading,
  progress,
  imageUrlInput,
  setImageUrlInput,
  handleAddImageUrl,
  galleryUrlInput,
  setGalleryUrlInput,
  handleAddGalleryUrl
}) => {
  return (
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Tour Images</h2>
      <div className="space-y-8">
        {/* Main Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Main Image <span className="text-red-500">*</span>
          </label>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col">
              {imagePreview ? (
                <div className="relative border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-gray-50 aspect-[16/9]">
                  <img
                    src={imagePreview}
                    alt="Tour preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={resetMainImage}
                    className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full shadow-sm hover:bg-black/70 focus:outline-none transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white text-sm truncate">
                      {imagePreview.substring(0, 50)}
                      {imagePreview.length > 50 ? '...' : ''}
                    </p>
                  </div>
                </div>
              ) : (
                <div 
                  className={`border-2 border-dashed flex flex-col items-center justify-center aspect-[16/9] rounded-lg ${
                    errors.image_url ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-brand-400'
                  } transition-colors`}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Upload a high-quality image</p>
                  <p className="text-xs text-gray-400 mt-1">1200×800px or higher recommended</p>
                </div>
              )}
              
              {errors.image_url && (
                <p className="mt-1 text-sm text-red-600">{errors.image_url}</p>
              )}

              <div className="mt-4 flex space-x-4">
                <div className="flex-1">
                  <input
                    type="file"
                    id="mainImage"
                    accept="image/*"
                    onChange={handleMainImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="mainImage"
                    className="inline-flex w-full justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none cursor-pointer"
                  >
                    <Upload className="w-4 h-4 mr-2 text-gray-500" />
                    {imagePreview ? 'Change Image' : 'Upload Image'}
                  </label>
                </div>
              </div>
              
              {uploading && (
                <div className="mt-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-grow">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-brand-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{progress}%</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-700 mb-2">Or add image by URL</p>
              
              <div className="flex space-x-2 mb-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Link className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                >
                  Add
                </button>
              </div>
              
              {errors.image_url_input && (
                <p className="text-sm text-red-600 mb-4">{errors.image_url_input}</p>
              )}
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <ExternalLink className="w-4 h-4 mr-1 text-gray-500" />
                  Image Guidelines
                </h3>
                
                <ul className="text-xs text-gray-600 space-y-1 ml-5 list-disc">
                  <li>Use high-quality, engaging images</li>
                  <li>Recommended size: 1200×800 pixels</li>
                  <li>Max file size: 5MB</li>
                  <li>Supported formats: JPG, PNG, WebP</li>
                  <li>Landscape orientation works best</li>
                  <li>Ensure you have rights to use the image</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Gallery Images */}
        <div className="border-t border-gray-100 pt-6">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Gallery Images
            <span className="text-gray-500 text-xs font-normal ml-1">(Optional)</span>
          </label>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <div className="flex flex-wrap gap-4 mb-4">
                {galleryPreview.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
                      <img
                        src={preview}
                        alt={`Gallery image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-sm hover:bg-red-600 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                
                <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-brand-400 transition-colors">
                  <input
                    type="file"
                    id="galleryImages"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="galleryImages"
                    className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                  >
                    <Upload className="h-6 w-6 text-gray-400 mb-1" />
                    <p className="text-xs text-gray-500">Add</p>
                  </label>
                </div>
              </div>
              
              <div className="mt-2">
                <input
                  type="file"
                  id="galleryImagesBtn"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="galleryImagesBtn"
                  className="inline-flex w-full justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none cursor-pointer"
                >
                  <Upload className="w-4 h-4 mr-2 text-gray-500" />
                  Upload Gallery Images
                </label>
              </div>
            </div>
            
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-700 mb-2">Or add gallery image by URL</p>
              
              <div className="flex space-x-2 mb-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Link className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="https://example.com/gallery.jpg"
                    value={galleryUrlInput}
                    onChange={(e) => setGalleryUrlInput(e.target.value)}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddGalleryUrl}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                >
                  Add
                </button>
              </div>
              
              {errors.gallery_url_input && (
                <p className="text-sm text-red-600 mb-4">{errors.gallery_url_input}</p>
              )}
              
              <p className="text-sm text-gray-500 mt-4">
                Add multiple images to showcase different aspects of the tour. Include images of accommodations, activities, scenery, and more.
              </p>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      All image uploads will be stored in the "tours" bucket. Make sure your storage bucket is properly configured.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourImageUpload;