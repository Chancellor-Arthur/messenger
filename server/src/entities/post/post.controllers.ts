import { Router } from 'express';
import { ConflictError, ForbiddenError, InternalError, NotFoundError } from '../../lib/errors';
import Post, { IPost } from './post.model';
import User from '../user/user.model';
import { body, param } from 'express-validator';
import { CreatePostInput, PostOutput, PatchPostInput, PostRequest, PostResponse, UserIdComponent } from './post.types';

const router = Router();

router.get(
  '/:id',
  param('id').notEmpty().isString().isMongoId(),
  async (req: PostRequest<{ id: string }>, res: PostResponse<PostOutput>) => {
    const post: IPost | null = await Post.findById(req.params.id).catch(() => null);

    if (!post) return new NotFoundError('Не удалось найти пост').getExpressError(res);

    return res.status(200).json(post);
  },
);

router.get('/', async (req: PostRequest, res: PostResponse<PostOutput[]>) => {
  const posts: IPost[] = await Post.find().catch(() => []);

  return res.status(200).json(posts);
});

router.get('/timeline/all', async (req: PostRequest<{}, UserIdComponent>, res: PostResponse<PostOutput[]>) => {
  const user = await User.findById(req.body.userId).catch((err) => null);

  if (!user) return new NotFoundError('Не удалось найти пользователя').getExpressError(res);

  const userPosts: IPost[] = await Post.find({ userId: user._id }).catch((err) => []);
  const friendsPosts: IPost[] = await Post.find({ userId: { $in: user.followings } }).catch((err) => []);

  return res.status(200).json([...userPosts, ...friendsPosts]);
});

router.post(
  '/',
  body('userId').notEmpty().isString().isMongoId(),
  body('description').isString().isLength({ max: 500 }),
  body('image').isString(),
  async (req: PostRequest<{}, CreatePostInput>, res: PostResponse<PostOutput>) => {
    const post: IPost = new Post(req.body);
    await post.save().catch((err) => {
      console.error(err);
      new InternalError('Не удалось создать пост').getExpressError(res);
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
  async (req: PostRequest<{ id: string }, PatchPostInput>, res: PostResponse<PostOutput>) => {
    const post: IPost | null = await Post.findById(req.params.id).catch(() => null);

    if (!post) return new NotFoundError('Не удалось найти пост для обновления').getExpressError(res);

    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      return res.status(201).json(post);
    }

    return new ForbiddenError('Невозможно изменить чужой пост').getExpressError(res);
  },
);

router.delete(
  '/:id',
  param('id').notEmpty().isString().isMongoId(),
  body('userId').isString().isMongoId(),
  async (req: PostRequest<{ id: string }, UserIdComponent>, res: PostResponse<{}>) => {
    const post: IPost | null = await Post.findById(req.params.id).catch(() => null);

    if (!post) return new NotFoundError('Не удалось найти пост для удаления').getExpressError(res);

    if (post.userId === req.body.userId) {
      await post.deleteOne();
      return res.status(204).json({});
    }

    return new ForbiddenError('Невозможно удалить чужой пост').getExpressError(res);
  },
);

router.patch(
  '/:id/like',
  param('id').notEmpty().isString().isMongoId(),
  async (req: PostRequest<{ id: string }, UserIdComponent>, res: PostResponse<{}>) => {
    const post: IPost | null = await Post.findById(req.params.id).catch(() => null);

    if (!post) return new NotFoundError('Не удалось найти пост').getExpressError(res);

    if (!post.likes?.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });

      return res.status(204).json({});
    }

    await post.updateOne({ $pull: { likes: req.body.userId } });

    return res.status(204).json({});
  },
);

export default router;
