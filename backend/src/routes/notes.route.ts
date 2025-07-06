import { Router } from "express";
import authenticate from "../middleware/auth";
import { createNote, deleteNote, getNoteById, getNotes, updateNote } from "../controllers/note.controller";

const router = Router();

// get all notes of logged in user
router.get("/", authenticate, getNotes);

// create a new note
router.post("/new", authenticate, createNote);

// get note by id
router.get("/:id", authenticate, getNoteById);

// update note by id
router.put("/:id", authenticate, updateNote);

// delete note by id
router.delete("/:id", authenticate, deleteNote);

export default router;
