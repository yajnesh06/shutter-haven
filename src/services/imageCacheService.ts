
import { ImageType } from "@/types";
import { appSettings } from "@/config/appConfig";

// Enhanced cache with localStorage persistence
class ImageCache {
  private cache: Map<string, ImageType[]>;
  private maxSize: number;
  private hits: Map<string, number>;
  private storagePrefix: string;

  constructor(maxSize: number = 100, storagePrefix: string = 'image_cache_') {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.hits = new Map();
    this.storagePrefix = storagePrefix;
    
    // Initialize cache from localStorage if available
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      // Load cache metadata
      const metadataKey = `${this.storagePrefix}metadata`;
      const metadata = localStorage.getItem(metadataKey);
      
      if (metadata) {
        const cacheKeys = JSON.parse(metadata) as string[];
        
        // Load each cache entry
        cacheKeys.forEach(key => {
          try {
            const storedData = localStorage.getItem(`${this.storagePrefix}${key}`);
            if (storedData) {
              const images = JSON.parse(storedData) as ImageType[];
              this.cache.set(key, images);
              this.hits.set(key, 0);
              console.log(`Loaded ${images.length} images from localStorage for key: ${key}`);
            }
          } catch (e) {
            console.warn(`Failed to load cache for key ${key}:`, e);
          }
        });
        
        console.log(`Restored cache from localStorage with ${this.cache.size} entries`);
      }
    } catch (e) {
      console.warn('Failed to load cache from localStorage:', e);
      // If loading fails, start with a fresh cache
      this.cache.clear();
      this.hits.clear();
    }
  }

  private saveToStorage(key: string, images: ImageType[]): void {
    try {
      // Store the cache entry
      localStorage.setItem(`${this.storagePrefix}${key}`, JSON.stringify(images));
      
      // Update metadata
      const cacheKeys = Array.from(this.cache.keys());
      localStorage.setItem(`${this.storagePrefix}metadata`, JSON.stringify(cacheKeys));
      
      console.log(`Saved cache for ${key} with ${images.length} images to localStorage`);
    } catch (e) {
      // Handle quota exceeded or other storage errors
      console.warn('Failed to save cache to localStorage:', e);
      
      if (e instanceof DOMException && (
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED'
      )) {
        // Storage full - clear older entries
        this.pruneStorage();
      }
    }
  }

  private pruneStorage(): void {
    try {
      // Find localStorage keys that belong to our cache
      const ourKeys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.storagePrefix)) {
          ourKeys.push(key);
        }
      }
      
      // Sort by oldest access time (we could store timestamps for better precision)
      // For now, we'll just remove the first half of the keys
      if (ourKeys.length > 0) {
        const keysToRemove = ourKeys.slice(0, Math.floor(ourKeys.length / 2));
        keysToRemove.forEach(key => localStorage.removeItem(key));
        console.log(`Pruned ${keysToRemove.length} entries from localStorage cache`);
      }
    } catch (e) {
      console.error('Error while pruning storage:', e);
    }
  }

  get(key: string): ImageType[] | undefined {
    const images = this.cache.get(key);
    if (images) {
      // Increment hit count
      this.hits.set(key, (this.hits.get(key) || 0) + 1);
      console.log(`Cache hit for key ${key}: ${images.length} images`);
      return images;
    }
    console.log(`Cache miss for key ${key}`);
    return undefined;
  }

  set(key: string, value: ImageType[]): void {
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
        localStorage.removeItem(`${this.storagePrefix}${leastUsedKey}`);
        console.log(`Removed least used cache key: ${leastUsedKey}`);
      }
    }
    
    // Add to cache and initialize hit count
    this.cache.set(key, value);
    this.hits.set(key, this.hits.get(key) || 0);
    
    // Persist to localStorage
    this.saveToStorage(key, value);
  }

  clear(): void {
    // Clear in-memory cache
    this.cache.clear();
    this.hits.clear();
    
    // Clear localStorage items for this cache
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.storagePrefix)) {
          localStorage.removeItem(key);
        }
      }
      console.log('Cache cleared from localStorage');
    } catch (e) {
      console.error('Error clearing localStorage cache:', e);
    }
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

// Export a singleton instance with increased capacity
export const imageCache = new ImageCache(100);

// Extended getImages function that utilizes the cache
export const getCachedImages = async (category?: string): Promise<ImageType[]> => {
  const cacheKey = `images-${category || 'all'}`;
  
  // Try to get from cache first
  const cachedImages = imageCache.get(cacheKey);
  if (cachedImages && cachedImages.length > 0) {
    console.log(`Retrieved ${cachedImages.length} images from cache for: ${cacheKey}`);
    
    // Check cache age by comparing with app settings
    const now = new Date().getTime();
    const cacheAge = now - (cachedImages[0].timestamp || 0);
    
    // If cache is still fresh, use it
    if (cacheAge < appSettings.staleTime) {
      console.log(`Cache is fresh (${Math.round(cacheAge/1000)}s old)`);
      return cachedImages;
    }
    
    console.log(`Cache is stale (${Math.round(cacheAge/1000)}s old), fetching fresh data`);
    
    // If cache is stale, fetch new data but return cache immediately
    // for faster rendering, then update when new data arrives
    refreshImagesAsync(category, cacheKey);
    
    // Still return cached data for immediate rendering
    return cachedImages;
  }
  
  // If not in cache, fetch from API
  try {
    return await fetchFreshImages(category, cacheKey);
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
};

// Helper function to fetch and cache images
const fetchFreshImages = async (category?: string, cacheKey?: string): Promise<ImageType[]> => {
  const key = cacheKey || `images-${category || 'all'}`;
  
  try {
    const images = await import('./imageService').then(m => m.getImages(category));
    
    // Add timestamp to track cache age
    const timestampedImages = images.map(img => ({
      ...img,
      timestamp: new Date().getTime()
    }));
    
    // Store in cache for future use
    if (timestampedImages && timestampedImages.length > 0) {
      imageCache.set(key, timestampedImages);
      console.log(`Cached ${timestampedImages.length} images for key: ${key}`);
    }
    
    return timestampedImages;
  } catch (error) {
    console.error(`Error fetching fresh images for ${key}:`, error);
    throw error;
  }
};

// Refresh data in background without blocking UI
const refreshImagesAsync = (category?: string, cacheKey?: string): void => {
  const key = cacheKey || `images-${category || 'all'}`;
  
  fetchFreshImages(category, key)
    .then(images => {
      console.log(`Background refresh complete for ${key}: ${images.length} images`);
    })
    .catch(error => {
      console.error(`Background refresh failed for ${key}:`, error);
    });
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
