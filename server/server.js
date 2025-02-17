import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import router from './router.js';
import citiesRouter from './services/cities/cities.router.js'; 
const PORT = process.env.PORT || 4000;
const server = express();

// לאפשר גישה לשרת מכתובת אחרת (CORS)
server.use(cors()); 

// לאפשר קליטת נתונים מגוף הבקשה (JSON)
server.use(express.json({ extended: true, limit: '50mb' }));

// הגדרת נתיבים עבור המיקרו-שירותים
server.use('/api', router); // נתיב עיקרי
server.use('/api/cities', citiesRouter); // נתיב עבור הערים

// הפעלת השרת על הפורט שנבחר
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
