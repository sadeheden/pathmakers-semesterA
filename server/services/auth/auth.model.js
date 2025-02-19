import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcrypt";


// Use process.cwd() to get the current working directory
const FILE_PATH = path.join(process.cwd(),  'data', 'users.json');


export const getUsers = async () => {
    try {
        const data = await readFile(FILE_PATH, 'utf-8');
        const users = JSON.parse(data);  // Parse the JSON data
        console.log('Users:', users);  // Log users to verify they're fetched
        return users;
    } catch (error) {
        console.error('Error reading or parsing users.json:', error);
        throw new Error('Error fetching users from the file');
    }
};



// Save the updated users list to the users.json file
export const saveUsers = async (users) => {
    try {
        await writeFile(FILE_PATH, JSON.stringify(users, null, 2));  // Pretty print the JSON with 2 spaces
        console.log('Users saved successfully');
    } catch (error) {
        console.error('Error saving users file:', error);
        throw new Error('Error saving users to the file');
    }
};



export const addUser = async (username, email, password, profileImage = null) => {
    try {
        let users = await getUsers();
        if (await findUserByUsernameOrEmail(username, email)) return false;

        // ✅ Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = { id: uuidv4(), username, email, password: hashedPassword, profileImage };
        users.push(newUser);
        await saveUsers(users);
        console.log('✅ New user added:', newUser);
        return newUser;
    } catch (error) {
        console.error('❌ Error adding new user:', error);
        throw new Error('Error adding user');
    }
};


// Function to delete a user by id
export const deleteUser = async (id) => {
    try {
        let users = await getUsers();
        const updatedUsers = users.filter(user => user.id !== id);
        if (users.length === updatedUsers.length) return false;  // If no user was deleted

        await saveUsers(updatedUsers);
        console.log(`User with ID ${id} deleted successfully`);
        return true;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw new Error('Error deleting user');
    }
};

export const getCurrentUser = (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        console.log("Received Authorization Header:", authHeader); // ✅ Log header
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.log("❌ No valid Authorization header received");
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const token = authHeader.split(" ")[1]; // ✅ Extract token correctly
        console.log("Extracted Token:", token); // ✅ Log extracted token

        // Attempt to verify the token
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            console.log("✅ Decoded Token Data:", decoded); // ✅ Log decoded token
            res.json(decoded);
        } catch (error) {
            console.error("❌ JWT Verification Failed:", error.message);
            return res.status(401).json({ message: "Invalid token", error: error.message });
        }
    } catch (error) {
        console.error("❌ Unexpected Error in Token Verification:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const hashExistingPasswords = async () => {
    try {
        let users = await getUsers();

        for (let user of users) {
            if (!user.password.startsWith("$2b$")) { // ✅ Skip already hashed passwords
                user.password = await bcrypt.hash(user.password, 10);
                console.log(`🔑 Password hashed for ${user.username}`);
            }
        }

        await saveUsers(users);
        console.log("✅ All passwords hashed successfully!");
    } catch (error) {
        console.error("❌ Error hashing passwords:", error);
    }
};

hashExistingPasswords();
export const findUserByUsernameOrEmail = async (username, email) => {
    try {
        let users = await getUsers();
        console.log("🔍 Searching for:", { username, email });

        const user = users.find(user =>
            user.username.toLowerCase() === username.toLowerCase() ||
            user.email.toLowerCase() === email.toLowerCase()
        );

        if (!user) console.log("❌ User not found:", username);
        return user;
    } catch (error) {
        console.error("❌ Error finding user:", error);
        throw new Error("Error searching for user");
    }
};
