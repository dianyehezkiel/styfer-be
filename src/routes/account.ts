import express from 'express';
import Account from '../models/account';
import {
  AccountPreview,
  AccountPublic,
  LoginReqFromFields,
  Params,
  ResBody,
  SignupReqFromFields,
} from '../types';
import {
  toLoginReq,
  toPwdChangeReq,
  toSignupReq,
  isAccountPublic,
} from '../lib/utils';
import { tokenExtractor, userExtractor } from '../lib/middlewares';
import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import { SALTROUNDS } from '../config';
import User from '../models/user';

const SECRET = process.env.SECRET;
if (!SECRET) throw Error('No SECRET Defined');

const accountRouter = express.Router();

accountRouter.use(tokenExtractor);

accountRouter.get('/', userExtractor, (req, res) => {
  const acc = req.body.acc as unknown;
  if (!acc || !isAccountPublic(acc)) {
    res.status(400).send({
      error: 'No account data',
    });
    return;
  }

  const username = acc.username;

  Account.findOne({ username })
    .then((acc) => {
      if (!acc) {
        res.status(404).send({
          error: `cannot find account with username: ${username}`,
        });
        return;
      }

      const accountPreview: AccountPreview = {
        _id: acc._id.toString(),
        username: acc.username,
        email: acc.email,
      };

      res.send(accountPreview);
    })
    .catch((error) => {
      res.status(500).send({ error: `Server Error: ${error}` });
    });
});

accountRouter.post<'/login', Params, ResBody, LoginReqFromFields>(
  '/login',
  (req, res) => {
    const { username, email, password } = toLoginReq(req.body);

    const filter = username ? { username } : { email };

    Account.findOne(filter)
      .then((acc) => {
        if (!acc) {
          res.status(404).send({
            error: `${username ?? email} doesn't exist`,
          });
          return;
        }

        const passwordCorrect = bcrypt.compareSync(password, acc.password_hash);
        if (!passwordCorrect) {
          res.status(401).send({ error: 'Password is incorrect' });
          return;
        }

        const accForToken: AccountPublic = {
          _id: acc._id.toString(),
          username: acc.username,
        };

        const token = jwt.sign(accForToken, SECRET as Secret);

        res.send({
          ...accForToken,
          token,
        });
      })
      .catch((error) => {
        res.status(500).send({ error: `Server Error: ${error}` });
      });
  },
);

accountRouter.post<'/signup', Params, ResBody, SignupReqFromFields>(
  '/signup',
  (req, res) => {
    const { username, email, password } = toSignupReq(req.body);

    Account.findOne({ username })
      .then((user) => {
        const existedUsername = user?.username;
        if (existedUsername) {
          res.status(400).send({
            error: 'Username exist',
          });
          return;
        }

        if (password.length < 8) {
          res.status(400).send({
            error: 'Password must at least 8 characters long.',
          });
          return;
        }

        const hashedPassword = bcrypt.hashSync(password, SALTROUNDS);

        const newAccount = new Account({
          username,
          email,
          password_hash: hashedPassword,
        });

        return newAccount.save();
      })
      .then((savedAcc) => {
        if (!savedAcc) {
          return;
        }

        const newUser = new User({
          user: savedAcc._id,
          posts: [],
          liked_posts: [],
        });
        return newUser.save();
      })
      .then((savedUser) => {
        if (!savedUser) {
          return;
        }

        const accForToken: AccountPublic = {
          _id: savedUser.user.toString(),
          username,
        };
        const token = jwt.sign(accForToken, SECRET as Secret);
        res.status(201).send({
          ...accForToken,
          token,
        });
      })
      .catch((error) => {
        res.status(500).send({
          error: `Server Error: ${error}`,
        });
      });
  },
);

accountRouter.put('/change-password', userExtractor, (req, res) => {
  const { acc, old_password, new_password }: Record<string, unknown> =
    req.body as Record<string, unknown>;

  if (!isAccountPublic(acc)) {
    res.status(400).send({
      error: 'No account data',
    });
    return;
  }

  const { old_password: oldPassword, new_password: newPassword } =
    toPwdChangeReq({ old_password, new_password });

  const username = acc.username;

  Account.findOne({ username })
    .then((acc) => {
      if (!acc) {
        res.status(404).send({
          error: `${username} doesn't exist`,
        });
        return;
      }

      const passwordCorrect = bcrypt.compareSync(
        oldPassword,
        acc.password_hash,
      );

      if (!passwordCorrect) {
        res.status(401).send({ error: 'Password is incorrect' });
        return;
      }

      acc.password_hash = bcrypt.hashSync(newPassword, SALTROUNDS);

      return acc.save();
    })
    .then((updatedAcc) => {
      if (!updatedAcc) {
        return;
      }

      res.send({
        message: 'Password changed successfully',
      });
    })
    .catch((error) => {
      res.status(500).send({ error: `Server Error: ${error}` });
    });
});

export default accountRouter;
