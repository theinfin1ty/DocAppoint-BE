import { Router } from 'express';
import auth from '../middlewares/auth.middleware';
import controller from '../controllers/auth.controller';

const { initiateLogin, login, refresh } = controller;

const router = Router();

router.post('/login', initiateLogin);

router.put('/login', login);

router.post('/refresh', refresh);

export default router;
