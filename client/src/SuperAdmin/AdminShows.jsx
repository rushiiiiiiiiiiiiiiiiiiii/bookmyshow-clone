import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import AdminSidebar from "../Components/AdminSidebar";
import AdminNavbar from "../Components/Navbar";

axios.defaults.withCredentials = true;

const PAGE_SIZE = 8; // BookMyShow usually shows 8–10 grouped rows

export default function AdminShows() {
  const [groups, setGroups] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const [movieFilter, setMovieFilter] = useState("");
  const [theatreFilter, setTheatreFilter] = useState("");

  const [page, setPage] = useState(1);

  useEffect(() => {
    loadShows();
  }, []);

  async function loadShows() {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://bookmyshow-backend-mzd2.onrender.com/api/admin/shows"
      );

      if (res.data.ok) {
        const grouped = groupShows(res.data.shows);
        setAllGroups(grouped);
        setGroups(grouped);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // 🔹 Group shows BookMyShow-style
  function groupShows(shows) {
    const map = {};

    shows.forEach((s) => {
      const key = [
        s.movie,
        s.theatreId?._id,
        s.screenId?._id,
        s.time,
        s.endTime,
      ].join("|");

      if (!map[key]) {
        map[key] = {
          movie: s.movie,
          language: s.language,
          format: s.format,
          theatre: s.theatreId?.name,
          screen: s.screenId?.name,
          time: `${s.time} - ${s.endTime}`,
          price: s.price,
          dates: [],
          status: s.status,
        };
      }

      map[key].dates.push(s.date);
    });

    return Object.values(map);
  }

  // 🔹 Apply filters (reset page on change)
  useEffect(() => {
    let filtered = allGroups;

    if (movieFilter) {
      filtered = filtered.filter((g) => g.movie === movieFilter);
    }

    if (theatreFilter) {
      filtered = filtered.filter((g) => g.theatre === theatreFilter);
    }

    setGroups(filtered);
    setPage(1);
  }, [movieFilter, theatreFilter, allGroups]);

  // 🔹 Pagination
  const totalPages = Math.ceil(groups.length / PAGE_SIZE);

  const paginatedGroups = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return groups.slice(start, start + PAGE_SIZE);
  }, [groups, page]);

  function badge(status) {
    const map = {
      active: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-600",
      inactive: "bg-gray-200 text-gray-600",
    };

    return (
      <span className={`text-xs px-2 py-1 rounded ${map[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  }

  // Unique filter values
  const movies = [...new Set(allGroups.map((g) => g.movie))];
  const theatres = [...new Set(allGroups.map((g) => g.theatre))];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminNavbar />

        <main className="p-6 max-w-7xl mx-auto w-full">
          <h2 className="text-2xl font-bold mb-4">Show Management</h2>

          {/* FILTERS */}
          <div className="bg-white p-4 rounded shadow mb-6 flex flex-wrap gap-4">
            <select
              value={movieFilter}
              onChange={(e) => setMovieFilter(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="">All Movies</option>
              {movies.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <select
              value={theatreFilter}
              onChange={(e) => setTheatreFilter(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="">All Theatres</option>
              {theatres.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {loading && (
            <div className="bg-white p-6 rounded shadow text-center">
              Loading shows...
            </div>
          )}

          {!loading && groups.length === 0 && (
            <div className="bg-white p-6 rounded shadow text-center">
              No shows found
            </div>
          )}

          {!loading && paginatedGroups.length > 0 && (
            <>
              <div className="bg-white rounded shadow overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3">Movie</th>
                      <th className="p-3">Theatre</th>
                      <th className="p-3">Screen</th>
                      <th className="p-3">Time</th>
                      <th className="p-3">Dates</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedGroups.map((g, i) => (
                      <tr key={i} className="border-t">
                        <td className="p-3 font-medium">
                          {g.movie}
                          <div className="text-xs text-gray-500">
                            {g.language} · {g.format}
                          </div>
                        </td>

                        <td className="p-3">{g.theatre}</td>
                        <td className="p-3">{g.screen}</td>
                        <td className="p-3">{g.time}</td>

                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {g.dates.map((d) => (
                              <span
                                key={d}
                                className="text-xs bg-gray-200 px-2 py-1 rounded"
                              >
                                {d}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="p-3 font-medium">₹ {g.price}</td>
                        <td className="p-3">{badge(g.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION FOOTER */}
              <div className="flex justify-between items-center mt-4 text-sm">
                <div className="text-gray-600">
                  Showing {(page - 1) * PAGE_SIZE + 1}–
                  {Math.min(page * PAGE_SIZE, groups.length)} of {groups.length}
                </div>

                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Prev
                  </button>

                  <span className="px-2 py-1">
                    Page {page} of {totalPages}
                  </span>

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
