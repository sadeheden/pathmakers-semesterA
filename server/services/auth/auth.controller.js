import { addUser, findUserByUsernameOrEmail } from './auth.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// **Register New User**
export async function register(req, res) {
    try {
        let { username, email, password, profileImage } = req.body;

        // 🚨 **Check if required fields exist**
        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // 🚨 **Check if user already exists**
        let existingUser = await findUserByUsernameOrEmail(username, email);
        if (existingUser) {
            return res.status(400).json({ error: "Username or email already taken" });
        }

        // 🚨 **Ensure password is valid**
        if (password.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters long" });
        }

        // ✅ **Hash password**
        const hashedPassword = await bcrypt.hash(password, 10);
        if (!hashedPassword) throw new Error("Error hashing password");

        // ✅ **Add new user to database**
        let newUser = await addUser(username, email, hashedPassword, profileImage);
        if (!newUser) {
            return res.status(400).json({ error: "User registration failed" });
        }

        // ✅ **Return success response**
        res.status(201).json({ message: "User registered successfully", user: newUser });

    } catch (error) {
        console.error("❌ Register error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
