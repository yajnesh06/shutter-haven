
import { supabase } from "@/integrations/supabase/client";
import { ImageCategory, ImageType } from "@/types";
import { createClient } from "@supabase/supabase-js";

interface ImageUploadOptions {
  title: string;
  category: ImageCategory;
  onProgress?: (progress: number) => void;
}

// Create an admin client using the service role key to bypass RLS
// This should only be used for admin functions like this uploader
const SUPABASE_URL = "https://evjofjyjfzewjtzlkruw.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2am9manlqZnpld2p0emxrcnV3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDM4ODU5NSwiZXhwIjoyMDU1OTY0NTk1fQ.FoKlJFJDxcV35W-nAcRqaQ3SfcIQZmmaTFNWNZLQG-A";

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
    
    // Upload to Supabase Storage using the admin client to bypass RLS
    const { data: uploadData, error: uploadError } = await adminSupabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (uploadError) {
      throw new Error(`Error uploading image: ${uploadError.message}`);
    }
    
    // If progress callback is provided, call it with 100% after successful upload
    if (onProgress) {
      onProgress(100);
    }
    
    // Get the public URL
    const { data: { publicUrl } } = adminSupabase.storage
      .from('images')
      .getPublicUrl(filePath);
      
    // Create entry in the images database
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
      throw new Error(`Error creating database entry: ${dbError.message}`);
    }
    
    return imageData as ImageType;
  } catch (error) {
    console.error('Error in uploadImage:', error);
    throw error;
  }
};
