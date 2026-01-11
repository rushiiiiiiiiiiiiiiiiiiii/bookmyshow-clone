import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SellerNavbar from "../Components/Navbar";
import SellerSidebar from "../Components/SellerSidebar";

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
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <SellerSidebar />

      <div className="flex-1 flex flex-col">
        <SellerNavbar />

        <main className="max-w-2xl mx-auto mt-10 bg-white p-8 shadow rounded">
          <h2 className="text-xl font-bold text-[#f84464] mb-6">Add Screen</h2>

          <div className="grid grid-cols-2 gap-4">
            <input
              name="name"
              placeholder="Screen Name (Audi 1)"
              onChange={handleChange}
              className="border p-2 rounded col-span-2"
            />

            <input
              name="rows"
              type="number"
              placeholder="No of Rows"
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <input
              name="seatsPerRow"
              type="number"
              placeholder="Seats per row"
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
              className="border p-2 rounded col-span-2"
            >
              <option>Dolby 7.1</option>
              <option>Dolby Atmos</option>
              <option>DTS</option>
            </select>
          </div>

          <button
            onClick={save}
            className="mt-6 w-full bg-[#f84464] text-white py-2 rounded-lg"
          >
            Save Screen
          </button>
        </main>
      </div>
    </div>
  );
}
