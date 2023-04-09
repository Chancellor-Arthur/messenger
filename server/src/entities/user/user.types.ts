import { Request, Response } from 'express';
import { IUser } from './user.model';

export type UserRequest<P = {}, B = {}, Q = {}> = Request<P, {}, B, Q>;
export type UserResponse<R> = Response<R>;

export type UserIdComponent = { userId: string };

export type PatchUserInput = Partial<IUser> & UserIdComponent;

export type UserOutput = IUser;

export type PartialUserOutput = Omit<IUser, 'password' | 'createdAt' | 'updatedAt' | '__v'>;
