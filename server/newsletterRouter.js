import express from 'express';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'youremail@gmail.com', // כתובת המייל שלך
        pass: 'yourpassword' // הסיסמה שלך
    }
});

// API לשליחה של אימייל
router.post("/newsletterRouter", async (req, res) => {
    const token = req.headers["authorization"]?.split(" ")[1]; // קבלת הטוקן

    if (!token) {
        return res.status(401).send("Unauthorized: No token provided");
    }

    try {
        // פענוח הטוקן כדי לקבל את פרטי המשתמש
        const decoded = jwt.verify(token, 'your-jwt-secret'); // חשוב להחליף ב-secret שלך
        const userEmail = decoded.email;

        // הגדרת פרטי האימייל
        const mailOptions = {
            from: 'youremail@gmail.com', // כתובת המייל שלך
            to: userEmail, // כתובת המייל של המשתמש
            subject: 'Newsletter Subscription',
            text: 'You have successfully subscribed to our newsletter. Stay tuned for updates!'
        };

        // שליחת האימייל
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).send("Error sending email");
            }
            res.status(200).send("Email sent successfully");
        });
    } catch (error) {
        console.error("Error verifying token:", error);
        res.status(401).send("Unauthorized: Invalid token");
    }
});

export default router;
