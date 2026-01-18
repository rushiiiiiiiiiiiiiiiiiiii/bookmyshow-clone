import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import axios from "axios";
import {
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  X,
  QrCode,
  History,
  Ticket,
} from "lucide-react";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBooking, setActiveBooking] = useState(null);
  const [activeTab, setActiveTab] = useState("recent"); // 'recent' or 'history'

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get(
          "https://bookmyshow-backend-mzd2.onrender.com/api/my-bookings",
          { withCredentials: true },
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

  // --- LOGIC TO SPLIT BOOKINGS ---
  const now = new Date();

  const isExpired = (booking) => {
    // Combine date and time string to create a comparable Date object
    const showDateTime = new Date(
      `${booking.date.split("T")[0]}T${booking.time}`,
    );
    return showDateTime < now || booking.status === "cancelled";
  };

  const recentBookings = bookings.filter((b) => !isExpired(b));
  const historyBookings = bookings.filter((b) => isExpired(b));

  const displayBookings =
    activeTab === "recent" ? recentBookings : historyBookings;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-14 h-14 border-[4px] border-[#f84464]/20 border-t-[#f84464] rounded-full animate-spin"></div>
        </div>
      </>
    );
  }

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-6">My Bookings</h1>

        {/* CLICKABLE TAB SECTIONS */}
        <div className="flex gap-8 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("recent")}
            className={`pb-3 flex items-center gap-2 font-semibold transition-all ${
              activeTab === "recent"
                ? "border-b-2 border-[#f84464] text-[#f84464]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Ticket size={18} /> Active Booking{" "}
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`pb-3 flex items-center gap-2 font-semibold transition-all ${
              activeTab === "history"
                ? "border-b-2 border-[#f84464] text-[#f84464]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <History size={18} /> History
          </button>
        </div>

        {displayBookings.length === 0 && (
          <div className="bg-white rounded-xl p-10 text-center text-gray-500 shadow-sm">
            {activeTab === "recent"
              ? "You have no upcoming shows 🍿"
              : "Your booking history is empty."}
          </div>
        )}

        <div className="space-y-4">
          {displayBookings.map((b) => (
            <BookingCard
              key={b._id}
              booking={b}
              isHistory={activeTab === "history"}
              onView={() => setActiveBooking(b)}
            />
          ))}
        </div>
      </div>

      {/* TICKET MODAL */}
      {activeBooking && (
        <TicketModal
          booking={activeBooking}
          isHistory={isExpired(activeBooking)}
          onClose={() => setActiveBooking(null)}
        />
      )}
    </div>
  );
}

/* =========================
     BOOKING CARD
========================= */

function BookingCard({ booking, onView, isHistory }) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden 
      ${isHistory ? "grayscale opacity-75 border-gray-200" : "border-transparent"}`}
    >
      <div className="flex flex-col sm:flex-row">
        <img
          src={booking.poster}
          alt={booking.movie}
          className="w-full sm:w-28 h-44 sm:h-auto object-cover"
        />

        <div className="flex-1 p-4">
          <div className="flex justify-between items-start gap-3">
            <div className="min-w-0">
              <h2 className="font-bold text-base sm:text-lg truncate">
                {booking.movie}
              </h2>
              <p className="text-[11px] text-gray-500 truncate">
                Booking ID: {booking._id}
              </p>
            </div>

            <StatusBadge status={booking.status} isHistory={isHistory} />
          </div>

          <div className="mt-3 text-sm text-gray-600 space-y-1">
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              {new Date(booking.date).toDateString()} · {booking.time}
            </div>

            <div className="flex items-center gap-2 truncate">
              <MapPin size={14} />
              {booking.theatre?.name} · {booking.screen?.name}
            </div>
          </div>

          <div className="mt-3 text-sm">
            🎟 Seats: <strong>{booking.seats.join(", ")}</strong>
          </div>

          <div className="mt-2 font-bold text-sm">
            Amount Paid ₹ {booking.amount}
          </div>
        </div>
      </div>

      <div className="border-t px-4 py-3 text-right bg-gray-50/50">
        <button
          onClick={onView}
          className={`${isHistory ? "text-gray-600" : "text-[#f84464]"} text-sm font-semibold hover:underline`}
        >
          {isHistory ? "View Summary" : "View Ticket"}
        </button>
      </div>
    </div>
  );
}

/* =========================
     TICKET MODAL
========================= */

function TicketModal({ booking, onClose, isHistory }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4 backdrop-blur-sm">
      <div
        className={`bg-white w-full max-w-md rounded-3xl shadow-2xl relative overflow-hidden transition-all ${isHistory ? "grayscale" : ""}`}
      >
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-white/90 rounded-full p-1 text-gray-700 hover:bg-gray-100"
        >
          <X size={18} />
        </button>

        {/* MOVIE IMAGE */}
        <div className="relative h-52">
          <img
            src={booking.poster}
            alt={booking.movie}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h2 className="text-xl font-bold leading-tight">{booking.movie}</h2>
            <p className="text-xs opacity-90 mt-1">
              {booking.theatre?.name} · {booking.screen?.name}
            </p>
          </div>
        </div>

        {/* TICKET BODY */}
        <div className="p-5 space-y-4">
          <div className="flex justify-between text-sm">
            <div>
              <p className="text-gray-500 text-xs">Date</p>
              <p className="font-semibold">
                {new Date(booking.date).toDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-xs">Time</p>
              <p className="font-semibold">{booking.time}</p>
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <div>
              <p className="text-gray-500 text-xs">Seats</p>
              <p className="font-semibold">{booking.seats.join(", ")}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-xs">Amount</p>
              <p className="font-semibold">₹ {booking.amount}</p>
            </div>
          </div>

          {/* PERFORATION DIVIDER */}
          <div className="relative my-3">
            <div className="border-t border-dashed border-gray-300" />
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-800/20 rounded-full" />
            <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-800/20 rounded-full" />
          </div>

          {/* QR / TOKEN */}
          <div className="text-center">
            {isHistory ? (
              <div className="py-4">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-lg border-2 border-dashed border-gray-300 inline-block px-4 py-1">
                  Expired
                </p>
              </div>
            ) : (
              <>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-xl border bg-gray-50 mx-auto">
                  <QrCode size={44} className="text-gray-700" />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Show this code at entrance
                </p>
                <p className="mt-1 font-mono text-sm font-bold tracking-wide">
                  {booking.bookingToken}
                </p>
              </>
            )}
          </div>

          {/* STATUS */}
          <div className="flex justify-center pt-2">
            <StatusBadge status={booking.status} isHistory={isHistory} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
     STATUS BADGE
========================= */

function StatusBadge({ status, isHistory }) {
  if (status === "cancelled") {
    return (
      <span className="flex items-center gap-1 bg-red-100 text-red-600 text-[10px] font-bold uppercase px-2 py-1 rounded-full shrink-0">
        <XCircle size={12} /> Cancelled
      </span>
    );
  }

  if (isHistory) {
    return (
      <span className="flex items-center gap-1 bg-gray-100 text-gray-500 text-[10px] font-bold uppercase px-2 py-1 rounded-full shrink-0">
        <CheckCircle size={12} /> Completed
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1 bg-green-100 text-green-600 text-[10px] font-bold uppercase px-2 py-1 rounded-full shrink-0">
      <CheckCircle size={12} /> Confirmed
    </span>
  );
}
