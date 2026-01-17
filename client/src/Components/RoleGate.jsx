import { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import React from 'react'
export default function RoleGate({ children }) {
  const location = useLocation();
  const [role, setRole] = useState("loading");

  useEffect(() => {
    async function detectRole() {
      try {
        const res = await fetch(
          "https://bookmyshow-backend-mzd2.onrender.com/auth/me",
          { credentials: "include" }
        );

        const data = await res.json();
        if (data.ok) {
          setRole(data.user.role);
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

  // 🚫 ADMIN → ONLY /admin/*
  if (role === "admin" && !path.startsWith("/admin")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // 🚫 SELLER → ONLY /seller/*
  if (role === "seller" && !path.startsWith("/seller")) {
    return <Navigate to="/seller/dashboard" replace />;
  }

  // 🚫 USER → NO admin/seller
  if (
    role === "user" &&
    (path.startsWith("/admin") || path.startsWith("/seller"))
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
}
