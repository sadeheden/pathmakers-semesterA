import { readFile, writeFile } from 'fs/promises';
import path from 'path';

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

// Function to find a user by username or email
export const findUserByUsernameOrEmail = async (username, email) => {
    try {
        let users = await getUsers();
        return users.find(user => user.username === username || user.email === email);
    } catch (error) {
        console.error('Error finding user:', error);
        throw new Error('Error searching for user');
    }
};

// Function to add a new user
export const addUser = async (id, username, email, password, profileImage = null) => {
    try {
        let users = await getUsers();
        if (await findUserByUsernameOrEmail(username, email)) return false;  // Prevent duplicates

        const newUser = { id, username, email, password, profileImage };
        users.push(newUser);
        await saveUsers(users);
        console.log('New user added:', newUser);  // Log the new user added
        return newUser;
    } catch (error) {
        console.error('Error adding new user:', error);
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
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // ✅ Fix here
        res.json(decoded);
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};
