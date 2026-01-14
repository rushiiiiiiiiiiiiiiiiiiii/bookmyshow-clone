import React, { useRef, useEffect } from "react";
import { X, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SearchModal({
  open,
  onClose,
  search,
  setSearch,
  movies = [],
}) {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  if (!open) return null;

  const results = search
    ? movies.filter((m) =>
        m.title.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60">
      {/* CONTAINER */}
      <div
        className="
          bg-white
          w-full h-full
          md:h-auto md:max-w-4xl
          md:mx-auto md:mt-20
          md:rounded-xl
          shadow-2xl
          flex flex-col
        "
      >
        {/* HEADER / SEARCH BAR (STICKY) */}
        <div className="sticky top-0 z-10 bg-white border-b">
          <div className="flex items-center gap-4 px-4 py-4 md:px-6">
            <Search className="text-gray-400" />

            <input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for Movies, Events, Plays, Sports and more"
              className="
                w-full
                text-base md:text-lg
                font-medium
                text-gray-800
                outline-none
                placeholder:text-gray-400
              "
            />

            <button onClick={onClose}>
              <X className="text-gray-400 hover:text-black" />
            </button>
          </div>

          {/* CATEGORY TABS */}
          <div className="flex gap-3 px-4 pb-3 overflow-x-auto md:px-6">
            {["Movies", "Stream", "Events", "Plays", "Sports", "Activities"].map(
              (c) => (
                <span
                  key={c}
                  className="
                    whitespace-nowrap
                    px-4 py-1.5
                    rounded-full
                    text-sm
                    font-medium
                    text-[#f84464]
                    border border-[#f84464]/40
                    hover:bg-[#f84464]/10
                    cursor-pointer
                  "
                >
                  {c}
                </span>
              )
            )}
          </div>
        </div>

        {/* RESULTS */}
        <div className="flex-1 overflow-y-auto">
          {results.map((m) => (
            <div
              key={m.title}
              onClick={() => {
                navigate(`/movie/${encodeURIComponent(m.title)}`);
                onClose();
                setSearch("");
              }}
              className="
                flex items-center justify-between
                px-4 md:px-6 py-4
                cursor-pointer
                hover:bg-gray-100
              "
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded bg-gray-100">
                  🎬
                </div>
                <span className="text-gray-900 font-medium">
                  {m.title}
                </span>
              </div>

              <span className="text-gray-400 text-lg">›</span>
            </div>
          ))}

          {search && results.length === 0 && (
            <p className="px-6 py-8 text-gray-500">
              No results found for "<b>{search}</b>"
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
