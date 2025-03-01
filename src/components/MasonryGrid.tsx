
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageType } from '@/types';
import { useInView } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { ImagePreview } from './ImagePreview';

interface MasonryGridProps {
  images: ImageType[];
}

const getTransformedImageUrl = (url: string, width?: number): string => {
  if (!url) return '';
  
  // Check if the URL is from Supabase
  if (url.includes('supabase.co/storage/v1/object/public')) {
    // Extract the base URL and the path
    const [baseUrl, path] = url.split('/public/');
    if (!baseUrl || !path) return url;
    
    // Format for Supabase transformation
    if (width) {
      return `${baseUrl}/public/transform/width=${width},quality=80/${path}`;
    }
    return url;
  }
  
  // Return original URL if not Supabase or no transformation needed
  return url;
};

const ImageCard = ({ image, index, onImageClick }: { 
  image: ImageType; 
  index: number;
  onImageClick: (image: ImageType) => void;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "200px" });
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isInView) return;

    // Stage 1: Thumbnail loading (100px width)
    const thumbLoader = new Image();
    thumbLoader.src = getTransformedImageUrl(image.url, 100);
    thumbLoader.onload = () => {
      setCurrentSrc(thumbLoader.src);

      // Stage 2: Medium resolution loading (800px width)
      const mediumLoader = new Image();
      mediumLoader.src = getTransformedImageUrl(image.url, 800);
      mediumLoader.onload = () => {
        setCurrentSrc(mediumLoader.src);

        // Stage 3: Full resolution loading
        const fullLoader = new Image();
        fullLoader.src = image.url;
        fullLoader.onload = () => {
          setCurrentSrc(image.url);
          setIsLoaded(true);
        };
      };
    };

    return () => {
      thumbLoader.onload = null;
    };
  }, [isInView, image.url]);

  const blurDataURL = image.blur_hash || 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4dHRsdHR4dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/2wBDAR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';

  return (
    <motion.div
      ref={ref}
      key={image.id}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ 
        duration: 0.3,
        delay: index * 0.05,
        ease: [0.43, 0.13, 0.23, 0.96]
      }}
      className="relative mb-4 break-inside-avoid"
      onClick={() => onImageClick(image)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="group relative cursor-pointer overflow-hidden"
        style={{
          paddingBottom: `${(image.height / image.width) * 100}%`,
        }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500"
          style={{
            backgroundImage: `url(${blurDataURL})`,
            filter: 'blur(10px)',
            transform: 'scale(1.1)',
            opacity: isLoaded ? 0 : 1,
          }}
        />
        
        {currentSrc && (
          <motion.img
            layoutId={`image-${image.id}`}
            src={currentSrc}
            alt={image.title}
            fetchPriority={index < 4 ? "high" : "low"}
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            style={{ 
              opacity: isLoaded ? 1 : 0.5,
              willChange: 'opacity',
            }}
            onLoad={(e) => {
              const img = e.target as HTMLImageElement;
              if (img.src === image.url && img.complete) {
                setIsLoaded(true);
              }
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
        )}

        <motion.div 
          className="absolute inset-0 bg-black/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className="absolute bottom-0 left-0 right-0 p-4 text-white"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-medium">{image.title}</h3>
            <p className="text-sm opacity-75 capitalize">{image.category}</p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export const MasonryGrid = ({ images }: MasonryGridProps) => {
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);

  useEffect(() => {
    const categories = ['people', 'animals', 'landscapes'];
    const currentCategory = images[0]?.category;
    
    if (currentCategory) {
      const currentIndex = categories.indexOf(currentCategory);
      if (currentIndex !== -1) {
        const nextCategory = categories[(currentIndex + 1) % categories.length];
        const prevCategory = categories[(currentIndex - 1 + categories.length) % categories.length];
        
        [nextCategory, prevCategory].forEach(category => {
          queryClient.prefetchQuery({
            queryKey: ['images', category],
            queryFn: () => import('@/services/imageService').then(m => m.getImages(category)),
            staleTime: 5 * 60 * 1000,
          });
        });
      }
    }
  }, [images, queryClient]);

  const handleImageClick = (image: ImageType) => {
    setSelectedImage(image);
  };

  const handleClosePreview = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="columns-1 md:columns-2 lg:columns-3 gap-4 p-4"
      >
        <AnimatePresence mode="wait" initial={false}>
          {images.map((image, index) => (
            <ImageCard 
              key={image.id} 
              image={image} 
              index={index} 
              onImageClick={handleImageClick}
            />
          ))}
        </AnimatePresence>
      </motion.div>
      
      <ImagePreview 
        image={selectedImage} 
        onClose={handleClosePreview}
      />
    </>
  );
};
