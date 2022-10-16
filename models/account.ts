import mongoose from "mongoose";

interface IAccount {
  username: string;
  email: string;
  password_hash: string;
}

const accountSchema = new mongoose.Schema<IAccount>({
  username: {
    type: String,
    required: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
  },
  password_hash: {
    type: String,
    required: true,
  },
});

accountSchema.set('toJSON', {
  versionKey: false,
});

const Account = mongoose.model<IAccount>('Account', accountSchema);

export default Account;