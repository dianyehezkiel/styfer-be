import { AccountPublic } from "./account";

export interface Post {
  _id: string;
  img_src: string;
  desc: string;
  created_at: Date;
  creator?: AccountPublic;
  likes: number;
  liked_by: AccountPublic[];
}

export type PostPreview = Omit<Post, 'liked_by'>;

export type PostLikedBy = Pick<Post, '_id' | 'likes' | 'liked_by'>;

export interface NewPostReqFromFields {
  img_src: unknown,
  desc: unknown,
  creator: unknown,
}

export interface NewPostReq {
  img_src: string;
  desc: string;
  created_at: Date;
  creator?: AccountPublic
}
