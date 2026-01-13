import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../Components/AdminSidebar";
import AdminNavbar from "../Components/Navbar";

axios.defaults.withCredentials = true;

export default function AdminSellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [nextStatus, setNextStatus] = useState("");

  useEffect(() => {
    loadSellers();
  }, []);

  async function loadSellers() {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://bookmyshow-backend-mzd2.onrender.com/api/admin/sellers"
      );
      setSellers(res.data.sellers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function openModal(seller, status) {
    setSelectedSeller(seller);
    setNextStatus(status);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedSeller(null);
    setNextStatus("");
  }

  async function confirmStatusChange() {
    try {
      await axios.put(
        `https://bookmyshow-backend-mzd2.onrender.com/api/admin/seller/${selectedSeller._id}/status`,
        { status: nextStatus }
      );
      closeModal();
      loadSellers();
    } catch (err) {
      console.error(err);
      closeModal();
    }
  }

  function statusBadge(status = "approved") {
    const map = {
      approved: "bg-green-100 text-green-700",
      blocked: "bg-red-100 text-red-600",
    };

    return (
      <span className={`px-2 py-1 text-xs rounded ${map[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        <AdminNavbar />

        <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
          <h2 className="text-xl md:text-2xl font-bold mb-6">
            Sellers Management
          </h2>

          {/* LOADING */}
          {loading && (
            <div className="bg-white p-6 rounded shadow text-center text-gray-500">
              Loading sellers...
            </div>
          )}

          {/* EMPTY */}
          {!loading && sellers.length === 0 && (
            <div className="bg-white p-6 rounded shadow text-center text-gray-500">
              No sellers found
            </div>
          )}

          {/* DESKTOP TABLE */}
          {!loading && sellers.length > 0 && (
            <>
              {/* DESKTOP VIEW */}
              <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 text-left">
                    <tr>
                      <th className="p-4">Business</th>
                      <th className="p-4">Owner</th>
                      <th className="p-4">City</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {sellers.map((s) => (
                      <tr key={s._id} className="border-t hover:bg-gray-50">
                        <td className="p-4">
                          <div className="font-semibold">
                            {s.businessName || "-"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {s.businessType}
                          </div>
                        </td>

                        <td className="p-4">
                          <div>{s.name}</div>
                          <div className="text-xs text-gray-500">{s.email}</div>
                        </td>

                        <td className="p-4">
                          {s.businessCity}
                          <div className="text-xs text-gray-400">
                            {s.businessPincode}
                          </div>
                        </td>

                        <td className="p-4">{s.phone || "-"}</td>

                        <td className="p-4">
                          {statusBadge(s.status || "approved")}
                        </td>

                        <td className="p-4 text-center">
                          {s.status === "blocked" ? (
                            <button
                              onClick={() => openModal(s, "approved")}
                              className="px-4 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700"
                            >
                              Unblock
                            </button>
                          ) : (
                            <button
                              onClick={() => openModal(s, "blocked")}
                              className="px-4 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
                            >
                              Block
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS */}
              <div className="md:hidden space-y-4">
                {sellers.map((s) => (
                  <div key={s._id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">{s.businessName || "-"}</p>
                        <p className="text-xs text-gray-500">
                          {s.businessType}
                        </p>
                      </div>
                      {statusBadge(s.status)}
                    </div>

                    <p className="text-sm">
                      <span className="font-medium">Owner:</span> {s.name}
                    </p>
                    <p className="text-sm text-gray-500">{s.email}</p>

                    <p className="text-sm mt-1">
                      <span className="font-medium">City:</span>{" "}
                      {s.businessCity} ({s.businessPincode})
                    </p>

                    <p className="text-sm mt-1">
                      <span className="font-medium">Contact:</span>{" "}
                      {s.phone || "-"}
                    </p>

                    <div className="mt-3">
                      {s.status === "blocked" ? (
                        <button
                          onClick={() => openModal(s, "approved")}
                          className="w-full py-2 text-sm rounded bg-green-600 text-white"
                        >
                          Unblock
                        </button>
                      ) : (
                        <button
                          onClick={() => openModal(s, "blocked")}
                          className="w-full py-2 text-sm rounded bg-red-600 text-white"
                        >
                          Block
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Confirm Action</h3>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to{" "}
              <span className="font-semibold">
                {nextStatus === "blocked" ? "BLOCK" : "UNBLOCK"}
              </span>{" "}
              seller{" "}
              <span className="font-semibold">
                {selectedSeller?.businessName}
              </span>
              ?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm rounded border"
              >
                Cancel
              </button>

              <button
                onClick={confirmStatusChange}
                className={`px-4 py-2 text-sm rounded text-white ${
                  nextStatus === "blocked" ? "bg-red-600" : "bg-green-600"
                }`}
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
