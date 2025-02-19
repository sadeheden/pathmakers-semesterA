import { getUsers, addUser, findUserByUsernameOrEmail } from './auth.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// **Get All Users**
export async function getAllUsers(req, res) {
    try {
        const users = await getUsers();
        if (!users.length) {
            return res.status(404).json({ error: "No users found" });
        }
        res.status(200).json(users);
    } catch (error) {
        console.error("❌ Error retrieving users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// **Register New User**
export async function register(req, res) {
    try {
        let { username, email, password, profileImage } = req.body;

        // 🚨 Validate fields
        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // 🚨 Check if user exists
        let existingUser = await findUserByUsernameOrEmail(username, email);
        if (existingUser) {
            return res.status(400).json({ error: "Username or email already taken" });
        }

        // 🚨 Ensure password meets criteria
        if (password.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters long" });
        }

        // ✅ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        if (!hashedPassword) throw new Error("Error hashing password");

        // ✅ Add user to database
        let newUser = await addUser(username, email, hashedPassword, profileImage);
        if (!newUser) {
            return res.status(400).json({ error: "User registration failed" });
        }

        // ✅ Generate JWT token immediately after registration
        const token = jwt.sign(
            { id: newUser.id, username: newUser.username },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "24h" }
        );

        // ✅ Return token so frontend can store it
        res.status(201).json({
            message: "User registered successfully",
            user: { id: newUser.id, username: newUser.username, email: newUser.email },
            token: token
        });

    } catch (error) {
        console.error("❌ Register error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


// **Login User**
export async function login(req, res) {
    try {
        const { username, password } = req.body;
        const users = await getUsers();

        // Find user by username
        const user = users.find(user => user.username === username);
        if (!user) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // Compare hashed passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET_KEY, { expiresIn: "24h" });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("❌ Login error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// **Get Current User**
export async function getCurrentUser(req, res) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        res.json(decoded);
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
}

// **Logout**
export async function logout(req, res) {
    res.status(200).json({ message: "Logged out successfully" });
}

// **Remove User**
export async function removeUser(req, res) {
    try {
        const { id } = req.params;
        const users = await getUsers();
        const updatedUsers = users.filter(user => user.id !== id);

        if (users.length === updatedUsers.length) {
            return res.status(404).json({ error: "User not found" });
        }

        await saveUsers(updatedUsers);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
