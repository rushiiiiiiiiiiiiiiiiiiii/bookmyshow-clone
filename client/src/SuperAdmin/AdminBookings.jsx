import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AdminSidebar from "../Components/AdminSidebar";
import AdminNavbar from "../Components/Navbar";

axios.defaults.withCredentials = true;

const PAGE_SIZE = 10; // BookMyShow usually shows 10–20 rows

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [theatre, setTheatre] = useState("");

  // Pagination
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    try {
      const res = await axios.get(
        "https://bookmyshow-backend-mzd2.onrender.com/api/admin/bookings"
      );
      if (res.data.ok) setBookings(res.data.bookings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // 🎯 Extract unique theatres for filter dropdown
  const theatres = useMemo(() => {
    const map = new Map();
    bookings.forEach((b) => {
      if (b.theatre?._id) {
        map.set(b.theatre._id, b.theatre.name);
      }
    });
    return Array.from(map.entries());
  }, [bookings]);

  // 🎯 Apply filters (BookMyShow-style)
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (theatre && b.theatre?._id !== theatre) return false;

      if (fromDate && b.date < fromDate) return false;
      if (toDate && b.date > toDate) return false;

      return true;
    });
  }, [bookings, theatre, fromDate, toDate]);

  // 🎯 Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / PAGE_SIZE);

  const paginatedBookings = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredBookings.slice(start, start + PAGE_SIZE);
  }, [filteredBookings, page]);

  function statusBadge(status) {
    const map = {
      confirmed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-600",
      refunded: "bg-yellow-100 text-yellow-700",
    };

    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          map[status] || "bg-gray-100 text-gray-600"
        }`}
      >
        {status.toUpperCase()}
      </span>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminNavbar />

        <main className="p-6 max-w-7xl mx-auto w-full">
          <h2 className="text-2xl font-bold mb-4">Bookings (Platform)</h2>

          {/* FILTER BAR (BookMyShow-style) */}
          <div className="bg-white p-4 rounded shadow mb-4 flex flex-wrap gap-4 items-end">
            <div>
              <label className="text-xs text-gray-500">From date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setPage(1);
                  setFromDate(e.target.value);
                }}
                className="block border rounded px-2 py-1 text-sm"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500">To date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setPage(1);
                  setToDate(e.target.value);
                }}
                className="block border rounded px-2 py-1 text-sm"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500">Theatre</label>
              <select
                value={theatre}
                onChange={(e) => {
                  setPage(1);
                  setTheatre(e.target.value);
                }}
                className="block border rounded px-2 py-1 text-sm min-w-[180px]"
              >
                <option value="">All theatres</option>
                {theatres.map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                setFromDate("");
                setToDate("");
                setTheatre("");
                setPage(1);
              }}
              className="text-sm px-3 py-1 border rounded hover:bg-gray-100"
            >
              Reset
            </button>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="bg-white p-6 rounded shadow text-center">
              Loading bookings...
            </div>
          )}

          {/* TABLE */}
          {!loading && paginatedBookings.length > 0 && (
            <div className="bg-white rounded shadow overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Booking ID</th>
                    <th className="p-3 text-left">Movie</th>
                    <th className="p-3 text-left">Theatre</th>
                    <th className="p-3 text-left">Screen</th>
                    <th className="p-3 text-left">Date & Time</th>
                    <th className="p-3 text-left">Seats</th>
                    <th className="p-3 text-left">User</th>
                    <th className="p-3 text-left">Amount</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedBookings.map((b) => (
                    <tr key={b._id} className="border-t hover:bg-gray-50">
                      <td className="p-3 text-xs text-gray-600">
                        {b.bookingToken}
                      </td>
                      <td className="p-3 font-medium">{b.movie}</td>
                      <td className="p-3">{b.theatre?.name}</td>
                      <td className="p-3">{b.screen?.name}</td>
                      <td className="p-3">
                        {b.date} · {b.time}
                      </td>
                      <td className="p-3">{b.seats.length}</td>
                      <td className="p-3 text-xs">
                        {b.user?.name}
                        <div className="text-gray-500">{b.user?.email}</div>
                      </td>
                      <td className="p-3 font-semibold">₹ {b.amount}</td>
                      <td className="p-3">{statusBadge(b.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PAGINATION */}
          {!loading && filteredBookings.length > 0 && (
            <div className="flex justify-between items-center mt-4 text-sm">
              <div className="text-gray-600">
                Showing {(page - 1) * PAGE_SIZE + 1}–
                {Math.min(page * PAGE_SIZE, filteredBookings.length)} of{" "}
                {filteredBookings.length}
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
          )}
        </main>
      </div>
    </div>
  );
}
