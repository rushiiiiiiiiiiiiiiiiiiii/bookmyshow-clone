import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SellerNavbar from "../Components/Navbar";
import SellerSidebar from "../Components/SellerSidebar";
import { toast } from "react-hot-toast";
axios.defaults.withCredentials = true;

/* ===============================
   ✅ HELPER FUNCTION (End Time)
================================*/
function computeEndTime(time, durationMinutes) {
  if (!time || !durationMinutes) return "";

  const [h, m] = time.split(":").map(Number);
  const dur = parseInt(durationMinutes, 10);

  if (Number.isNaN(h) || Number.isNaN(m) || Number.isNaN(dur)) return "";

  let total = h * 60 + m + dur;
  const minutesInDay = 24 * 60;
  total = ((total % minutesInDay) + minutesInDay) % minutesInDay;

  const hh = String(Math.floor(total / 60)).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

/* ===============================
   ✅ ADD SHOW PAGE COMPONENT
================================*/
export default function AddShow() {
  const { theatreId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    movie: "",
    poster: "",
    language: "English",
    format: "2D",
    startDate: "",
    endDate: "",
    time: "",
    durationMinutes: "",
    endTime: "",
    price: "",
    screenId: "",
    status: "active",
    isSubtitled: false,
    certificate: "UA",
    maxSeatsPerBooking: 10,
  });

  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ===============================
     ✅ LOAD SCREENS
  ================================*/
  useEffect(() => {
    loadScreens();
  }, []);

  async function loadScreens() {
    try {
      const res = await axios.get(
        `https://bookmyshow-backend-mzd2.onrender.com/api/seller/screens/${theatreId}`
      );
      if (res.data.ok) setScreens(res.data.screens);
    } catch {
      alert("Failed to load screens");
    }
  }

  /* ===============================
     ✅ AUTO CALCULATE END TIME
  ================================*/
  useEffect(() => {
    if (form.time && form.durationMinutes) {
      const newEndTime = computeEndTime(form.time, form.durationMinutes);
      if (newEndTime !== form.endTime) {
        setForm((prev) => ({ ...prev, endTime: newEndTime }));
      }
    }
  }, [form.time, form.durationMinutes]);

  /* ===============================
     ✅ HANDLE INPUT CHANGE
  ================================*/
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  /* ===============================
     ✅ SAVE SHOW
  ================================*/
  async function save() {
    if (loading) return;

    const {
      movie,
      startDate,
      endDate,
      time,
      durationMinutes,
      price,
      screenId,
    } = form;

    if (
      !movie ||
      !startDate ||
      !endDate ||
      !time ||
      !durationMinutes ||
      !price ||
      !screenId
    ) {
      alert("All required fields must be filled");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `https://bookmyshow-backend-mzd2.onrender.com/api/seller/show/${theatreId}`,
        form
      );

      if (res.data.ok) {
        toast.success("Show Created Successfully ✅");
        navigate(`/seller/shows/${theatreId}`);
      } else {
        toast.error(res.data.message || "Failed to create show");
      }
    } catch (err) {
      console.error(err);
      alert("Server Error while creating show");
    } finally {
      setLoading(false);
    }
  }

  /* ===============================
     ✅ UI RENDER
  ================================*/
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <SellerSidebar />

      <div className="flex-1 flex flex-col">
        <SellerNavbar />

        <main className="max-w-4xl mx-auto mt-10 bg-white p-8 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-[#f84464] mb-6">
            Add New Show
          </h2>

          {/* ===============================
              ✅ POSTER PREVIEW
          ================================*/}
          <div className="flex gap-6 mb-6">
            <img
              src={
                form.poster ||
                "https://via.placeholder.com/240x360?text=Movie+Poster"
              }
              alt="Poster Preview"
              className="w-40 h-60 object-cover rounded shadow border"
            />

            <div className="flex-1">
              <label className="text-sm font-semibold">
                Poster Image URL (like BookMyShow banner)
              </label>
              <input
                name="poster"
                placeholder="Paste Movie Poster Image URL here"
                value={form.poster}
                onChange={handleChange}
                className="border p-2 rounded w-full mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              name="movie"
              placeholder="Movie Name"
              value={form.movie}
              onChange={handleChange}
              className="border p-2 rounded col-span-2"
            />

            <select
              name="language"
              value={form.language}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Marathi</option>
              <option>Telugu</option>
              <option>Kannada</option>
              <option>Tamil</option>
            </select>

            <select
              name="format"
              value={form.format}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option>2D</option>
              <option>3D</option>
              <option>IMAX</option>
              <option>4DX</option>
              <option>Dolby Atmos</option>
            </select>

            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <input
              type="number"
              name="durationMinutes"
              placeholder="Duration (minutes)"
              value={form.durationMinutes}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <input
              type="time"
              name="endTime"
              value={form.endTime}
              readOnly
              className="border p-2 rounded bg-gray-100"
            />

            <input
              type="number"
              name="price"
              placeholder="Ticket Price"
              value={form.price}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <select
              name="screenId"
              value={form.screenId}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="">Select Screen</option>
              {screens.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.rows} x {s.seatsPerRow})
                </option>
              ))}
            </select>

            <select
              name="certificate"
              value={form.certificate}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="U">U</option>
              <option value="UA">UA</option>
              <option value="U/A 7+">U/A 7+</option>
              <option value="U/A 13+">U/A 13+</option>
              <option value="A">A</option>
            </select>

            <input
              type="number"
              name="maxSeatsPerBooking"
              placeholder="Max Seats per Booking"
              value={form.maxSeatsPerBooking}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <div classivName="col-span-2 flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isSubtitled"
                  checked={form.isSubtitled}
                  onChange={handleChange}
                />
                Subtitles Available
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="border p-2 rounded ml-auto"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <button
            onClick={!loading ? save : null}
            disabled={loading}
            className="mt-6 w-full bg-[#f84464] hover:bg-[#e63954] text-white font-semibold py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? "Saving..." : "Create Show"}
          </button>
        </main>
      </div>
    </div>
  );
}
