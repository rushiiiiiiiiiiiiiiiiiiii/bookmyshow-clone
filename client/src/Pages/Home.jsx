import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronRight, Star, MapPin } from "lucide-react";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";

// --- BookMyShow Theme/Styling Constants ---
const BMS_BTN = "bg-[#f84464] hover:bg-[#e43a57] active:bg-[#d6334f]";

// --- Dummy Movies (Fallback if API empty) ---
const sampleMovies = [
  {
    id: 1,
    title: "The Great Escape",
    sub: "English · 2h 24m",
    rating: "9.1/10",
    poster: "https://m.media-amazon.com/images/I/81cy1dRCcyL.jpg",
  },
  {
    id: 2,
    title: "Midnight Run",
    sub: "Hindi · 2h 10m",
    rating: "8.8/10",
    poster:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtUq0qAPyNUHsoD_ImNGMUyQ_hHHG3-KGtJg&s",
  },
  {
    id: 3,
    title: "Space Odyssey",
    sub: "English · 2h 40m",
    rating: "9.4/10",
    poster: "https://m.media-amazon.com/images/I/81mZDyQhLBL.jpg",
  },
  {
    id: 4,
    title: "The Silent Sea",
    sub: "Korean · 1h 50m",
    rating: "8.2/10",
    poster:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuU604OLMlJX34WsCMzaL3xvKDelZ0qa5yAA&s",
  },
  {
    id: 5,
    title: "Future Shock",
    sub: "English · 2h 05m",
    rating: "7.9/10",
    poster:
      "https://vareverta.wordpress.com/wp-content/uploads/2014/01/future-shock-movie-poster-1993-1020394176.jpg?w=144",
  },
];

function shuffleArray(arr) {
  return [...arr].sort(() => 0.5 - Math.random());
}

// ============================================================
// HERO (UNCHANGED)
// ============================================================

