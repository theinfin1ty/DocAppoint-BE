import { sign } from 'jsonwebtoken';

export const verificationToken = (payload) => {
  const token = sign(payload, `${process.env.JWT_SECRET}`, { expiresIn: '1h' });
};
