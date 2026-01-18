import { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import React from "react";

export default function RoleGate({ children }) {
  const location = useLocation();
  const [role, setRole] = useState("loading");

  useEffect(() => {
    async function detectRole() {
      try {
        // 1️⃣ SELLER check
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

        // 2️⃣ USER / ADMIN check
        const res = await fetch(
          "https://bookmyshow-backend-mzd2.onrender.com/auth/me",
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        const data = await res.json();
        if (data.ok) {
          setRole(data.user.role); // user | admin
        } else {
          setRole("guest");
        }
      } catch {
        setRole("guest");
      }
    }

    detectRole();
  }, []);

  if (role === "loading") return null;

  const path = location.pathname;

  /* ─────────────────────────────
     🚫 ADMIN PROTECTION
  ───────────────────────────── */

  if (role !== "admin" && path.startsWith("/admin")) {
    return <Navigate to="/register" replace />;
  }

  /* ─────────────────────────────
     🚫 USER PROTECTION
  ───────────────────────────── */

  if (
    role === "user" &&
    (path.startsWith("/admin") || path.startsWith("/seller"))
  ) {
    return <Navigate to="/" replace />;
  }

  /* ─────────────────────────────
     SELLER ROUTES HANDLED ELSEWHERE
  ───────────────────────────── */

  // ❌ DO NOT BLOCK SELLER HERE
  // Seller auth MUST be handled by SellerProtectedRoute

  return children;
}
