import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import axios from "axios";
import { Calendar, MapPin, Ticket, CheckCircle, XCircle } from "lucide-react";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get(
          "https://bookmyshow-backend-mzd2.onrender.com/api/my-bookings",
          {
            withCredentials: true,
          }
        );
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading)
    return <div className="p-10 text-center">Loading your bookings...</div>;

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

        {bookings.length === 0 && (
          <div className="bg-white rounded-lg p-6 text-center text-gray-500">
            You have no bookings yet 🍿
          </div>
        )}

        <div className="space-y-4">
          {bookings.map((b, i) => (
            <BookingCard key={i} booking={b} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================
     BOOKING CARD
========================= */

function BookingCard({ booking }) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
      <div className="flex">
        {/* POSTER */}
        <img
          src={booking.poster}
          alt={booking.movie}
          className="w-24 object-cover"
        />

        {/* DETAILS */}
        <div className="flex-1 p-4">
          {/* TITLE */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-bold text-lg">{booking.movie}</h2>
              <p className="text-xs text-gray-500">Booking ID: {booking._id}</p>
            </div>

            <StatusBadge status={booking.status} />
          </div>

          {/* TIME & LOCATION */}
          <div className="mt-3 text-sm text-gray-600 space-y-1">
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              {new Date(booking.date).toDateString()} · {booking.time}
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={14} />
              {booking.theatre?.name} · {booking.screen?.name}
            </div>
          </div>

          {/* SEATS */}
          <div className="mt-3 text-sm">
            🎟 Seats: <strong>{booking.seats.join(", ")}</strong>
          </div>

          {/* PRICE */}
          <div className="mt-2 font-bold text-sm">
            Amount Paid ₹ {booking.amount}
          </div>
        </div>
      </div>

      {/* FOOTER ACTION */}
      <div className="border-t px-4 py-2 text-right">
        <button className="text-[#f84464] text-sm font-semibold hover:underline">
          View Ticket
        </button>
      </div>
    </div>
  );
}

/* =========================
     STATUS BADGE
========================= */

function StatusBadge({ status }) {
  if (status === "cancelled") {
    return (
      <span className="flex items-center gap-1 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
        <XCircle size={14} /> Cancelled
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1 bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
      <CheckCircle size={14} /> Confirmed
    </span>
  );
}
