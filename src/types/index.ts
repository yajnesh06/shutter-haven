
export type ImageCategory = 'people' | 'animals' | 'landscapes';

export interface ImageType {
  id: string;
  url: string;
  width: number;
  height: number;
  title: string;
  category: ImageCategory;
  blur_hash?: string;
  timestamp?: number;  // Added for cache age tracking
}
