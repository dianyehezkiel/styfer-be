import express from 'express';
import Post from '../../models/post';
// import { toNewPost } from '../../utils';
// import postServices from '../services/postServices';
// import { NewPostFromFields } from '../types';

const postRouter = express.Router();

postRouter.get('/', (_req, res) => {
  Post.find({})
    .populate('creator', {
      _id: 1,
      username: 1,
    })
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => {
      res.status(500).send({ error: `Server error: ${err}` });
    });
});

// postRouter.get('/:id', (req, res) => {
//   const id = req.params.id;
//   const post = postServices.getPost(id);

//   if (!post) {
//     res.status(404).send(`Cannot find post with id: ${id}`);
//   } else {
//     res.send(post);
//   }
// });

// postRouter.post('/', async (req, _res) => {
//   try {
//     const newPost = toNewPost(req.body as NewPostFromFields);

//     const post = new Post({
//       img_src: newPost.img_src,
//       title: newPost.title,
//       createdAt: newPost.createdAt,
//       creator: newPost.creator?.id
//     })
//   }
// })

export default postRouter;