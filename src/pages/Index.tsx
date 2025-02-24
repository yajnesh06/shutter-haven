
import React from 'react';
import { Layout } from '@/components/Layout';
import { MasonryGrid } from '@/components/MasonryGrid';
import { useLocation } from 'react-router-dom';
import { useImages } from '@/hooks/useImages';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const location = useLocation();
  const category = location.pathname.substring(1) as 'people' | 'animals' | 'landscapes' | '';
  const { images, isLoading, error } = useImages(category || undefined);

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
