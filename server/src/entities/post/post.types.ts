import { Request, Response } from 'express';
import { IPost } from './post.model';

export type PostRequest<P = {}, B = {}, Q = {}> = Request<P, {}, B, Q>;
export type PostResponse<R> = Response<R>;

export type UserIdComponent = { userId: string };

export type CreatePostInput = {
  userId: string;
  description: string;
  image: string;
};

export type PatchPostInput = Partial<IPost>;

export type PostOutput = IPost;
