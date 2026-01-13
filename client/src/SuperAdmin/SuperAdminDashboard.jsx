import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Building2,
  Monitor,
  Calendar,
  Ticket,
  IndianRupee,
} from "lucide-react";

import SellerNavbar from "../Components/Navbar";
import AdminSidebar from "../Components/AdminSidebar";

axios.defaults.withCredentials = true;

const BMS_RED = "#f84464";

export default function SuperAdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    sellers: 0,
    theatres: 0,
    screens: 0,
    shows: 0,
    bookings: 0,
    revenue: 0,
  });

  useEffect(() => {
    loadDashboardStats();
  }, []);

  async function loadDashboardStats() {
    try {
      const [sellersRes, theatresRes, screensRes, showsRes, bookingsRes] =
        await Promise.all([
          axios.get(
            "https://bookmyshow-backend-mzd2.onrender.com/api/admin/sellers"
          ),
          axios.get(
            "https://bookmyshow-backend-mzd2.onrender.com/api/admin/theatres"
          ),
          axios.get(
            "https://bookmyshow-backend-mzd2.onrender.com/api/admin/screens"
          ),
          axios.get(
            "https://bookmyshow-backend-mzd2.onrender.com/api/admin/shows"
          ),
          axios.get(
            "https://bookmyshow-backend-mzd2.onrender.com/api/admin/bookings"
          ),
        ]);

      setStats({
        sellers: sellersRes.data?.sellers?.length || 0,
        theatres: theatresRes.data?.theatres?.length || 0,
        screens: screensRes.data?.screens?.length || 0,
        shows: showsRes.data?.shows?.length || 0,
        bookings: bookingsRes.data?.totalBookings || 0,
        revenue: bookingsRes.data?.totalRevenue || 0,
      });
    } catch (error) {
      console.error("Admin dashboard error:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <SellerNavbar />

        <main className="p-6 max-w-7xl mx-auto w-full">
          {/* HEADER */}
          <h2 className="text-2xl font-bold mb-6">Super Admin Dashboard</h2>

          {/* STATS GRID */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <StatCard title="Sellers" value={stats.sellers} icon={<Users />} />
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
              icon={<Ticket />}
            />
            <StatCard
              title="Revenue"
              value={`₹ ${stats.revenue}`}
              icon={<IndianRupee />}
            />
          </div>

          {/* QUICK ACTIONS */}
          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-4">Quick Management</h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ActionCard
                title="Manage Sellers"
                icon={<Users />}
                onClick={() => navigate("/admin/sellers")}
              />
              <ActionCard
                title="View Theatres"
                icon={<Building2 />}
                onClick={() => navigate("/admin/theatres")}
              />
              <ActionCard
                title="View Screens"
                icon={<Building2 />}
                onClick={() => navigate("/admin/screens")}
              />
              <ActionCard
                title="View Shows"
                icon={<Calendar />}
                onClick={() => navigate("/admin/shows")}
              />
              <ActionCard
                title="View Bookings"
                icon={<Ticket />}
                onClick={() => navigate("/admin/bookings")}
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

      <div className="text-[${BMS_RED}]">{icon}</div>
    </div>
  );
}

function ActionCard({ title, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white p-4 rounded-lg shadow hover:shadow-md transition flex flex-col items-center justify-center group"
    >
      <div className="text-[#f84464] mb-2">{icon}</div>
      <p className="font-medium group-hover:text-[#f84464]">{title}</p>
    </button>
  );
}
