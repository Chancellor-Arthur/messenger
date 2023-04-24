import mongoose, { Document, model } from 'mongoose';

export interface IMessage extends Document {
  conversationId: string;
  sender: string;
  text: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const MessageSchema = new mongoose.Schema<IMessage>(
  {
    conversationId: {
      type: String,
    },
    sender: {
      type: String,
    },
    text: {
      type: String,
    },
  },
  { timestamps: true },
);

export default model<IMessage>('Message', MessageSchema);
