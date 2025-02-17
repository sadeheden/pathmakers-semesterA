import { upload } from '../../globals.js';
import Router from 'express';
import { getAllUsers, register, login, logout, removeUser } from './auth.controller.js';
const authRouter = Router();




// Define routes
authRouter
    .get('/users', getAllUsers)
    .post('/register', upload.single('profileImage'), register) // Use upload middleware for profile image
    .post('/login', login)
    .post('/logout', logout)
    .delete('/users/:id', removeUser);

export default authRouter;

/*
    Model --> Functions & Data
    View --> React
    Controller --> Router + Controller
*/
