
import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { MasonryGrid } from '@/components/MasonryGrid';
import { useLocation } from 'react-router-dom';
import { useImages } from '@/hooks/useImages';
import { Loader2, Info } from 'lucide-react';
import { ImageType } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { AdminUploader } from '@/components/AdminUploader';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

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

  const toggleUploader = () => {
    setShowUploader(!showUploader);
  };

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
      <Alert className="mb-4 bg-blue-50 text-blue-800 border-blue-200">
        <Info className="h-4 w-4" />
        <AlertDescription>
          For uploads to work, you need to create an <strong>images</strong> bucket in Supabase Storage with public access.
        </AlertDescription>
      </Alert>
      
      <div className="mb-4 flex justify-end">
        <Button 
          onClick={toggleUploader} 
          variant="outline"
        >
          {showUploader ? 'Hide Uploader' : 'Show Temporary Admin Uploader'}
        </Button>
      </div>

      {showUploader && (
        <div className="mb-8">
          <AdminUploader />
        </div>
      )}

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
