import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const [status, setStatus] = useState({
    loading: true,
    ok: false,
    role: null,
  });

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch(
          "https://bookmyshow-backend-mzd2.onrender.com/auth/me",
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        if (data.ok) {
          setStatus({
            loading: false,
            ok: true,
            role: data.user?.role || "user",
          });
        } else {
          setStatus({ loading: false, ok: false, role: null });
        }
      } catch {
        setStatus({ loading: false, ok: false, role: null });
      }
    }

    checkAuth();
  }, []);

  // ⏳ loader (you can add spinner later)
  if (status.loading) return null;

  // ❌ not logged in
  if (!status.ok) return <Navigate to="/register" replace />;

  // ❌ role mismatch (admin route but not admin)
  if (role && status.role !== role) {
    return <Navigate to="/" replace />;
  }

  // ✅ allowed
  return children;
}
