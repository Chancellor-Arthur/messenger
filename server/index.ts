import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import multer from 'multer';
import path from 'path';
import mongoose from 'mongoose';

import authRoutes from './src/entities/auth/auth.controllers';
import usersRoutes from './src/entities/user/user.controllers';
import postRoutes from './src/entities/post/post.controllers';
import messageRoutes from './src/entities/message/message.controller';
import conversationRoutes from './src/entities/conversation/conversation.controller';

const app = express();

app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post('/upload', upload.single('file'), (req, res) => res.status(201).json({}));

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/posts', postRoutes);
app.use('/messages', messageRoutes);
app.use('/conversations', conversationRoutes);

const PORT = process.env.PORT ? +process.env.PORT : 5000;
const HOST = process.env.HOST ? process.env.HOST : '0.0.0.0';

const start = async () => {
  await mongoose
    .connect(process.env.MONGO_URL || 'mongodb://localhost:27017/messenger')
    .then(() => console.info('Connecting to the database was successful'))
    .catch((err) => console.error(err));

  app.listen(PORT, HOST, () => {
    console.info(`Server started on port ${PORT}`);
  });
};

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
