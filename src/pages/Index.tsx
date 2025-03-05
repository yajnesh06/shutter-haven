
import React, { useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { MasonryGrid } from '@/components/MasonryGrid';
import { useLocation } from 'react-router-dom';
import { useImages } from '@/hooks/useImages';
import { Loader2 } from 'lucide-react';
import { ImageType } from '@/types';
import { useDisableRightClick } from '@/hooks/useDisableRightClick';


function App() {
  useDisableRightClick();
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
      });
    } else if (!isLoading) {
      console.log('No images found for category:', category || 'all');
    }
  }, [category, images, isLoading, error]);

  if (error) {
    console.error('Error loading images:', error);
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-red-500">Error loading images. Please try again later.</p>
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
