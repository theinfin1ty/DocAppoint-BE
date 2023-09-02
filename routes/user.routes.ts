import { Router } from 'express';
import controller from '../controllers/user.controller';
import auth from '../middlewares/auth.middleware';

const router = Router();

const { register, getAllUsers, getUser, getLoggedInUser, updateUser, deleteUser, addUser } =
  controller;

router.post('/add', auth({ roles: ['admin'] }), addUser);
router.post('/register', register);

router.get('/', auth({ roles: ['admin'] }), getAllUsers);
router.get('/profile', auth({ roles: ['admin', 'client', 'doctor'] }), getLoggedInUser);
router.get('/:id', auth({ roles: ['admin', 'client', 'doctor'] }), getUser);

router.patch('/:id', auth({ roles: ['admin'] }), updateUser);

router.delete('/:id', auth({ roles: ['admin'] }), deleteUser);

export default router;
