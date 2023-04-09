import { Request, Response } from 'express';
import { IUser } from '../user/user.model';

export type AuthRequest<B> = Request<{}, {}, B>;
export type AuthResponse<R> = Response<R>;

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = LoginInput & {
  username: string;
};

export type AuthOutput = IUser;
