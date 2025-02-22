
import React from 'react';
import { Layout } from '@/components/Layout';
import { motion } from 'framer-motion';

const Info = () => {
  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-12 max-w-2xl"
      >
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="w-48 h-48 rounded-full overflow-hidden"
            >
              <img 
                src="https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?auto=format&fit=crop&w=400&h=400"
                alt="Eric Ryan Anderson"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <h1 className="text-4xl font-bold text-center">Eric Ryan Anderson</h1>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="prose prose-lg"
          >
            <p>
              A passionate photographer capturing the essence of life through my lens. Specializing in 
              portrait, wildlife, and landscape photography, I strive to tell stories that connect people 
              with the natural world.
            </p>
            <p>
              Based in New York City, I travel extensively to capture diverse perspectives and stories 
              from around the globe. My work has been featured in various publications and galleries 
              internationally.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="pt-8"
          >
            <h2 className="text-2xl font-semibold mb-4">Contact</h2>
            <p className="text-gray-600">email@ericryananderson.com</p>
            <p className="text-gray-600">Instagram: @ericryananderson</p>
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Info;
