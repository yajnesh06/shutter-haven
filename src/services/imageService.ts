
import { supabase } from "@/integrations/supabase/client";
import { ImageType } from "@/types";

export const getImages = async (category?: string) => {
  let query = supabase
    .from('images')
    .select('*')
    .order('created_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  
  if (error) throw error;
  return data as ImageType[];
};
