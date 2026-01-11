import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SellerNavbar from "../Components/Navbar";
import { toast } from "react-hot-toast";
axios.defaults.withCredentials = true;

const BMS_RED = "#f84464";

export default function AddTheatre() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    brand: "",
    theatreType: "Multiplex",
    city: "",
    pincode: "",
    address: "",
    contactEmail: "",
    contactPhone: "",
    openingTime: "",
    closingTime: "",
    amenities: [],
    lat: "",
    lng: "",
  });

  const [saving, setSaving] = useState(false);

  const AMENITIES = [
    "Parking",
    "Food & Beverages",
    "Wheelchair Access",
    "Restroom",
    "Recliner Seats",
    "IMAX Support",
    "Online Booking",
  ];

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function toggleAmenity(amenity) {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  }

  async function saveTheatre() {
    const { name, city, pincode, address, contactEmail, contactPhone } = form;

    if (
      !name ||
      !city ||
      !pincode ||
      !address ||
      !contactEmail ||
      !contactPhone
    ) {
      alert("All required fields must be filled.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...form,
        location: {
          lat: Number(form.lat),
          lng: Number(form.lng),
        },
      };

      const res = await axios.post(
        "https://bookmyshow-backend-mzd2.onrender.com/api/seller/theatre",
        payload
      );

      if (res.data.ok) {
        toast.success("Theatre added successfully ✅");
        navigate(`/seller/add-screen/${res.data.theatre._id}`);
      } else {
        toast.error(res.data.message || "Failed to add theatre");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SellerNavbar />

      <div className="max-w-6xl mx-auto py-10 px-6">
        <h1 className="text-3xl font-bold mb-8">🎬 Add New Theatre</h1>

        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 border-b pb-3">
            Theatre Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <input
              name="name"
              placeholder="Theatre Name"
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              name="brand"
              placeholder="Brand (PVR / INOX)"
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <select
              name="theatreType"
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option>Multiplex</option>
              <option>Single Screen</option>
              <option>IMAX</option>
              <option>Drive-In</option>
            </select>

            <input
              name="city"
              placeholder="City"
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              name="pincode"
              placeholder="Pincode"
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              name="contactEmail"
              placeholder="Contact Email"
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              name="contactPhone"
              placeholder="Contact Phone"
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <input
              name="openingTime"
              type="time"
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              name="closingTime"
              type="time"
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <input
              name="lat"
              placeholder="Latitude"
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              name="lng"
              placeholder="Longitude"
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <textarea
              name="address"
              placeholder="Full Address"
              onChange={handleChange}
              className="border p-2 rounded col-span-3"
              rows={3}
            />
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {AMENITIES.map((a) => (
                <label
                  key={a}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={form.amenities.includes(a)}
                    onChange={() => toggleAmenity(a)}
                  />
                  {a}
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={() => navigate("/seller/dashboard")}
              className="border px-5 py-2 rounded"
            >
              Cancel
            </button>

            <button
              onClick={saveTheatre}
              style={{ backgroundColor: BMS_RED }}
              disabled={saving}
              className="px-8 py-2 text-white rounded-lg font-semibold disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Theatre"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
