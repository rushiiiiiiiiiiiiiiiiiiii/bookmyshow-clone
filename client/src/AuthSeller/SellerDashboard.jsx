import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Monitor,
  Calendar,
  TrendingUp,
  PlusCircle,
  IndianRupee,
} from "lucide-react";
import SellerNavbar from "../Components/Navbar";
import SellerSidebar from "../Components/SellerSidebar";

axios.defaults.withCredentials = true;

export default function SellerDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    theatres: 0,
    screens: 0,
    shows: 0,
    bookings: 0,
    earnings: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const [theatresRes, screensRes, showsRes, bookingsRes] =
        await Promise.all([
          axios.get("http://localhost:8000/api/seller/theatres"),
          axios.get("http://localhost:8000/api/seller/screens"),
          axios.get("http://localhost:8000/api/seller/shows"),
          axios.get("http://localhost:8000/api/seller/bookings"),
        ]);

      const bookings = bookingsRes.data.bookings || [];

      const bookingsCount = bookings.length;

      const totalEarnings = bookings
        .filter(
          (b) => b.paymentStatus === "success" && b.status === "confirmed"
        )
        .reduce((sum, b) => sum + (b.amount || 0), 0);

      setStats({
        theatres: theatresRes.data.theatres?.length || 0,
        screens: screensRes.data.screens?.length || 0,
        shows: showsRes.data.shows?.length || 0,
        bookings: bookingsCount,
        earnings: totalEarnings,
      });
    } catch (err) {
      console.error("Dashboard stats error:", err);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <SellerSidebar />

      <div className="flex-1 flex flex-col">
        <SellerNavbar />

        <main className="p-6 max-w-7xl mx-auto w-full">
          <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

          {/* STATS GRID */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <StatCard
              title="Theatres"
              value={stats.theatres}
              icon={<Building2 />}
            />
            <StatCard
              title="Screens"
              value={stats.screens}
              icon={<Monitor />}
            />
            <StatCard title="Shows" value={stats.shows} icon={<Calendar />} />
            <StatCard
              title="Bookings"
              value={stats.bookings}
              icon={<TrendingUp />}
            />
            <StatCard
              title="Total Earnings"
              value={`₹ ${stats.earnings.toLocaleString("en-IN")}`}
              icon={<IndianRupee />}
            />
          </div>

          {/* QUICK ACTIONS */}
          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ActionCard
                title="Add Theatre"
                onClick={() => navigate("/seller/add-theatre")}
                icon={<PlusCircle />}
              />
              <ActionCard
                title="View Theatres"
                onClick={() => navigate("/seller/theatres")}
                icon={<Building2 />}
              />
              <ActionCard
                title="Manage Screens"
                onClick={() => navigate("/seller/screens")}
                icon={<Monitor />}
              />
              <ActionCard
                title="Manage Shows"
                onClick={() => navigate("/seller/shows")}
                icon={<Calendar />}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ---------------- UI COMPONENTS ---------------- */

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-5 rounded-lg shadow flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>

      <div className="text-[#f84464]">{icon}</div>
    </div>
  );
}

function ActionCard({ title, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white p-4 rounded-lg shadow hover:shadow-md flex flex-col items-center justify-center group transition"
    >
      <div className="text-[#f84464] mb-2">{icon}</div>
      <p className="font-medium group-hover:text-[#f84464]">{title}</p>
    </button>
  );
}
