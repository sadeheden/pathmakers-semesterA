import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import router from './router.js';
import citiesRouter from './services/cities/cities.router.js'; // או הנתיב המתאים לקובץ שלך
import flightsRouter from './services/flights/flights.router.js';  // או הנתיב המתאים לקובץ שלך
import hotelsRouter from './services/hotel/hotel.router.js';  // או הנתיב המתאים לקובץ שלך
import attractionsRouter from './services/attraction/att.router.js';  // או הנתיב המתאים לקובץ שלך

const server = express(); // קודם כל, הגדר את השרת

const PORT = process.env.PORT || 4000;

// לאפשר גישה לשרת מכתובת אחרת (CORS)
server.use(cors()); 

// לאפשר קליטת נתונים מגוף הבקשה (JSON)
server.use(express.json({ extended: true, limit: '50mb' }));

// הגדרת נתיבים עבור המיקרו-שירותים
server.use('/api', router); // נתיב עיקרי
server.use('/api/cities', citiesRouter); // נתיב עבור הערים
server.use('/api/flights', flightsRouter); // נתיב עבור טיסות
server.use('/api/hotels', hotelsRouter); // נתיב עבור מלונות
server.use('/api/attractions', attractionsRouter); // נתיב עבור אטרקציות

// הפעלת השרת על הפורט שנבחר
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
