
import { supabase } from "@/integrations/supabase/client";
import { ImageType } from "@/types";

export const getImages = async (category?: string) => {
  console.log('Fetching images with category:', category);
  
  let query = supabase
    .from('images')
    .select('*')
    .order('created_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
  
  console.log('Fetched images:', data);
  return data as ImageType[];
};
