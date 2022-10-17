import { parseString } from ".";
import { NewPostReq, NewPostReqFromFields } from "../types";

export const toNewPostReq = ({
  img_src,
  desc,
}: NewPostReqFromFields): NewPostReq => {
  return {
    img_src: parseString(img_src, 'Image Source'),
    desc: parseString(desc, 'desc'),
    created_at: new Date(),
  };
};