import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import SellerNavbar from "../Components/Navbar";
import SellerSidebar from "../Components/SellerSidebar";
import { Trash2, X, Pencil } from "lucide-react";

axios.defaults.withCredentials = true;

export default function ShowsList() {
  const { theatreId } = useParams();
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Delete Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedShow, setSelectedShow] = useState(null);

  // ✅ Edit Modal
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    loadShows();
  }, [theatreId]);

  async function loadShows() {
    try {
      setLoading(true);
      const url = theatreId
        ? `https://bookmyshow-backend-mzd2.onrender.com/api/seller/shows/${theatreId}`
        : `https://bookmyshow-backend-mzd2.onrender.com/api/seller/shows`;

      const res = await axios.get(url);

      if (res.data.ok) setShows(res.data.shows);
      else setError("Failed to load shows");
    } catch (err) {
      console.error(err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  }

  // ✅ OPEN DELETE MODAL
  function openCancelModal(show) {
    setSelectedShow(show);
    setShowModal(true);
  }

  // ✅ DELETE CONFIRMED
  async function confirmCancel() {
    await axios.delete(
      `https://bookmyshow-backend-mzd2.onrender.com/api/seller/show/${selectedShow._id}`
    );
    setShowModal(false);
    setSelectedShow(null);
    loadShows();
  }

  // ✅ OPEN EDIT MODAL
  function openEditModal(show) {
    setEditData({ ...show });
    setEditModal(true);
  }

  // ✅ UPDATE CONFIRMED
  async function confirmUpdate() {
    try {
      await axios.put(
        `https://bookmyshow-backend-mzd2.onrender.com/api/seller/show/${editData._id}`,
        {
          movie: editData.movie,
          time: editData.time,
          durationMinutes: editData.durationMinutes,
          price: editData.price,
          status: editData.status,
          language: editData.language,
          format: editData.format,
        }
      );

      setEditModal(false);
      loadShows();
    } catch (err) {
      alert("Update failed. There may be a conflict or invalid time.");
    }
  }

  // ✅ Badge
  function badge(status) {
    const map = {
      active: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-600",
      inactive: "bg-gray-200 text-gray-600",
    };

    return (
      <span className={`text-xs px-2 py-1 rounded ${map[status]}`}>
        {(status || "active").toUpperCase()}
      </span>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <SellerSidebar />

      <div className="flex-1 flex flex-col">
        <SellerNavbar />

        <main className="p-6 max-w-7xl mx-auto w-full">
          <h2 className="text-2xl font-bold mb-6">
            {theatreId ? "Theatre Shows" : "All Shows"}
          </h2>

          {/* LOADING */}
          {loading && (
            <div className="bg-white p-8 rounded shadow text-center">
              <p className="text-gray-400">Loading shows...</p>
            </div>
          )}

          {/* ERROR */}
          {error && !loading && (
            <div className="bg-white p-8 rounded shadow text-center">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {/* EMPTY */}
          {!loading && shows.length === 0 && !error && (
            <div className="bg-white p-8 rounded shadow text-center">
              <p className="text-gray-500">No shows scheduled.</p>
            </div>
          )}

          {/* TABLE */}
          {!loading && shows.length > 0 && (
            <div className="bg-white shadow rounded overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-100">
                  <tr className="text-left">
                    <th className="p-3">Movie</th>
                    <th className="p-3">Lang / Format</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Time</th>
                    <th className="p-3">Theatre</th>
                    <th className="p-3">Screen</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {shows.map((s) => (
                    <tr key={s._id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{s.movie}</td>

                      <td className="p-3">
                        {s.language} / {s.format}
                        {s.isSubtitled && (
                          <span className="ml-1 text-xs text-blue-600">
                            (Sub)
                          </span>
                        )}
                      </td>

                      <td className="p-3">{s.date}</td>

                      <td className="p-3">
                        {s.time}
                        {s.endTime && ` - ${s.endTime}`}
                      </td>

                      <td className="p-3">{s.theatreId?.name}</td>

                      <td className="p-3">{s.screenId?.name}</td>

                      <td className="p-3 font-medium">₹{s.price}</td>

                      <td className="p-3">{badge(s.status)}</td>

                      <td className="p-3 flex justify-center gap-3">
                        {/* EDIT */}
                        <button
                          onClick={() => openEditModal(s)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil size={16} />
                        </button>

                        {/* DELETE */}
                        {s.status !== "cancelled" && (
                          <button
                            onClick={() => openCancelModal(s)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* ✅ DELETE MODAL */}
      {showModal && selectedShow && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between">
              <h3 className="font-semibold">Cancel Show?</h3>
              <button onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>

            <p className="mt-3">{selectedShow.movie}</p>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="border px-4 py-2"
              >
                No
              </button>
              <button
                onClick={confirmCancel}
                className="bg-red-600 text-white px-4 py-2"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ EDIT MODAL */}
      {editModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <div className="flex justify-between">
              <h3 className="font-semibold">Edit Show</h3>
              <button onClick={() => setEditModal(false)}>
                <X size={18} />
              </button>
            </div>

            <input
              className="border p-2 w-full mt-3"
              value={editData.movie || ""}
              onChange={(e) =>
                setEditData({ ...editData, movie: e.target.value })
              }
              placeholder="Movie name"
            />

            <input
              type="time"
              className="border p-2 w-full mt-3"
              value={editData.time || ""}
              onChange={(e) =>
                setEditData({ ...editData, time: e.target.value })
              }
            />

            <input
              type="number"
              className="border p-2 w-full mt-3"
              value={editData.durationMinutes || ""}
              onChange={(e) =>
                setEditData({ ...editData, durationMinutes: e.target.value })
              }
              placeholder="Duration (minutes)"
            />

            <input
              type="number"
              className="border p-2 w-full mt-3"
              value={editData.price || ""}
              onChange={(e) =>
                setEditData({ ...editData, price: e.target.value })
              }
              placeholder="Ticket price"
            />

            <select
              className="border p-2 w-full mt-3"
              value={editData.status || "active"}
              onChange={(e) =>
                setEditData({ ...editData, status: e.target.value })
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

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
