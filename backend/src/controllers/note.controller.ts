import { NextFunction, Request, Response } from "express";
import Note from "../models/notes.model";
import ErrorHandler from "../utils/errorHandler";
import { createNoteSchema, updateNoteSchema, noteIdParamSchema } from "../validators/note.schema";

// Create a note
export const createNote = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const userId = req.userId;
    const parsed = createNoteSchema.parse(req.body);
    const note = await Note.create({ ...parsed, user: userId });

    res.status(201).json({ success: true, note });

  } catch (err: any) {

    console.error("Create Note Error:", err);
    if (err.name === "ZodError") {
      return next(new ErrorHandler(err.errors[0].message, 400));
    }
    return next(new ErrorHandler(err.message || "Internal Server Error", 500));
  }
};

// Get all notes for logged-in user with pagination
export const getNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [notes, total] = await Promise.all([
      Note.find({ user: userId }).sort({ updatedAt: -1 }).skip(skip).limit(limit),
      Note.countDocuments({ user: userId }),
    ]);

    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      notes,
    });

  } catch (err: any) {
    console.error("Get Notes Error:", err);
    return next(new ErrorHandler(err.message || "Internal Server Error", 500));
  }
};

// Get a single note
export const getNoteById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    noteIdParamSchema.parse(req.params);

    const note = await Note.findOne({ _id: req.params.id, user: req.userId });

    if (!note) {
      return next(new ErrorHandler("Note not found", 404));
    }

    res.status(200).json({ success: true, note });

  } catch (err: any) {
    console.error("Get Note By ID Error:", err);
    if (err.name === "ZodError") {
      return next(new ErrorHandler(err.errors[0].message, 400));
    }
    return next(new ErrorHandler(err.message || "Internal Server Error", 500));
  }
};

// Update a note
export const updateNote = async (req: Request, res: Response, next: NextFunction) => {
  try {

    noteIdParamSchema.parse(req.params);
    const updates = updateNoteSchema.parse(req.body);

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      updates,
      { new: true }
    );

    if (!note) {
      return next(new ErrorHandler("Note not found", 404));
    }

    res.status(200).json({ success: true, note });

  } catch (err: any) {

    console.error("Update Note Error:", err);
    if (err.name === "ZodError") {
      return next(new ErrorHandler(err.errors[0].message, 400));
    }
    return next(new ErrorHandler(err.message || "Internal Server Error", 500));
  }
};

// Delete a note
export const deleteNote = async (req: Request, res: Response, next: NextFunction) => {
  try {

    noteIdParamSchema.parse(req.params);
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.userId });

    if (!note) {
      return next(new ErrorHandler("Note not found", 404));
    }

    res.status(200).json({ success: true, message: "Note deleted successfully" });

  } catch (err: any) {
    
    console.error("Delete Note Error:", err);
    if (err.name === "ZodError") {
      return next(new ErrorHandler(err.errors[0].message, 400));
    }
    return next(new ErrorHandler(err.message || "Internal Server Error", 500));
  }
};
