import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import SellerNavbar from "../Components/Navbar";
import SellerSidebar from "../Components/SellerSidebar";
import { PlusCircle, Trash2, X, Pencil } from "lucide-react";

axios.defaults.withCredentials = true;

export default function ScreenList() {
  const navigate = useNavigate();
  const { theatreId } = useParams();

  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // DELETE MODAL
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState(null);

  // EDIT MODAL
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    loadScreens();
  }, [theatreId]);

  async function loadScreens() {
    try {
      setLoading(true);
      setError("");

      const url = theatreId
        ? `http://localhost:8000/api/seller/screens/${theatreId}`
        : `http://localhost:8000/api/seller/screens`;

      const res = await axios.get(url);

      if (res.data.ok) {
        setScreens(res.data.screens);
      } else {
        setError("Failed to load screens");
      }
    } catch {
      setError("Server error while loading screens");
    } finally {
      setLoading(false);
    }
  }

  function statusBadge(status) {
    return status === "blocked" ? (
      <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-600">
        BLOCKED
      </span>
    ) : (
      <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
        ACTIVE
      </span>
    );
  }

  // DELETE
  function openDeleteModal(screen) {
    setSelectedScreen(screen);
    setConfirmModal(true);
  }

  async function confirmDelete() {
    await axios.delete(
      `http://localhost:8000/api/seller/screen/${selectedScreen._id}`
    );
    setConfirmModal(false);
    setSelectedScreen(null);
    loadScreens();
  }

  // EDIT
  function openEditModal(screen) {
    setEditData({ ...screen });
    setEditModal(true);
  }

  async function confirmUpdate() {
    await axios.put(
      `http://localhost:8000/api/seller/screen/${editData._id}`,
      editData
    );
    setEditModal(false);
    loadScreens();
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <SellerSidebar />

      <div className="flex-1 flex flex-col">
        <SellerNavbar />

        <main className="p-6 max-w-7xl mx-auto w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {theatreId ? "Theatre Screens" : "All Screens"}
            </h2>

            {theatreId && (
              <button
                onClick={() => navigate(`/seller/add-screen/${theatreId}`)}
                className="bg-[#f84464] hover:bg-[#e43a57] text-white px-5 py-2 rounded-lg flex items-center gap-2"
              >
                <PlusCircle size={18} />
                Add Screen
              </button>
            )}
          </div>

          {loading && <p className="text-gray-500">Loading screens...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && screens.length === 0 && !error && (
            <div className="bg-white p-8 rounded text-center">
              No screens created yet.
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {screens.map((s) => {
              const isBlocked = s.status === "blocked";

              return (
                <div
                  key={s._id}
                  className={`bg-white p-5 rounded-lg shadow ${
                    isBlocked ? "opacity-70" : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{s.name}</h3>
                    {statusBadge(s.status)}
                  </div>

                  <p className="text-sm text-gray-600">
                    Theatre: <b>{s.theatreId?.name}</b>
                  </p>

                  <p className="text-sm text-gray-500">
                    {s.rows} × {s.seatsPerRow} · {s.totalSeats} seats
                  </p>

                  <div className="text-xs mt-2 text-gray-600">
                    <p>Type: {s.screenType}</p>
                    <p>Projector: {s.projectorType}</p>
                    <p>Sound: {s.soundSystem}</p>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <button
                      disabled={isBlocked}
                      onClick={() =>
                        navigate(`/seller/add-show/${s.theatreId?._id}`)
                      }
                      className={`text-sm ${
                        isBlocked
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-[#f84464] hover:underline"
                      }`}
                    >
                      + Add Show
                    </button>

                    <div className="flex gap-2">
                      <button
                        disabled={isBlocked}
                        onClick={() => openEditModal(s)}
                        className={`${
                          isBlocked
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-blue-500 hover:text-blue-700"
                        }`}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        disabled={isBlocked}
                        onClick={() => openDeleteModal(s)}
                        className={`${
                          isBlocked
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-red-500 hover:text-red-700"
                        }`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* DELETE MODAL */}
      {confirmModal && selectedScreen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h3 className="font-semibold text-lg mb-3">Delete Screen?</h3>
            <p className="text-sm">{selectedScreen.name}</p>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setConfirmModal(false)}
                className="border px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded w-full max-w-lg">
            <div className="flex justify-between mb-3">
              <h3 className="font-semibold text-lg">Edit Screen</h3>
              <button onClick={() => setEditModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                className="border p-2 rounded col-span-2"
                value={editData.name || ""}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
              />
              <input
                type="number"
                className="border p-2 rounded"
                value={editData.rows || ""}
                onChange={(e) =>
                  setEditData({ ...editData, rows: e.target.value })
                }
              />
              <input
                type="number"
                className="border p-2 rounded"
                value={editData.seatsPerRow || ""}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    seatsPerRow: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setEditModal(false)}
                className="border px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmUpdate}
                className="bg-[#f84464] text-white px-4 py-2"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
