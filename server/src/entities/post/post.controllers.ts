import { Router } from 'express';
import { ConflictError, ForbiddenError, InternalError, NotFoundError } from '../../lib/errors';
import Post, { IPost } from './post.model';
import User, { IUser } from '../user/user.model';
import { body, param } from 'express-validator';
import { CreatePostInput, PostOutput, PatchPostInput, PostRequest, PostResponse, UserIdComponent } from './post.types';

const router = Router();

router.get(
  '/:id',
  param('id').notEmpty().isString().isMongoId(),
  // Получение поста по id
  async (req: PostRequest<{ id: string }>, res: PostResponse<PostOutput>) => {
    const post: IPost | null = await Post.findById(req.params.id).catch((err) => null);

    if (!post) return new NotFoundError('Не удалось найти пост').callExpressError(res);

    return res.status(200).json(post);
  },
);

router.get(
  '/',
  // Получение всех постов
  async (req: PostRequest, res: PostResponse<PostOutput[]>) => {
    const posts: IPost[] = await Post.find().catch(() => []);

    return res.status(200).json(posts);
  },
);

router.get(
  '/timeline/:id',
  // Получение ленты новостей
  async (req: PostRequest<{ id: string }>, res: PostResponse<PostOutput[]>) => {
    const user = await User.findById(req.params.id).catch((err) => null);

    if (!user) return new NotFoundError('Не удалось найти пользователя').callExpressError(res);

    const userPosts: IPost[] = await Post.find({ userId: user._id }).catch((err) => []);
    const friendsPosts: IPost[] = await Post.find({ userId: { $in: user.followings } }).catch((err) => []);

    return res.status(200).json([...userPosts, ...friendsPosts]);
  },
);

router.get(
  '/profile/:username',
  param('username').notEmpty().isString(),
  // Получение всех постов пользователя по username
  async (req: PostRequest<{ username: string }>, res: PostResponse<PostOutput[]>) => {
    const user: IUser | null = await User.findOne({ username: req.params.username }).catch(() => null);

    if (!user) return new NotFoundError('Не удалось найти пользователя').callExpressError(res);

    const posts: IPost[] = await Post.find({ userId: user._id }).catch((err) => []);
    res.status(200).json(posts);
  },
);

router.post(
  '/',
  body('userId').notEmpty().isString().isMongoId(),
  body('description').isString().isLength({ max: 500 }),
  body('image').isString(),
  // Создание поста
  async (req: PostRequest<{}, CreatePostInput>, res: PostResponse<PostOutput>) => {
    const post: IPost = new Post(req.body);
    await post.save().catch((err) => {
      console.error(err);
      new InternalError('Не удалось создать пост').callExpressError(res);
    });

    return res.status(201).json(post);
  },
);

router.patch(
  '/:id',
  param('id').notEmpty().isString().isMongoId(),
  body('userId').isString().isMongoId(),
  body('description').isString().isLength({ max: 500 }),
  body('image').isString(),
  // Редактирование поста
  async (req: PostRequest<{ id: string }, PatchPostInput>, res: PostResponse<PostOutput>) => {
    const post: IPost | null = await Post.findById(req.params.id).catch(() => null);

    if (!post) return new NotFoundError('Не удалось найти пост для обновления').callExpressError(res);

    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      return res.status(201).json(post);
    }

    return new ForbiddenError('Невозможно изменить чужой пост').callExpressError(res);
  },
);

router.delete(
  '/:id',
  param('id').notEmpty().isString().isMongoId(),
  body('userId').isString().isMongoId(),
  // Удаление поста
  async (req: PostRequest<{ id: string }, UserIdComponent>, res: PostResponse<{}>) => {
    const post: IPost | null = await Post.findById(req.params.id).catch(() => null);

    if (!post) return new NotFoundError('Не удалось найти пост для удаления').callExpressError(res);

    if (post.userId === req.body.userId) {
      await post.deleteOne();
      return res.status(204).json({});
    }

    return new ForbiddenError('Невозможно удалить чужой пост').callExpressError(res);
  },
);

router.patch(
  '/like/:id',
  param('id').notEmpty().isString().isMongoId(),
  // Лайк или отмена лайка поста
  async (req: PostRequest<{ id: string }, UserIdComponent>, res: PostResponse<{}>) => {
    const post: IPost | null = await Post.findById(req.params.id).catch(() => null);

    if (!post) return new NotFoundError('Не удалось найти пост').callExpressError(res);

    if (!post.likes?.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });

      return res.status(204).json({});
    }

    await post.updateOne({ $pull: { likes: req.body.userId } });

    return res.status(204).json({});
  },
);

export default router;
