import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  role: {
    type: String,
    required: true,
    lowercase: true,
    enum: ['client', 'doctor', 'admin'],
    default: 'client',
  },
});

const User = model('User', userSchema);

export default User;
