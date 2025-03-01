
import { supabase } from "@/integrations/supabase/client";
import { ImageType } from "@/types";

export const uploadImage = async (
  file: File,
  category: 'people' | 'animals' | 'landscapes' | string
): Promise<ImageType | null> => {
  try {
    // Generate a unique filename to avoid collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${category}/${fileName}`;

    // Get image dimensions
    const dimensions = await getImageDimensions(file);

    // Upload file to supabase
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      throw uploadError;
    }

    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    // Create a record in the images table
    const { data: imageData, error: insertError } = await supabase
      .from('images')
      .insert({
        title: file.name.split('.')[0], // Use filename as title
        url: publicUrl,
        category,
        width: dimensions.width,
        height: dimensions.height,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting image record:', insertError);
      throw insertError;
    }

    return imageData;
  } catch (error) {
    console.error('Upload failed:', error);
    return null;
  }
};

// Helper function to get image dimensions
const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src); // Clean up
      resolve({ width: img.width, height: img.height });
    };
    img.src = URL.createObjectURL(file);
  });
};
