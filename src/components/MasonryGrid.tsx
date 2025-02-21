
import React from 'react';
import { motion } from 'framer-motion';

interface Image {
  id: string;
  url: string;
  width: number;
  height: number;
  title?: string;
}

interface MasonryGridProps {
  images: Image[];
}

export const MasonryGrid = ({ images }: MasonryGridProps) => {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-4 p-4">
      {images.map((image) => (
        <motion.div
          key={image.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-4 break-inside-avoid"
        >
          <div
            className="group relative cursor-pointer overflow-hidden"
            style={{
              paddingBottom: `${(image.height / image.width) * 100}%`,
            }}
          >
            <img
              src={image.url}
              alt={image.title || ''}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                {image.title && (
                  <h3 className="text-lg font-medium">{image.title}</h3>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
