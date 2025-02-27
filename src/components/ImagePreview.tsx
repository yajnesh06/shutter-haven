
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ImageType } from '@/types';

interface ImagePreviewProps {
  image: ImageType | null;
  onClose: () => void;
}

export const ImagePreview = ({ image, onClose }: ImagePreviewProps) => {
  if (!image) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="relative max-w-[85vw] max-h-[85vh] w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute -right-2 -top-8 p-2 text-white hover:text-gray-300 transition-colors md:-right-9 md:-top-4"
            aria-label="Close preview"
          >
            <X className="w-6 h-6 md:w-7 md:h-7" />
          </button>
          <motion.img
            src={image.url}
            alt={image.title}
            className="w-auto max-w-full h-auto max-h-[85vh] object-contain rounded-lg shadow-2xl mx-auto"
            layoutId={`image-${image.id}`}
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white rounded-b-lg">
            <h3 className="text-lg md:text-xl font-semibold">{image.title}</h3>
            <p className="text-sm opacity-90 capitalize">{image.category}</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
