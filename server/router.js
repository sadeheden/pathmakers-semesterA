import Router from 'express';
import authRouter from './services/auth/auth.router.js';
import uploadRouter from './services/upload/upload.router.js';

const router = Router();

// נתיב בדיקה כדי לראות אם ה-API פועל
router.get('/', (req, res) => {
    res.json({ message: 'API is working!' });
});

router.use('/auth', authRouter);
router.use('/upload', uploadRouter);

export default router;

