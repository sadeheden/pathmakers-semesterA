import { uploadToCloud } from "../upload/upload.model.js";
import { getUsers, addUser, findUserByCredentials, deleteUser } from './auth.model.js';

export async function getAllUsers(req, res) {
    try {
        let users = await getUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ error: 'Error retrieving users' });
    }
}

export async function register(req, res) {
    let { id, username, email, password, profileImage } = req.body;
    try {
        let newUser = await addUser(id, username, email, password, profileImage);
        if (!newUser) return res.status(400).json({ error: 'Username or email already taken' });
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Error registering user' });
    }
}

export async function login(req, res) {
    let { username, password } = req.body;
    try {
        let user = await findUserByCredentials(username, password);
        if (!user) return res.status(401).json({ error: 'Invalid username or password' });
        res.status(200).json({
            message: `Welcome ${user.username}!`,
            user: { id: user.id, username: user.username, email: user.email, profileImage: user.profileImage || null }
        });
    } catch (error) {
        console.error('Server error during login:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
}

export async function logout(req, res) {
    res.clearCookie('session');
    res.json({ message: 'Logged out successfully' });
}

export async function removeUser(req, res) {
    let { id } = req.params;
    try {
        let deleted = await deleteUser(id);
        if (!deleted) return res.status(404).json({ error: 'User not found' });
        res.json({ message: `User with ID ${id} deleted successfully.` });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Error deleting user' });
    }
}