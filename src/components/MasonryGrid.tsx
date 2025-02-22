
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageType } from '@/types';

interface MasonryGridProps {
  images: ImageType[];
}

export const MasonryGrid = ({ images }: MasonryGridProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="columns-1 md:columns-2 lg:columns-3 gap-4 p-4"
    >
      <AnimatePresence mode="wait">
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ 
              duration: 0.5,
              delay: index * 0.1,
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
              <motion.img
                src={image.url}
                alt={image.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
              />
              <motion.div 
                className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 p-4 text-white"
                  initial={{ y: 20, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-medium">{image.title}</h3>
                  <p className="text-sm opacity-75 capitalize">{image.category}</p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};
