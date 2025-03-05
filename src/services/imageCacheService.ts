
// Simple in-memory LRU cache for images
class ImageCache {
  private cache: Map<string, ImageType>;
  private maxSize: number;
  private hits: Map<string, number>;

  constructor(maxSize: number = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.hits = new Map();
  }

  get(key: string): ImageType | undefined {
    const image = this.cache.get(key);
    if (image) {
      // Increment hit count
      this.hits.set(key, (this.hits.get(key) || 0) + 1);
      return image;
    }
    return undefined;
  }

  set(key: string, value: ImageType): void {
    // If cache is full, remove least frequently used item
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      let minHits = Infinity;
      let leastUsedKey = '';
      
      this.hits.forEach((count, imageKey) => {
        if (count < minHits) {
          minHits = count;
          leastUsedKey = imageKey;
        }
      });
      
      if (leastUsedKey) {
        this.cache.delete(leastUsedKey);
        this.hits.delete(leastUsedKey);
      }
    }
    
    // Add to cache and initialize hit count
    this.cache.set(key, value);
    this.hits.set(key, this.hits.get(key) || 0);
  }

  clear(): void {
    this.cache.clear();
    this.hits.clear();
  }

  getCachedImage(url: string): HTMLImageElement | null {
    // Check if image is in browser cache
    const cachedImage = new Image();
    cachedImage.src = url;
    return cachedImage.complete ? cachedImage : null;
  }

  preloadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    });
  }
}

// Export a singleton instance
export const imageCache = new ImageCache(50);

import { ImageType } from "@/types";

// Extended getImages function that utilizes the cache
export const getCachedImages = async (category?: string): Promise<ImageType[]> => {
  const cacheKey = `images-${category || 'all'}`;
  
  // Try to get from cache first
  const cachedImages = imageCache.get(cacheKey);
  if (cachedImages) {
    console.log('Retrieved images from cache:', cacheKey);
    return [cachedImages] as ImageType[];
  }
  
  // If not in cache, fetch from API
  try {
    const images = await import('./imageService').then(m => m.getImages(category));
    
    // Store in cache for future use
    if (images && images.length > 0) {
      imageCache.set(cacheKey, images[0]);
    }
    
    return images;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
};

// Preload adjacent images based on current image
export const preloadAdjacentImages = (images: ImageType[], currentImageIndex: number): void => {
  if (!images || images.length <= 1) return;
  
  const preloadIndices = [];
  // Preload next 2 images
  if (currentImageIndex < images.length - 1) {
    preloadIndices.push(currentImageIndex + 1);
  }
  if (currentImageIndex < images.length - 2) {
    preloadIndices.push(currentImageIndex + 2);
  }
  // Preload previous image
  if (currentImageIndex > 0) {
    preloadIndices.push(currentImageIndex - 1);
  }
  
  preloadIndices.forEach(index => {
    const imageUrl = images[index]?.url;
    if (imageUrl) {
      console.log('Preloading image:', imageUrl);
      imageCache.preloadImage(imageUrl).catch(err => 
        console.warn('Failed to preload image:', err)
      );
    }
  });
};
