import { RequestHandler } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { isAccountPublic, isString, parseString } from '.';
import { SECRET } from '../../lib/constant';
import Account from '../../models/account';
import { AccountPublic } from '../types';

// interface Params {
//   [key: string]: string;
// }

// type ResBody = Record<string, unknown>;

// type ReqBody = Record<string, unknown>;

/**
 * Get token from request headers and put it to request body
 * @param {Request} req 
 * @param {Response} _res 
 * @param {NextFunction} next 
 */
export const tokenExtractor: RequestHandler = (req, _res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.body.token = authorization.substring(7);
  }
  console.log("req on tokenExtractor", req.body);
  next();
};

/**
 * Authenticate token and add user data to request body if it exist.
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 * @returns {void}
 */
export const userExtractor: RequestHandler = (req , res, next) => {
  const token = parseString(req.body.token, 'token');
  if (!token) {
    return;
  }

  if (!SECRET) {
    res.status(500).send({
      error: 'Server error: missing secret key',
    });
    return;
  }

  const decodedToken = jwt.verify(token, (SECRET as Secret));
  if (isString(decodedToken) || !isAccountPublic(decodedToken)) {
    res.status(400).send({
      error: 'Invalid token',
    });
    return;
  }

  console.log(decodedToken);

  Account.findById<AccountPublic>(decodedToken._id)
    .then((acc) => {
      // FUCK THIS SHIT IS ASYNC ASSIGN TO ACC
      console.log(acc);
      req.body.acc = acc
        ? { _id: acc._id.toString(), username: acc.username } 
        : undefined;
      next();
    })
    .catch((error) => {
      res.status(500).send({
        error: `Server error: ${error}`,
      });
      console.log(error);
    });
    console.log("req on userExtractor", req.body);
};