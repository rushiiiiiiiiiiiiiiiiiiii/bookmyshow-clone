import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Clock, Globe, BadgeCheck, Star } from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { toast } from "react-hot-toast";

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
  const [submitting, setSubmitting] = useState(false);

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
      <>
        <Navbar />
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-14 h-14 border-[4px] border-[#f84464]/20 border-t-[#f84464] rounded-full animate-spin"></div>
        </div>
      </>
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
      {/* HERO */}
      <div
        className="
    relative
    h-[420px]
    sm:h-[400px]
    md:h-[440px]
    bg-cover
    bg-center
  "
        style={{ backgroundImage: `url(${movie.poster})` }}
      >
        {/* DARK OVERLAY */}
<div className="
  absolute inset-0
  bg-black/15
  sm:bg-gradient-to-t
  sm:from-black/55
  sm:via-black/30
  sm:to-black/5
"></div>



        {/* CONTENT */}
        {/* CONTENT */}
       <div
  className="
    relative h-full
    flex flex-col items-center justify-center
    sm:flex-col sm:items-center sm:justify-end
    md:flex-row md:items-center md:justify-start
    px-4 sm:px-6
    max-w-7xl mx-auto
  "
>

          {/* POSTER */}
          <img
            src={movie.poster}
            alt={movie.movie}
            className="
    h-56 w-40
    sm:h-72 sm:w-48
    md:h-80 md:w-56
    object-cover
    rounded-2xl
    shadow-[0_20px_40px_rgba(0,0,0,0.7)]
    border border-white/10
    mb-5 sm:mb-6 md:mb-0
  "
          />

          {/* DETAILS */}
          <div
            className="
    text-white
    text-center sm:text-center
    md:text-left
    md:ml-10
    max-w-xl
    md:-translate-y-10
  "
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              {movie.movie}
            </h1>

            <div className="flex justify-center sm:justify-start gap-4 text-xs sm:text-sm text-gray-300 mb-2">
              <span className="flex items-center gap-1">
                <Clock size={14} /> {movie.durationMinutes} mins
              </span>
              <span className="flex items-center gap-1">
                <Globe size={14} /> {movie.language}
              </span>
              <span className="flex items-center gap-1">
                <BadgeCheck size={14} /> {movie.certificate}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-400 mb-4">
              {movie.format} • Subtitles: {movie.isSubtitled ? "Yes" : "No"}
            </p>

            <button
              className={`
          ${BMS_BTN}
          w-full sm:w-auto
          px-8
          py-3
          rounded-xl
          text-white
          font-semibold
          text-base
          shadow-lg
        `}
              onClick={() => navigate(`/buytickets/${movie.movie}`)}
            >
              Book Tickets
            </button>
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
            disabled={submitting}
            className={`${BMS_BTN} px-6 py-2 text-white rounded-lg flex items-center justify-center gap-2 disabled:opacity-70`}
            onClick={async () => {
              if (!comment.trim()) {
                toast.error("Please write a review before submitting");
                return;
              }

              try {
                setSubmitting(true);

                await axios.post(
                  "https://bookmyshow-backend-mzd2.onrender.com/api/reviews",
                  { movie: movie.movie, rating, comment },
                  { withCredentials: true },
                );

                toast.success("Review submitted successfully 🎉");

                setComment("");
                setRating(5);

                const reviewRes = await axios.get(
                  `https://bookmyshow-backend-mzd2.onrender.com/api/reviews/${encodeURIComponent(
                    movie.movie,
                  )}`,
                );

                setReviews(reviewRes.data.reviews);
              } catch (err) {
                if (err.response?.status === 401) {
                  toast.error("Please login to submit a review");
                  navigate("/register");
                  return;
                }

                toast.error(
                  err.response?.data?.message ||
                    "Failed to submit review. Please try again.",
                );
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
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
