import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SellerLogin() {
  const [email, setEmail] = useState("");
  const [otpScreen, setOtpScreen] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function sendOtp() {
    if (!email.trim()) return toast.succes("Enter business email");
    try {
      setLoading(true);
      const res = await axios.post("/api/seller/send-otp", { email });
      setLoading(false);
      if (res.data.ok) setOtpScreen(true);
      else toast.succes(res.data.message || "Failed to send OTP");
    } catch (err) {
      setLoading(false);
      console.error(err);
      toast.succes("Server error");
    }
  }

  async function verifyOtp() {
    if (!otp.trim()) return toast.succes("Enter OTP");

    try {
      setLoading(true);

      const res = await axios.post(
        "https://bookmyshow-backend-mzd2.onrender.com/api/seller/verify-otp",
        { email, otp },
        { withCredentials: true } // ⬅ VERY IMPORTANT
      );

      setLoading(false);

      if (res.data.ok) {
        // NO localStorage, we use secure httpOnly cookie
        if (res.data.isNewSeller) {
          navigate("/seller/onboard");
        } else {
          navigate("/seller/dashboard");
        }
      } else {
        toast.succes(res.data.message || "Invalid OTP");
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      toast.succes("Server error");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Partner Login</h2>

        {!otpScreen ? (
          <>
            <label className="block text-sm text-gray-700 mb-1">
              Official business email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@yourtheatre.com"
              className="w-full px-4 py-2 border rounded-lg outline-none mb-4"
            />
            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full py-2 bg-[#f84464] hover:bg-[#e43a57] text-white rounded-lg font-semibold"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
            <p className="text-xs text-gray-500 mt-3">
              We will send OTP to this email for partner login.
            </p>
          </>
        ) : (
          <>
            <label className="block text-sm text-gray-700 mb-1">
              Enter OTP
            </label>
            <input
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="123456"
              className="w-full px-4 py-2 border rounded-lg outline-none mb-4"
            />
            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full py-2 bg-[#f84464] hover:bg-[#e43a57] text-white rounded-lg font-semibold"
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>

            <button
              onClick={() => setOtpScreen(false)}
              className="w-full mt-3 py-2 border rounded-lg text-sm"
            >
              Edit Email
            </button>
          </>
        )}
      </div>
    </div>
  );
}
