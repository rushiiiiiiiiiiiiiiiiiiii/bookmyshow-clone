import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const countries = [
  { code: "+91", name: "India" },
  { code: "+1", name: "USA" },
  { code: "+44", name: "UK" },
];

const OTP_LENGTH = 6;
const BMS_RED = "bg-[#f84464] hover:bg-[#e43a57]";

export default function RegisterPage() {
  const [mode, setMode] = useState("email"); // DEFAULT EMAIL FIRST
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isContinueEnabled, setContinueEnabled] = useState(false);

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));
  const [resendTimer, setResendTimer] = useState(30);

  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const otpInputsRef = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (mode === "phone") {
      setContinueEnabled(false);
    } else {
      setContinueEnabled(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    }
  }, [email, mode]);

  useEffect(() => {
    let interval;
    if (showOtpModal && resendTimer > 0) {
      interval = setTimeout(() => setResendTimer((t) => t - 1), 1000);
    }
    return () => clearTimeout(interval);
  }, [showOtpModal, resendTimer]);

  const otpValue = otp.join("");

  // ==== REAL API CALLS ====

  async function apiSendOtp(identifier) {
    try {
      const res = await fetch(
        "https://bookmyshow-backend-mzd2.onrender.com/auth/send-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: identifier }),
        }
      );

      return await res.json();
    } catch (err) {
      console.log(err);
      return { ok: false, message: "Server error" };
    }
  }

  async function apiVerifyOtp(identifier, code) {
    try {
      const res = await fetch(
        "https://bookmyshow-backend-mzd2.onrender.com/auth/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: identifier, otp: code }),
        }
      );

      return await res.json();
    } catch (err) {
      console.log(err);
      return { ok: false, message: "Server error" };
    }
  }

  // === CONTINUE ===
  async function handleContinue() {
    if (mode === "phone") {
      toast.error("Mobile Number login is coming soon!");
      return;
    }

    setIsSending(true);
    const res = await apiSendOtp(email);
    setIsSending(false);

    if (res.ok) {
      setShowOtpModal(true);
      setOtp(new Array(OTP_LENGTH).fill(""));
      setResendTimer(30);
      setTimeout(() => otpInputsRef.current[0]?.focus(), 150);
    } else {
      toast.error(res.message || "Failed to send OTP.");
    }
  }

  // === OTP INPUT ===

  function handleOtpChange(e, index) {
    const value = e.target.value.replace(/\D/g, "").slice(0, 1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      otpInputsRef.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(e, index) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  }

  // === VERIFY OTP ===

  async function handleVerifyOtp() {
    if (otpValue.length !== OTP_LENGTH) {
      toast.error("Enter complete OTP");
      return;
    }

    setIsVerifying(true);
    const response = await apiVerifyOtp(email, otpValue);
    setIsVerifying(false);

    if (!response.ok) {
      toast.error(response.message || "Invalid OTP");
      return;
    }
    toast.success("Verification Successful!");

    // 🔥 ROLE-BASED REDIRECT
    if (response.role === "admin") {
      navigate("/admin/dashboard");
    } else if (response.isNewUser) {
      navigate("/setup-name");
    } else {
      navigate("/");
    }

    setShowOtpModal(false);
  }

  // === RESEND OTP ===

  async function handleResendOtp() {
    if (resendTimer > 0) return;

    setIsSending(true);
    const res = await apiSendOtp(email);
    setIsSending(false);

    if (res.ok) {
      setResendTimer(30);
      setOtp(new Array(OTP_LENGTH).fill(""));
      otpInputsRef.current[0]?.focus();
    } else {
      toast.error("Failed to resend OTP.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-2xl p-6 sm:p-8">
        <div className="text-center mb-6">
          <span className="text-3xl font-bold text-gray-800">BookMyShow</span>
        </div>

        <h2 className="text-2xl font-bold mb-1">Sign in / Sign up</h2>
        <p className="text-sm text-gray-500 mb-6">to manage your bookings</p>

        {/* SWITCH */}
        <div className="flex gap-2 mb-6 border border-gray-200 rounded-md p-1 bg-gray-100">
          <button
            onClick={() => setMode("email")}
            className={`flex-1 py-2 text-sm rounded-md ${
              mode === "email"
                ? `${BMS_RED} text-white shadow-md font-semibold`
                : "text-gray-700 hover:bg-white"
            }`}
          >
            Email
          </button>

          <button
            onClick={() => {
              setMode("phone");
              toast.error("Mobile number OTP is coming soon!");
            }}
            className={`flex-1 py-2 text-sm rounded-md ${
              mode === "phone"
                ? `${BMS_RED} text-white shadow-md font-semibold`
                : "text-gray-700 hover:bg-white"
            }`}
          >
            Mobile Number
          </button>
        </div>

        {/* INPUTS */}
        {mode === "phone" ? (
          <div className="space-y-1 mb-6">
            <label className="text-sm font-medium text-gray-700">
              Mobile Number (Coming Soon)
            </label>

            <div className="flex opacity-60 cursor-not-allowed">
              <select
                disabled
                value={countryCode}
                className="px-3 py-2 rounded-l-md border border-gray-300 bg-gray-100"
              >
                {countries.map((c) => (
                  <option key={c.code}>{c.code}</option>
                ))}
              </select>

              <input
                disabled
                placeholder="Coming Soon"
                className="flex-1 px-3 py-2 rounded-r-md border bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-1 mb-6">
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-[#f84464]"
            />
          </div>
        )}

        {/* CONTINUE */}
        <button
          disabled={mode === "phone" ? true : !isContinueEnabled || isSending}
          onClick={handleContinue}
          className={`w-full py-3 rounded-md text-white font-semibold ${
            isContinueEnabled && !isSending
              ? BMS_RED
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {isSending ? "Sending OTP..." : "Continue"}
        </button>

        {/* OR */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-3 text-xs text-gray-500 uppercase font-medium">
            or
          </span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* SOCIAL LOGIN */}
        <button className="w-full border py-2 rounded-md flex items-center justify-center gap-3 text-gray-700 mb-3">
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            className="w-5"
          />
          Continue with Google
        </button>

        <button className="w-full border py-2 rounded-md flex items-center justify-center gap-3 text-gray-700">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
            className="w-5"
          />
          Continue with Apple
        </button>

        <p className="text-xs text-gray-500 mt-6 text-center">
          By continuing you agree to BookMyShow's{" "}
          <span className="text-[#f84464] underline cursor-pointer">
            Terms & Conditions
          </span>{" "}
          and{" "}
          <span className="text-[#f84464] underline cursor-pointer">
            Privacy Policy
          </span>
          .
        </p>
      </div>

      {/* OTP MODAL */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-lg p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-2">Verify OTP</h3>
            <p className="text-sm text-gray-600 mb-6">
              Enter the OTP sent to <strong>{email}</strong>
            </p>

            <div className="flex justify-between mb-6">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  value={digit}
                  maxLength={1}
                  inputMode="numeric"
                  ref={(el) => (otpInputsRef.current[i] = el)}
                  onChange={(e) => handleOtpChange(e, i)}
                  onKeyDown={(e) => handleOtpKeyDown(e, i)}
                  className="w-10 h-10 text-xl border-2 rounded-md text-center"
                />
              ))}
            </div>

            <button
              disabled={otpValue.length !== 6 || isVerifying}
              onClick={handleVerifyOtp}
              className={`w-full py-3 rounded-md text-white font-semibold ${
                otpValue.length === 6
                  ? BMS_RED
                  : "bg-red-300 cursor-not-allowed"
              }`}
            >
              {isVerifying ? "Verifying..." : "Verify & Continue"}
            </button>

            <div className="flex justify-between items-center mt-4 text-sm">
              <div>
                {resendTimer > 0 ? (
                  <>
                    Resend in <b>{resendTimer}s</b>
                  </>
                ) : (
                  <button
                    onClick={handleResendOtp}
                    className="text-[#f84464] underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowOtpModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
