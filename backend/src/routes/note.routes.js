import { Router } from 'express';
import{ verifyJWT } from '../middlewares/auth.middleware.js';
import {
  getUserNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/note.controllers.js";

const router = Router();

router.use(verifyJWT);

router.get("/", getUserNotes);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
