import { Schema, model, Document } from 'mongoose';

enum Relationship {
  Single = 'Single',
  Married = 'Married',
  Complicated = 'Complicated',
}

export interface IUser extends Document {
  username: string;
  email: string;
  description?: string;
  password: string;
  avatar?: string;
  cover?: string;
  city?: string;
  from?: string;
  relationship?: Relationship;
  followers?: string[];
  followings?: string[];
  isAdmin?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      require: true,
      max: 50,
      unique: true,
    },
    description: {
      type: String,
      max: 100,
    },
    password: {
      type: String,
      require: true,
      min: 6,
    },
    avatar: {
      type: String,
      default: '',
    },
    cover: {
      type: String,
      default: '',
    },
    followers: {
      type: Array<string>,
      default: [],
    },
    followings: {
      type: Array<string>,
      default: [],
    },
    city: {
      type: String,
      max: 50,
    },
    from: {
      type: String,
      max: 50,
    },
    relationship: {
      type: String,
      enum: Relationship,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default model<IUser>('User', UserSchema);
