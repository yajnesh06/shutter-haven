import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageType } from '@/types';
import { useInView } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { ImagePreview } from './ImagePreview';
import { preloadAdjacentImages } from '@/services/imageCacheService';

const getTransformedImageUrl = (url: string, width?: number): string => {
  if (!url) return '';
  
  // Check if the URL is from Supabase
  if (url.includes('supabase.co/storage/v1/object/public')) {
    // Extract the base URL and the path
    const [baseUrl, path] = url.split('/public/');
    if (!baseUrl || !path) return url;
    
    // Format for Supabase transformation with progressive quality based on size
    if (width) {
      // Use lower quality for thumbnails, higher for larger images
      const quality = width <= 100 ? 60 : width <= 800 ? 75 : 85;
      return `${baseUrl}/public/transform/width=${width},quality=${quality}/${path}`;
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
  const isInView = useInView(ref, { once: true, margin: "400px" }); // Increased margin for earlier loading
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);

  useEffect(() => {
    if (!isInView || !image.url) return;

    // Determine if this image is critical (high priority)
    const isPriority = index < 4;
    
    // Stage 1: Thumbnail loading (100px width)
    const thumbLoader = new Image();
    thumbLoader.src = getTransformedImageUrl(image.url, 100);
    
    thumbLoader.onload = () => {
      setCurrentSrc(thumbLoader.src);
      setLoadingStage(1);

      // Stage 2: Medium resolution loading (400px width instead of 800px to save bandwidth)
      const mediumLoader = new Image();
      mediumLoader.src = getTransformedImageUrl(image.url, 400);
      
      mediumLoader.onload = () => {
        setCurrentSrc(mediumLoader.src);
        setLoadingStage(2);

        // Only load full resolution for priority images or on hover/interaction
        if (isPriority) {
          loadFullResolution();
        }
      };
      
      mediumLoader.onerror = () => {
        // If medium resolution fails, try loading the original directly
        loadFullResolution();
      };
    };
    
    thumbLoader.onerror = () => {
      // Try loading the original directly
      loadFullResolution();
    };

    const loadFullResolution = () => {
      // Only load full resolution if needed (prioritized or interacted with)
      const fullLoader = new Image();
      fullLoader.src = image.url;
      
      fullLoader.onload = () => {
        setCurrentSrc(fullLoader.src);
        setIsLoaded(true);
        setLoadingStage(3);
      };
      
      fullLoader.onerror = () => {
        setLoadError(true);
      };
    };

    return () => {
      thumbLoader.onload = null;
      thumbLoader.onerror = null;
    };
  }, [isInView, image.url, index]);

  // Load full resolution on hover
  useEffect(() => {
    if (isHovered && loadingStage < 3 && !loadError) {
      const fullLoader = new Image();
      fullLoader.src = image.url;
      
      fullLoader.onload = () => {
        setCurrentSrc(fullLoader.src);
        setIsLoaded(true);
        setLoadingStage(3);
      };
    }
  }, [isHovered, loadingStage, image.url, loadError]);

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
        
        {loadError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <p className="text-gray-500 text-sm">Failed to load image</p>
          </div>
        )}
        
        {currentSrc && !loadError && (
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
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none',
            }}
            draggable="false"
            onDragStart={(e) => e.preventDefault()}
            onLoad={(e) => {
              const img = e.target as HTMLImageElement;
              if (img.src === image.url && img.complete) {
                setIsLoaded(true);
              }
            }}
            onError={() => {
              console.error('Error in img tag:', currentSrc);
              setLoadError(true);
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

export const MasonryGrid = ({ images }: { images: ImageType[] }) => {
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);

  // Only prefetch adjacent categories when needed
  useEffect(() => {
    if (!images || images.length === 0) {
      console.log('No images to display');
      return;
    }
    
    // Debounce prefetch to avoid excess network requests
    const timer = setTimeout(() => {
      const categories = ['people', 'animals', 'landscapes'];
      const currentCategory = images[0]?.category;
      
      if (currentCategory) {
        const currentIndex = categories.indexOf(currentCategory);
        if (currentIndex !== -1) {
          // Only prefetch the next category, not both next and previous
          const nextCategory = categories[(currentIndex + 1) % categories.length];
          
          queryClient.prefetchQuery({
            queryKey: ['images', nextCategory],
            queryFn: () => import('@/services/imageService').then(m => m.getImages(nextCategory)),
            staleTime: 5 * 60 * 1000,
          });
        }
      }
    }, 1000); // Delay prefetching by 1 second
    
    return () => clearTimeout(timer);
  }, [images, queryClient]);

  const handleImageClick = (image: ImageType) => {
    setSelectedImage(image);
    
    // Preload adjacent images for smoother navigation
    if (images.length > 1) {
      const currentIndex = images.findIndex(img => img.id === image.id);
      if (currentIndex !== -1) {
        preloadAdjacentImages(images, currentIndex);
      }
    }
  };

  const handleClosePreview = () => {
    setSelectedImage(null);
  };
  
  const handleNavigate = (imageId: string) => {
    const newImage = images.find(img => img.id === imageId);
    if (newImage) {
      setSelectedImage(newImage);
    }
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="columns-1 md:columns-2 lg:columns-4 gap-4 p-4"
      >
        {/* Fix AnimatePresence warning by not using 'wait' mode with multiple children */}
        <AnimatePresence initial={false} mode="sync">
          {images && images.length > 0 ? (
            images.map((image, index) => (
              <ImageCard 
                key={image.id} 
                image={image} 
                index={index} 
                onImageClick={handleImageClick}
              />
            ))
          ) : (
            <div className="col-span-full p-8 text-center">
              <p className="text-gray-500">No images found in this category</p>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
      
      <ImagePreview 
        image={selectedImage} 
        images={images}
        onClose={handleClosePreview}
        onNavigate={handleNavigate}
      />
    </>
  );
};
