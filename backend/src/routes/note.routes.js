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

// GET /api/notes?userName=UserName - Fetch user notes
router.get("/", getUserNotes);

// POST /api/notes - Create new note
router.post("/", createNote);

// PUT /api/notes/:id - Update existing note
router.put("/:id", updateNote);

// DELETE /api/notes/:id - Delete note
router.delete("/:id", deleteNote);

export default router;