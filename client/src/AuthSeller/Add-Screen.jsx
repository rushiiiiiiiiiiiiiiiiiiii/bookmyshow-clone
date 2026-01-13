import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SellerNavbar from "../Components/Navbar";
import SellerSidebar from "../Components/SellerSidebar";

axios.defaults.withCredentials = true;

export default function AddScreen() {
  const { theatreId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    rows: "",
    seatsPerRow: "",
    screenType: "Regular",
    projectorType: "Digital",
    soundSystem: "Dolby 7.1",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function save() {
    const { name, rows, seatsPerRow } = form;

    if (!name || !rows || !seatsPerRow) {
      alert("All required fields must be provided");
      return;
    }

    try {
      const payload = {
        ...form,
        rows: Number(form.rows),
        seatsPerRow: Number(form.seatsPerRow),
      };

      const res = await axios.post(
        `https://bookmyshow-backend-mzd2.onrender.com/api/seller/screen/${theatreId}`,
        payload
      );

      if (res.data.ok) {
        navigate(`/seller/add-show/${theatreId}`);
      } else {
        alert(res.data.message || "Failed to add screen");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <SellerNavbar />

      <div className="flex">
        {/* SIDEBAR (DESKTOP ONLY) */}
        <div className="hidden lg:block">
          <SellerSidebar />
        </div>

        {/* MAIN */}
        <main className="flex-1 px-4 py-6 md:px-6 md:py-10">
          <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 shadow rounded-lg">
            <h2 className="text-lg md:text-xl font-bold text-[#f84464] mb-6">
              Add Screen
            </h2>

            {/* FORM */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="name"
                placeholder="Screen Name (Audi 1) *"
                onChange={handleChange}
                className="border p-2 rounded sm:col-span-2"
              />

              <input
                name="rows"
                type="number"
                placeholder="Number of Rows *"
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                name="seatsPerRow"
                type="number"
                placeholder="Seats per Row *"
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <select
                name="screenType"
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option>Regular</option>
                <option>Recliner</option>
                <option>IMAX</option>
                <option>Luxury</option>
              </select>

              <select
                name="projectorType"
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option>Digital</option>
                <option>Laser</option>
                <option>4K</option>
              </select>

              <select
                name="soundSystem"
                onChange={handleChange}
                className="border p-2 rounded sm:col-span-2"
              >
                <option>Dolby 7.1</option>
                <option>Dolby Atmos</option>
                <option>DTS</option>
              </select>
            </div>

            {/* ACTION */}
            <button
              onClick={save}
              className="mt-6 w-full bg-[#f84464] text-white py-2 rounded-lg font-semibold hover:opacity-90"
            >
              Save Screen
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
