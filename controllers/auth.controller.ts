import { Request, Response } from 'express';
import User from '../models/user.model';
import {
  generateAuthTokens,
  generateOTP,
  verificationToken,
  verifyToken,
} from '../utils/auth.util';
import OTP from '../models/otp.model';
import * as admin from 'firebase-admin';

const initiateLogin = async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.body;

    if (!Number(phoneNumber)) {
      return res.status(400).send({ error: 'Invalid phone number!' });
    }

    const otp = generateOTP(6);

    await OTP.create({
      phoneNumber,
      otp,
      expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
    });

    // TODO: add logic to send otp via sms

    return res.status(200).send({
      success: true,
      otp: process.env.APP_ENV === 'development' ? otp : undefined,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'Something went wrong!' });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, otp, idToken, provider } = req.body;

    // Google Sign-In
    if (provider === 'google' && idToken) {
      try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { email, name, phone_number } = decodedToken;
        
        let user = await User.findOne({ email });
        
        if (!user) {
          user = await User.create({
            email,
            name,
            phoneNumber: phone_number || email,
          });
        }
        
        const tokens = generateAuthTokens(user.toJSON());
        
        return res.status(200).send({
          user,
          tokens,
        });
      } catch (error) {
        return res.status(400).send({ error: 'Invalid Google token!' });
      }
    }

    // SMS OTP Login

    const sentOTP = await OTP.findOne({
      phoneNumber,
      otp,
      expiresAt: {
        $gte: new Date().toISOString(),
      },
    });

    if (!sentOTP) {
      return res.status(400).send({ error: 'Invalid OTP!' });
    }

    await OTP.deleteMany({ phoneNumber });

    const existingUser = await User.findOne({ phoneNumber });

    if (existingUser) {
      const tokens = generateAuthTokens(existingUser.toJSON());

      return res.status(200).send({
        user: existingUser,
        tokens,
      });
    }

    const user = await User.create({
      phoneNumber,
      name: 'User',
    });

    const tokens = generateAuthTokens(user.toJSON());

    return res.status(200).send({
      user,
      tokens,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'Something went wrong!' });
  }
};

const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    console.log(refreshToken);
    if (!refreshToken) {
      return res.status(400).send({ error: 'Refresh token is required!' });
    }

    const decodedToken: any = verifyToken(refreshToken);

    const user = await User.findById(decodedToken._id);

    if (!user) {
      return res.status(400).send({ error: 'User not found!' });
    }

    const tokens = generateAuthTokens(user.toJSON());

    return res.status(200).send({
      user,
      tokens,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'Something went wrong!' });
  }
};

export default {
  initiateLogin,
  login,
  refresh,
};
