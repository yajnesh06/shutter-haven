
import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { MasonryGrid } from '@/components/MasonryGrid';
import { useLocation } from 'react-router-dom';
import { useImages } from '@/hooks/useImages';
import { Loader2 } from 'lucide-react';
import { ImageType } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { ImageUploader } from '@/components/ImageUploader';
import { Button } from '@/components/ui/button';

const Index = () => {
  const location = useLocation();
  const category = location.pathname.substring(1) as 'people' | 'animals' | 'landscapes' | '';
  const { images, isLoading, error } = useImages(category || undefined);
  const [showUploader, setShowUploader] = useState(false);

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
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Photos` : 'All Photos'}
        </h1>
        <Button 
          onClick={() => setShowUploader(!showUploader)}
          variant={showUploader ? "outline" : "default"}
        >
          {showUploader ? "Hide Uploader" : "Upload New Photo"}
        </Button>
      </div>
      
      {showUploader && <div className="mb-8"><ImageUploader /></div>}
      
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
