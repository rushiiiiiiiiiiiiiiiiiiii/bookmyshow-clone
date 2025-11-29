import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Search } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";

/* ===================================================
   SELLER NAVBAR (BookMyShow Partner Panel)
=================================================== */
function SellerNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  function signOut() {
    document.cookie = "seller_token=; Max-Age=0; path=/;";
    window.location.href = "/seller/signin";
  }

  const isActive = (path) =>
    location.pathname.startsWith(path)
      ? "text-[#f84464] font-semibold"
      : "text-gray-700 hover:text-black";

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* LEFT: LOGO */}
        <div
          onClick={() => navigate("/seller/dashboard")}
          className="cursor-pointer flex items-center gap-3"
        >
          {/* <img
            src="https://upload.wikimedia.org/wikipedia/commons/7/75/Bookmyshow-logoid.png"
            className="h-8"
            alt="BookMyShow Partner"
          /> */}
          <span className="text-lg font-semibold text-gray-500">
            Partner Panel
          </span>
        </div>

        {/* CENTER: MENU */}
        <nav className="flex gap-6 text-sm">
          <button
            onClick={() => navigate("/seller/dashboard")}
            className={isActive("/seller/dashboard")}
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/seller/theatres")}
            className={isActive("/seller/theatres")}
          >
            Theatres
          </button>

          <button
            onClick={() => navigate("/seller/screens")}
            className={isActive("/seller/screens")}
          >
            Screens
          </button>

          <button
            onClick={() => navigate("/seller/shows")}
            className={isActive("/seller/shows")}
          >
            Shows
          </button>
        </nav>

        {/* RIGHT: PROFILE MENU */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#f84464] text-white flex items-center justify-center font-semibold">
              S
            </div>
            <ChevronDown size={16} />
          </button>

          {/* DROPDOWN */}
          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white  rounded-lg shadow-md">
              <button
                onClick={signOut}
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                <LogOut size={14} />
                Logout
              </button>
              <button onClick={()=> navigate('/profile')}>
                Your booking
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* ===================================================
   USER NAVBAR (Public User Navbar)
=================================================== */
function UserNavbar() {
  const [city, setCity] = useState(localStorage.getItem("city") || "Mumbai");
  const [showCityMenu, setShowCityMenu] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const cityRef = useRef(null);
  const profileRef = useRef(null);

  // Check login
  useEffect(() => {
    const hasToken = document.cookie.includes("token=");
    setLoggedIn(hasToken);
  }, []);
  function selectCity(cityName) {
    setCity(cityName);
    localStorage.setItem("city", cityName);
    setShowCityMenu(false);
    window.location.reload();
  }

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target)) {
        setShowCityMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    document.cookie = "token=; Max-Age=0; path=/;";
    window.location.reload();
  };

  const categories = [
    "Movies",
    "Stream",
    "Events",
    "Plays",
    "Sports",
    "Activities",
    "Monuments",
    "Buzz",
    "Kids",
    "Offers",
  ];

  const popularCities = [
    {
      name: "Mumbai",
      icon: "https://in.bmscdn.com/m6/images/common-modules/regions/mumbai.png",
    },
    {
      name: "Delhi-NCR",
      icon: "https://in.bmscdn.com/m6/images/common-modules/regions/ncr.png",
    },
    {
      name: "Bengaluru",
      icon: "https://in.bmscdn.com/m6/images/common-modules/regions/bengaluru.png",
    },
    {
      name: "Hyderabad",
      icon: "https://in.bmscdn.com/m6/images/common-modules/regions/hyderabad.png",
    },
    {
      name: "Chandigarh",
      icon: "https://in.bmscdn.com/m6/images/common-modules/regions/chandigarh.png",
    },
    {
      name: "Ahmedabad",
      icon: "https://in.bmscdn.com/m6/images/common-modules/regions/ahmedabad.png",
    },
    {
      name: "Pune",
      icon: "https://in.bmscdn.com/m6/images/common-modules/regions/pune.png",
    },
    {
      name: "Chennai",
      icon: "https://in.bmscdn.com/m6/images/common-modules/regions/chennai.png",
    },
    {
      name: "Kolkata",
      icon: "https://in.bmscdn.com/m6/images/common-modules/regions/kolkata.png",
    },
    {
      name: "Kochi",
      icon: "https://in.bmscdn.com/m6/images/common-modules/regions/kochi.png",
    },
  ];

  return (
    <div className="relative font-sans">
      {/* PRIMARY NAV BAR */}
      <div className="w-full bg-white shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* LOGO + SEARCH */}
          <div className="flex items-center gap-6 w-3/4">
            <img onClick={()=> navigate('/')}
              src="https://upload.wikimedia.org/wikipedia/commons/7/75/Bookmyshow-logoid.png"
              className="w-16 h-8 md:w-28 md:h-10"
              alt="logo"
            />

            <div className="relative hidden lg:flex w-full max-w-xl">
              <input
                type="text"
                placeholder="Search for Movies, Events, Plays, Sports and more"
                className="w-full bg-white border border-gray-300 px-4 py-2 pl-10 rounded-md text-sm"
              />
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* CITY */}
            {/* CITY */}
            <div ref={cityRef} className="relative">
              <button
                onClick={() => setShowCityMenu(!showCityMenu)}
                className="flex items-center gap-1 hover:text-[#f84464]"
              >
                {city}
                <ChevronDown size={18} />
              </button>

              {/* CITY DROPDOWN */}
              {showCityMenu && (
                <div className="absolute top-full mt-2 left-0 bg-white shadow-xl rounded-lg w-56 z-50 border">
                  <p className="p-3 text-sm text-gray-500 font-medium">
                    Popular Cities
                  </p>

                  {popularCities.map((c) => (
                    <div
                      key={c.name}
                      className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => selectCity(c.name)}
                    >
                      <img src={c.icon} className="w-6 h-6 object-contain" />
                      <span>{c.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* LOGIN */}
            {!loggedIn && (
              <button
                onClick={() => navigate("/register")}
                className="bg-[#f84464] text-white px-4 py-1.5 rounded-md text-sm hidden sm:block"
              >
                Sign in
              </button>
            )}

            {/* PROFILE */}
            {loggedIn && (
              <div ref={profileRef} className="relative">
                <div
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center cursor-pointer"
                >
                  <span className="text-sm text-white font-semibold">U</span>
                </div>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg  z-50">
                    <p
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => navigate("/profile")}
                    >
                      My Profile
                    </p>
                    <p
                      className="px-4 py-2 text-red-500 hover:bg-red-50 cursor-pointer"
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECOND NAV */}
      <div className="bg-[#f8f8f8] hidden md:block">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex gap-6 text-sm text-gray-600">
            {categories.map((cat) => (
              <span key={cat} className="cursor-pointer hover:text-black">
                {cat}
              </span>
            ))}
          </div>

          <div className="flex gap-6 text-sm text-gray-600">
            <span
              onClick={() => navigate("/seller/signin")}
              className="cursor-pointer hover:text-black font-medium"
            >
              List Your Show
            </span>
            <span>Corporates</span>
            <span>Offers</span>
            <span>Gift Cards</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================================================
   MAIN EXPORT
=================================================== */
export default function Navbar() {
  const isSeller = document.cookie.includes("seller_token=");
  return isSeller ? <SellerNavbar /> : <UserNavbar />;
}
