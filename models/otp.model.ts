import { model, Schema } from 'mongoose';

const otpSchema = new Schema(
  {
    otp: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const OTP = model('OTP', otpSchema);

export default OTP;