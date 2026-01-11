import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Building2, Monitor, Calendar, Film } from "lucide-react";

export default function SellerSidebar() {
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
        <ul className="space-y-2">
          <li
            onClick={() => navigate("/seller/dashboard")}
            className={`cursor-pointer flex items-center gap-3 px-2 py-2 rounded-md transition ${
              isActive("/seller/dashboard")
                ? "bg-pink-50 text-[#f84464] font-semibold"
                : "hover:bg-gray-100 hover:text-[#f84464]"
            }`}
          >
            <Home size={18} />
            Dashboard
          </li>

          <li
            onClick={() => navigate("/seller/theatres")}
            className={`cursor-pointer flex items-center gap-3 px-2 py-2 rounded-md transition ${
              isActive("/seller/theatres")
                ? "bg-pink-50 text-[#f84464] font-semibold"
                : "hover:bg-gray-100 hover:text-[#f84464]"
            }`}
          >
            <Building2 size={18} />
            Theatres
          </li>

          <li
            onClick={() => navigate("/seller/screens")}
            className={`cursor-pointer flex items-center gap-3 px-2 py-2 rounded-md transition ${
              isActive("/seller/screens")
                ? "bg-pink-50 text-[#f84464] font-semibold"
                : "hover:bg-gray-100 hover:text-[#f84464]"
            }`}
          >
            <Monitor size={18} />
            Screens
          </li>

          <li
            onClick={() => navigate("/seller/shows")}
            className={`cursor-pointer flex items-center gap-3 px-2 py-2 rounded-md transition ${
              isActive("/seller/shows")
                ? "bg-pink-50 text-[#f84464] font-semibold"
                : "hover:bg-gray-100 hover:text-[#f84464]"
            }`}
          >
            <Calendar size={18} />
            Shows
          </li>

          <li
            onClick={() => navigate("/seller/bookings")}
            className={`cursor-pointer flex items-center gap-3 px-2 py-2 rounded-md transition ${
              isActive("/seller/bookings")
                ? "bg-pink-50 text-[#f84464] font-semibold"
                : "hover:bg-gray-100 hover:text-[#f84464]"
            }`}
          >
            <Film size={18} />
            Bookings
          </li>
        </ul>
      </nav>

      {/* CTA */}
      <div className="p-4 border-t border-gray-200 shrink-0">
        <button
          onClick={() => navigate("/seller/add-theatre")}
          className="w-full bg-[#f84464] hover:bg-[#e43a57] text-white py-2 rounded-lg font-semibold"
        >
          + Add Theatre
        </button>
      </div>
    </aside>
  );
}
