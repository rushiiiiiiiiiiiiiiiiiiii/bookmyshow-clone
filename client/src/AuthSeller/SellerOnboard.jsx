import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// 🔥 ALWAYS send cookies with axios requests
axios.defaults.withCredentials = true;

export default function SellerOnboard() {
  const [bizName, setBizName] = useState("");
  const [businessType, setBusinessType] = useState("Cinema");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  async function save() {
    if (!bizName.trim() || !city.trim()) {
      alert("Business name and city are required");
      return;
    }

    try {
      setSaving(true);

      const res = await axios.post(
        "http://localhost:8000/api/seller/onboard",
        { bizName, businessType, address, city, pincode, phone },
        { withCredentials: true }
      );

      setSaving(false);

      if (res.data.ok) {
        navigate("/seller/dashboard");
      } else {
        alert(res.data.message || "Failed");
      }
    } catch (err) {
      setSaving(false);
      console.error(err);
      alert("Server error");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Complete partner details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Business Name */}
          <input
            value={bizName}
            onChange={(e) => setBizName(e.target.value)}
            placeholder="Business / Theatre name"
            className="p-3 border rounded"
          />

          {/* Business Type */}
          <select
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            className="p-3 border rounded"
          >
            <option>Cinema</option>
            <option>Single Screen</option>
            <option>Event Organizer</option>
            <option>Stadium</option>
          </select>

          {/* Contact Phone */}
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Contact phone"
            className="p-3 border rounded"
          />

          {/* City */}
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            className="p-3 border rounded"
          />

          {/* Pincode */}
          <input
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="Pincode"
            className="p-3 border rounded"
          />

          {/* Address */}
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Full address"
            className="p-3 border rounded col-span-2"
          />
        </div>

        <div className="mt-6 flex gap-3">
          {/* Save Button */}
          <button
            onClick={save}
            disabled={saving}
            className="px-6 py-2 bg-[#f84464] text-white rounded-lg"
          >
            {saving ? "Saving..." : "Save & Continue"}
          </button>

          {/* Skip Button */}
          <button
            onClick={() => navigate("/seller/dashboard")}
            className="px-6 py-2 border rounded-lg"
          >
            Skip & Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
