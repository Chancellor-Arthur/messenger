import { Router } from 'express';
import { ConflictError, ForbiddenError, NotFoundError } from '../../lib/errors';
import { crypt } from '../../lib/crypt';
import User, { IUser } from './user.model';
import {
  PartialFriendOutput,
  PartialUserOutput,
  PatchUserInput,
  UserIdComponent,
  UserOutput,
  UserRequest,
  UserResponse,
} from './user.types';
import { body, param, query } from 'express-validator';

const router = Router();

router.get('/all', async (req: UserRequest, res: UserResponse<UserOutput[]>) => {
  const users: IUser[] = await User.find().catch(() => []);

  return res.status(200).json(users);
});

router.get(
  '/:id',
  param('id').notEmpty().isString().isMongoId(),
  async (req: UserRequest<{ id: string }>, res: UserResponse<PartialUserOutput>) => {
    const user: IUser | null = await User.findById(req.params.id).catch(() => null);

    if (!user) return new NotFoundError('Не удалось найти пользователя').callExpressError(res);

    const { password, createdAt, updatedAt, __v, ...partialUser } = user.toJSON();

    return res.status(200).json(partialUser as PartialUserOutput);
  },
);

router.get(
  '/',
  query('username').notEmpty().isString(),
  async (req: UserRequest<{}, {}, { username: string }>, res: UserResponse<PartialUserOutput>) => {
    const user: IUser | null = await User.findOne({ username: req.query.username }).catch(() => null);

    if (!user) return new NotFoundError('Не удалось найти пользователя').callExpressError(res);

    const { password, createdAt, updatedAt, __v, ...partialUser } = user.toJSON();

    return res.status(200).json(partialUser as PartialUserOutput);
  },
);

router.get(
  '/friends/:id',
  param('id').notEmpty().isString().isMongoId(),
  async (req: UserRequest<{ id: string }>, res: UserResponse<PartialFriendOutput[]>) => {
    const user: IUser | null = await User.findById(req.params.id).catch(() => null);

    if (!user) return new NotFoundError('Не удалось найти пользователя').callExpressError(res);

    const friends: IUser[] = await User.find({ userId: { $in: user.followings } }).catch((err) => []);

    const partialFriends = friends.map((friend) => {
      const { _id, username, avatar } = friend;
      return { _id, username, avatar };
    });

    res.status(200).json(partialFriends);
  },
);

router.patch(
  '/:id',
  param('id').notEmpty().isString().isMongoId(),
  body('userId').notEmpty().isString().isMongoId(),
  body('username').notEmpty().isString().isLength({ min: 3, max: 20 }),
  body('email').notEmpty().isEmail().isLength({ max: 50 }),
  body('password').notEmpty().isString().isLength({ min: 6 }),
  body('description').isString().isLength({ max: 100 }),
  body('avatar').isString(),
  body('cover').isString(),
  body('city').isString().isLength({ max: 50 }),
  body('from').isString().isLength({ max: 50 }),
  body('relationship').isString().isIn(['Single', 'Married', 'Complicated']),
  body('isAdmin').isBoolean(),
  async (req: UserRequest<{ id: string }, PatchUserInput>, res: UserResponse<UserOutput>) => {
    if (req.body.userId === req.params.id || res.locals.user.isAdmin) {
      if (req.body.password) req.body.password = crypt(req.body.password);

      const user: IUser | null = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).catch(
        () => null,
      );

      if (!user) return new NotFoundError('Не удалось найти пользователя для обновления').callExpressError(res);

      return res.status(201).json(user);
    }

    return new ForbiddenError('Недостаточно прав').callExpressError(res);
  },
);

router.delete(
  '/:id',
  param('id').notEmpty().isString().isMongoId(),
  async (req: UserRequest<{ id: string }, UserIdComponent>, res: UserResponse<{}>) => {
    if (req.body.userId === req.params.id || res.locals.user.isAdmin) {
      await User.findByIdAndDelete(req.params.id).catch(() =>
        new NotFoundError('Не удалось найти пользователя для удаления').callExpressError(res),
      );

      return res.status(204).json({});
    }

    return new ForbiddenError('Недостаточно прав').callExpressError(res);
  },
);

router.patch(
  '/follow/:id',
  param('id').notEmpty().isString().isMongoId(),
  async (req: UserRequest<{ id: string }, UserIdComponent>, res: UserResponse<{}>) => {
    if (req.body.userId !== req.params.id) {
      const user: IUser | null = await User.findById(req.params.id).catch(() => null);

      if (!user)
        return new NotFoundError('Не удалось найти пользователя для оформления подписки на него').callExpressError(res);

      const currentUser: IUser | null = await User.findById(req.body.userId).catch(() => null);

      if (!currentUser) return new NotFoundError('Не удалось найти текущего пользователя').callExpressError(res);

      if (!user.followers?.includes(currentUser._id)) {
        await user.updateOne({ $push: { followers: currentUser._id } });
        await currentUser.updateOne({ $push: { followings: user._id } });

        return res.status(204).json({});
      }

      return new ConflictError('Подписка уже была оформлена').callExpressError(res);
    }

    return new ConflictError('Невозможно подписаться на себя').callExpressError(res);
  },
);

router.patch(
  '/unfollow/:id',
  param('id').notEmpty().isString().isMongoId(),
  async (req: UserRequest<{ id: string }, UserIdComponent>, res: UserResponse<{}>) => {
    if (req.body.userId !== req.params.id) {
      const user: IUser | null = await User.findById(req.params.id).catch(() => null);

      if (!user) return new NotFoundError('Не удалось найти пользователя для отписки от него').callExpressError(res);

      const currentUser: IUser | null = await User.findById(req.body.userId).catch(() => null);

      if (!currentUser) return new NotFoundError('Не удалось найти текущего пользователя').callExpressError(res);

      if (user.followers?.includes(currentUser._id)) {
        await user.updateOne({ $pull: { followers: currentUser._id } });
        await currentUser.updateOne({ $pull: { followings: user._id } });

        return res.status(204).json({});
      }

      return new ConflictError('Невозможно отписаться без наличия подписки').callExpressError(res);
    }

    return new ConflictError('Невозможно отписаться от себя').callExpressError(res);
  },
);

export default router;
