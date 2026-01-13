import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function SellerProtectedRoute({ children }) {
  const [status, setStatus] = useState({
    loading: true,
    ok: false,
  });

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch(
          "https://bookmyshow-backend-mzd2.onrender.com/api/seller/me",
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        if (data.ok) {
          setStatus({ loading: false, ok: true });
        } else {
          setStatus({ loading: false, ok: false });
        }
      } catch {
        setStatus({ loading: false, ok: false });
      }
    }

    checkAuth();
  }, []);

  if (status.loading) return null;

  if (!status.ok) {
    return <Navigate to="/seller/signin" replace />;
  }

  return children;
}
