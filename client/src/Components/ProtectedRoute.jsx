import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState({
    loading: true,
    ok: false,
  });

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("http://localhost:8000/api/auth/me", {
          credentials: "include",
        });

        const data = await res.json();
        setStatus({ loading: false, ok: data.ok });
      } catch {
        setStatus({ loading: false, ok: false });
      }
    }

    checkAuth();
  }, []);

  if (status.loading) return null;

  if (!status.ok) return <Navigate to="/register" replace />;

  return children;
}
