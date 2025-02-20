import Router from 'express';
import authRouter from './services/auth/auth.router.js';
import uploadRouter from './services/upload/upload.router.js';
import citiesRouter from './services/cities/cities.router.js';
import sendNewsletterRouter from './newsletterRouter.js';

const router = Router();

// נתיב בדיקה כדי לראות אם ה-API פועל
router.get('/', (req, res) => {
    res.json({ message: 'API is working!' });
});

router.use('/auth', authRouter);
router.use('/upload', uploadRouter);
router.use('/cities', citiesRouter); 
router.use('/api/newsletterRouter', sendNewsletterRouter);
export default router;
