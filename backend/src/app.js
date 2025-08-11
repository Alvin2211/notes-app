import express from 'express';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app =express();

app.use(cors({
  origin: "http://localhost:5173", // Frontend URL
  credentials: true, 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

import userRoutes from './routes/user.routes.js';
import noteRoutes from './routes/note.routes.js';

app.use('/api/v1/users', userRoutes);
app.use('/api/notes', noteRoutes); // This matches frontend calls to /api/notes

export { app };