import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import React from 'react'
export default function PublicRoute({ children }) {
  const [state, setState] = useState({
    loading: true,
    ok: false,
    role: null,
  });

  useEffect(() => {
    fetch("https://bookmyshow-backend-mzd2.onrender.com/auth/me", {
      credentials: "include",
      cache: "no-store", // 🔥 IMPORTANT
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setState({
            loading: false,
            ok: true,
            role: data.user.role,
          });
        } else {
          setState({ loading: false, ok: false, role: null });
        }
      })
      .catch(() => {
        setState({ loading: false, ok: false, role: null });
      });
  }, []);

  if (state.loading) return null;

  // 🔥 ADMIN → dashboard
  if (state.ok && state.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // 🔥 USER → home
  if (state.ok && state.role === "user") {
    return <Navigate to="/" replace />;
  }

  // 🔥 GUEST
  return children;
}
