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

const BANNERS = [
  "https://www.adgully.com/img/800/201712/creative_tvc.jpg",
  "https://cdn.grabon.in/gograbon/indulge/wp-content/uploads/2023/08/ticket-purchase.jpg",
  "https://blog.releasemyad.com/wp-content/uploads/2020/07/bookmyshow.jpg",
  "https://images.freekaamaal.com/post_images/1582183521.png",
  "https://assets-in-gm.bmscdn.com/promotions/cms/creatives/1765883058083_popdesjan.jpg",
  "https://couponswala.com/blog/wp-content/uploads/2021/07/25-1-1-1024x576.jpg.webp",
  "https://in.bmscdn.com/offers/tncbanner/get-rs-100-off-on-your-tickets-take100.jpg?03072023171523",
  "https://cd9941cc.delivery.rocketcdn.me/wp-content/uploads/2024/06/Book-My-Show-HSBC-NEws2-Post.jpg",
  "https://bsmedia.business-standard.com/_media/bs/img/article/2016-07/05/full/1467721201-5966.jpg?im=FeatureCrop,size=(826,465)",
];

export function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % BANNERS.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-gray-100 py-4">
      <div className="max-w-7xl mx-auto px-4">
        {/* BANNER CONTAINER */}
        <div className="relative h-[160px] sm:h-[220px] md:h-[300px] overflow-hidden rounded-xl bg-black">
          {BANNERS.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === active ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <img
                src={img}
                alt="promo-banner"
                className="w-full h-full object-cover"
                draggable="false"
              />
            </div>
          ))}

          {/* DOT INDICATORS */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {BANNERS.map((_, i) => (
              <span
                key={i}
                onClick={() => setActive(i)}
                className={`h-2 w-2 rounded-full cursor-pointer transition ${
                  i === active ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// https://www.adgully.com/img/800/201712/creative_tvc.jpg
// https://cdn.grabon.in/gograbon/indulge/wp-content/uploads/2023/08/ticket-purchase.jpg
// https://blog.releasemyad.com/wp-content/uploads/2020/07/bookmyshow.jpg
// https://images.freekaamaal.com/post_images/1582183521.png
// https://couponswala.com/blog/wp-content/uploads/2021/07/25-1-1-1024x576.jpg.webp
// https://in.bmscdn.com/offers/tncbanner/get-rs-100-off-on-your-tickets-take100.jpg?03072023171523
// https://cd9941cc.delivery.rocketcdn.me/wp-content/uploads/2024/06/Book-My-Show-HSBC-NEws2-Post.jpg
// https://bsmedia.business-standard.com/_media/bs/img/article/2016-07/05/full/1467721201-5966.jpg?im=FeatureCrop,size=(826,465)

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
const upcomingMovies = [
  {
    title: "Dunki",
    poster: "https://m.media-amazon.com/images/I/91zOCNs+x-L.jpg",
    sub: "Hindi · Action",
  },
  {
    title: "KGF Chapter 3",
    poster:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE5XXL0RadcwWnn6JfiAlGK5lvHiZ1lMhogA&s",
    sub: "Kannada · Action",
  },
  {
    title: "Animal Park",
    poster:
      "https://preview.redd.it/talking-about-animal-park-v0-bngithurymyd1.jpeg?width=1080&crop=smart&auto=webp&s=c449d59919c1a8972290fd9d6e92208e528d686d",
    sub: "Hindi · Crime",
  },
  {
    title: "Salaar 2",
    poster:
      "https://m.media-amazon.com/images/M/MV5BOGE3YWQ3NzAtNmEwOS00OGY5LThkNzEtZDg5NDRjMzRmMzhiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    sub: "Telugu · Action",
  },
  {
    title: "Tiger 3",
    poster: "https://upload.wikimedia.org/wikipedia/en/f/f8/Tiger_3_poster.jpg",
    sub: "Hindi · Action",
  },
  {
    title: "Jawan 2",
    poster:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5xzqrrx8pVxJ5eJd_PbVV1WVxRcPRHrRNNA&s",
    sub: "Hindi · Thriller",
  },
];

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
          `http://localhost:8000/api/user/theatres?city=${city}`
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
          `http://localhost:8000/api/user/shows?city=${city}`
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
      {/* STREAM PROMO BANNER */}
      <div className="max-w-7xl mx-auto px-4 my-10">
        <div className="rounded-xl overflow-hidden cursor-pointer">
          <img
            src="https://assets-in.bmscdn.com/discovery-catalog/collections/tr:w-1440,h-120/stream-leadin-web-collection-202210241242.png"
            alt="BookMyShow Stream"
            draggable="false"
            className="
        w-full
        h-[80px] sm:h-[180px] md:h-[120px]
        object-fill
      "
          />
        </div>
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
      {/* UPCOMING MOVIES */}
      <SectionTitle title="Upcoming Movies" />

      <div className="max-w-7xl mx-auto px-4 flex gap-6 overflow-x-auto pb-6">
        {upcomingMovies.map((m, i) => (
          <MovieCard key={i} m={m} />
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
