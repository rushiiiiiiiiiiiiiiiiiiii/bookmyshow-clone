import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { MapPin, Clock, Film } from "lucide-react";

export default function UserShows() {
  const city = localStorage.getItem("city") || "Mumbai";
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const type = params.get("type") || "movies";

  const [shows, setShows] = useState([]);
  const [theatres, setTheatres] = useState([]);

  useEffect(() => {
    if (type === "theatres") {
      loadTheatres();
    } else {
      loadShows();
    }
  }, [city, type]);

  /* =========================
     LOAD SHOWS (FOR MOVIES)
  ========================= */
  async function loadShows() {
    const res = await axios.get(
      `http://localhost:8000/api/user/shows?city=${city}`
    );
    if (res.data.ok) setShows(res.data.shows);
  }

  /* =========================
     LOAD THEATRES (ALL)
  ========================= */
  async function loadTheatres() {
    const res = await axios.get(
      `http://localhost:8000/api/user/theatres?city=${city}`
    );
    if (res.data.ok) setTheatres(res.data.theatres);
  }

  /* =========================
     MOVIES (DEDUPED)
  ========================= */
  const moviesMap = {};
  shows.forEach((s) => {
    if (!moviesMap[s.movie]) {
      moviesMap[s.movie] = {
        title: s.movie,
        poster: s.poster,
        language: s.language,
        format: s.format,
      };
    }
  });
  const movies = Object.values(moviesMap);

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">
          {type === "movies" && `Movies in ${city}`}
          {type === "upcoming" && "Upcoming Movies"}
          {type === "recommended" && "Recommended Movies"}
          {type === "theatres" && `Theatres in ${city}`}
        </h2>

        {/* ================= MOVIES VIEW ================= */}
        {type !== "theatres" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {movies.map((m, i) => (
              <div
                key={i}
                onClick={() =>
                  navigate(`/movie/${encodeURIComponent(m.title)}`)
                }
                className="cursor-pointer hover:scale-105 transition"
              >
                <div className="h-72 rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={m.poster}
                    alt={m.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="mt-2 font-bold truncate">{m.title}</div>
                <div className="text-xs text-gray-500">
                  {m.language} · {m.format}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= THEATRES VIEW ================= */}
        {type === "theatres" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {theatres.map((t) => (
              <div
                key={t._id}
                // onClick={() => navigate(`/theatre/${t.slug}`)}
                className="bg-white p-5 rounded-xl shadow hover:shadow-xl transition"
              >
                <h4 className="font-bold text-lg flex items-center gap-2">
                  <Film size={18} /> {t.name}
                </h4>

                <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                  <MapPin size={14} /> {t.address}
                </p>

                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <Clock size={14} />
                  {t.openingTime} – {t.closingTime}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {t.amenities.slice(0, 3).map((a, i) => (
                    <span
                      key={i}
                      className="text-xs bg-gray-100 px-2 py-1 rounded"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
