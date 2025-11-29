import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Building2, Monitor, Calendar } from "lucide-react";
import { Film } from "lucide-react";

export default function SellerSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // helper for active link highlight
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <aside className="w-64 bg-white border-r border-gray-300 hidden md:flex flex-col">
      {/* LOGO */}
      <div className="px-6 py-3 border-b border-gray-300 ">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/7/75/Bookmyshow-logoid.png"
          alt="BookMyShow"
          className="w-32"
        />
      </div>

      {/* MENU */}
      <nav className="flex-1 px-4 py-6 text-sm text-gray-700">
        <ul className="space-y-3">
          <li
            onClick={() => navigate("/seller/dashboard")}
            className={`cursor-pointer flex items-center gap-3 ${
              isActive("/seller/dashboard")
                ? "text-[#f84464] font-semibold"
                : "hover:text-[#f84464]"
            }`}
          >
            <Home size={18} /> Dashboard
          </li>

          <li
            onClick={() => navigate("/seller/theatres")}
            className={`cursor-pointer flex items-center gap-3 ${
              isActive("/seller/theatres")
                ? "text-[#f84464] font-semibold"
                : "hover:text-[#f84464]"
            }`}
          >
            <Building2 size={18} /> Theatres
          </li>

          <li
            onClick={() => navigate("/seller/screens")}
            className={`cursor-pointer flex items-center gap-3 ${
              isActive("/seller/screens")
                ? "text-[#f84464] font-semibold"
                : "hover:text-[#f84464]"
            }`}
          >
            <Monitor size={18} /> Screens
          </li>

          <li
            onClick={() => navigate("/seller/shows")}
            className={`cursor-pointer flex items-center gap-3 ${
              isActive("/seller/shows")
                ? "text-[#f84464] font-semibold"
                : "hover:text-[#f84464]"
            }`}
          >
            <Calendar size={18} /> Shows
          </li>
          <li
            onClick={() => navigate("/seller/bookings")}
            className={`cursor-pointer flex items-center gap-3 ${
              isActive("/seller/bookings")
                ? "text-[#f84464] font-semibold"
                : "hover:text-[#f84464]"
            }`}
          >
            <Film size={18} />
            Bookings
          </li>
        </ul>
      </nav>

      {/* CTA BUTTON */}
      <div className="p-4">
        <button
          onClick={() => navigate("/seller/add-theatre")}
          className="w-full bg-[#f84464] hover:bg-[#e43a57] text-white py-2 rounded-lg"
        >
          + Add Theatre
        </button>
      </div>
    </aside>
  );
}