function Hero({ city, carouselMovies }) {
  const navigate = useNavigate();
  const firstMovie = carouselMovies?.[0];

  return (
    <section className="relative bg-gradient-to-b from-[#fdf0f0] to-white rounded-b-xl shadow-inner">
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="col-span-2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
              Watch movies, events and plays near you
            </h1>
            <p className="mt-4 text-lg text-gray-700">
              Book tickets for your favourite movies, live shows and events in{" "}
              {city}
            </p>
            <div className="mt-8 flex gap-3">
              <button
                // onClick={() => navigate("/movies")}
                className={`px-6 py-3 rounded-lg text-white font-bold shadow-xl ${BMS_BTN}`}
              >
                Book Tickets
              </button>
              <button
                // onClick={() => navigate("/events")}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-800"
              >
                Theatres Near Me
              </button>
            </div>
          </div>
          {firstMovie && (
            <div
              onClick={() =>
                navigate(`/movie/${encodeURIComponent(firstMovie.title)}`)
              }
              className="hidden md:flex justify-end pr-8 cursor-pointer"
            >
              <div className="w-64 rounded-xl overflow-hidden shadow-2xl bg-white">
                <img
                  src={firstMovie.poster}
                  className="w-full h-72 object-cover"
                  alt={firstMovie.title}
                  onError={(e) => {
                    e.target.src = "";
                  }}
                />
                <div className="p-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Star size={14} className="text-[#f84464] mr-1" />
                    {firstMovie.rating || "8.5/10"}
                  </div>
                  <div className="font-bold text-xl truncate">
                    {firstMovie.title}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// TITLE

function SectionTitle({ title, viewAllTo }) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between max-w-7xl mx-auto px-4 mt-12 mb-4">
      <h3 className="text-2xl font-bold">{title}</h3>

      <span
        onClick={() => navigate(viewAllTo)}
        className="text-[#f84464] cursor-pointer text-sm hover:underline"
      >
        View All
      </span>
    </div>
  );
}

// MOVIE CARD (UNCHANGED)
function MovieCard({ m }) {
  const navigate = useNavigate();

  function goToMovie() {
    const safeName = encodeURIComponent(m.title);
    navigate(`/movie/${safeName}`);
  }

  return (
    <div
      onClick={goToMovie}
      className="w-[180px] sm:w-[220px] cursor-pointer transition hover:scale-105"
    >
      <div className="h-72 rounded-xl overflow-hidden shadow-lg">
        <img
          src={m.poster}
          alt={m.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="pt-2 font-bold truncate">{m.title}</div>
      <div className="text-xs text-gray-500 truncate">{m.sub}</div>
    </div>
  );
}

// THEATER CARD
function TheaterCard({ t }) {
  return (
    <div className="bg-white shadow rounded-lg p-3 flex gap-2">
      <MapPin size={16} className="text-[#f84464] mt-1" />
      <div>
        <div className="font-bold">{t.name}</div>
        <div className="text-xs text-gray-500">{t.location}</div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================
export default function Home() {
  const [city, setCity] = useState(() => {
    return localStorage.getItem("city") || "Mumbai";
  });

  useEffect(() => {
    function handleCityChange() {
      const updatedCity = localStorage.getItem("city");
      if (updatedCity) setCity(updatedCity);
    }

    window.addEventListener("cityChanged", handleCityChange);

    return () => {
      window.removeEventListener("cityChanged", handleCityChange);
    };
  }, []);

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselMovies = loading ? sampleMovies : movies;

  const randomRecommended = shuffleArray(carouselMovies).slice(0, 10);

  const [theatres, setTheatres] = useState([]);
  useEffect(() => {
    async function loadTheatres() {
      try {
        const res = await axios.get(
          `https://bookmyshow-backend-mzd2.onrender.com/api/user/theatres?city=${city}`
        );

        if (res.data.ok) {
          setTheatres(res.data.theatres || []);
        }
      } catch (err) {
        console.error("Failed to load theatres", err);
      }
    }

    loadTheatres();
  }, [city]);

  // useEffect(() => {
  //   const saved = localStorage.getItem("city");
  //   if (saved) setCity(saved);
  // }, []);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const res = await axios.get(
          `https://bookmyshow-backend-mzd2.onrender.com/api/user/shows?city=${city}`
        );

        const validShows = res.data.shows.filter(
          (s) =>
            s.status === "active" &&
            s.theatreId &&
            s.theatreId.status === "approved" &&
            s.theatreId.isActive === true &&
            s.screenId &&
            s.screenId.status === "active"
        );

        console.log("VALID SHOWS COUNT:", validShows.length);

        const seen = new Set();
        const list = [];

        validShows.forEach((s) => {
          if (!seen.has(s.movie)) {
            seen.add(s.movie);
            list.push({
              title: s.movie,
              poster: s.poster,
              sub: `${s.language} · ${s.format}`,
            });
          }
        });

        console.log("MOVIES LIST:", list);

        setMovies(list.length ? list : sampleMovies);
      } catch (err) {
        console.error("SHOW LOAD ERROR:", err);
        setMovies(sampleMovies);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [city]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar movies={carouselMovies} />

      <Hero city={city} carouselMovies={carouselMovies} />

      {/* RECOMMENDED MOVIES */}
      <SectionTitle
        title="Newly Launched Movies"
        viewAllTo="/shows?type=movies"
      />

      <div className="max-w-7xl mx-auto px-4 flex gap-6 overflow-x-auto pb-6">
        {carouselMovies.map((m, i) => (
          <MovieCard key={i} m={m} />
        ))}
      </div>

      {/* CATEGORY GRID (UNCHANGED) */}
      <SectionTitle title="Browse by Category" />
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 ">
        {["Comedy", "Sports", "Music", "Plays", "Workshops", "Movies"].map(
          (c, i) => (
            <div
              key={i}
              className="bg-white p-6 text-center shadow rounded-lg font-bold"
            >
              {c}
            </div>
          )
        )}
      </div>
      {/* UPCOMING MOVIES (✅ ADDED) */}
      <SectionTitle title="Upcoming Movies" />

      <div className="max-w-7xl mx-auto px-4 flex gap-6 overflow-x-auto pb-6">
        {[
          {
            title: "Dunki",
            img: "https://m.media-amazon.com/images/I/91zOCNs+x-L.jpg",
          },
          // {
          //   title: "Pushpa 2",
          //   img: "https://m.media-amazon.com/images/M/MV5BZjllNTdiM2QtYjQ0Ni00ZGM1LWFlYmUtNWY0YjMzYWIxOTYxXkEyXkFqcGc@._V1_.jpg",
          // },
          {
            title: "KGF Chapter 3",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE5XXL0RadcwWnn6JfiAlGK5lvHiZ1lMhogA&s",
          },
          {
            title: "Animal Park",
            img: "https://preview.redd.it/talking-about-animal-park-v0-bngithurymyd1.jpeg?width=1080&crop=smart&auto=webp&s=c449d59919c1a8972290fd9d6e92208e528d686d",
          },
          {
            title: "Salaar 2",
            img: "https://m.media-amazon.com/images/M/MV5BOGE3YWQ3NzAtNmEwOS00OGY5LThkNzEtZDg5NDRjMzRmMzhiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
          },
          {
            title: "Tiger 3",
            img: "https://upload.wikimedia.org/wikipedia/en/f/f8/Tiger_3_poster.jpg",
          },
          // {
          //   title: "Fighter",
          //   img: "https://upload.wikimedia.org/wikipedia/en/d/df/Fighter_film_teaser.jpg",
          // },
          {
            title: "Jawan 2",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5xzqrrx8pVxJ5eJd_PbVV1WVxRcPRHrRNNA&s",
          },
        ].map((m, i) => (
          <div
            key={i}
            className="w-48 rounded-lg cursor-pointer hover:scale-105 transition"
          >
            <div className="h-72 rounded-lg overflow-hidden shadow-lg">
              <img
                src={m.img}
                alt={m.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="font-bold mt-2 text-center">{m.title}</div>
          </div>
        ))}
      </div>

      {/* THEATERS (✅ ADDED) */}
      {/* THEATERS (FROM BACKEND) */}
      <SectionTitle
        title={`Theatres Near You (${city})`}
        viewAllTo="/shows?type=theatres"
      />

      <div className="max-w-7xl mx-auto mb-10 px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {theatres.length === 0 ? (
          <p className="text-gray-500 col-span-full">No theatres found</p>
        ) : (
          theatres
            .filter(
              (t) =>
                t.city === city &&
                t.status === "approved" && // ✅ ADD THIS
                t.isActive === true // ✅ ADD THIS
            )
            .map((t) => (
              <TheaterCard
                key={t._id}
                t={{
                  name: t.name,
                  location: t.city,
                }}
              />
            ))
        )}
      </div>

      {/* EXTRA RECOMMENDED MOVIES (✅ NEW) */}
      <SectionTitle
        title="Recommended For You"
        viewAllTo="/shows?type=recommended"
      />

      <div className="max-w-7xl mx-auto px-4 flex gap-6 overflow-x-auto pb-10">
        {randomRecommended.map((m, i) => (
          <MovieCard key={i} m={m} />
        ))}
      </div>

      <Footer />
    </div>
  );
}
