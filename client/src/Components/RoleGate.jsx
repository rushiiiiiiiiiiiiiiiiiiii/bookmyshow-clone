import { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import React from 'react'
export default function RoleGate({ children }) {
  const location = useLocation();
  const [role, setRole] = useState("loading");

  useEffect(() => {
    async function detectRole() {
      try {
        // 1️⃣ CHECK ADMIN / USER FIRST
        const authRes = await fetch(
          "https://bookmyshow-backend-mzd2.onrender.com/auth/me",
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        const authData = await authRes.json();

        if (authData.ok) {
          setRole(authData.user.role); // "admin" | "user"
          return;
        }

        // 2️⃣ CHECK SELLER
        const sellerRes = await fetch(
          "https://bookmyshow-backend-mzd2.onrender.com/api/seller/me",
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        const sellerData = await sellerRes.json();

        if (sellerData.ok) {
          setRole("seller");
          return;
        }

        // 3️⃣ GUEST
        setRole("guest");
      } catch {
        setRole("guest");
      }
    }

    detectRole();
  }, []);

  if (role === "loading") return null;

  const path = location.pathname;

  /* ───────── ADMIN RULES ───────── */
  if (role !== "admin" && path.startsWith("/admin")) {
    return <Navigate to="/register" replace />;
  }

  if (role === "admin" && !path.startsWith("/admin")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  /* ───────── USER RULES ───────── */
  if (
    role === "user" &&
    (path.startsWith("/admin") || path.startsWith("/seller"))
  ) {
    return <Navigate to="/" replace />;
  }

  /* ───────── SELLER RULES ───────── */
  // Seller routes are protected by SellerProtectedRoute
  // DO NOT block seller here

  return children;
}
