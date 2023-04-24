import { Request, Response } from 'express';
import { IMessage } from './message.model';

export type MessageRequest<P = {}, B = {}, Q = {}> = Request<P, {}, B, Q>;
export type MessageResponse<R> = Response<R>;

export type CreateMessageInput = {
  conversationId: string;
  sender: string;
  text: string;
};

export type MessageOutput = IMessage;
