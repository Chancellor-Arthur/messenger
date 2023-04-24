import mongoose, { model, Document } from 'mongoose';

export interface IConversation extends Document {
  members?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const ConversationSchema = new mongoose.Schema<IConversation>(
  {
    members: {
      type: Array<string>,
    },
  },
  { timestamps: true },
);

export default model<IConversation>('Conversation', ConversationSchema);
