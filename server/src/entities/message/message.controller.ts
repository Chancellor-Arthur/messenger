import { Router } from 'express';
import Message, { IMessage } from './message.model';
import { InternalError } from '../../lib/errors';
import { CreateMessageInput, MessageOutput, MessageRequest, MessageResponse } from './message.types';
import { body, param } from 'express-validator';

const router = Router();

router.post(
  '/',
  body('conversationId').notEmpty().isString().isMongoId(),
  body('sender').notEmpty().isString(),
  body('text').isString(),
  async (req: MessageRequest<{}, CreateMessageInput>, res: MessageResponse<MessageOutput>) => {
    const message: IMessage = new Message(req.body);

    await message.save().catch((err) => {
      console.error(err);
      return new InternalError('Не удалось сохранить сообщение').callExpressError(res);
    });

    res.status(201).json(message);
  },
);

router.get(
  '/:conversationId',
  param('conversationId').notEmpty().isString().isMongoId(),
  async (req: MessageRequest<{ conversationId: string }>, res: MessageResponse<MessageOutput[]>) => {
    const messages: IMessage[] = await Message.find({ conversationId: req.params.conversationId }).catch(() => []);

    res.status(200).json(messages);
  },
);

export default router;
