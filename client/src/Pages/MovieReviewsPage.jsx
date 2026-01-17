import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Star, ArrowLeft } from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

export default function MovieReviewsPage() {
  const { name } = useParams();
  const movieName = decodeURIComponent(name);
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await axios.get(
        `https://bookmyshow-backend-mzd2.onrender.com/api/reviews/${encodeURIComponent(movieName)}`,
      );

      if (res.data.ok) {
        setReviews(res.data.reviews);
      }

      setLoading(false);
    }

    load();
  }, [movieName]);

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : null;

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-500">Loading reviews...</div>
    );
  }

  return (
    <div className="bg-[#f5f5f5] min-h-screen pb-20">
      <Navbar />

      {/* HEADER */}
      <div className="max-w-5xl mx-auto px-6 mt-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-4"
        >
          <ArrowLeft size={16} />
          Back to movie
        </button>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h1 className="text-2xl font-bold mb-2">Audience Reviews</h1>

          <div className="flex items-center gap-4">
            <p className="text-gray-600">{movieName}</p>

            {averageRating && (
              <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                <Star size={14} className="fill-green-600 text-green-600" />
                {averageRating} / 5
              </div>
            )}
          </div>
        </div>
      </div>

      {/* REVIEWS LIST */}
      <div className="max-w-5xl mx-auto px-6 mt-8 pb-10">
        {reviews.length === 0 && (
          <div className="bg-white rounded-xl p-10 text-center text-gray-500 shadow-sm">
            No reviews yet. Be the first to review 🎬
          </div>
        )}

        <div className="space-y-5">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition"
            >
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

              <p className="text-gray-600 text-sm leading-relaxed">
                {r.comment}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
