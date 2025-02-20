import { getUsers, addUser, findUserByUsernameOrEmail } from './auth.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// **Get All Users**
export async function getCurrentUser(req, res) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            console.warn("⚠️ No Authorization header received");
            return res.status(401).json({ message: "Unauthorized, no token provided" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            console.warn("⚠️ Token missing from Authorization header");
            return res.status(401).json({ message: "Unauthorized, token missing" });
        }

        try {
            console.log("🔍 Verifying Token:", token);
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            console.log("✅ Token verified:", decoded);
            res.json(decoded);
        } catch (error) {
            console.error("❌ JWT Verification Failed:", error.message);
            return res.status(401).json({ message: "Unauthorized, invalid token" });
        }
    } catch (error) {
        console.error("⚠️ Unexpected error in getCurrentUser:", error);
        res.status(500).json({ message: "Server error" });
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

export async function getAllUsers(req, res) {
    try {
        const users = await getUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error("❌ Error fetching users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


// **Login User**
export async function login(req, res) {
    try {
        const { username, password } = req.body;
        console.log("🔍 Login Attempt:", username, password);

        const users = await getUsers();
        console.log("📂 Loaded Users:", users);

        // Find user by username
        const user = users.find(user => user.username === username);
        if (!user) {
            console.warn("⚠️ User not found:", username);
            return res.status(401).json({ error: "Invalid username or password" });
        }

        console.log("✅ User Found:", user);

        // Compare hashed passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.warn("⚠️ Incorrect Password for:", username);
            return res.status(401).json({ error: "Invalid username or password" });
        }

        console.log("🔑 Password Matched!");

        // Generate JWT token
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET_KEY, { expiresIn: "24h" });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("❌ Login error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

console.log(process.env.JWT_SECRET_KEY);

// **Get Current User**

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
