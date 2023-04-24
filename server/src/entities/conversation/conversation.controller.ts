import { Router } from 'express';
import Conversation, { IConversation } from './conversation.model';
import { InternalError } from '../../lib/errors';
import {
  ConversationOutput,
  ConversationRequest,
  ConversationResponse,
  CreateConversationInput,
} from './conversation.types';
import { body, param } from 'express-validator';

const router = Router();

router.post(
  '/',
  body('senderId').notEmpty().isString().isMongoId(),
  body('receiverId').notEmpty().isString().isMongoId(),
  async (req: ConversationRequest<{}, CreateConversationInput>, res: ConversationResponse<ConversationOutput>) => {
    const conversation: IConversation = new Conversation({
      members: [req.body.senderId, req.body.receiverId],
    });

    await conversation.save().catch((err) => {
      console.error(err);
      return new InternalError('Не удалось создать диалог').callExpressError(res);
    });

    res.status(201).json(conversation);
  },
);

router.get(
  '/:userId',
  param('userId').notEmpty().isString().isMongoId(),
  async (req: ConversationRequest<{ userId: string }>, res: ConversationResponse<ConversationOutput[]>) => {
    const conversations: IConversation[] = await Conversation.find({ members: { $in: [req.params.userId] } }).catch(
      () => [],
    );

    res.status(200).json(conversations);
  },
);

router.get(
  '/find/:firstUserId/:secondUserId',
  param('firstUserId').notEmpty().isString().isMongoId(),
  param('secondUserId').notEmpty().isString().isMongoId(),
  async (
    req: ConversationRequest<{ firstUserId: string; secondUserId: string }>,
    res: ConversationResponse<ConversationOutput>,
  ) => {
    const conversation: IConversation | undefined =
      (await Conversation.findOne({
        members: { $all: [req.params.firstUserId, req.params.secondUserId] },
      }).catch(() => null)) || undefined;

    res.status(200).json(conversation);
  },
);

export default router;
