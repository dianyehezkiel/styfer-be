import { AccountPublic } from "./account";
import { PostPreview } from "./post";

export interface User {
  user: AccountPublic;
  posts: Omit<PostPreview, 'creator'>[];
  liked_posts: PostPreview[];
}

export type UserPreview = Omit<User, 'liked_posts'>;

export type UserLikedPosts = Omit<User, 'posts'>;
