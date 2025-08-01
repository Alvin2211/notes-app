import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app= express();

app.use(cors({
  origin: true, // your frontend domain
  credentials: true               // this is crucial
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());    

import userRoutes from './routes/user.routes.js';
import noteRoutes from './routes/note.routes.js';

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/notes', noteRoutes);

export {app}
