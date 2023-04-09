import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';

import authRoutes from './entities/auth/auth.controllers';
import usersRoutes from './entities/user/user.controllers';
import postRoutes from './entities/post/post.controllers';

const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/posts', postRoutes);

const PORT = process.env.PORT ? +process.env.PORT : 5000;
const HOST = process.env.HOST ? process.env.HOST : '0.0.0.0';

const start = async () => {
  await mongoose
    .connect(process.env.MONGO_URL || 'mongodb://localhost:27017/messenger')
    .then(() => console.info('Connecting to the database was successful'))
    .catch((err) => console.error(err));

  app.listen(PORT, HOST, () => {
    console.log(`Server started on port ${PORT}`);
  });
};

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
