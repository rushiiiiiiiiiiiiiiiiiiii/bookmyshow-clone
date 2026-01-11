import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Building2,
  Monitor,
  Calendar,
  Ticket,
} from "lucide-react";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <aside className="w-64 bg-white border-r border-gray-300 hidden md:flex flex-col h-screen sticky top-0">
      {/* LOGO */}
      <div className="px-6 py-4 border-b border-gray-300 shrink-0">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/7/75/Bookmyshow-logoid.png"
          alt="BookMyShow"
          className="w-32"
        />
      </div>

      {/* MENU */}
      <nav className="flex-1 px-4 py-6 text-sm text-gray-700 overflow-y-auto">
        <ul className="space-y-3">
          <li
            onClick={() => navigate("/admin/dashboard")}
            className={`cursor-pointer flex items-center gap-3 px-2 py-2 rounded-md transition ${
              isActive("/admin/dashboard")
                ? "bg-pink-50 text-[#f84464] font-semibold"
                : "hover:bg-gray-100 hover:text-[#f84464]"
            }`}
          >
            <Home size={18} />
            Dashboard
          </li>

          <li
            onClick={() => navigate("/admin/sellers")}
            className={`cursor-pointer flex items-center gap-3 px-2 py-2 rounded-md transition ${
              isActive("/admin/sellers")
                ? "bg-pink-50 text-[#f84464] font-semibold"
                : "hover:bg-gray-100 hover:text-[#f84464]"
            }`}
          >
            <Users size={18} />
            Sellers
          </li>

          <li
            onClick={() => navigate("/admin/theatres")}
            className={`cursor-pointer flex items-center gap-3 px-2 py-2 rounded-md transition ${
              isActive("/admin/theatres")
                ? "bg-pink-50 text-[#f84464] font-semibold"
                : "hover:bg-gray-100 hover:text-[#f84464]"
            }`}
          >
            <Building2 size={18} />
            Theatres
          </li>

          <li
            onClick={() => navigate("/admin/screens")}
            className={`cursor-pointer flex items-center gap-3 px-2 py-2 rounded-md transition ${
              isActive("/admin/screens")
                ? "bg-pink-50 text-[#f84464] font-semibold"
                : "hover:bg-gray-100 hover:text-[#f84464]"
            }`}
          >
            <Monitor size={18} />
            Screens
          </li>

          <li
            onClick={() => navigate("/admin/shows")}
            className={`cursor-pointer flex items-center gap-3 px-2 py-2 rounded-md transition ${
              isActive("/admin/shows")
                ? "bg-pink-50 text-[#f84464] font-semibold"
                : "hover:bg-gray-100 hover:text-[#f84464]"
            }`}
          >
            <Calendar size={18} />
            Shows
          </li>

          <li
            onClick={() => navigate("/admin/bookings")}
            className={`cursor-pointer flex items-center gap-3 px-2 py-2 rounded-md transition ${
              isActive("/admin/bookings")
                ? "bg-pink-50 text-[#f84464] font-semibold"
                : "hover:bg-gray-100 hover:text-[#f84464]"
            }`}
          >
            <Ticket size={18} />
            Bookings
          </li>
        </ul>
      </nav>
    </aside>
  );
}
