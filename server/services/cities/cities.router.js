import express from 'express';
import { getAllCities, createCity } from '../cities.controller.js';

const router = express.Router();

// הגדרת נתיבי GET ו-POST עבור הערים
router.get('/', getAllCities);   // קבלת כל הערים מה-DB
router.post('/', createCity);    // הוספת עיר חדשה למסד הנתונים

export default router;
