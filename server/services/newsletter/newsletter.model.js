import nodemailer from 'nodemailer';

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'youremail@gmail.com', // כתובת המייל שלך
        pass: 'yourpassword' // הסיסמה שלך
    }
});

// שליחת המייל
export const sendNewsletterEmail = async (userEmail) => {
    const mailOptions = {
        from: 'youremail@gmail.com', // כתובת המייל שלך
        to: userEmail, // כתובת המייל של המשתמש
        subject: 'Newsletter Subscription',
        text: 'You have successfully subscribed to our newsletter. Stay tuned for updates!'
    };

    return transporter.sendMail(mailOptions);
};
