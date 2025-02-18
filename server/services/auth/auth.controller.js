import { getUsers, addUser, findUserByUsernameOrEmail, deleteUser } from './auth.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 
import passwordValidator from 'password-validator';

const schema = new passwordValidator();
schema
    .is().min(8)  // לפחות 8 תווים
    .is().max(20) // מקסימום 20 תווים
    .has().uppercase() // לפחות אות גדולה אחת
    .has().lowercase() // לפחות אות קטנה אחת
    .has().digits() // לפחות מספר אחד
    .has().not().spaces(); // ללא רווחים

// **Generate Auth Token**
const generateAuthToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username }, 
        process.env.JWT_SECRET_KEY,  // ✅ Correctly use the env variable
        { expiresIn: '1h' }
    );
};


// **Register New User**
export async function register(req, res) {
    let { username, email, password, profileImage } = req.body;

    // Validate password
    if (!schema.validate(password)) {
        return res.status(400).json({
            error: 'Password must be at least 8 characters, contain uppercase, a number, and no spaces.'
        });
    }

    try {
        // Check if user already exists
        let existingUser = await findUserByUsernameOrEmail(username, email);
        if (existingUser) return res.status(400).json({ error: 'Username or email already taken' });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);


        // Add new user
        let newUser = await addUser(username, email, hashedPassword, profileImage);

        if (!newUser) return res.status(400).json({ error: 'User registration failed' });

        // Return success response
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// **User Login**
export async function login(req, res) {
    const { username, password } = req.body;

    try {
        console.log("🔹 Login request received:", { username, password });

        const users = await getUsers();
        console.log("🔹 Users found:", users);

        const user = users.find(user => user.username === username);
        if (!user) {
            console.log("❌ User not found:", username);
            return res.status(401).json({ error: "Invalid username or password" });
        }

        console.log("🔹 User found:", user);

        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log("🔹 Password comparison result:", isPasswordValid);

        if (!isPasswordValid) {
            console.log("❌ Password mismatch for user:", username);
            return res.status(401).json({ error: "Invalid username or password" });
        }

        console.log("✅ Password verified for user:", username);

        // Generate JWT Token
        const token = jwt.sign(
            { id: user.id, username: user.username }, 
            process.env.JWT_SECRET_KEY, 
            { expiresIn: "24h" }
        );

        console.log("✅ Token generated for user:", token);

        res.status(200).json({
            message: `Welcome ${user.username}!`,
            user: { id: user.id, username: user.username, email: user.email },
            token: token
        });

    } catch (error) {
        console.error("❌ Login error:", error);
        res.status(500).json({ error: "Server error during login" });
    }
}

// **Get All Users**
export async function getAllUsers(req, res) {
    try {
        // Retrieve users from the database
        let users = await getUsers();
        if (!users.length) {
            return res.status(404).json({ error: 'No users found' });
        }
        res.status(200).json(users);
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
// auth.controller.js
export const getCurrentUser = (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        res.json(decoded);
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// Delete User
export async function removeUser(req, res) {
    let { id } = req.params;
    try {
        if (!id) return res.status(400).json({ error: 'User ID is required' });

        // Delete the user
        let deleted = await deleteUser(id);
        if (!deleted) return res.status(404).json({ error: 'User not found' });

        res.status(200).json({ message: `User with ID ${id} deleted successfully.` });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Logout
export async function logout(req, res) {
    try {
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Error logging out' });
    }
}