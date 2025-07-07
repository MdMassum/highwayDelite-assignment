import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "../../assets/icon.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  signOutFailure,
  signOutStart,
  signOutSuccess,
} from "../../redux/authSlice";
import toast from "react-hot-toast";
import NoteCard from "../../components/NoteCard";
import NoteModal from "../../components/NoteModal";
import Button from "../../components/Button";

export interface Note {
  _id: string;
  title: string;
  content: string;
  completed: boolean;
}

const Home: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const user = useSelector((state: any) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/notes?page=${page}&limit=5`,
        { withCredentials: true }
      );

      setNotes(res.data.notes);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch notes", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      dispatch(signOutStart());
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
      if (response.data.success === false) {
        dispatch(signOutFailure(response.data.message));
        toast.error(response.data.message);
        return;
      }
      dispatch(signOutSuccess(response.data.user));
      toast.success("Logged out successfully");
      navigate("/");
    } catch (err: any) {
      console.error("Logout Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "An error occurred");
      dispatch(signOutFailure(err.response?.data?.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [page]);

  return (
    <div className="min-h-screen px-4 py-6 md:px-20 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <img src={logo} alt="logo" className="h-6 w-6" />
          <h2 className="text-xl font-semibold">Dashboard</h2>
        </div>
        <button
          onClick={handleSignOut}
          className="text-blue-600 hover:underline cursor-pointer"
        >
          Sign Out
        </button>
      </div>

      {/* Welcome Card */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">
          Welcome, {user?.name ?? "Loading..."}!
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          Email: {user?.email ?? "xxxxx@xxxx.com"}
        </p>
        <p className="text-sm text-gray-600">
          Date of Birth: {user?.dob.split("T")[0] ?? "00-00-00"}
        </p>
      </div>

      {/* Create Note */}
      <div className="mb-6">
        <Button onClick={() => setShowModal(true)}>Create Note</Button>
      </div>

      {showModal && (
        <NoteModal
          mode="create"
          onClose={() => setShowModal(false)}
          onSubmit={(newNote) => {
            setNotes((prev) => [newNote, ...prev]);
            setShowModal(false);
          }}
        />
      )}

      {/* Notes List */}
      <div>
        <h4 className="text-md font-semibold mb-3">Notes</h4>
        {loading ? (
          <p className="text-gray-500">Loading notes...</p>
        ) : notes.length === 0 ? (
          <p className="text-gray-500">No notes found.</p>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onDelete={(_id) =>
                  setNotes((prev) => prev.filter((n) => n._id !== _id))
                }
                onUpdate={(updatedNote) =>
                  setNotes((prev) =>
                    prev.map((n) =>
                      n._id === updatedNote._id ? updatedNote : n
                    )
                  )
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex justify-center gap-3 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm font-medium text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
