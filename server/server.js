import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// ייבוא של ה-Router הראשי
import router from './router.js';

// ייבוא ה-Routers של השירותים השונים
import citiesRouter from './services/cities/cities.router.js';
import flightsRouter from './services/flights/flights.router.js';
import hotelsRouter from './services/hotel/hotel.router.js';
import attractionsRouter from './services/attraction/att.router.js';
import authRouter from './services/auth/auth.router.js'; 
import uploadRouter from './services/upload/upload.router.js';

const server = express();
const PORT = process.env.PORT || 4000;

// Middleware להגדרת CORS
server.use(cors());

// Middleware לטיפול בבקשות JSON
server.use(express.json({ extended: true, limit: '50mb' }));


// חיבור הנתיבים הראשיים
server.use('/api', router);
server.use('/api/cities', citiesRouter);
server.use('/api/flights', flightsRouter);
server.use('/api/hotels', hotelsRouter);
server.use('/api/attractions', attractionsRouter);
server.use('/api/auth', authRouter); // ✅ חיבור נתיב האימות
server.use('/api/upload', uploadRouter);


// בדיקת תקינות השרת
server.get('/', (req, res) => {
    res.send('Server is running!');
});

// הפעלת השרת
server.listen(PORT, () => {
    console.log(` Server is running on http://localhost:${PORT}`);
});
