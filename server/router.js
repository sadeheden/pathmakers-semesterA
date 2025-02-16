import Router from 'express';
import authRouter from './services/auth/auth.router.js';
import uploadRouter from './services/upload/upload.router.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/upload', uploadRouter);

export default router;