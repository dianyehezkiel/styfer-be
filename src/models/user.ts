import mongoose, { Types } from "mongoose";

interface IUser {
  user: Types.ObjectId;
  posts: Array<Types.ObjectId>;
  liked_posts: Array<Types.ObjectId>;
}

const userSchema = new mongoose.Schema<IUser>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  liked_posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    }
  ]
});

userSchema.set('toJSON', {
  versionKey: false,
});

const User = mongoose.model('User', userSchema);

export default User;