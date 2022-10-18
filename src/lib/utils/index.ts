import { AccountPublic } from "../../types";

export * from './accountUtils';
export * from './postUtils';
export * from './logger';

export function isString (text: unknown): text is string {
  return typeof text === 'string' || text instanceof String;
}

export function isAccountPublic (object: unknown): object is AccountPublic {
  return Object.prototype.hasOwnProperty.call(object, '_id')
    && Object.prototype.hasOwnProperty.call(object, 'username');
}

export const isValidEmail = (email: unknown) => {
  if (!isString(email)) {
    return false;
  }
  return email.match(
    /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/
  );
};

export function parseString(text: unknown, dataName: string): string {
  if (!text || !isString(text)) {
    throw new Error(`Incorrect or missing ${dataName}`);
  }

  return text;
}

export function parseCreator(user: unknown): AccountPublic | undefined {
  if (!isAccountPublic(user)) {
    if (user === undefined) {
      return;
    }
    throw new Error('Incorrect or missing user');
  }

  return {
    _id: parseString(user._id, 'user id'),
    username: parseString(user.username, 'username'),
  };
}