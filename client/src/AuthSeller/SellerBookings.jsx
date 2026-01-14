import React, { useEffect, useState } from "react";
import axios from "axios";
import SellerNavbar from "../Components/Navbar";
import SellerSidebar from "../Components/SellerSidebar";
import { Calendar, MapPin, Film } from "lucide-react";

axios.defaults.withCredentials = true;

export default function SellerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    try {
      const res = await axios.get("http://localhost:8000/api/seller/bookings");
      if (res.data.ok) setBookings(res.data.bookings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-10">Loading bookings...</div>;

  return (
    <div className="min-h-screen flex bg-gray-100">
      <SellerSidebar />

      <div className="flex-1 flex flex-col">
        <SellerNavbar />

        <div className="max-w-7xl mx-auto p-6 w-full">
          <h2 className="text-2xl font-bold mb-6">All Bookings</h2>

          {bookings.length === 0 && (
            <div className="bg-white p-6 rounded text-gray-500 text-center">
              No bookings yet
            </div>
          )}

          <div className="space-y-4">
            {bookings.map((b, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-lg shadow flex gap-4"
              >
                <img
                  src={b.poster}
                  alt={b.movie}
                  className="w-20 h-28 object-cover rounded"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                />

                <div className="flex-1">
                  <h3 className="font-bold text-lg">{b.movie}</h3>

                  <div className="text-sm text-gray-600 mt-2 space-y-1">
                    <div className="flex gap-2 items-center">
                      <MapPin size={14} />
                      {b.theatre?.name} · {b.screen?.name}
                    </div>

                    <div className="flex gap-2 items-center">
                      <Calendar size={14} />
                      {new Date(b.date).toDateString()} · {b.time}
                    </div>

                    <div className="flex gap-2 items-center">
                      <Film size={14} />
                      Seats: {b.seats.join(", ")}
                    </div>
                  </div>

                  <div className="mt-2 font-bold">₹ {b.amount}</div>
                </div>

                <span className="px-3 py-1 text-xs h-fit rounded-full bg-green-100 text-green-600">
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
