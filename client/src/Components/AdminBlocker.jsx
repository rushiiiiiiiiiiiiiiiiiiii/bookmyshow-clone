import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import React from 'react'
export default function AdminBlocker({ children }) {
  const location = useLocation();
  const [state, setState] = useState({
    loading: true,
    isAdmin: false,
  });

  useEffect(() => {
    let mounted = true;

    async function checkAdmin() {
      try {
        const res = await fetch(
          "https://bookmyshow-backend-mzd2.onrender.com/auth/me",
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        const data = await res.json();

        if (!mounted) return;

        if (data.ok && data.user?.role === "admin") {
          setState({ loading: false, isAdmin: true });
        } else {
          setState({ loading: false, isAdmin: false });
        }
      } catch {
        if (mounted) {
          setState({ loading: false, isAdmin: false });
        }
      }
    }

    checkAdmin();
    return () => (mounted = false);
  }, []);

  if (state.loading) return null;

  const path = location.pathname;

  // 🔒 ADMIN LOGGED IN → BLOCK NON-ADMIN ROUTES
  if (
    state.isAdmin &&
    !path.startsWith("/admin") &&
    !path.startsWith("/register")
  ) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}
