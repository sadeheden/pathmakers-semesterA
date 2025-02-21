import nodemailer from 'nodemailer';


export const sendNewsletterEmail = async (email) => {
    console.log("🚀 Preparing email transport...");

    const transporter = nodemailer.createTransport({
        service: 'gmail', // Or use SMTP settings if not Gmail
        auth: {
            user: process.env.EMAIL_USER, // Ensure this is set
            pass: process.env.EMAIL_PASS, // Ensure this is set
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Newsletter Subscription",
        text: "Thank you for subscribing to our newsletter!"
    };

    console.log("📨 Sending email to:", email);
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
};
