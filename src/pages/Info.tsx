
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
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold"
          >
            Eric Ryan Anderson
          </motion.h1>
          
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
