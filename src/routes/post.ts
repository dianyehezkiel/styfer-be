import express from 'express';
import Post from '../models/post';
import { AccountPublic, PostLikedBy } from '../types';
import { toNewPostReq } from '../lib/utils';
import { NewPostReqFromFields } from '../types';
import { tokenExtractor, userExtractor } from '../lib/middlewares';
import { Types } from 'mongoose';
import User from '../models/user';

const postRouter = express.Router();

postRouter.get('/', (req, res) => {
  const { page, limit } = req.query;

  let pageNum = Number(page);
  let limitNum = Number(limit);

  if (isNaN(pageNum) || pageNum <= 0) {
    pageNum = 1;
  }

  if (isNaN(limitNum) || limitNum <= 0) {
    limitNum = 20;
  }

  Post.find({})
    .limit(limitNum)
    .skip(((pageNum - 1) * limitNum))
    .populate('creator', {
      _id: 1,
      username: 1,
    })
    .then((posts) => {
      res.json({
        page: pageNum,
        data_length: posts.length,
        posts: posts
      });
    })
    .catch((error) => {
      res.status(500).send({
        error: `Server error: ${error}`,
      });
    });
});

postRouter.get('/:id', (req, res) => {
  const id = req.params.id;

  Post.findOne({ _id: id })
    .select({
      img_src: 1,
      desc: 1,
      created_at: 1,
      likes: 1,
      creator: 1,
    })
    .populate<{ creator: AccountPublic }>('creator', 'username')
    .then((post) => {
      if (!post) {
        res.status(404).send({
          error: `Cannot find post with id ${id}`,
        });
        return;
      }
      res.json(post);
    })
    .catch((error) => {
      res.status(500).send({
        error: `Server Error: ${error}`,
      });
    });
});

postRouter.get('/:id/likes', (req, res) => {
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
  
  Post.findById(id)
    .select({ likes: 1, liked_by: 1 })
    .slice('liked_by', [(pageNum - 1) * limitNum, limitNum])
    .populate<{ liked_by: AccountPublic[] }>('liked_by', 'username')
    .then((post) => {
      if (!post) {
        res.status(404).send({
          error: `Cannot find post with id ${id}`,
        });
        return;
      }
      const postLikesInfo: PostLikedBy = {
        _id: post._id.toString(),
        likes: post.likes,
        liked_by: post.liked_by,
      };

      res.json({
        page: pageNum,
        data_length: post.liked_by.length,
        ...postLikesInfo
      });
    })
    .catch((error) => {
      res.status(500).send({
        error: `Server Error: ${error}`,
      });
    });
});

postRouter.post('/', tokenExtractor, userExtractor, (req, res) => {
  const newPostReq = toNewPostReq(req.body as NewPostReqFromFields);
  const acc = (req.body.acc as AccountPublic) ?? undefined;
  console.log("ACC on POSTS", acc);

  const post = new Post({
    img_src: newPostReq.img_src,
    desc: newPostReq.desc,
    created_at: newPostReq.created_at,
    creator: acc ? new Types.ObjectId(acc._id) : undefined,
    likes: 0,
    liked_by: [],
  });


  post
    .save()
    .then((savedPost) => {
      if (!acc) {
        res.send(savedPost);
      }
      return User.findOneAndUpdate({ user: acc._id }, { $push: { posts: savedPost._id }});
    })
    .then((updatedUser) => {
      if (!updatedUser) {
        return;
      }
      res.send(post);
    })
    .catch((error) => {
      res.status(500).send({
        error: `Error Save Post: ${error}`,
      });
    });
});

postRouter.put('/:id/likes', tokenExtractor, userExtractor, (req, res) => {
  const postId = new Types.ObjectId(req.params.id);
  const acc = req.body.acc ? (req.body.acc as AccountPublic) : undefined;
  if (!acc) {
    res.status(401).send({
      error: 'User not logged in',
    });
    return;
  }

  const userId = new Types.ObjectId(acc._id);

  let liked: boolean;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        res.status(404).send({
          error: `Cannot find post with id ${postId.toString()}`,
        });
        return;
      }

      liked = post.liked_by.find((id) => id.toString() === userId.toString()) ? true : false;
      if (!liked) {
        post.likes += 1;
        post.liked_by.push(userId);
      } else {
        post.likes -= 1;
        const newLikedBy = post.liked_by.filter((id) => id.toString() !== userId.toString());
        post.liked_by = newLikedBy;
      }

      return post.save();
    })
    .then((savedPost) => {
      if (!savedPost) {
        throw Error('Problem updating post likes data');
      }
      return User.findOne({ user: userId });
    })
    .then((user) => {
      if (!user) {
        res.status(404).send({
          error: `Cannot find user with username ${acc.username}`,
        });
        return;
      }

      if (!liked) {
        user.liked_posts.push(new Types.ObjectId(postId));
      } else {
        const newLikedPosts = user.liked_posts.filter((id) => id.toString() !== postId.toString());
        user.liked_posts = newLikedPosts;
      }

      return user.save();
    })
    .then((savedUser) => {
      if (!savedUser) {
        throw new Error('Problem updating user likes data');
      }

      const message = liked
        ? `Successfully unlike ${postId.toString()} post`
        : `Successfully like ${postId.toString()} post`;

      res.send({
        message,
      });
    })
    .catch((error) => {
      res.status(500).send({
        error: `Error Like Post: ${error}`,
      });
    });
});

postRouter.delete('/:id', tokenExtractor, userExtractor, (req, res) => {
  const postId = new Types.ObjectId(req.params.id);
  const acc = req.body.acc ? (req.body.acc as AccountPublic) : undefined;
  if (!acc) {
    res.status(401).send({
      error: 'User not logged in',
    });
    return;
  }

  const userId = new Types.ObjectId(acc._id);

  Post.findOneAndDelete({ _id: postId, creator: userId })
    .then((deletedPost) => {
      if (!deletedPost) {
        res.status(400).send({
          error: `Failed to delete post with id ${postId.toString()}`,
        });
        return;
      }

      res.send({
        message: `Successfully delete ${postId.toString()} post`
      });
    })
    .catch((error) => {
      res.status(500).send({
        error: `Error Like Post: ${error}`,
      });
    });
});

export default postRouter;
