
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageType } from '@/types';
import { useInView } from 'framer-motion';

interface MasonryGridProps {
  images: ImageType[];
}

const ImageCard = ({ image, index }: { image: ImageType; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "100px" });

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
        {image.blur_hash && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${image.blur_hash})`,
              filter: 'blur(10px)',
              transform: 'scale(1.1)',
            }}
          />
        )}
        <motion.img
          src={image.url}
          alt={image.title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: isInView ? 1 : 0 }}
          onLoad={(e) => {
            const img = e.target as HTMLImageElement;
            img.style.opacity = '1';
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
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
