import { upload } from '../../globals.js';
import Router from 'express';
import { getAllUsers, register, login, logout, removeUser } from './auth.controller.js';
const authRouter = Router();

authRouter
    .get('/users', getAllUsers)
    .post('/register', register)
    .post('/login', login)
    .post('/logout', logout)
    .delete('/users/:id', removeUser);

export default authRouter;

/*
    Model --> Functions & Data
    View --> React
    Controller --> Router + Controller
*/
