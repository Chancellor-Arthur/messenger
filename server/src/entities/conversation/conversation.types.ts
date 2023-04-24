import { Request, Response } from 'express';
import { IConversation } from './conversation.model';

export type ConversationRequest<P = {}, B = {}, Q = {}> = Request<P, {}, B, Q>;
export type ConversationResponse<R> = Response<R>;

export type CreateConversationInput = {
  senderId: string;
  receiverId: string;
};

export type ConversationOutput = IConversation;
