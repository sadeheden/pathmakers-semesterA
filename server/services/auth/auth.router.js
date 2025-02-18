import Router from 'express';
import { getAllUsers, register, login, logout, removeUser, getCurrentUser } from './auth.controller.js';

const authRouter = Router();

authRouter
    .get('/users', getAllUsers)
    .post('/register', register)
    .post('/login', login)  // ודא שהשורה הזו קיימת!
    .post('/logout', logout)
    .delete('/users/:id', removeUser)
    .get('/user', getCurrentUser);

export default authRouter;

/*
    Model --> Functions & Data
    View --> React
    Controller --> Router + Controller
*/
