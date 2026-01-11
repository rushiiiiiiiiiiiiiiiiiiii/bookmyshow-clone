import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MapPin, Monitor, Calendar, Pencil, Trash2, X } from "lucide-react";
import SellerNavbar from "../Components/Navbar";
import SellerSidebar from "../Components/SellerSidebar";

axios.defaults.withCredentials = true;

export default function TheaterList() {
  const navigate = useNavigate();

  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---- DELETE MODAL ----
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedTheatre, setSelectedTheatre] = useState(null);

  // ---- EDIT MODAL ----
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    city: "",
    pincode: "",
    address: "",
    contactPhone: "",
    brand: "",
    theatreType: "",
  });

  useEffect(() => {
    loadTheatres();
  }, []);

  async function loadTheatres() {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/seller/theatres");
      if (res.data.ok) setTheatres(res.data.theatres);
      else setError("Failed to load theatres");
    } catch (err) {
      console.error(err);
      setError("Server error while fetching theatres");
    } finally {
      setLoading(false);
    }
  }

  // ---------- DELETE ----------
  function openDeleteModal(theatre) {
    setSelectedTheatre(theatre);
    setConfirmModal(true);
  }

  async function confirmDelete() {
    try {
      await axios.delete(
        `http://localhost:8000/api/seller/theatre/${selectedTheatre._id}`
      );
      setConfirmModal(false);
      setSelectedTheatre(null);
      loadTheatres();
    } catch (err) {
      console.error(err);
      alert("Cannot delete theatre. It may contain screens or shows.");
    }
  }

  // ---------- EDIT ----------
  function openEditModal(theatre) {
    setSelectedTheatre(theatre);
    setEditData({
      name: theatre.name,
      city: theatre.city,
      pincode: theatre.pincode || "",
      address: theatre.address || "",
      contactPhone: theatre.contactPhone || "",
      brand: theatre.brand || "",
      theatreType: theatre.theatreType || "",
    });
    setEditModal(true);
  }

  function handleChange(e) {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  }

  async function saveEdit() {
    if (!editData.name || !editData.city || !editData.contactPhone) {
      alert("Name, City & Phone are required");
      return;
    }

    try {
      await axios.put(
        `http://localhost:8000/api/seller/theatre/${selectedTheatre._id}`,
        editData
      );

      setEditModal(false);
      setSelectedTheatre(null);
      loadTheatres();
    } catch (err) {
      console.error(err);
      alert("Failed to update theatre");
    }
  }

  function badge(status) {
    const map = {
      approved: "bg-green-100 text-green-700",
      blocked: "bg-red-100 text-red-600",
      pending: "bg-yellow-100 text-yellow-700",
    };

    return (
      <span
        className={`text-xs px-2 py-1 rounded ${map[status] || "bg-gray-100"}`}
      >
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">My Theatres</h2>
            <button
              onClick={() => navigate("/seller/add-theatre")}
              className="bg-[#f84464] text-white px-5 py-2 rounded-lg shadow"
            >
              + Add Theatre
            </button>
          </div>

          {loading && <p>Loading theatres...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && theatres.length === 0 && !error && (
            <div className="bg-white p-8 rounded shadow text-center">
              No theatres found.
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {theatres.map((t) => (
              <div key={t._id} className="bg-white rounded-xl shadow ">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-semibold">{t.name}</h3>
                  {badge(t.status)}
                </div>

                <div className="p-4">
                  <p className="text-sm text-gray-500 flex gap-1 items-center">
                    <MapPin size={14} /> {t.city}{" "}
                    {t.pincode && `· ${t.pincode}`}
                  </p>

                  <div className="mt-3 space-y-1 text-xs text-gray-600">
                    {t.brand && <p>Brand: {t.brand}</p>}
                    {t.theatreType && <p>Type: {t.theatreType}</p>}
                    {t.contactPhone && <p>Phone: {t.contactPhone}</p>}
                  </div>

                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => navigate(`/seller/screens/${t._id}`)}
                      className="w-full border border-gray-300 rounded p-2 flex gap-2 justify-center"
                    >
                      <Monitor size={16} className="mt-1" /> Manage Screens
                    </button>

                    <button
                      onClick={() => navigate(`/seller/shows/${t._id}`)}
                      className="w-full border border-gray-300 rounded p-2 flex gap-2 justify-center"
                    >
                      <Calendar size={16} className="mt-1" /> Shows
                    </button>
                  </div>

                  {/* ACTION ICONS */}
                  <div className="flex justify-end gap-4 mt-4">
                    <button
                      onClick={() => openEditModal(t)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => openDeleteModal(t)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* ---------- DELETE MODAL ---------- */}
      {confirmModal && selectedTheatre && (
        <Modal title="Delete Theatre?" close={() => setConfirmModal(false)}>
          <p>
            You are deleting <b>{selectedTheatre.name}</b>
          </p>
          <ModalActions
            cancel={() => setConfirmModal(false)}
            confirm={confirmDelete}
            confirmLabel="Delete"
          />
        </Modal>
      )}

      {/* ---------- EDIT MODAL ---------- */}
      {editModal && (
        <Modal title="Edit Theatre" close={() => setEditModal(false)}>
          {[
            "name",
            "city",
            "pincode",
            "address",
            "contactPhone",
            "brand",
            "theatreType",
          ].map((f) => (
            <input
              key={f}
              name={f}
              value={editData[f]}
              onChange={handleChange}
              placeholder={f}
              className="border p-2 w-full mb-2 rounded"
            />
          ))}

          <ModalActions
            cancel={() => setEditModal(false)}
            confirm={saveEdit}
            confirmLabel="Save Changes"
          />
        </Modal>
      )}
    </div>
  );
}

/* -------- MINI MODAL COMPONENT -------- */
function Modal({ title, children, close }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow">
        <div className="flex justify-between mb-3">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={close}>
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ModalActions({ cancel, confirm, confirmLabel }) {
  return (
    <div className="flex justify-end gap-3 mt-4">
      <button onClick={cancel} className="border px-4 py-2 rounded">
        Cancel
      </button>
      <button
        onClick={confirm}
        className="bg-[#f84464] text-white px-4 py-2 rounded"
      >
        {confirmLabel}
      </button>
    </div>
  );
}
