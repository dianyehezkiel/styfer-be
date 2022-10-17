import express from 'express';
// import bcrypt from 'bcrypt';
import User from '../../models/user';
// import { isValidEmail, toNewUser } from '../utils';
// import userServices from '../services/userServices';
// import { NewUserFromFields } from '../types';

const userRouter = express.Router();

userRouter.get('/', (_req, res) => {
  User.find({})
    .populate('user', {
      _id: 1,
      username: 1,
    })
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      res.status(500).send({ Error: `Server error: ${error}` });
    });
});

userRouter.get('/:id', (req, res) => {
  const id = req.params.id;

  User.findOne({ user: id })
    .populate('user', {
      _id: 1,
      username: 1,
    })
    .populate('posts', {
      _id: 1,
      img_src: 1,
      desc: 1,
      created_at: 1,
      likes: 1,
    })
    .then((user) => {
      if (!user) {
        res.status(404).send({
          error: `Cannot find user with id ${id}`
        });
        return;
      }
      const userInfo = {
        user: user.user,
        posts: user.posts,
      };

      res.json(userInfo);
    })
    .catch((error) => {
      res.status(500).send({ Error: `Server error: ${error}` });
    });
});

userRouter.get('/:id/likes', (req, res) => {
  const id = req.params.id;

  User.findOne({ user: id })
    .populate('user', {
      _id: 1,
      username: 1,
    })
    .populate('liked_posts', {
      _id: 1,
      img_src: 1,
      desc: 1,
      created_at: 1,
      likes: 1,
      creator: 1,
    })
    .then((user) => {
      if (!user) {
        res.status(404).send({
          error: `Cannot find user with id ${id}`
        });
        return;
      }
      const userInfo = {
        user: user.user,
        liked_posts: user.liked_posts,
      };

      res.json(userInfo);
    })
    .catch((error) => {
      res.status(500).send({ Error: `Server error: ${error}` });
    });
});

export default userRouter;
