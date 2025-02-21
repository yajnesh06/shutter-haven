
import React from 'react';
import { Layout } from '@/components/Layout';
import { MasonryGrid } from '@/components/MasonryGrid';

const images = [
  {
    id: '1',
    url: 'https://source.unsplash.com/random/800x1200?portrait',
    width: 800,
    height: 1200,
    title: 'Portrait Study'
  },
  {
    id: '2',
    url: 'https://source.unsplash.com/random/800x600?landscape',
    width: 800,
    height: 600,
    title: 'Landscape'
  },
  {
    id: '3',
    url: 'https://source.unsplash.com/random/800x800?street',
    width: 800,
    height: 800,
    title: 'Street'
  },
  // Add more images as needed
];

const Index = () => {
  return (
    <Layout>
      <MasonryGrid images={images} />
    </Layout>
  );
};

export default Index;
