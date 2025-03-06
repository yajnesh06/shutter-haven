
import { supabase } from "@/integrations/supabase/client";
import { ImageType } from "@/types";
import { appSettings } from "@/config/appConfig";

export const getImages = async (category?: string) => {
  console.log('Fetching images with category:', category);
  
  let query = supabase
    .from('images')
    .select('*')
    .order('created_at', { ascending: false });

  if (category && category !== appSettings.defaultCategory) {
    query = query.eq('category', category);
  }

  // Limit the number of images to prevent excessive loading
  query = query.limit(24);

  // Add cache control to the request
  const fetchOptions = {
    cache: 'force-cache' as RequestCache, // Tell fetch to use HTTP cache aggressively
  };
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
  
  console.log('Fetched images:', data?.length || 0);
  return data as ImageType[];
};
