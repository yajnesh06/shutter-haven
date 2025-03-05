
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getImages } from '@/services/imageService';
import { getCachedImages } from '@/services/imageCacheService';
import { useEffect } from 'react';

export const useImages = (category?: string) => {
  const queryClient = useQueryClient();
  
  // Main query for current category
  const { data: images, isLoading, error } = useQuery({
    queryKey: ['images', category],
    queryFn: () => getCachedImages(category),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    // Add these settings to optimize resource usage
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retryDelay: attempt => Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000),
  });

  return { images, isLoading, error };
};
