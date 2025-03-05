
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Info, Download } from 'lucide-react';
import { ImageType } from '@/types';
import { useDisableRightClick } from '@/hooks/useDisableRightClick';
import { preloadAdjacentImages } from '@/services/imageCacheService';
import { useHotkeys } from '@/hooks/useHotkeys';
import { toast } from '@/components/ui/use-toast';

interface ImagePreviewProps {
  image: ImageType | null;
  images: ImageType[];
  onClose: () => void;
  onNavigate: (imageId: string) => void;
}

export const ImagePreview = ({ image, images, onClose, onNavigate }: ImagePreviewProps) => {
  // Initialize all state hooks at the top level
  const [showInfo, setShowInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  
  // Use the hook to disable right-clicks
  useDisableRightClick();

  // Early return if no image
  if (!image) return null;

  // Find current image index
  const currentIndex = images.findIndex(img => img.id === image.id);
  
  // Determine prev/next images
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;
  const prevImage = hasPrev ? images[currentIndex - 1] : null;
  const nextImage = hasNext ? images[currentIndex + 1] : null;

  // Preload adjacent images for smoother navigation
  useEffect(() => {
    if (image && images.length > 0) {
      preloadAdjacentImages(images, currentIndex);
    }
    
    // Reset loading state when image changes
    setIsLoading(true);
    setLoadError(false);
  }, [image, images, currentIndex]);

  // Add keyboard navigation support
  useHotkeys([
    { key: 'ArrowLeft', callback: () => hasPrev && onNavigate(prevImage!.id) },
    { key: 'ArrowRight', callback: () => hasNext && onNavigate(nextImage!.id) },
    { key: 'Escape', callback: onClose },
    { key: 'i', callback: () => setShowInfo(!showInfo) },
  ]);

  const handleDownloadAttempt = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
      title: "Download Protected",
      description: "This image is protected and cannot be downloaded.",
      variant: "destructive",
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="relative max-w-[90vw] max-h-[90vh] w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -right-2 -top-8 p-2 text-white hover:text-gray-300 transition-colors md:-right-9 md:-top-4 z-10"
            aria-label="Close preview"
          >
            <X className="w-6 h-6 md:w-7 md:h-7" />
          </button>

          {/* Navigation controls */}
          <div className="absolute inset-y-0 left-0 flex items-center">
            {hasPrev && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(prevImage!.id);
                }}
                className="bg-black/30 hover:bg-black/60 transition-colors p-2 rounded-r-lg text-white"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center">
            {hasNext && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(nextImage!.id);
                }}
                className="bg-black/30 hover:bg-black/60 transition-colors p-2 rounded-l-lg text-white"
                aria-label="Next image"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}
          </div>

          {/* Info toggle button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowInfo(!showInfo);
            }}
            className="absolute top-2 left-2 p-2 bg-black/30 hover:bg-black/60 transition-colors rounded-full text-white"
            aria-label="Toggle information"
          >
            <Info className="w-5 h-5" />
          </button>

          {/* Download prevention overlay */}
          <button
            onClick={handleDownloadAttempt}
            className="absolute top-2 right-2 p-2 bg-black/30 hover:bg-black/60 transition-colors rounded-full text-white"
            aria-label="Download (disabled)"
          >
            <Download className="w-5 h-5" />
          </button>

          {/* Loading indicator */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Image */}
          <motion.img
            src={image.url}
            alt={image.title}
            className="w-auto max-w-full h-auto max-h-[85vh] object-contain rounded-lg shadow-2xl mx-auto"
            layoutId={`image-${image.id}`}
            draggable="false"
            onDragStart={(e) => e.preventDefault()}
            style={{ 
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none',
            }}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setLoadError(true);
            }}
          />

          {/* Error message */}
          {loadError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/70 text-white p-4 rounded-md">
                Error loading image
              </div>
            </div>
          )}

          {/* Information panel */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: showInfo ? 1 : 0, 
              y: showInfo ? 0 : 20,
              pointerEvents: showInfo ? 'auto' : 'none'
            }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/60 to-transparent text-white rounded-b-lg"
          >
            <h3 className="text-xl md:text-2xl font-semibold mb-2">{image.title}</h3>
            <p className="text-sm md:text-base opacity-90 capitalize">{image.category}</p>
            <div className="mt-2 text-xs md:text-sm opacity-75">
              <p>Dimensions: {image.width} × {image.height}px</p>
              <p className="mt-1">Image {currentIndex + 1} of {images.length}</p>
            </div>
          </motion.div>

          {/* Simple caption overlay when info is hidden */}
          {!showInfo && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white rounded-b-lg pointer-events-none">
              <h3 className="text-lg md:text-xl font-semibold">{image.title}</h3>
              <p className="text-sm opacity-90 capitalize">{image.category}</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
