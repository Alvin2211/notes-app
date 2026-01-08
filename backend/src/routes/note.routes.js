import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  getUserNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/note.controllers.js";

const router = Router();

router.use(verifyJWT);

//fetching the notes api
router.get("/", getUserNotes);

//creating new note api 
router.post("/", createNote);

//updating new note api
router.put("/:id", updateNote);

//Deleting new note api 
router.delete("/:id", deleteNote);

export default router;