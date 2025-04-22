import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface FileUploadState {
  uploading: boolean;
  progress: number;
  error: Error | null;
  url: string | null;
  urls: string[];
}

interface UseFileUploadReturn extends FileUploadState {
  uploadFile: (file: File, bucketName?: string) => Promise<string | null>;
  uploadMultipleFiles: (files: File[], bucketName?: string) => Promise<string[]>;
  reset: () => void;
}

// Default bucket name to use if none specified
const DEFAULT_BUCKET = 'tours';

export const useFileUpload = (): UseFileUploadReturn => {
  const [state, setState] = useState<FileUploadState>({
    uploading: false,
    progress: 0,
    error: null,
    url: null,
    urls: []
  });

  const reset = useCallback(() => {
    setState({
      uploading: false,
      progress: 0,
      error: null,
      url: null,
      urls: []
    });
  }, []);

  // Function to ensure a bucket exists before uploading
  const ensureBucketExists = async (bucketName: string): Promise<boolean> => {
    try {
      // Check if bucket exists by listing objects - will fail if bucket doesn't exist
      const { error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error('Error listing buckets:', error);
        return false;
      }
      
      // Check if our specific bucket is in the list
      const { data: buckets } = await supabase.storage.listBuckets();
      
      const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
      
      if (!bucketExists) {
        // Try using 'tours' bucket as fallback
        const fallbackBucket = 'tours';
        const fallbackExists = buckets?.some(bucket => bucket.name === fallbackBucket);
        
        if (fallbackExists) {
          console.warn(`Bucket "${bucketName}" not found, falling back to "${fallbackBucket}"`);
          return true; // Return true but we'll use fallback bucket name later
        }
        
        // If no fallback available, try public bucket
        const publicBucket = 'public';
        const publicExists = buckets?.some(bucket => bucket.name === publicBucket);
        
        if (publicExists) {
          console.warn(`Bucket "${bucketName}" not found, falling back to "${publicBucket}"`);
          return true; // Return true but we'll use public bucket name later
        }
        
        toast.error(`Storage bucket "${bucketName}" not found`);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error ensuring bucket exists:', error);
      return false;
    }
  };

  // Get a valid bucket name (either requested one or fallback)
  const getValidBucketName = async (requestedBucket: string): Promise<string> => {
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      
      // Check if requested bucket exists
      if (buckets?.some(bucket => bucket.name === requestedBucket)) {
        return requestedBucket;
      }
      
      // Try standard fallbacks
      const fallbacks = ['tours', 'events', 'public', 'storage'];
      
      for (const fallback of fallbacks) {
        if (buckets?.some(bucket => bucket.name === fallback)) {
          console.warn(`Using fallback bucket "${fallback}" instead of "${requestedBucket}"`);
          return fallback;
        }
      }
      
      // If no valid buckets found, use the first available bucket
      if (buckets && buckets.length > 0) {
        console.warn(`Using first available bucket "${buckets[0].name}" instead of "${requestedBucket}"`);
        return buckets[0].name;
      }
      
      // Last resort - return the requested bucket (will likely fail but at least we tried)
      return requestedBucket;
    } catch (error) {
      console.error('Error getting valid bucket name:', error);
      return requestedBucket; // Return original as last resort
    }
  };

  const uploadFile = useCallback(
    async (file: File, bucketName: string = DEFAULT_BUCKET): Promise<string | null> => {
      try {
        setState(prev => ({ ...prev, uploading: true, progress: 0, error: null }));
        
        // Get a valid bucket name
        const validBucketName = await getValidBucketName(bucketName);
        
        // Generate a unique file name
        const fileExt = file.name.split('.').pop();
        const timeStamp = new Date().getTime();
        const filePath = `${timeStamp}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        
        // Upload file to Supabase Storage
        const { error } = await supabase.storage
          .from(validBucketName)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
            onUploadProgress: (progress) => {
              const percentage = Math.round((progress.loaded / progress.total) * 100);
              setState(prev => ({ ...prev, progress: percentage }));
            }
          });
        
        if (error) {
          console.error('Upload error:', error);
          // Check if it's an RLS policy error
          if (error.message?.includes('row-level security policy') || error.message?.includes('Unauthorized')) {
            toast.error('Permission denied: You do not have access to upload files. Please contact an administrator.');
          } else {
            toast.error(`Upload failed: ${error.message || 'Unknown error'}`);
          }
          throw error;
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from(validBucketName)
          .getPublicUrl(filePath);
        
        setState(prev => ({ 
          ...prev, 
          uploading: false, 
          progress: 100, 
          url: publicUrl,
          urls: [...prev.urls, publicUrl]
        }));
        
        return publicUrl;
      } catch (error: any) {
        setState(prev => ({ 
          ...prev, 
          uploading: false, 
          error: error instanceof Error ? error : new Error(error.message || 'Upload failed') 
        }));
        
        // Show error toast
        if (!error.message?.includes('row-level security policy') && !error.message?.includes('Unauthorized')) {
          toast.error(error.message || 'Failed to upload file');
        }
        
        return null;
      }
    },
    []
  );

  const uploadMultipleFiles = useCallback(
    async (files: File[], bucketName: string = DEFAULT_BUCKET): Promise<string[]> => {
      try {
        setState(prev => ({ ...prev, uploading: true, progress: 0, error: null }));
        
        // Get a valid bucket name
        const validBucketName = await getValidBucketName(bucketName);
        
        const uploadPromises = files.map((file, index) => {
          // Add a small delay between uploads to prevent overwhelming the server
          return new Promise<string | null>(resolve => {
            setTimeout(async () => {
              // Use the valid bucket name here
              const result = await uploadFile(file, validBucketName);
              resolve(result);
            }, index * 200); // 200ms delay between each upload
          });
        });
        
        const urls = await Promise.all(uploadPromises);
        const validUrls = urls.filter(url => url !== null) as string[];
        
        setState(prev => ({ 
          ...prev, 
          uploading: false, 
          progress: 100, 
          urls: [...prev.urls, ...validUrls]
        }));
        
        return validUrls;
      } catch (error: any) {
        setState(prev => ({ 
          ...prev, 
          uploading: false, 
          error: error instanceof Error ? error : new Error(error.message || 'Upload failed')
        }));
        
        // Show error toast
        if (!error.message?.includes('row-level security policy') && !error.message?.includes('Unauthorized')) {
          toast.error(error.message || 'Failed to upload files');
        }
        
        return [];
      }
    },
    [uploadFile]
  );

  return {
    ...state,
    uploadFile,
    uploadMultipleFiles,
    reset
  };
};