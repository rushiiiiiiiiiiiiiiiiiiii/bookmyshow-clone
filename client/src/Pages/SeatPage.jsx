import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";
import {toast} from 'react-hot-toast'
// --- Colors ---
const BMS_GREEN = "#1FA85D";
const BMS_BTN = "bg-[#f84464] hover:bg-[#e43a57]";

const SEAT_PRICE = 250;
const AISLE_AFTER_SEAT = 6;

// ------------------------------------------------
// LEGEND
// ------------------------------------------------
function Legend({ color, border, label, style }) {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-600">
      <div
        className={`w-4 h-4 rounded-sm ${color} ${
          border ? "border border-gray-400" : ""
        }`}
        style={style}
      />
      {label}
    </div>
  );
}

// ------------------------------------------------
// MAIN PAGE
// ------------------------------------------------
export default function SeatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booked, setBooked] = useState([]);
  const [selected, setSelected] = useState([]);
  const [screen, setScreen] = useState(null);
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);

  // -------------------------
  // LOAD DATA
  // -------------------------
  useEffect(() => {
    async function load() {
      try {
        // ✅ MOVIE DETAILS
        const showRes = await axios.get(
          `http://localhost:8000/api/shows/${id}`
        );

        if (showRes.data.ok) {
          setShow(showRes.data.show);
        }

        // ✅ SEAT DATA
        const seatRes = await axios.get(
          `http://localhost:8000/api/user/seats/${id}`
        );

        if (seatRes.data.ok) {
          const seatNumbers = (seatRes.data.booked || []).map(
            (seat) => seat.seatNumber
          );

          setBooked(seatNumbers);
          setScreen(seatRes.data.screen);
        }
      } catch (err) {
        console.error("SEAT PAGE ERROR:", err);

        // FALLBACK DEMO DATA
        setBooked(["A4", "A5", "C6"]);
        setScreen({ rows: 8, seatsPerRow: 12, screenType: "IMAX" });
        setShow({
          movie: "Stranger Things S5",
          poster:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpzT0KCj3xFEEmbs8fS7andoLlj_eX8Yv3zA&s",
          theatreId: { name: "Madhuban Cinema", city: "Mumbai" },
          screenId: { name: "Puja Cineplex" },
          date: "2025-11-28",
          time: "9:00 PM",
          language: "English",
          format: "4DX",
          maxSeatsPerBooking: 1,
        });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  // -------------------------
  // SEAT TOGGLE (LIMIT BY DB)
  // -------------------------
  function toggleSeat(seat) {
    if (booked.includes(seat)) return;

    const max = show?.maxSeatsPerBooking || 1;

    if (!selected.includes(seat) && selected.length >= max) {
      toast.error(`You can only book ${max} ticket(s) for this show.`);
      return;
    }

    setSelected((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  }

  // -------------------------
  // LOADING
  // -------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading seats...
      </div>
    );
  }

  if (!screen || !show) {
    return <div className="p-10 text-center">Failed to load seat layout</div>;
  }

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const rows = alphabet.slice(0, screen.rows);
  const seatsPerRow = screen.seatsPerRow;
  const total = selected.length * SEAT_PRICE;

  const limit = show.maxSeatsPerBooking || 1;

  const leftSeats = AISLE_AFTER_SEAT;
  const rightSeats = seatsPerRow - AISLE_AFTER_SEAT;

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Navbar />

      {/* ===================
           🎬 MOVIE HEADER
      =================== */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-4">
          {/* POSTER */}
          <img
            src={show.poster}
            alt={show.movie}
            className="w-14 h-20 object-cover rounded-md"
          />

          {/* DETAILS */}
          <div className="flex-1">
            <h1 className="text-base font-bold truncate">{show.movie}</h1>

            <p className="text-xs text-gray-600">
              {show.language} · {show.format}
            </p>

            <p className="text-xs text-gray-600">
              {show.theatreId?.name} · {show.screenId?.name}
            </p>

            <p className="text-xs font-medium text-gray-800">
              {new Date(show.date).toDateString()} · {show.time}
            </p>
          </div>

          {/* LIMIT BADGE */}
          <div className="text-[11px] text-red-600 font-semibold whitespace-nowrap">
            MAX {limit}
          </div>
        </div>
      </div>

      {/* ===================
              SCREEN
      =================== */}
      <div className="max-w-5xl mx-auto px-6 pt-8 pb-28">
        <div className="flex justify-center mb-10">
          <div className="relative w-full max-w-xs">
            <div className="h-3 bg-black rounded-t-full opacity-70" />
            <div className="h-3 w-[80%] mx-auto bg-black rounded-t-full absolute -top-1 left-1/2 transform -translate-x-1/2 opacity-90" />
            <p className="text-center mt-3 text-xs tracking-widest text-gray-600">
              {screen.screenType || "SCREEN"} THIS WAY
            </p>
          </div>
        </div>

        {/* ===================
              SEATS
        =================== */}
        <div className="flex flex-col items-center">
          {rows.split("").map((r) => (
            <div key={r} className="flex items-center mb-2">
              <span className="w-6 text-right mr-3 text-sm text-gray-500">
                {r}
              </span>

              <div className="flex items-center">
                {[...Array(leftSeats)].map((_, i) => {
                  const seat = `${r}${i + 1}`;
                  return (
                    <Seat
                      key={seat}
                      id={seat}
                      booked={booked}
                      selected={selected}
                      toggleSeat={toggleSeat}
                    />
                  );
                })}

                <div className="w-10" />

                {[...Array(rightSeats)].map((_, i) => {
                  const seat = `${r}${leftSeats + i + 1}`;
                  return (
                    <Seat
                      key={seat}
                      id={seat}
                      booked={booked}
                      selected={selected}
                      toggleSeat={toggleSeat}
                    />
                  );
                })}
              </div>

              <span className="w-6 ml-3 text-sm text-gray-500">{r}</span>
            </div>
          ))}
        </div>

        {/* LEGEND */}
        <div className="flex justify-center gap-8 mt-8 border-t pt-5">
          <Legend color="bg-gray-400" label="Sold" />
          <Legend color="bg-white" border label="Available" />
          <Legend label="Selected" style={{ backgroundColor: BMS_GREEN }} />
        </div>
      </div>

      {/* ===================
           PAY BAR
      =================== */}
      {selected.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg px-6 py-4 flex justify-between items-center z-50">
          <div>
            <div className="text-lg font-bold">
              {selected.length} / {limit} Ticket(s)
            </div>
            <div className="text-xs text-gray-500">{selected.join(", ")}</div>
          </div>

          <button
            className={`${BMS_BTN} text-white px-8 py-3 rounded-lg font-bold`}
            onClick={() =>
              navigate("/pay", {
                state: {
                  show,
                  seats: selected,
                  amount: total,
                },
              })
            }
          >
            Pay ₹ {total.toLocaleString("en-IN")}
          </button>
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------
// SEAT
// ------------------------------------------------
function Seat({ id, booked, selected, toggleSeat }) {
  const isBooked = booked.includes(id);
  const isSelected = selected.includes(id);

  let style =
    "w-7 h-6 mx-1 mb-1 rounded-t-md transition-all duration-150 flex items-center justify-center text-[9px] font-semibold select-none";

  if (isBooked) {
    style += " bg-gray-500 cursor-not-allowed text-white";
  } else if (isSelected) {
    style += " shadow-md scale-105 text-white";
  } else {
    style +=
      " bg-white border border-gray-400 cursor-pointer hover:bg-gray-200 text-gray-800";
  }

  return (
    <div
      title={id}
      className={style}
      style={isSelected ? { backgroundColor: BMS_GREEN } : {}}
      onClick={() => toggleSeat(id)}
    >
      {id.slice(1)}
    </div>
  );
}

