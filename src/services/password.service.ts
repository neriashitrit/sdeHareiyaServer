import bcrypt from 'bcrypt-nodejs';

export const encryptPassword = (password: string): string => bcrypt.hashSync(password);

export const comparePasswords = (password: string, hash: string): boolean => bcrypt.compareSync(password, hash);
