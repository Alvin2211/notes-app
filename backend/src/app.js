import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app= express();

app.use(cors());
app.use(express.json());
// app.use(urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());    

export {app}
