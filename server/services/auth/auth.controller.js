import { uploadToCloud } from "../upload/upload.model.js";
import { getUsers, addUser, findUserByCredentials, deleteUser } from './auth.model.js';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 
import passwordValidator from 'password-validator';

const schema = new passwordValidator();
schema
    .is().min(8)  // Minimum 8 characters
    .is().max(20) // Maximum 20 characters
    .has().uppercase() // Must have uppercase letters
    .has().lowercase() // Must have lowercase letters
    .has().digits() // Must have digits
    .has().not().spaces(); // No spaces

    
export async function register(req, res) {
    let { id, username, email, password, profileImage } = req.body;

    // Validate password
    if (!schema.validate(password)) {
        return res.status(400).json({
            error: 'Password is too weak. It must have at least 8 characters, one uppercase letter, one number, and no spaces.'
        });
    }

    try {
        // Check if the username or email already exists
        let existingUser = await findUserByCredentials(username, email);
        if (existingUser) return res.status(400).json({ error: 'Username or email already taken' });

        const hashedPassword = await bcrypt.hash(password, 10);
        let newUser = await addUser(id, username, email, hashedPassword, profileImage);

        if (!newUser) return res.status(400).json({ error: 'User registration failed' });

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Error registering user. Please try again later.' });
    }
}

export async function getAllUsers(req, res) {
    try {
        let users = await getUsers();
        if (!users || users.length === 0) {
            return res.status(404).json({ error: 'No users found' });
        }
        res.status(200).json(users);
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ error: 'Error retrieving users. Please try again later.' });
    }
}



const generateAuthToken = (user) => {
    // Generate a JWT token (use your secret and expiration as needed)
    return jwt.sign({ id: user.id, username: user.username }, 'your-secret-key', { expiresIn: '1h' });
};

export async function login(req, res) {
    let { username, password } = req.body;
    try {
        let user = await findUserByCredentials(username);
        if (!user) return res.status(401).json({ error: 'Invalid username or password' });

        // Check if the password matches the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Generate and send the token
        const token = generateAuthToken(user);
        
        res.status(200).json({
            message: `Welcome ${user.username}!`,
            user: { id: user.id, username: user.username, email: user.email, profileImage: user.profileImage || null },
            token: token
        });
    } catch (error) {
        console.error('Server error during login:', error);
        res.status(500).json({ error: 'Server error during login. Please try again later.' });
    }
}



export async function logout(req, res) {
    try {
        res.clearCookie('session');  // Clear session cookie if using session-based authentication
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Error logging out. Please try again later.' });
    }
}



export async function removeUser(req, res) {
    let { id } = req.params;
    try {
        if (!id) return res.status(400).json({ error: 'User ID is required' });
        
        let deleted = await deleteUser(id);
        if (!deleted) return res.status(404).json({ error: 'User not found' });
        
        res.status(200).json({ message: `User with ID ${id} deleted successfully.` });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Error deleting user. Please try again later.' });
    }
}

