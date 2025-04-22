import { useState } from 'react';
import { useFileUpload } from './useFileUpload';
import toast from 'react-hot-toast';

interface MediaUploaderOptions {
  mainImageFieldName?: string;
  galleryFieldName?: string;
  bucketName?: string;
}

const useMediaUploader = (options: MediaUploaderOptions = {}) => {
  const { 
    mainImageFieldName = 'image_url', 
    galleryFieldName = 'gallery',
    bucketName = 'images'  // Default bucket name - use the generic 'images' bucket
  } = options;
  
  const { uploadFile, uploading, progress } = useFileUpload();
  const [imagePreview, setImagePreview] = useState<string>('');
  const [galleryPreview, setGalleryPreview] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState<string>('');
  const [galleryUrlInput, setGalleryUrlInput] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Image upload handlers
  const handleMainImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setFormValue: (name: string, value: any) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Clear any existing image error
    if (errors[mainImageFieldName]) {
      setErrors(prev => ({ ...prev, [mainImageFieldName]: '' }));
    }
    
    // Show preview immediately using URL.createObjectURL for better UX
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    
    try {
      // Now handle the actual upload - using the specific bucket
      const imageUrl = await uploadFile(file, bucketName);
      if (imageUrl) {
        setFormValue(mainImageFieldName, imageUrl);
        toast.success('Image uploaded successfully');
      } else {
        setErrors(prev => ({ 
          ...prev, 
          [mainImageFieldName]: 'Failed to upload image. Please try again.' 
        }));
        toast.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setErrors(prev => ({ 
        ...prev, 
        [mainImageFieldName]: 'Failed to upload image. Please try again.' 
      }));
      toast.error('Error uploading image');
    }
  };
  
  const handleGalleryImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setFormValue: (name: string, value: any) => void,
    currentGallery: string[] = []
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Show previews immediately for better UX
    const newPreviews: string[] = Array.from(files).map(file => URL.createObjectURL(file));
    setGalleryPreview(prev => [...prev, ...newPreviews]);
    
    try {
      // Upload the files one by one to the specific bucket
      const uploadPromises = Array.from(files).map(file => uploadFile(file, bucketName));
      
      // Wait for all uploads to complete
      const uploadedUrls = await Promise.all(uploadPromises);
      
      // Filter out any failed uploads (null values)
      const validUrls = uploadedUrls.filter(url => url) as string[];
      
      // Update the form value with the new URLs
      setFormValue(galleryFieldName, [...currentGallery, ...validUrls]);
      
      toast.success(`${validUrls.length} images uploaded successfully`);
    } catch (error) {
      console.error('Error uploading gallery images:', error);
      toast.error('Error uploading gallery images');
    }
  };
  
  const removeGalleryImage = (
    index: number,
    setFormValue: (name: string, value: any) => void,
    currentGallery: string[] = []
  ) => {
    setGalleryPreview(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
    
    const updatedGallery = [...currentGallery];
    updatedGallery.splice(index, 1);
    setFormValue(galleryFieldName, updatedGallery);
  };
  
  const resetMainImage = (
    setFormValue: (name: string, value: any) => void
  ) => {
    setImagePreview('');
    setFormValue(mainImageFieldName, '');
  };
  
  // Image URL handlers
  const handleAddImageUrl = (
    setFormValue: (name: string, value: any) => void
  ) => {
    if (!isValidUrl(imageUrlInput)) {
      setErrors(prev => ({ ...prev, image_url_input: 'Please enter a valid URL' }));
      return;
    }
    
    setFormValue(mainImageFieldName, imageUrlInput);
    setImagePreview(imageUrlInput);
    setImageUrlInput('');
    setErrors(prev => ({ ...prev, image_url_input: '', [mainImageFieldName]: '' }));
    toast.success('Image URL added successfully');
  };
  
  const handleAddGalleryUrl = (
    setFormValue: (name: string, value: any) => void,
    currentGallery: string[] = []
  ) => {
    if (!isValidUrl(galleryUrlInput)) {
      setErrors(prev => ({ ...prev, gallery_url_input: 'Please enter a valid URL' }));
      return;
    }
    
    setGalleryPreview(prev => [...prev, galleryUrlInput]);
    setFormValue(galleryFieldName, [...currentGallery, galleryUrlInput]);
    setGalleryUrlInput('');
    setErrors(prev => ({ ...prev, gallery_url_input: '' }));
    toast.success('Gallery image URL added successfully');
  };
  
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };
  
  const setInitialValues = (formData: any) => {
    if (formData[mainImageFieldName]) {
      setImagePreview(formData[mainImageFieldName]);
    }
    
    if (formData[galleryFieldName] && formData[galleryFieldName].length > 0) {
      setGalleryPreview(formData[galleryFieldName]);
    }
  };
  
  return {
    imagePreview,
    setImagePreview,
    galleryPreview,
    setGalleryPreview,
    imageUrlInput,
    setImageUrlInput,
    galleryUrlInput,
    setGalleryUrlInput,
    errors,
    setErrors,
    uploading,
    progress,
    handleMainImageUpload,
    handleGalleryImageUpload,
    removeGalleryImage,
    resetMainImage,
    handleAddImageUrl,
    handleAddGalleryUrl,
    setInitialValues
  };
};

export default useMediaUploader;