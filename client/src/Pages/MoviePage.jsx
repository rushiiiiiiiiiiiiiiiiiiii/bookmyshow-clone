import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Clock, Globe, BadgeCheck, Star } from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const BMS_BTN =
  "bg-[#f84464] hover:bg-[#e43a57] active:bg-[#d6334f] transition-all duration-200";

export default function MoviePage() {
  const { name } = useParams();
  const movieName = decodeURIComponent(name);
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [suggested, setSuggested] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await axios.get(
        `https://bookmyshow-backend-mzd2.onrender.com/api/shows/movie?movie=${encodeURIComponent(
          movieName,
        )}`,
      );

      if (res.data.ok && res.data.shows.length > 0) {
        setMovie(res.data.shows[0]);
      }

      const reviewRes = await axios.get(
        `https://bookmyshow-backend-mzd2.onrender.com/api/reviews/${encodeURIComponent(movieName)}`,
      );

      if (reviewRes.data.ok) {
        setReviews(reviewRes.data.reviews);
      }

      const suggestedRes = await axios.get(
        `https://bookmyshow-backend-mzd2.onrender.com/api/shows/suggested?exclude=${encodeURIComponent(
          movieName,
        )}`,
      );

      if (suggestedRes.data.ok) {
        setSuggested(suggestedRes.data.movies);
      }

      setLoading(false);
    }

    load();
  }, [movieName]);

  useEffect(() => {
    async function load() {
      const res = await axios.get(
        `https://bookmyshow-backend-mzd2.onrender.com/api/shows/movie?movie=${encodeURIComponent(
          movieName,
        )}`,
      );

      if (res.data.ok && res.data.shows.length > 0) {
        setMovie(res.data.shows[0]);
      }

      setLoading(false);
    }

    load();
  }, [movieName]);

  const visibleReviews = reviews.slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-[5px] border-[#f84464]/20 border-t-[#f84464] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-2xl font-bold">Movie Not Found</h2>
        <p className="text-gray-500 mt-2">
          No shows available for "{movieName}"
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f5f5] min-h-screen pb-20">
      <Navbar />

      {/* HERO */}
      <div
        className="relative h-[440px] bg-cover bg-center"
        style={{ backgroundImage: `url(${movie.poster})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40"></div>

        <div className="relative max-w-7xl mx-auto px-6 h-full flex items-end pb-10">
          <div className="flex gap-10 items-end">
            <img
              src={movie.poster}
              className="h-80 w-56 object-cover rounded-2xl shadow-2xl border border-white/10"
              alt={movie.movie}
            />

            <div className="text-white max-w-xl pb-20">
              <h1 className="text-4xl font-bold mb-3">{movie.movie}</h1>

              <div className="flex gap-5 items-center text-sm text-gray-200 mb-3">
                <span className="flex gap-1 items-center">
                  <Clock size={14} /> {movie.durationMinutes} mins
                </span>
                <span className="flex gap-1 items-center">
                  <Globe size={14} /> {movie.language}
                </span>
                <span className="flex gap-1 items-center">
                  <BadgeCheck size={14} /> {movie.certificate}
                </span>
              </div>

              <p className="text-sm text-gray-300 mb-6">
                {movie.format} • Subtitles: {movie.isSubtitled ? "Yes" : "No"}
              </p>

              <button
                className={`px-8 py-3 rounded-lg text-white font-semibold ${BMS_BTN}`}
                onClick={() => navigate(`/buytickets/${movie.movie}`)}
              >
                Book Tickets
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <div className="max-w-7xl mx-auto px-6 mt-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold mb-2">About the movie</h2>
          <p className="text-gray-700 leading-relaxed">
            {movie.movieDescription ||
              "No description available for this movie."}
          </p>
        </div>
      </div>

      {/* WRITE REVIEW */}
      <div className="max-w-7xl mx-auto px-6 mt-14">
        <div className="bg-white p-6 rounded-2xl shadow-md mb-10">
          <h3 className="text-lg font-semibold mb-4">Write a Review</h3>

          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                size={22}
                className={`cursor-pointer transition ${
                  n <= rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300 hover:text-yellow-300"
                }`}
                onClick={() => setRating(n)}
              />
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
            className="w-full border rounded-xl p-4 mb-4 resize-none focus:ring-2 focus:ring-[#f84464] outline-none"
          />

          <button
            className={`${BMS_BTN} px-6 py-2 text-white rounded-lg`}
            onClick={async () => {
              await axios.post(
                "https://bookmyshow-backend-mzd2.onrender.com/api/reviews",
                { movie: movie.movie, rating, comment },
                { withCredentials: true },
              );

              setComment("");
              setRating(5);

              const reviewRes = await axios.get(
                `https://bookmyshow-backend-mzd2.onrender.com/api/reviews/${encodeURIComponent(
                  movie.movie,
                )}`,
              );
              setReviews(reviewRes.data.reviews);
            }}
          >
            Submit Review
          </button>
        </div>
      </div>

      {/* REVIEWS */}

      {/* REVIEWS */}
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-xl font-bold mb-6">Top Reviews</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {reviews.length === 0 && (
            <p className="text-gray-500 col-span-2 text-center">
              Be the first one to review this movie 🎬
            </p>
          )}

          {visibleReviews.map((r, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-gray-800">{r.userName}</h4>
                <div className="flex gap-1">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className="text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 text-sm">{r.comment}</p>
            </div>
          ))}
        </div>

        {reviews.length > 4 && (
          <div className="text-center mt-6">
            <button
              className="text-[#f84464] font-semibold hover:underline"
              onClick={() =>
                navigate(`/movie/${encodeURIComponent(movieName)}/reviews`)
              }
            >
              Load more reviews
            </button>
          </div>
        )}
      </div>

      {/* SUGGESTED MOVIES */}
      {suggested.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 mt-16">
          <h2 className="text-xl font-bold mb-5">Suggested Movies</h2>

          <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar">
            {suggested.map((m, i) => (
              <div
                key={i}
                className="w-40 shrink-0 cursor-pointer"
                onClick={() =>
                  navigate(`/movie/${encodeURIComponent(m.movie)}`)
                }
              >
                <img
                  src={m.poster}
                  className="h-60 w-full rounded-2xl shadow-md object-cover hover:scale-105 transition"
                  alt={m.movie}
                />
                <div className="mt-2 font-semibold text-center">{m.movie}</div>
              </div>
            ))}
          </div>
        </div>
      )}

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

      {/* UPCOMING */}
      <div className="max-w-7xl mx-auto px-6 mt-16 mb-12">
        <h2 className="text-xl font-bold mb-5">Upcoming Movies</h2>

        <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar">
          {[
            {
              title: "Dunki",
              img: "https://m.media-amazon.com/images/I/91zOCNs+x-L.jpg",
            },
            {
              title: "Pushpa 2",
              img: "https://m.media-amazon.com/images/M/MV5BZjllNTdiM2QtYjQ0Ni00ZGM1LWFlYmUtNWY0YjMzYWIxOTYxXkEyXkFqcGc@._V1_.jpg",
            },
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
              img: "https://m.media-amazon.com/images/M/MV5BOGE3YWQ3NzAtNmEwOS00OGY5LThkNzEtZDg5NDRjMzRmMzhiXkEyXkFqcGc@._V1_.jpg",
            },
            {
              title: "Tiger 3",
              img: "https://upload.wikimedia.org/wikipedia/en/f/f8/Tiger_3_poster.jpg",
            },
            {
              title: "Fighter",
              img: "https://upload.wikimedia.org/wikipedia/en/d/df/Fighter_film_teaser.jpg",
            },
            {
              title: "Jawan 2",
              img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5xzqrrx8pVxJ5eJd_PbVV1WVxRcPRHrRNNA&s",
            },
          ].map((m, i) => (
            <div key={i} className="w-40 shrink-0">
              <img
                src={m.img}
                className="h-60 w-full rounded-2xl shadow-md object-cover hover:scale-105 transition"
                alt={m.title}
              />
              <div className="mt-2 font-semibold text-center">{m.title}</div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
