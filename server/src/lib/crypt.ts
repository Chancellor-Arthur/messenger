import bcrypt from 'bcrypt';

export const crypt = (password: string) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(process.env.SALT ? +process.env.SALT : 10));
