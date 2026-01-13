import React, { useEffect, useState } from "react";
import Home from "../Pages/Home";
import SellerOnboard from "../AuthSeller/SellerOnboard";
import SellerDashboard from "../AuthSeller/SellerDashboard";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function RootRouter() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [sellerVerified, setSellerVerified] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        if (document.cookie.includes("seller_token=")) {
          const res = await axios.get(
            "https://bookmyshow-backend-mzd2.onrender.com/api/seller/me"
          );

          if (res.data.ok && res.data.seller) {
            setRole("seller");
            setSellerVerified(res.data.seller.isVerified);
          }
        } else if (document.cookie.includes("token=")) {
          setRole("user");
        }

        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;

  // SELLER
  if (role === "seller") {
    return sellerVerified ? <SellerDashboard /> : <SellerOnboard />;
  }

  // USER or GUEST
  return <Home />;
}
