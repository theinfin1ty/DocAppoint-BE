import { Router } from 'express';
import catchAsync from '../utils/catchAsync';
import controller from '../controllers/user.controller';

const router = Router();

const { register, getAllUsers, getUser, updateUser, deleteUser, addUser } = controller;

router.post('/add', catchAsync(addUser));
router.post('/register', catchAsync(register));

router.get('/', catchAsync(getAllUsers));
router.get('/:id', catchAsync(getUser));

router.patch('/:id', catchAsync(updateUser));

router.delete('/:id', catchAsync(deleteUser));

export default router;
