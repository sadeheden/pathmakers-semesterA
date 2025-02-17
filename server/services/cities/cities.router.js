import express from 'express';
import { getCities, addCity } from '../controllers/cities.controller.js';

const router = express.Router();

router.get('/', getCities);   // קבלת כל הערים מה-DB
router.post('/', addCity);    // הוספת עיר חדשה למסד הנתונים

export default router;
