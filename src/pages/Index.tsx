
import React from 'react';
import { Layout } from '@/components/Layout';
import { MasonryGrid } from '@/components/MasonryGrid';
import { ImageType } from '@/types';
import { useLocation } from 'react-router-dom';

const images: ImageType[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    width: 8256,
    height: 5504,
    title: 'Work From Home',
    category: 'people'
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    width: 6000,
    height: 4000,
    title: 'Tech Life',
    category: 'people'
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    width: 5530,
    height: 3687,
    title: 'Circuit Abstract',
    category: 'landscapes'
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    width: 7952,
    height: 5304,
    title: 'Digital Nomad',
    category: 'people'
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
    width: 4896,
    height: 3264,
    title: 'Wildlife Portrait',
    category: 'animals'
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
    width: 5760,
    height: 3840,
    title: 'Digital Matrix',
    category: 'landscapes'
  },
  {
    id: '7',
    url: 'https://images.unsplash.com/photo-1473091534298-04dcbce3278c',
    width: 4896,
    height: 3264,
    title: 'Lion King',
    category: 'animals'
  },
  {
    id: '8',
    url: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
    width: 5760,
    height: 3840,
    title: 'Desert Life',
    category: 'landscapes'
  },
  {
    id: '9',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9',
    width: 3072,
    height: 4608,
    title: 'Pine Forest',
    category: 'landscapes'
  },
  {
    id: '10',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
    width: 7372,
    height: 4392,
    title: 'Mountain Vista',
    category: 'landscapes'
  },
  {
    id: '11',
    url: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b',
    width: 5472,
    height: 3648,
    title: 'Winter Fox',
    category: 'animals'
  },
  {
    id: '12',
    url: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714',
    width: 6240,
    height: 4160,
    title: 'Urban Portrait',
    category: 'people'
  },
  {
    id: '13',
    url: 'https://images.unsplash.com/photo-1682687219570-4c596363fd96',
    width: 6240,
    height: 4160,
    title: 'City Life',
    category: 'people'
  },
  {
    id: '14',
    url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
    width: 6016,
    height: 4016,
    title: 'Landscape Drama',
    category: 'landscapes'
  },
  {
    id: '15',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    width: 2500,
    height: 1667,
    title: 'Eagle Flying',
    category: 'animals'
  }
];

const Index = () => {
  const location = useLocation();
  const category = location.pathname.substring(1) as ImageCategory | '';
  
  const filteredImages = category 
    ? images.filter(image => image.category === category)
    : images;

  return (
    <Layout>
      <MasonryGrid images={filteredImages} />
    </Layout>
  );
};

export default Index;
