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
      const userInfo = user
        ? {
          user: user.user,
          posts: user.posts,
        }
        : undefined;

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
      const userInfo = user
        ? {
          user: user.user,
          liked_posts: user.liked_posts,
        }
        : undefined;

      res.json(userInfo);
    })
    .catch((error) => {
      res.status(500).send({ Error: `Server error: ${error}` });
    });
});

// userRouter.get('/:id', (req, res) => {
//   const id = req.params.id;
//   const post = userServices.getUser(id);

//   if (!post) {
//     res.status(404).send(`Cannot find user with id: ${id}`);
//   } else {
//     res.send(post);
//   }
// });

// userRouter.post('/', (req, res) => {
//   const { username, email, password } = toNewUser(req.body as NewUserFromFields);

//   User.findOne({ username })
//     .then((user) => {
//       if (user) {
//         res.status(400).json({ error: 'username must be unique' });
//         return;
//       }
//     })
//     .catch((err) => {
//       res.status(500).json({ error: `Server error: ${err}` });
//     });

//   if (!password) {
//     res.status(400).json({
//       error: 'password must be provided!',
//     });
//     return;
//   }

//   if (password.length < 8) {
//     res.status(400).json({
//       error: 'password must be at least 8 characters long',
//     });
//     return;
//   }

//   if (!isValidEmail(email)) {
//     res.status(400).json({
//       error: 'email is not valid',
//     });
//     return;
//   }

//   const saltRounds = 10;
  
//   bcrypt.hash(password, saltRounds)
//     .then((passwordHash) => {
//       const user = new User({
//         username,
//         email,
//         passwordHash,
//       });
//       return user.save();
//     })
//     .then((savedUser) => {
//       res.status(201).json(savedUser);
//     })
//     .catch((err) => {
//       res.status(500).json({ error: `Server error: ${err}` });
//     });
// });

export default userRouter;
