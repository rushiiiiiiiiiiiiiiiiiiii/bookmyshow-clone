import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    async function check() {
      try {
        await axios.get(
          "https://bookmyshow-backend-mzd2.onrender.com/api/admin/dashboard",
          {
            withCredentials: true,
          },
        );
        setAllowed(true);
      } catch {
        setAllowed(false);
      } finally {
        setLoading(false);
      }
    }

    check();
  }, []);

  if (loading) return null;

  if (!allowed) {
    return <Navigate to="/register" replace />;
  }

  return children;
}
