import { Note } from "../models/note.models.js";
import { ApiError } from "../utils/ApiError.js";

// Get all notes of logged-in user
export const getUserNotes = async (req, res) => {
  const notes = await Note.find({ user: req.user._id }).sort({ updatedAt: -1 });
  res.status(200).json({ notes });
};

// Create new note
export const createNote = async (req, res) => {
  const { title, content } = req.body;
  const note = await Note.create({ user: req.user._id, title, content });
  res.status(201).json({ note });
};

// Update note content/title
export const updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const note = await Note.findOneAndUpdate(
    { _id: id, user: req.user._id },
    { title, content },
    { new: true }
  );

  if (!note) throw new ApiError(404, "Note not found");

  res.status(200).json({ note });
};

// Delete a note
export const deleteNote = async (req, res) => {
  const { id } = req.params;
  const deleted = await Note.findOneAndDelete({ _id: id, user: req.user._id });

  if (!deleted) throw new ApiError(404, "Note not found");

  res.status(200).json({ message: "Note deleted" });
};
