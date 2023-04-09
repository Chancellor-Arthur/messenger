import { Schema, model, Document } from 'mongoose';

export interface IPost extends Document {
  userId: string;
  description?: string;
  image?: string;
  likes?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const PostSchema = new Schema<IPost>(
  {
    userId: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      max: 500,
    },
    image: {
      type: String,
    },
    likes: {
      type: Array<string>,
      default: [],
    },
  },
  { timestamps: true },
);

export default model<IPost>('Post', PostSchema);
