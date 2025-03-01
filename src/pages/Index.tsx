
import React, { useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { MasonryGrid } from '@/components/MasonryGrid';
import { useLocation } from 'react-router-dom';
import { useImages } from '@/hooks/useImages';
import { Loader2 } from 'lucide-react';
import { ImageType } from '@/types';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const location = useLocation();
  const category = location.pathname.substring(1) as 'people' | 'animals' | 'landscapes' | '';
  const { images, isLoading, error } = useImages(category || undefined);

  // Additional debugging for image loading
  useEffect(() => {
    console.log('Current category:', category);
    console.log('Images loaded:', images);
    console.log('Loading state:', isLoading);
    console.log('Error state:', error);
    
    if (images && images.length > 0) {
      images.forEach((img: ImageType) => {
        console.log(`Image ${img.id}: ${img.title} - URL: ${img.url}`);
        console.log(`Dimensions: ${img.width}x${img.height} (aspect ratio: ${img.height/img.width})`);
      });
    } else if (!isLoading) {
      console.log('No images found for category:', category || 'all');
    }
  }, [category, images, isLoading, error]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading images",
        description: "There was a problem loading the images. Please try again.",
        variant: "destructive"
      });
    }
  }, [error]);

  if (error) {
    console.error('Error loading images:', error);
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="text-red-500">Error loading images. Please try again later.</p>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        </div>
      ) : (
        <MasonryGrid images={images || []} />
      )}
    </Layout>
  );
};

export default Index;
