import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      lowercase: true,
    },
    role: {
      type: String,
      required: true,
      lowercase: true,
      enum: ['client', 'doctor', 'admin'],
      default: 'client',
    },
  },
  {
    timestamps: true,
  }
);

const User = model('User', userSchema);

export default User;
