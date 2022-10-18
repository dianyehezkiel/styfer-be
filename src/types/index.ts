export * from './post';
export * from './user';
export * from './account';

export interface Params {
  [key: string]: string;
}

export type ResBody = Record<string, unknown>;

export type ReqBody = Record<string, unknown>;
