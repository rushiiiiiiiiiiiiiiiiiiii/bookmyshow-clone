import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [state, setState] = useState({
    loading: true,
    ok: false,
    role: null,
  });

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch(
          "https://bookmyshow-backend-mzd2.onrender.com/auth/me",
          { credentials: "include" }
        );

        const data = await res.json();
        setState({
          loading: false,
          ok: data.ok,
          role: data.user?.role,
        });
      } catch {
        setState({ loading: false, ok: false, role: null });
      }
    }

    check();
  }, []);

  if (state.loading) return null;

  if (!state.ok) return <Navigate to="/register" replace />;

  // 🚫 ADMIN BLOCKED
  if (state.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}
