import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import User from '../models/user.model';

const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ error: 'User already exists!' });
    }
    const userRecord = await admin.auth().createUser({
      email,
      emailVerified: true,
      password,
      displayName: name,
      disabled: false,
    });
    const user = await User.create({
      name,
      email,
      uid: userRecord.uid,
    });

    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'Something went wrong!' });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { role } = req.query;
    if (!role) {
      return res.status(400).send({ error: 'Please select a valid user type!' });
    }
    const users = await User.find({ role });
    return res.status(200).send(users);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'Something went wrong!' });
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ error: 'User not found!' });
    }
    return res.status(404).send(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'Something went wrong!' });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { ...req.body });
    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'Something went wrong!' });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    await User.findByIdAndDelete(id);
    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'Something went wrong!' });
  }
};

// TODO: Fix after initializing firebase
const addUser = async (req: Request, res: Response) => {
  try {
    const { name, role, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ error: 'User already exists!' });
    }
    const userRecord = await admin.auth().createUser({
      email,
      emailVerified: true,
      password,
      displayName: name,
      disabled: false,
    });
    await admin.auth().setCustomUserClaims(userRecord.uid, { role });
    const user = await User.create({
      name,
      email,
      role,
      uid: userRecord.uid,
    });
    return res.status(200).send(user);
  } catch (e) {
    res.redirect('/admin/register');
  }
};

export default {
  register,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  addUser,
};
