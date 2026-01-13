import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";
import { MapPin, Clock, BadgeCheck, Subtitles, Ticket } from "lucide-react";

export default function BuyTicketsPage() {
  const { movieName } = useParams();
  const navigate = useNavigate();
  const decodedName = decodeURIComponent(movieName);

  const [shows, setShows] = useState([]);
  const [dates, setDates] = useState([]);
  const [activeDate, setActiveDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get(
          `https://bookmyshow-backend-mzd2.onrender.com/api/shows/movie?movie=${encodeURIComponent(
            decodedName
          )}`
        );

        if (res.data.ok) {
          setShows(res.data.shows);
          const uniqueDates = [...new Set(res.data.shows.map((s) => s.date))];
          setDates(uniqueDates);
          setActiveDate(uniqueDates[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [decodedName]);

  const filteredShows = shows.filter((s) => s.date === activeDate);

  if (loading) return <div className="p-10 text-center">Loading shows...</div>;

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <Navbar />

      {/* MOVIE HEADER */}
      <div className="bg-white w-[95%] m-auto">
        <div className="max-w-7xl mx-auto px-4 py-4 flex gap-5">
          {/* POSTER */}
          {filteredShows[0]?.poster && (
            <img
              src={filteredShows[0].poster}
              alt={decodedName}
              className="w-24 h-36 object-cover rounded-md shadow"
            />
          )}

          {/* DETAILS */}
          <div>
            <h1 className="text-2xl font-bold">{decodedName}</h1>

            <div className="flex flex-wrap gap-2 mt-2 text-xs">
              <Badge>{filteredShows[0]?.certificate}</Badge>
              <Badge>{filteredShows[0]?.language}</Badge>
              <Badge>{filteredShows[0]?.format}</Badge>
              {filteredShows[0]?.isSubtitled && <Badge>Subtitles</Badge>}
            </div>

            <div className="mt-2 text-xs text-gray-600 flex gap-4">
              <span className="flex items-center gap-1">
                <Clock size={14} /> {filteredShows[0]?.durationMinutes} mins
              </span>

              <span className="flex items-center gap-1">
                <BadgeCheck size={14} /> {filteredShows[0]?.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DATE STRIP */}
      <div className="bg-white mt-2  w-[95%] m-auto">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-3 overflow-x-auto">
          {dates.map((date) => {
            const isActive = activeDate === date;
            return (
              <button
                key={date}
                onClick={() => setActiveDate(date)}
                className={`min-w-[70px] h-[56px] rounded-lg text-sm flex flex-col items-center justify-center
                ${
                  isActive
                    ? "bg-[#f84464] text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }
                `}
              >
                <div className="font-bold">
                  {new Date(date).toLocaleDateString("en-IN", {
                    weekday: "short",
                  })}
                </div>
                <div className="text-xs">
                  {new Date(date).getDate()}{" "}
                  {new Date(date).toLocaleDateString("en-IN", {
                    month: "short",
                  })}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* LEGEND */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex gap-5 text-xs text-gray-600  w-[95%] m-auto">
        <Legend color="bg-green-500" label="Available" />
        <Legend color="bg-yellow-400" label="Fast Filling" />
      </div>

      {/* SHOW LIST */}
      <div className="max-w-7xl mx-auto px-4 pb-24 space-y-5 w-[95%] m-auto">
        {filteredShows.map((show) => (
          <div
            key={show._id}
            className="bg-white rounded-xl px-4 py-3 shadow-sm"
          >
            {/* THEATRE INFO */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-[15px] flex items-center gap-1">
                  <MapPin size={14} /> {show.theatreId.name}
                </h3>

                <p className="text-xs text-gray-500">{show.screenId.name}</p>

                <p className="text-xs text-gray-400 mt-[2px]">
                  {show.language} · {show.format} · {show.certificate}
                  {show.isSubtitled && " · Subs"}
                </p>
              </div>

              <div className="text-xs text-green-600 font-semibold">
                {show.status.toUpperCase()}
              </div>
            </div>

            {/* TIME */}
            <div className="mt-3 flex items-center gap-5">
              <button
                onClick={() => navigate(`/seats/${show._id}`)}
                className="border border-green-500 text-green-600 px-4 py-2 rounded-md font-semibold hover:bg-green-50"
              >
                {show.time}
              </button>

              {show.fillPercent > 50 && (
                <span className="text-xs font-semibold text-orange-600">
                  FAST FILLING
                </span>
              )}

              <span className="ml-auto text-sm font-bold">₹ {show.price}</span>
            </div>
          </div>
        ))}

        {filteredShows.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            No shows available for this date
          </div>
        )}
      </div>
    </div>
  );
}

/* SMALL COMPONENTS */

function Badge({ children }) {
  return (
    <span className="border rounded-full px-3 py-[2px] text-gray-700 text-[11px]">
      {children}
    </span>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${color}`} />
      {label}
    </div>
  );
}
