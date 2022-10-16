import { User } from '../src/types';

export const USERS: User[] = [
  {
    id: 'user-1',
    username: 'dianyehezkiel',
    email: 'dianyehezkiel@gmail.com',
    password: 'dianyehezkiel',
    posts: [
      {
        id: 'post-3',
        img_src:
          'https://storage.googleapis.com/styfer/results/20220917-061046_unimed-rektorat.jpg',
        title: 'my image',
        createdAt: new Date(2022, 9, 7, 21, 40, 15),
      },
    ],
  },
];
