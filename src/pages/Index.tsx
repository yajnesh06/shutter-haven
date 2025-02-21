
import React from 'react';
import { Layout } from '@/components/Layout';
import { MasonryGrid } from '@/components/MasonryGrid';

const images = [
  {
    id: '1',
    url: 'https://source.unsplash.com/photo-1649972904349-6e44c42644a7',
    width: 8256,
    height: 5504,
    title: 'Work From Home'
  },
  {
    id: '2',
    url: 'https://source.unsplash.com/photo-1488590528505-98d2b5aba04b',
    width: 6000,
    height: 4000,
    title: 'Tech Life'
  },
  {
    id: '3',
    url: 'https://source.unsplash.com/photo-1518770660439-4636190af475',
    width: 5530,
    height: 3687,
    title: 'Circuit Abstract'
  },
  {
    id: '4',
    url: 'https://source.unsplash.com/photo-1581091226825-a6a2a5aee158',
    width: 7952,
    height: 5304,
    title: 'Digital Nomad'
  },
  {
    id: '5',
    url: 'https://source.unsplash.com/photo-1485827404703-89b55fcc595e',
    width: 4896,
    height: 3264,
    title: 'Robot Portrait'
  },
  {
    id: '6',
    url: 'https://source.unsplash.com/photo-1526374965328-7f61d4dc18c5',
    width: 5760,
    height: 3840,
    title: 'Digital Matrix'
  },
  {
    id: '7',
    url: 'https://source.unsplash.com/photo-1473091534298-04dcbce3278c',
    width: 4896,
    height: 3264,
    title: 'Digital Art'
  },
  {
    id: '8',
    url: 'https://source.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
    width: 5760,
    height: 3840,
    title: 'Code Poetry'
  },
  {
    id: '9',
    url: 'https://source.unsplash.com/photo-1509316975850-ff9c5deb0cd9',
    width: 3072,
    height: 4608,
    title: 'Pine Forest'
  },
  {
    id: '10',
    url: 'https://source.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
    width: 7372,
    height: 4392,
    title: 'Mountain Vista'
  },
  {
    id: '11',
    url: 'https://source.unsplash.com/photo-1549880338-65ddcdfd017b',
    width: 5472,
    height: 3648,
    title: 'Winter Peaks'
  },
  {
    id: '12',
    url: 'https://source.unsplash.com/photo-1682687982501-1e58ab814714',
    width: 6240,
    height: 4160,
    title: 'Urban Night'
  },
  {
    id: '13',
    url: 'https://source.unsplash.com/photo-1682687219570-4c596363fd96',
    width: 6240,
    height: 4160,
    title: 'City Lights'
  },
  {
    id: '14',
    url: 'https://source.unsplash.com/photo-1501785888041-af3ef285b470',
    width: 6016,
    height: 4016,
    title: 'Landscape Drama'
  },
  {
    id: '15',
    url: 'https://source.unsplash.com/photo-1506744038136-46273834b3fb',
    width: 2500,
    height: 1667,
    title: 'Mountain Lake'
  },
  {
    id: '16',
    url: 'https://source.unsplash.com/photo-1511884642898-4c92249e20b6',
    width: 3648,
    height: 5472,
    title: 'Portrait Light'
  },
  {
    id: '17',
    url: 'https://source.unsplash.com/photo-1469474968028-56623f02e42e',
    width: 2400,
    height: 1600,
    title: 'Nature Path'
  },
  {
    id: '18',
    url: 'https://source.unsplash.com/photo-1490730141103-6cac27016106',
    width: 5184,
    height: 3456,
    title: 'Spring Colors'
  },
  {
    id: '19',
    url: 'https://source.unsplash.com/photo-1501854140801-50d01698950b',
    width: 5472,
    height: 3648,
    title: 'Mountain Range'
  },
  {
    id: '20',
    url: 'https://source.unsplash.com/photo-1441974231531-c6227db76b6e',
    width: 4752,
    height: 3168,
    title: 'Forest Light'
  }
];

const Index = () => {
  return (
    <Layout>
      <MasonryGrid images={images} />
    </Layout>
  );
};

export default Index;
