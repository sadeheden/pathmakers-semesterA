import { readFile, writeFile } from 'fs/promises';
const FILE_PATH = './data/users.json';


export async function getUsers() {
    try {
        let users = await readFile(FILE_PATH, 'utf-8');
        return JSON.parse(users);
    } catch (error) {
        console.error('Error reading users file:', error);
        return [];
    }
}

export async function saveUsers(users) {
    try {
        await writeFile(FILE_PATH, JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('Error saving users file:', error);
    }
}

export async function findUserByUsernameOrEmail(username, email) {
    let users = await getUsers();
    return users.find(user => user.username === username || user.email === email);
}

export async function findUserByCredentials(username, password) {
    let users = await getUsers();
    return users.find(user => user.username === username && user.password === password);
}

export async function addUser(id, username, email, password, profileImage = null) {
    let users = await getUsers();
    if (await findUserByUsernameOrEmail(username, email)) return false;
    let newUser = { id, username, email, password, profileImage };
    users.push(newUser);
    await saveUsers(users);
    return newUser;
}

export async function deleteUser(id) {
    let users = await getUsers();
    let updatedUsers = users.filter(user => user.id !== parseInt(id));
    if (users.length === updatedUsers.length) return false;
    await saveUsers(updatedUsers);
    return true;
}