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
import sendNewsletter from "./services/newsletter/newsletter.router.js";
import infoRoutes from "./services/info/info.router.js"; 
import orderRoutes from "./services/order/order.router.js"; 

const server = express();
const PORT = process.env.PORT || 4000;

server.use(cors());
server.use(express.json({ extended: true, limit: '50mb' }));

// ✅ Register API routes
server.use('/api/info', infoRoutes);
server.use('/api', router);
server.use('/api/cities', citiesRouter);
server.use('/api/flights', flightsRouter);
server.use('/api/hotels', hotelsRouter);
server.use('/api/attractions', attractionsRouter);
server.use('/api/auth', authRouter); 
server.use('/api/upload', uploadRouter);
server.use('/api/newsletter', sendNewsletter);
server.use('/api/order', orderRoutes); 

// ✅ Check if the server is running
server.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
server.use((req, res, next) => {
    console.log('Time:', Date.now(), 'Request Type:', req.method, 'Path:', req.originalUrl);
    next();
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
