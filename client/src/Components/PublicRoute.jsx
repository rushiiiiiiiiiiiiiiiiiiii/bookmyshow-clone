import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null);

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
        if (data.ok) setIsAuth(true);
        else setIsAuth(false);
      } catch {
        setIsAuth(false);
      }
    }

    checkAuth();
  }, []);

  if (isAuth === null) return null;

  return isAuth ? <Navigate to="/" /> : children;
}
