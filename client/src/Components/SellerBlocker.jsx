import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import React from 'react'
export default function SellerBlocker({ children }) {
  const location = useLocation();
  const [state, setState] = useState({
    loading: true,
    isSeller: false,
  });

  useEffect(() => {
    async function checkSeller() {
      try {
        const res = await fetch(
          "https://bookmyshow-backend-mzd2.onrender.com/api/seller/me",
          { credentials: "include" }
        );

        const data = await res.json();

        if (data.ok) {
          setState({ loading: false, isSeller: true });
        } else {
          setState({ loading: false, isSeller: false });
        }
      } catch {
        setState({ loading: false, isSeller: false });
      }
    }

    checkSeller();
  }, []);

  if (state.loading) return null;

  // 🚫 Seller trying to access NON seller routes
  if (
    state.isSeller &&
    !location.pathname.startsWith("/seller")
  ) {
    return <Navigate to="/seller/dashboard" replace />;
  }

  return children;
}
