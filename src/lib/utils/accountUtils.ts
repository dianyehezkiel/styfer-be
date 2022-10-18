import { isValidEmail, parseString } from '.';
import { LoginReqFromFields, LoginReq, SignupReqFromFields, SignupReq, PwdChangeReqFromFields, PwdChangeReq } from '../../types';

export const toLoginReq = ({
  username_or_email,
  password,
}: LoginReqFromFields): LoginReq => {
  if (isValidEmail(username_or_email)) {
    return {
      email: parseString(username_or_email, 'email'),
      password: parseString(password, 'password'),
    };
  }

  return {
    username: parseString(username_or_email, 'username'),
    password: parseString(password, 'password'),
  };
};

export const toSignupReq = ({
  username,
  email,
  password,
}: SignupReqFromFields): SignupReq => {
  if (!isValidEmail(email)) {
    throw new Error('Email invalid');
  }

  return {
    username: parseString(username, 'username'),
    email: parseString(email, 'email'),
    password: parseString(password, 'password'),
  };
};

export const toPwdChangeReq = ({
  old_password,
  new_password,
}: PwdChangeReqFromFields): PwdChangeReq => {
  return {
    old_password: parseString(old_password, 'old password'),
    new_password: parseString(new_password, 'new password'),
  };
};
