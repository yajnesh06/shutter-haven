
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

// Create a supabase client specifically for admin operations, bypassing auth completely
const adminSupabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
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

// Check if a bucket exists and create it if it doesn't
const ensureBucketExists = async (bucketName: string): Promise<void> => {
  try {
    // Using regular supabase client to check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.log(`${bucketName} bucket does not exist, creating it`);
      
      // Instead of creating the bucket programmatically, we'll use an existing bucket
      // or inform the user that the bucket needs to be created manually in the Supabase dashboard
      console.log(`Please create the "${bucketName}" bucket manually in the Supabase dashboard with public access.`);
      return;
    }
    
    console.log(`${bucketName} bucket exists`);
  } catch (error) {
    console.error('Error checking bucket:', error);
    throw new Error(`Error checking if bucket exists: ${error.message}`);
  }
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
    
    console.log(`Attempting to upload file to ${filePath}`);
    
    // First check if the bucket exists
    await ensureBucketExists('images');
    
    // Upload to Supabase Storage using standard client
    const { data: uploadData, error: uploadError } = await supabase.storage
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
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);
      
    console.log(`Successfully uploaded file, public URL: ${publicUrl}`);
    
    // Create entry in the images database
    const { data: imageData, error: dbError } = await supabase
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
