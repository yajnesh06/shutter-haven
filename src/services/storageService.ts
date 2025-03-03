
import { supabase } from "@/integrations/supabase/client";
import { ImageCategory, ImageType } from "@/types";

interface ImageUploadOptions {
  title: string;
  category: ImageCategory;
  onProgress?: (progress: number) => void;
}

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
    
    console.log(`Attempting to upload file to ${filePath}`);
    
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
