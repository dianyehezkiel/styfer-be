import { RequestHandler } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { isAccountPublic, isString, logger } from '../utils';
import { SECRET } from '../../config';
import Account from '../../models/account';
import { AccountPublic } from '../../types';

/**
 * log request information in terminal
 * @param {Request} req 
 * @param {Response} _res 
 * @param {NextFunction} next 
 */
export const requestLogger: RequestHandler = (req, _res, next) => {
  logger.info('Method:', req.method);
  logger.info('Path:  ', req.path);
  logger.info('Body:  ', req.body);
  logger.info('-----');
  next();
};

/**
 * Get token from authorization headers and put it to request body
 * @param {Request} req 
 * @param {Response} _res 
 * @param {NextFunction} next 
 */
export const tokenExtractor: RequestHandler = (req, _res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.body.token = authorization.substring(7);
  }
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
  const token = (req.body.token as string) ?? undefined;
  if (!token) {
    next();
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

  Account.findById<AccountPublic>(decodedToken._id)
    .then((acc) => {
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
};