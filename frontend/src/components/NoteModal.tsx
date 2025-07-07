
import React, { useState } from "react";
import axios from "axios";
import type { Note } from "../pages/Home/Home";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import Input from "./Input";
import Button from "./Button";

interface Props {
  mode: "edit" | "create";
  note?: Note;
  onClose: () => void;
  onSubmit: (note: Note) => void;
}

const NoteModal: React.FC<Props> = ({ mode, note, onClose, onSubmit }) => {

  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [completed, setCompleted] = useState(note?.completed || false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    try {
      setLoading(true);
      if (mode === "edit" && note) {
        const res = await axios.put(
          `${import.meta.env.VITE_BASE_URL}/notes/${note._id}`,
          { title, content, completed },
          { withCredentials: true }
        );
        if (res.data.success === false) {
          toast.error("Note update failed");
          return;
        }
        toast.success("Note Updated Successfully");
        onSubmit(res.data.note);
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/notes/new`,
          { title, content, completed },
          { withCredentials: true }
        );
        if (res.data.success === false) {
          toast.error("Note creation failed");
          return;
        }
        toast.success("Note Created Successfully");
        onSubmit(res.data.note);
      }
      onClose();
    } catch (err) {
      console.error("Submit failed", err);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-[90%] max-w-md p-6 rounded-xl shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 cursor-pointer"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">
          {mode === "edit" ? "Edit Note" : "Create Note"}
        </h2>

        <Input
          label="Title"
          type="text"
          placeholder="Enter Title"
          disabled={loading}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Input
          label="Content"
          type="text"
          placeholder="Enter Content"
          disabled={loading}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={completed}
            onChange={() => setCompleted((prev) => !prev)}
            id="completed"
            className="mr-2"
          />
          <label htmlFor="completed" className="text-sm">
            Mark as completed
          </label>
        </div>

        <Button onClick={handleSubmit} disabled={loading} fullWidth>
          {loading ? (mode === "edit" ? "Saving..." : "Creating...") : (mode === "edit" ? "Save Changes" : "Create Note")}
        </Button>
      </div>
    </div>
  );
};

export default NoteModal;
