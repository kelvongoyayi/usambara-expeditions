import React, { useState } from 'react';
import { Upload, X, Link as LinkIcon } from 'lucide-react';

interface MediaUploaderProps {
  title: string;
  description?: string;
  mainImage: string;
  galleryImages: string[];
  onMainImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGalleryImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveMainImage: () => void;
  onRemoveGalleryImage: (index: number) => void;
  uploading: boolean;
  progress: number;
  errors: Record<string, string>;
  urlInput: {
    main: string;
    setMain: (value: string) => void;
    gallery: string;
    setGallery: (value: string) => void;
  };
  onAddMainImageUrl: () => void;
  onAddGalleryImageUrl: () => void;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
  title,
  description,
  mainImage,
  galleryImages,
  onMainImageUpload,
  onGalleryImageUpload,
  onRemoveMainImage,
  onRemoveGalleryImage,
  uploading,
  progress,
  errors,
  urlInput,
  onAddMainImageUrl,
  onAddGalleryImageUrl
}) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}

        {/* Main Image */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Main Image <span className="text-red-500">*</span>
          </label>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col">
              {mainImage ? (
                <div className="relative border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-gray-50 aspect-[16/9]">
                  <img
                    src={mainImage}
                    alt="Main image preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={onRemoveMainImage}
                    className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full shadow-sm hover:bg-black/70 focus:outline-none transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white text-sm truncate">
                      {mainImage.substring(0, 50)}
                      {mainImage.length > 50 ? '...' : ''}
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
                    onChange={onMainImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="mainImage"
                    className="inline-flex w-full justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none cursor-pointer"
                  >
                    <Upload className="w-4 h-4 mr-2 text-gray-500" />
                    {mainImage ? 'Change Image' : 'Upload Image'}
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
                    <LinkIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    value={urlInput.main}
                    onChange={(e) => urlInput.setMain(e.target.value)}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={onAddMainImageUrl}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                >
                  Add
                </button>
              </div>
              
              {errors.image_url_input && (
                <p className="text-sm text-red-600 mb-4">{errors.image_url_input}</p>
              )}
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
                {galleryImages.map((preview, index) => (
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
                      onClick={() => onRemoveGalleryImage(index)}
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
                    onChange={onGalleryImageUpload}
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
                  onChange={onGalleryImageUpload}
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
                    <LinkIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="https://example.com/gallery.jpg"
                    value={urlInput.gallery}
                    onChange={(e) => urlInput.setGallery(e.target.value)}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={onAddGalleryImageUrl}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                >
                  Add
                </button>
              </div>
              
              {errors.gallery_url_input && (
                <p className="text-sm text-red-600 mb-4">{errors.gallery_url_input}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaUploader;