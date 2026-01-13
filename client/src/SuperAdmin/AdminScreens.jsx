import React, { useEffect, useState } from "react";
import axios from "axios";
import { Monitor, Speaker, Video, Users, MapPin } from "lucide-react";
import AdminSidebar from "../Components/AdminSidebar";
import AdminNavbar from "../Components/Navbar";

axios.defaults.withCredentials = true;

export default function AdminScreens() {
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScreens();
  }, []);

  async function loadScreens() {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://bookmyshow-backend-mzd2.onrender.com/api/admin/screens"
      );
      setScreens(res.data.screens || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // 🔹 Group screens by theatre
  const grouped = screens.reduce((acc, screen) => {
    const theatre = screen.theatreId;
    const key = theatre?._id || "unknown";

    if (!acc[key]) {
      acc[key] = {
        name: theatre?.name || "Unknown Theatre",
        city: theatre?.city || "",
        area: theatre?.area || "",
        screens: [],
      };
    }

    acc[key].screens.push(screen);
    return acc;
  }, {});

  function statusBadge(status = "active") {
    const map = {
      active: "bg-green-100 text-green-700",
      blocked: "bg-red-100 text-red-600",
    };

    return (
      <span
        className={`text-xs px-2 py-1 rounded font-medium ${
          map[status] || "bg-gray-100 text-gray-600"
        }`}
      >
        {status.toUpperCase()}
      </span>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminNavbar />

        <div className="p-6 max-w-7xl mx-auto w-full">
          <h2 className="text-2xl font-bold mb-6">Screen Management</h2>

          {/* LOADING */}
          {loading && (
            <div className="bg-white p-6 rounded shadow text-center text-gray-500">
              Loading screens...
            </div>
          )}

          {/* EMPTY */}
          {!loading && screens.length === 0 && (
            <div className="bg-white p-6 rounded shadow text-center text-gray-500">
              No screens found
            </div>
          )}

          {/* THEATRES */}
          {!loading &&
            Object.values(grouped).map((theatre) => (
              <div key={theatre.name} className="mb-10">
                {/* THEATRE HEADER */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {theatre.name}
                  </h3>

                  {(theatre.city || theatre.area) && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <MapPin size={12} />
                      {theatre.area
                        ? `${theatre.area}, ${theatre.city}`
                        : theatre.city}
                    </div>
                  )}
                </div>

                {/* SCREENS */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {theatre.screens.map((s) => {
                    const isBlocked = s.status === "blocked";

                    return (
                      <div
                        key={s._id}
                        className={`rounded-lg border transition
                          ${
                            isBlocked
                              ? "bg-gray-50 border-gray-200 opacity-70"
                              : "bg-white border-gray-200 hover:shadow"
                          }
                        `}
                      >
                        {/* HEADER */}
                        <div className="p-4 border-b flex justify-between items-center">
                          <div>
                            <h4 className="text-sm font-medium text-gray-800">
                              {s.name}
                            </h4>
                            <div className="mt-1">{statusBadge(s.status)}</div>
                          </div>

                          <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
                            {s.screenType}
                          </span>
                        </div>

                        {/* BODY */}
                        <div className="p-4 space-y-2 text-sm text-gray-700">
                          <div className="flex gap-2 items-center">
                            <Users size={14} />
                            Total seats: {s.totalSeats}
                          </div>

                          <div className="flex gap-2 items-center">
                            <Monitor size={14} />
                            Layout: {s.rows} × {s.seatsPerRow}
                          </div>

                          <div className="flex gap-2 items-center">
                            <Video size={14} />
                            Projector: {s.projectorType}
                          </div>

                          <div className="flex gap-2 items-center">
                            <Speaker size={14} />
                            Sound: {s.soundSystem}
                          </div>
                        </div>

                        {/* FOOTER */}
                        <div className="p-4 border-t text-xs text-gray-500">
                          Read-only configuration
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
