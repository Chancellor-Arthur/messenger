import { Router } from 'express';
import User, { IUser } from '../user/user.model';
import { compareSync } from 'bcrypt';
import { BadRequestError, InternalError, NotFoundError } from '../../lib/errors';
import { body } from 'express-validator';
import { AuthRequest, AuthResponse, RegisterInput, AuthOutput, LoginInput } from './auth.types';
import { crypt } from '../../lib/crypt';

const router = Router();

router.post(
  '/register',
  body('username').notEmpty().isString().isLength({ min: 3, max: 20 }),
  body('email').notEmpty().isEmail().isLength({ max: 50 }),
  body('password').notEmpty().isString().isLength({ min: 6 }),
  async (req: AuthRequest<RegisterInput>, res: AuthResponse<AuthOutput>) => {
    const user: IUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: crypt(req.body.password),
    });

    await user.save().catch((err) => {
      console.error(err);
      return new InternalError('Не удалось зарегистрировать пользователя').callExpressError(res);
    });

    return res.status(201).json(user);
  },
);

router.post(
  '/login',
  body('email').notEmpty().isEmail().isLength({ max: 50 }),
  body('password').notEmpty().isString().isLength({ min: 6 }),
  async (req: AuthRequest<LoginInput>, res: AuthResponse<AuthOutput>) => {
    const user: IUser | null = await User.findOne({ email: req.body.email }).catch((err) => null);
    if (!user) return new NotFoundError(`Пользователь с таким email не найден`).callExpressError(res);

    const isValidPassword = compareSync(req.body.password, user!.password);
    if (!isValidPassword) return new BadRequestError('Неверный пароль').callExpressError(res);

    return res.status(200).json(user);
  },
);

export default router;
