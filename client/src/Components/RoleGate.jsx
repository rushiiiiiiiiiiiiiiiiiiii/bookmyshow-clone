import React, { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";

export default function RoleGate({ children }) {
  const location = useLocation();
  const [role, setRole] = useState("loading");

  useEffect(() => {
    async function detectRole() {
      try {
        // 🔴 SELLER (highest priority)
        const sellerRes = await fetch(
          "https://bookmyshow-backend-mzd2.onrender.com/api/seller/me",
          { credentials: "include" }
        );
        const seller = await sellerRes.json();
        if (seller.ok) {
          setRole("seller");
          return;
        }

        // 🔴 ADMIN
        const adminRes = await fetch(
          "https://bookmyshow-backend-mzd2.onrender.com/api/admin/me",
          { credentials: "include" }
        );
        const admin = await adminRes.json();
        if (admin.ok) {
          setRole("admin");
          return;
        }

        // 🟢 USER
        const userRes = await fetch(
          "https://bookmyshow-backend-mzd2.onrender.com/api/auth/me",
          { credentials: "include" }
        );
        const user = await userRes.json();
        if (user.ok) {
          setRole("user");
          return;
        }

        setRole("guest");
      } catch {
        setRole("guest");
      }
    }

    detectRole();
  }, []);

  if (role === "loading") return null;

  const path = location.pathname;

  /* =====================================================
     🚫 HARD SELLER LOCK
     Seller → ONLY /seller/*
  ===================================================== */
  if (role === "seller" && !path.startsWith("/seller")) {
    return <Navigate to="/seller/dashboard" replace />;
  }

  /* =====================================================
     🚫 HARD ADMIN LOCK  ✅ (THIS IS WHAT YOU ASKED)
     Admin → ONLY /admin/*
  ===================================================== */
  if (role === "admin" && !path.startsWith("/admin")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  /* =====================================================
     🚫 USER LOCK
     User cannot access admin/seller
  ===================================================== */
  if (
    role === "user" &&
    (path.startsWith("/admin") || path.startsWith("/seller"))
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
}
