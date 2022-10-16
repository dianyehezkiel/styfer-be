import { Post } from '../src/types';

export const POSTS: Post[] = [
  {
    id: 'post-1',
    img_src:
      'https://storage.googleapis.com/styfer/results/20220917-061046_unimed-rektorat.jpg',
    title: 'lorem ipsum',
    createdAt: new Date(2022, 9, 7, 20, 10, 15),
    creator: 'anonymous',
  },
  {
    id: 'post-2',
    img_src:
      'https://storage.googleapis.com/styfer/results/20221004-160846_HKBP_Pearaja_Res._Pearaja_01.jpg',
    title: 'dolor amit',
    createdAt: new Date(2022, 9, 7, 21, 10, 15),
    creator: 'anonymous',
  },
  {
    id: 'post-3',
    img_src:
      'https://storage.googleapis.com/styfer/results/20220917-061046_unimed-rektorat.jpg',
    title: 'my image',
    createdAt: new Date(2022, 9, 7, 21, 40, 15),
    creator: {
      id: 'user-1',
      username: 'dianyehezkiel',
    },
  },
];
