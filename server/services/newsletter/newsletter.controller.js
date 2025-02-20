import jwt from 'jsonwebtoken';
import { sendNewsletterEmail } from './newsletter.model.js';

// פונקציה לשליחת ניוזלטר למשתמש
export const handleNewsletterSubscription = async (req, res) => {
    const token = req.headers["authorization"]?.split(" ")[1]; // קבלת הטוקן

    if (!token) {
        return res.status(401).send("Unauthorized: No token provided");
    }

    try {
        // פענוח הטוקן כדי לקבל את פרטי המשתמש
        const decoded = jwt.verify(token, 'your-jwt-secret'); // חשוב להחליף ב-secret שלך
        const userEmail = decoded.email;

        // שליחת המייל
        await sendNewsletterEmail(userEmail);

        res.status(200).send("Email sent successfully");
    } catch (error) {
        console.error("Error verifying token:", error);
        res.status(401).send("Unauthorized: Invalid token");
    }
};
