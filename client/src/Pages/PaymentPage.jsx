import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import axios from "axios";
import {
  Smartphone,
  CreditCard,
  Wallet,
  Gift,
  Landmark,
  PiggyBank,
} from "lucide-react";

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { show, seats, amount } = location.state || {};
  const [activeMethod, setActiveMethod] = useState("UPI");
  const [loading, setLoading] = useState(false);

  if (!show) {
    return (
      <div className="p-10 text-center">
        <h2 className="font-bold text-xl">Invalid payment session</h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-red-500 text-white px-5 py-2 rounded"
        >
          Go Home
        </button>
      </div>
    );
  }

  const convenienceFee = Math.round(amount * 0.12);
  const finalTotal = amount + convenienceFee;

  // ✅ HANDLE PAYMENT SIMULATION
  async function handlePayment() {
    try {
      setLoading(true);

      const res = await axios.post(
        "https://bookmyshow-backend-mzd2.onrender.com/api/booking",
        {
          showId: show._id,
          seats,
          amount: finalTotal,
        },
        {
          withCredentials: true, // ✅ VERY IMPORTANT
        },
      );

      if (!res.data.booking) {
        alert(res.data.msg || "Booking failed");
        return;
      }

      navigate("/success", {
        state: {
          booking: {
            _id: res.data.booking._id,
            token: res.data.booking.bookingToken,
            movie: show.movie,
            poster: show.poster,
            theatre: show.theatreId.name,
            screen: show.screenId.name,
            date: show.date,
            time: show.time,
            seats,
            amount: finalTotal,
          },
        },
      });
    } catch (err) {
      console.error("PAYMENT ERROR:", err.response?.data || err);

      if (err.response?.status === 401) {
        alert("Please login to continue booking");
        navigate("/login");
      } else {
        alert(err.response?.data?.msg || "Payment failed");
      }
    } finally {
      setLoading(false);
    }
  }
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
    <div className="min-h-screen bg-[#f1f3f6] pb-28 lg:pb-0">
      <Navbar />

      {/* HEADER */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-5 py-3">
          <h1 className="text-lg font-bold">Payments & Order Summary</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-5 py-4 sm:py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT PANEL */}
        <div className="lg:col-span-8 bg-white rounded-lg shadow">
          <div className="px-4 py-3 font-bold">Payment options</div>

          <div className="flex flex-col sm:flex-row">
            <div
              className="w-full sm:w-64 border-b sm:border-b-0 sm:border-r
  flex sm:block overflow-x-auto sm:overflow-visible"
            >
              <SidebarItem
                icon={<PiggyBank size={18} />}
                label="Preferred payments"
                active={activeMethod === "PREFERRED"}
                onClick={() => setActiveMethod("PREFERRED")}
              />
              <SidebarItem
                icon={<Smartphone size={18} />}
                label="Pay by any UPI App"
                active={activeMethod === "UPI"}
                onClick={() => setActiveMethod("UPI")}
              />
              <SidebarItem
                icon={<CreditCard size={18} />}
                label="Debit/Credit Card"
                active={activeMethod === "CARD"}
                onClick={() => setActiveMethod("CARD")}
              />
              <SidebarItem
                icon={<Wallet size={18} />}
                label="Mobile Wallets"
                active={activeMethod === "WALLET"}
                onClick={() => setActiveMethod("WALLET")}
              />
              <SidebarItem
                icon={<Gift size={18} />}
                label="Gift Voucher"
                active={activeMethod === "GIFT"}
                onClick={() => setActiveMethod("GIFT")}
              />
              <SidebarItem
                icon={<Landmark size={18} />}
                label="Net Banking"
                active={activeMethod === "NETBANK"}
                onClick={() => setActiveMethod("NETBANK")}
              />
            </div>

            <div className="flex-1 p-4 sm:p-6">
              <h3 className="font-bold mb-4">Pay using {activeMethod}</h3>
              <p className="text-sm text-gray-500">
                Payment gateway simulation only
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SUMMARY */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-bold">{show.movie}</h2>
            <p className="text-xs text-gray-600 mt-1">
              {new Date(show.date).toDateString()} · {show.time}
            </p>
            <p className="text-sm mt-2">
              Seats: <strong>{seats.join(", ")}</strong>
            </p>

            <div className="mt-4 space-y-2 text-sm">
              <Row title="Tickets" value={`₹${amount}`} />
              <Row title="Convenience Fee" value={`₹${convenienceFee}`} />
            </div>

            <div className="mt-4 font-bold flex justify-between">
              <span>Total</span>
              <span>₹{finalTotal}</span>
            </div>
          </div>

          <div className="lg:static fixed bottom-0 left-0 right-0 bg-white p-4 lg:p-0 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] lg:shadow-none">
            <button
              disabled={loading}
              onClick={handlePayment}
              className="w-full bg-[#f84464] hover:bg-[#e43a57] text-white py-3 rounded-lg font-bold shadow"
            >
              {loading ? "Processing..." : `PROCEED TO PAY ₹ ${finalTotal}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 text-sm cursor-pointer whitespace-nowrap ${
        active
          ? "bg-[#fdecef] font-semibold text-[#f84464]"
          : "hover:bg-gray-100"
      }`}
    >
      {icon} {label}
    </div>
  );
}

function Row({ title, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span>{title}</span>
      <span>{value}</span>
    </div>
  );
}
