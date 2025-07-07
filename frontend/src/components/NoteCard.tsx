import axios from "axios";
import { Trash2, Pencil } from "lucide-react";
import React, { useState } from "react";
import type { Note } from "../pages/Home/Home";
import NoteModal from "./NoteModal";

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onUpdate: (note: Note) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onDelete, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    if(window.confirm() === false){
        return;
    }
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/notes/${note._id}`, {
        withCredentials: true,
      });
      onDelete(note._id);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div className="flex-1">
          <h3
            className={`text-base font-semibold ${
              note.completed ? "line-through text-gray-500" : ""
            }`}
          >
            {note.title}
          </h3>
          <p className="text-sm text-gray-700">{note.content}</p>
          {note.completed && (
            <p className="text-xs text-green-600 mt-1 font-medium">Completed</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-600 cursor-pointer"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {showModal && (
        <NoteModal
          mode="edit"
          note={note}
          onClose={() => setShowModal(false)}
          onSubmit={onUpdate}
        />
      )}
    </>
  );
};

export default NoteCard;
