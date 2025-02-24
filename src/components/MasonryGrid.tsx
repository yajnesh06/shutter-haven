
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageType } from '@/types';
import { useInView } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';

interface MasonryGridProps {
  images: ImageType[];
}

const ImageCard = ({ image, index }: { image: ImageType; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "100px" });
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Create a blur data URL for the placeholder
  const blurDataURL = image.blur_hash || 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4dHRsdHR4dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/2wBDAR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';

  return (
    <motion.div
      ref={ref}
      key={image.id}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ 
        duration: 0.2,
        delay: index * 0.05,
        ease: [0.43, 0.13, 0.23, 0.96]
      }}
      className="relative mb-4 break-inside-avoid"
    >
      <div
        className="group relative cursor-pointer overflow-hidden"
        style={{
          paddingBottom: `${(image.height / image.width) * 100}%`,
        }}
      >
        {/* Blur placeholder */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-200"
          style={{
            backgroundImage: `url(${blurDataURL})`,
            filter: 'blur(10px)',
            transform: 'scale(1.1)',
            opacity: isLoaded ? 0 : 1,
          }}
        />
        
        {/* Main image with srcSet for responsive loading */}
        <motion.img
          src={image.url}
          srcSet={`${image.url}?width=400 400w, 
                   ${image.url}?width=800 800w, 
                   ${image.url}?width=1200 1200w`}
          sizes="(max-width: 640px) 100vw, 
                 (max-width: 1024px) 50vw, 
                 33vw"
          alt={image.title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: isLoaded ? 1 : 0 }}
          onLoad={(e) => {
            const img = e.target as HTMLImageElement;
            if (img.complete) {
              setIsLoaded(true);
            }
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />

        {/* Overlay with image details */}
        <motion.div 
          className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          <motion.div 
            className="absolute bottom-0 left-0 right-0 p-4 text-white"
            initial={{ y: 20, opacity: 0 }}
            whileHover={{ y: 0, opacity: 1 }}
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

  // Prefetch adjacent categories
  useEffect(() => {
    const categories = ['people', 'animals', 'landscapes'];
    const currentCategory = images[0]?.category;
    
    if (currentCategory) {
      const currentIndex = categories.indexOf(currentCategory);
      if (currentIndex !== -1) {
        const nextCategory = categories[(currentIndex + 1) % categories.length];
        const prevCategory = categories[(currentIndex - 1 + categories.length) % categories.length];
        
        // Prefetch next and previous categories
        [nextCategory, prevCategory].forEach(category => {
          queryClient.prefetchQuery({
            queryKey: ['images', category],
            queryFn: () => import('@/services/imageService').then(m => m.getImages(category)),
            staleTime: 5 * 60 * 1000, // 5 minutes
          });
        });
      }
    }
  }, [images, queryClient]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="columns-1 md:columns-2 lg:columns-3 gap-4 p-4"
    >
      <AnimatePresence mode="wait" initial={false}>
        {images.map((image, index) => (
          <ImageCard key={image.id} image={image} index={index} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};
