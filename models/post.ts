import mongoose, { Document, Types } from "mongoose";

interface IPost extends Document {
  img_src: string;
  desc: string;
  created_at: Date;
  creator: Types.ObjectId;
  likes: number;
  liked_by: Array<Types.ObjectId>;
}

const postSchema = new mongoose.Schema<IPost>({
  img_src: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    minLength: 3,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  likes: {
    type: Number,
    required: true,
  },
  liked_by: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
});

postSchema.set('toJSON', {
  versionKey: false,
});

const Post = mongoose.model('Post', postSchema);

export default Post;