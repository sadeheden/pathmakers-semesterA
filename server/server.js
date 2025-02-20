import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import router from './router.js';
import citiesRouter from './services/cities/cities.router.js';
import flightsRouter from './services/flights/flights.router.js';
import hotelsRouter from './services/hotel/hotel.router.js';
import attractionsRouter from './services/attraction/att.router.js';
import authRouter from './services/auth/auth.router.js'; 
import uploadRouter from './services/upload/upload.router.js';
import sendNewsletter from  "./services/newsletter/newsletter.router.js";


const server = express();
const PORT = process.env.PORT || 4000;

server.use(cors());
server.use(express.json({ extended: true, limit: '50mb' }));

server.use('/api', router);
server.use('/api/cities', citiesRouter);
server.use('/api/flights', flightsRouter);
server.use('/api/hotels', hotelsRouter);
server.use('/api/attractions', attractionsRouter);
server.use('/api/auth', authRouter); 
server.use('/api/upload', uploadRouter);
server.use('/api/newsletter', sendNewsletter);

server.get('/', (req, res) => {
    res.send('Server is running!');
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
