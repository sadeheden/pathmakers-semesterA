import express from 'express';
import { handleNewsletterSubscription } from './newsletter.controller.js'; // Adjust path if needed

const router = express.Router();

router.post("/", handleNewsletterSubscription); // Keep it clean

export default router;
