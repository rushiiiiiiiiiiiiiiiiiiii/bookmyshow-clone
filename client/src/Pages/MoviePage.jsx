import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Clock, Globe, BadgeCheck, Star } from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const BMS_BTN = "bg-[#f84464] hover:bg-[#e43a57] active:bg-[#d6334f]";

export default function MoviePage() {
  const { name } = useParams();
  const movieName = decodeURIComponent(name);
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await axios.get(
        `https://bookmyshow-backend-mzd2.onrender.com/api/shows/movie?movie=${encodeURIComponent(
          movieName
        )}`
      );

      if (res.data.ok && res.data.shows.length > 0) {
        setMovie(res.data.shows[0]);
      }

      setLoading(false);
    }

    load();
  }, [movieName]);

  if (loading) {
    return (
      <div className="p-10 text-center text-lg text-gray-600">
        Loading movie...
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold">Movie Not Found</h2>
        <p className="text-gray-500 mt-2">
          No shows available for "{movieName}"
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <Navbar />

      {/* HERO */}
      <div
        className="h-[420px] bg-cover bg-center relative"
        style={{ backgroundImage: `url(${movie.poster})` }}
      >
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative max-w-7xl mx-auto px-6 h-full flex items-end pb-8">
          <div className="flex gap-8">
            {/* POSTER */}
            <img
              src={movie.poster}
              className="h-72 rounded-lg shadow-xl"
              alt={movie.movie}
            />

            {/* DETAILS */}
            <div className="text-white">
              <h1 className="text-4xl font-bold">{movie.movie}</h1>

              <div className="mt-3 flex gap-4 items-center text-sm">
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

              <div className="mt-2 text-sm text-gray-300">
                Format: {movie.format} | Subtitles:{" "}
                {movie.isSubtitled ? "Yes" : "No"}
              </div>

              <button
                className={`mt-6 px-6 py-3 rounded-lg text-white ${BMS_BTN}`}
                onClick={() => navigate(`/buytickets/${movie.movie}`)}
              >
                Book Tickets
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <div className="bg-white py-6">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-xl font-bold mb-2">About the movie</h2>
          <p className="text-gray-700">
            Stranger Things Season 5 continues the thrilling saga of Hawkins
            with dark mysteries, supernatural forces, and intense battles
            between good and evil.
          </p>
        </div>
      </div>

      {/* CAST & CREW */}
      {/* <div className="max-w-7xl mx-auto px-6 mt-10">
        <h2 className="text-xl font-bold mb-4">Cast & Crew</h2>

        <div className="flex gap-6 overflow-x-auto">
          {[
            {
              name: "Millie Bobby Brown",
              role: "Eleven",
              img: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Millie_Bobby_Brown_by_Gage_Skidmore_2.jpg",
            },
            {
              name: "Finn Wolfhard",
              role: "Mike",
              img: "https://upload.wikimedia.org/wikipedia/commons/3/32/Finn_Wolfhard_by_Gage_Skidmore_2.jpg",
            },
            {
              name: "Noah Schnapp",
              role: "Will",
              img: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Noah_Schnapp_by_Gage_Skidmore.jpg",
            },
            {
              name: "David Harbour",
              role: "Hopper",
              img: "https://upload.wikimedia.org/wikipedia/commons/f/f5/David_Harbour_by_Gage_Skidmore.jpg",
            },
          ].map((c, i) => (
            <div key={i} className="w-36 text-center">
              <img
                src={c.img}
                className="h-44 w-full object-cover rounded-lg shadow"
                alt={c.name}
              />
              <h4 className="font-semibold mt-2">{c.name}</h4>
              <p className="text-sm text-gray-500">{c.role}</p>
            </div>
          ))}
        </div>
      </div> */}

      {/* REVIEWS */}
      <div className="max-w-7xl mx-auto px-6 mt-12 mb-10">
        <h2 className="text-xl font-bold mb-4">Top Reviews</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              user: "Rahul Mehta",
              rating: 5,
              text: "Mind-blowing season! Every episode was intense.",
            },
            {
              user: "Sneha Sharma",
              rating: 4,
              text: "Great story and acting. Worth watching in theatre!",
            },
            {
              user: "Aman Verma",
              rating: 4,
              text: "Amazing visuals and music. Actors did a great job!",
            },
            {
              user: "Neha Kulkarni",
              rating: 5,
              text: "Best season so far. Totally loved it!",
            },
          ].map((r, i) => (
            <div key={i} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between mb-2">
                <h4 className="font-semibold">{r.user}</h4>
                <div className="flex">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className="text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 text-sm">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
      {/* UPCOMING */}
      <div className="max-w-7xl mx-auto px-6 mb-10 mt-12">
        <h2 className="text-xl font-bold mb-4">Upcoming Movies</h2>

        <div className="flex gap-6 overflow-x-auto">
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
              img: "https://m.media-amazon.com/images/M/MV5BOGE3YWQ3NzAtNmEwOS00OGY5LThkNzEtZDg5NDRjMzRmMzhiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
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
            <div key={i} className="w-40">
              <img
                src={m.img}
                className="h-56 rounded-lg shadow object-cover"
                alt={m.title}
              />
              <div className="mt-2 font-bold text-center">{m.title}</div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
