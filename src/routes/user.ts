import express from 'express';
import User from '../models/user';
import { AccountPublic, PostPreview, UserLikedPosts, UserPreview } from '../types';

const userRouter = express.Router();

userRouter.get('/', (req, res) => {
  const { page, limit } = req.query;

  let pageNum = Number(page);
  let limitNum = Number(limit);

  if (isNaN(pageNum) || pageNum <= 0) {
    pageNum = 1;
  }

  if (isNaN(limitNum) || limitNum <= 0) {
    limitNum = 20;
  }

  User.find({})
    .limit(limitNum)
    .skip(((pageNum - 1) * limitNum))
    .populate<{user: AccountPublic}>('user', 'username')
    .then((users) => {
      res.json({
        page: pageNum,
        data_length: users.length,
        users,
      });
    })
    .catch((error) => {
      res.status(500).send({ Error: `Server error: ${error}` });
    });
});

userRouter.get('/:id', (req, res) => {
  const id = req.params.id;
  const { page, limit } = req.query;

  let pageNum = Number(page);
  let limitNum = Number(limit);

  if (isNaN(pageNum) || pageNum <= 0) {
    pageNum = 1;
  }

  if (isNaN(limitNum) || limitNum <= 0) {
    limitNum = 20;
  }

  User.findOne({ user: id })
    .select({ user: 1, posts: 1 })
    .slice('posts', [(pageNum - 1) * limitNum, limitNum])
    .populate<{user: AccountPublic}>('user', 'username')
    .populate<{posts: PostPreview[]}>('posts', {
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
      const userInfo: UserPreview = {
        user: user.user,
        posts: user.posts,
      };

      res.json({
        page: pageNum,
        data_length: user.posts.length,
        ...userInfo
      });
    })
    .catch((error) => {
      res.status(500).send({ Error: `Server error: ${error}` });
    });
});

userRouter.get('/:id/likes', (req, res) => {
  const id = req.params.id;
  const { page, limit } = req.query;

  let pageNum = Number(page);
  let limitNum = Number(limit);

  if (isNaN(pageNum) || pageNum <= 0) {
    pageNum = 1;
  }

  if (isNaN(limitNum) || limitNum <= 0) {
    limitNum = 20;
  }

  User.findOne({ user: id })
    .select({ user: 1, liked_posts: 1 })
    .slice('liked_posts', [(pageNum - 1) * limitNum, limitNum])
    .populate<{user: AccountPublic}>('user', 'username')
    .populate<{liked_posts: PostPreview[]}>('liked_posts', {
      img_src: 1,
      desc: 1,
      created_at: 1,
      creator: 1,
      likes: 1,
    })
    .then((user) => {
      if (!user) {
        res.status(404).send({
          error: `Cannot find user with id ${id}`
        });
        return;
      }
      
      const userInfo: UserLikedPosts = {
        user: user.user,
        liked_posts: user.liked_posts,
      };

      res.json({
        page: pageNum,
        data_length: user.liked_posts.length,
        ...userInfo
      });
    })
    .catch((error) => {
      res.status(500).send({ Error: `Server error: ${error}` });
    });
});

export default userRouter;
