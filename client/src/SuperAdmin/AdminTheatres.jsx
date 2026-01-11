import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapPin, Phone, User } from "lucide-react";
import AdminSidebar from "../Components/AdminSidebar";
import AdminNavbar from "../Components/Navbar";

axios.defaults.withCredentials = true;

export default function AdminTheatres() {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [action, setAction] = useState("blocked");

  useEffect(() => {
    loadTheatres();
  }, []);

  async function loadTheatres() {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://bookmyshow-backend-mzd2.onrender.com/api/admin/theatres"
      );
      setTheatres(res.data.theatres || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function openModal(theatre, nextAction) {
    setSelectedTheatre(theatre);
    setAction(nextAction);
    setModalOpen(true);
  }

  async function confirmAction() {
    try {
      await axios.put(
        `https://bookmyshow-backend-mzd2.onrender.com/api/admin/theatre/${selectedTheatre._id}/status`,
        { status: action }
      );
      setModalOpen(false);
      setSelectedTheatre(null);
      loadTheatres();
    } catch {
      alert("Failed to update theatre");
    }
  }

  function statusBadge(status = "active") {
    const map = {
      active: "bg-green-100 text-green-700",
      blocked: "bg-red-100 text-red-600",
    };

    return (
      <span className={`px-2 py-1 text-xs rounded ${map[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  }

  // Group theatres by seller
  const groupedBySeller = theatres.reduce((acc, t) => {
    const sellerName = t.sellerId?.name || "Unknown Seller";
    if (!acc[sellerName]) acc[sellerName] = [];
    acc[sellerName].push(t);
    return acc;
  }, {});

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminNavbar />

        <div className="p-6 max-w-7xl mx-auto w-full">
          <h2 className="text-2xl font-bold mb-6">Theatre Management</h2>

          {loading && (
            <div className="bg-white p-6 rounded shadow text-center">
              Loading theatres...
            </div>
          )}

          {!loading &&
            Object.keys(groupedBySeller).map((seller) => (
              <div key={seller} className="mb-10">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <User size={16} />
                  {seller}
                </h3>

                <div className="flex gap-6 overflow-x-auto pb-2">
                  {groupedBySeller[seller].map((t) => {
                    const isBlocked = t.status === "blocked";

                    return (
                      <div
                        key={t._id}
                        className={`min-w-[280px] rounded-xl shadow transition
                          ${
                            isBlocked
                              ? "bg-gray-50 opacity-70"
                              : "bg-white hover:shadow-md"
                          }
                        `}
                      >
                        <div className="p-4 border-b flex justify-between">
                          <div>
                            <h4 className="font-semibold">{t.name}</h4>
                            <p className="text-xs text-gray-500">
                              {t.brand || "Independent Cinema"}
                            </p>
                          </div>
                          {statusBadge(t.status)}
                        </div>

                        <div className="p-4 space-y-2 text-sm">
                          <div className="flex gap-2 items-center">
                            <MapPin size={14} />
                            {t.city}
                          </div>

                          {t.contactPhone && (
                            <div className="flex gap-2 items-center">
                              <Phone size={14} />
                              {t.contactPhone}
                            </div>
                          )}
                        </div>

                        <div className="p-4 border-t">
                          {isBlocked ? (
                            <button
                              onClick={() => openModal(t, "approved")}
                              className="w-full text-xs py-2 rounded bg-green-600 text-white hover:bg-green-700"
                            >
                              Unblock Theatre
                            </button>
                          ) : (
                            <button
                              onClick={() => openModal(t, "blocked")}
                              className="w-full text-xs py-2 rounded bg-red-600 text-white hover:bg-red-700"
                            >
                              Block Theatre
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[380px]">
            <h3 className="font-semibold text-lg mb-2">
              {action === "blocked" ? "Block Theatre?" : "Unblock Theatre?"}
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              {action === "blocked"
                ? "All screens will be blocked and shows disabled."
                : "Screens will be re-enabled. Shows will remain inactive."}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm rounded bg-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={confirmAction}
                className={`px-4 py-2 text-sm rounded text-white
                  ${
                    action === "blocked"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  }
                `}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
