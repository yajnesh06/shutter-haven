
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getImages } from '@/services/imageService';
import { useEffect } from 'react';
import { ImageCategory, ImageType } from '@/types';

export const useImages = (category?: ImageCategory | string) => {
  const queryClient = useQueryClient();
  
  // Main query for current category
  const { data: images, isLoading, error } = useQuery({
    queryKey: ['images', category],
    queryFn: () => getImages(category),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  // Prefetch adjacent categories
  useEffect(() => {
    const categories: ImageCategory[] = ['people', 'animals', 'landscapes'];
    const currentIndex = categories.indexOf(category as ImageCategory);
    
    if (currentIndex !== -1) {
      // Prefetch next and previous categories
      const adjacentCategories = [
        categories[(currentIndex + 1) % categories.length],
        categories[(currentIndex - 1 + categories.length) % categories.length],
      ];

      adjacentCategories.forEach(adjCategory => {
        queryClient.prefetchQuery({
          queryKey: ['images', adjCategory],
          queryFn: () => getImages(adjCategory),
          staleTime: 5 * 60 * 1000,
        });
      });
    }
  }, [category, queryClient]);

  return { images, isLoading, error };
};
