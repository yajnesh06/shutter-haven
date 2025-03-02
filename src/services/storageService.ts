
import { supabase } from "@/integrations/supabase/client";
import { ImageCategory, ImageType } from "@/types";
import { createClient } from "@supabase/supabase-js";

interface ImageUploadOptions {
  title: string;
  category: ImageCategory;
  onProgress?: (progress: number) => void;
}

// For accessing Supabase from the browser using the Admin/Service role
// This should only be used for development/testing purposes
// In production, sensitive operations should be moved to a server-side API
const SUPABASE_URL = "https://evjofjyjfzewjtzlkruw.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2am9manlqZnpld2p0emxrcnV3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDM4ODU5NSwiZXhwIjoyMDU1OTY0NTk1fQ.FoKlJFJDxcV35W-nAcRqaQ3SfcIQZmmaTFNWNZLQG-A";

// Create a fetch-based client that will work in browser environments
const adminSupabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      fetch: fetch.bind(globalThis)
    }
  }
);

// Function to get image dimensions from File
const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
    };
    img.onerror = (error) => {
      reject(error);
    };
    img.src = URL.createObjectURL(file);
  });
};

// Upload an image to Supabase Storage and create a database entry
export const uploadImage = async (file: File, options: ImageUploadOptions): Promise<ImageType> => {
  const { title, category, onProgress } = options;
  
  try {
    // Get image dimensions
    const { width, height } = await getImageDimensions(file);
    
    // Create a unique filename to avoid collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${category}/${fileName}`;
    
    console.log(`Attempting to upload file to ${filePath} with admin client`);
    
    // First check if the bucket exists, if not create it
    const { data: buckets } = await adminSupabase.storage.listBuckets();
    const imagesBucketExists = buckets?.some(bucket => bucket.name === 'images');
    
    if (!imagesBucketExists) {
      console.log('Images bucket does not exist, creating it');
      const { error: bucketError } = await adminSupabase.storage.createBucket('images', {
        public: true
      });
      
      if (bucketError) {
        console.error('Bucket creation error:', bucketError);
        throw new Error(`Error creating images bucket: ${bucketError.message}`);
      }
    }
    
    // Upload to Supabase Storage using the admin client
    const { data: uploadData, error: uploadError } = await adminSupabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error(`Error uploading image: ${uploadError.message}`);
    }
    
    // If progress callback is provided, call it with 100% after successful upload
    if (onProgress) {
      onProgress(100);
    }
    
    // Get the public URL using the same admin client
    const { data: { publicUrl } } = adminSupabase.storage
      .from('images')
      .getPublicUrl(filePath);
      
    console.log(`Successfully uploaded file, public URL: ${publicUrl}`);
    
    // Create entry in the images database using the same admin client
    const { data: imageData, error: dbError } = await adminSupabase
      .from('images')
      .insert({
        title,
        url: publicUrl,
        storage_path: filePath,
        category,
        width,
        height
      })
      .select()
      .single();
      
    if (dbError) {
      console.error('Database insert error:', dbError);
      throw new Error(`Error creating database entry: ${dbError.message}`);
    }
    
    console.log('Successfully created database entry:', imageData);
    
    return imageData as ImageType;
  } catch (error) {
    console.error('Error in uploadImage:', error);
    throw error;
  }
};
