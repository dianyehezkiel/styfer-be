import { parseCreator, parseString } from ".";
import { NewPost, NewPostFromFields } from "../types";

export const toNewPost = ({
  img_src,
  title,
  creator,
}: NewPostFromFields): NewPost => {
  return {
    img_src: parseString(img_src, 'Image Source'),
    title: parseString(title, 'Title'),
    creator: parseCreator(creator),
    createdAt: new Date(),
  };
};