import { sign, verify } from 'jsonwebtoken';

export const verificationToken = (payload) => {
  const token = sign(payload, `${process.env.JWT_SECRET}`, { expiresIn: '1h' });
};

export const verifyToken = (token) => {
  return verify(token, `${process.env.JWT_SECRET}`);
};

export const generateOTP = (length: number = 6) => {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};

export const generateAuthTokens = (payload) => {
  const accessToken = sign(payload, `${process.env.JWT_SECRET}`, {
    expiresIn: '12h',
  });
  const refreshToken = sign(payload, `${process.env.JWT_SECRET}`, {
    expiresIn: '30d',
  });
  return { accessToken, refreshToken };
};
