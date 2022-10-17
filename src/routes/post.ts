import express from 'express';
import Post from '../../models/post';
import { AccountPublic, PostLikedBy, PostPreview } from '../types';
import { toNewPostReq } from '../utils';
import { NewPostReqFromFields } from '../types';
import { tokenExtractor, userExtractor } from '../utils/middlewares';
import { Types } from 'mongoose';
import User from '../../models/user';

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
    .catch((error) => {
      res.status(500).send({
        error: `Server error: ${error}`,
      });
    });
});

postRouter.get('/:id', (req, res) => {
  const id = req.params.id;

  Post.findOne({ _id: id })
    // watch below code
    .populate<{ creator: AccountPublic }>('creator')
    .then((post) => {
      if (!post) {
        res.status(404).send({
          error: `Cannot find post with id ${id}`,
        });
        return;
      }
      const postInfo: PostPreview = {
        _id: post._id.toString(),
        img_src: post.img_src,
        desc: post.desc,
        created_at: post.created_at,
        likes: post.likes,
        creator: post.creator,
      };
      res.json(postInfo);
    })
    .catch((error) => {
      res.status(500).send({
        error: `Server Error: ${error}`,
      });
    });
});

postRouter.get('/:id/likes', (req, res) => {
  const id = req.params.id;

  Post.findById(id)
    // watch  below code
    .populate<{ creator: AccountPublic }>('creator')
    .populate<{ liked_by: AccountPublic[] }>('liked_by')
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
      res.json(postLikesInfo);
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

  const post = new Post({
    img_src: newPostReq.img_src,
    desc: newPostReq.desc,
    createdAt: newPostReq.created_at,
    creator: acc ? new Types.ObjectId(acc._id) : undefined,
    likes: 0,
    liked_by: [],
  });

  post
    .save()
    .then((savedPost) => {
      res.send(savedPost);
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
      liked = post.liked_by.find((id) => id === userId) ? true : false;
      if (!liked) {
        post.likes += 1;
        post.liked_by.push(userId);
      } else {
        post.likes -= 1;
        const newLikedBy = post.liked_by.filter((id) => id !== userId);
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
        const newLikedPosts = user.liked_posts.filter((id) => id !== postId);
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

  // Post.findById(postId)
  //   .then((post) => {
  //     if (!post) {
  //       res.status(404).send({
  //         error: `Cannot find user with username ${acc.username}`,
  //       });
  //       return;
  //     }

  //     if (userId !== post.creator) {
  //       res.status(403).send({
  //         error: `${acc.username} is not the owner of the post`, 
  //       });
  //       return;
  //     }

  //     return Post.findByIdAndDelete()
  //   })
  //   .then()
  //   .catch((error) => {
  //     res.status(500).send({
  //       error: `Error Like Post: ${error}`,
  //     });
  //   });
  
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
