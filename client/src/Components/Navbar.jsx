import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronRight, Search, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import SearchModal from "./SearchModal";
import { MapPin } from "lucide-react";

function CityIcon({ src, name }) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return <MapPin size={32} className="text-gray-400" aria-label={name} />;
  }

  return (
    <img
      src={src}
      alt={name}
      className="w-12 h-12 object-contain"
      onError={() => setError(true)}
    />
  );
}
/* ===================================================
   ADMIN NAVBAR
=================================================== */
/* ===================================================
   ADMIN NAVBAR (FIXED WITH MOBILE MENU)
=================================================== */
function AdminNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenu, setMobileMenu] = useState(false);

  const isActive = (path) =>
    location.pathname.startsWith(path)
      ? "text-[#f84464] font-semibold"
      : "text-gray-700 hover:text-black";

  function signOut() {
    document.cookie = "admin_token=; Max-Age=0; path=/;";
    window.location.href = "/register";
  }

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
        {/* LEFT */}
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="cursor-pointer text-lg font-semibold"
        >
          Admin Panel
        </div>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex gap-6 text-sm">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className={isActive("/admin/dashboard")}
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/admin/sellers")}
            className={isActive("/admin/sellers")}
          >
            Sellers
          </button>
          <button
            onClick={() => navigate("/admin/theatres")}
            className={isActive("/admin/theatres")}
          >
            Theatres
          </button>
          <button
            onClick={() => navigate("/admin/screens")}
            className="block w-full text-left"
          >
            Screens
          </button>
          <button
            onClick={() => navigate("/admin/shows")}
            className={isActive("/admin/shows")}
          >
            Shows
          </button>
          <button
            onClick={() => navigate("/admin/bookings")}
            className={isActive("/admin/bookings")}
          >
            Bookings
          </button>
        </nav>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {/* DESKTOP LOGOUT */}
          <button
            onClick={signOut}
            className="hidden md:block text-sm text-red-500 font-medium"
          >
            Logout
          </button>

          {/* MOBILE HAMBURGER */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden"
          >
            {mobileMenu ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* MOBILE ADMIN MENU */}
      {mobileMenu && (
        <div className="md:hidden bg-white border-t p-4 space-y-3">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="block w-full text-left"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/admin/sellers")}
            className="block w-full text-left"
          >
            Sellers
          </button>
          <button
            onClick={() => navigate("/admin/theatres")}
            className="block w-full text-left"
          >
            Theatres
          </button>
          <button
            onClick={() => navigate("/admin/screens")}
            className="block w-full text-left"
          >
            Screens
          </button>
          <button
            onClick={() => navigate("/admin/shows")}
            className="block w-full text-left"
          >
            Shows
          </button>
          <button
            onClick={() => navigate("/admin/bookings")}
            className="block w-full text-left"
          >
            Bookings
          </button>
          <button
            onClick={signOut}
            className="block w-full text-left text-red-500"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

/* ===================================================
   SELLER NAVBAR (BookMyShow Partner Panel)
=================================================== */
function SellerNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);

  async function signOut() {
    await fetch("http://localhost:8000/api/seller/logout", {
      method: "POST",
      credentials: "include",
    });

    window.location.href = "/seller/signin";
  }

  const isActive = (path) =>
    location.pathname.startsWith(path)
      ? "text-[#f84464] font-semibold"
      : "text-gray-700 hover:text-black";

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-3">
        {/* LEFT: LOGO */}
        <div
          onClick={() => navigate("/seller/dashboard")}
          className="cursor-pointer flex items-center gap-3"
        >
          <span className="text-lg font-semibold text-gray-500">
            Seller Panel
          </span>
        </div>

        {/* CENTER: MENU (DESKTOP) */}
        <nav className="hidden md:flex gap-6 text-sm">
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
        {/* MOBILE SEARCH ICON */}

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden"
          >
            {mobileMenu ? <X /> : <Menu />}
          </button>

          {/* PROFILE MENU (DESKTOP) */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-[#f84464] text-white flex items-center justify-center font-semibold">
                S
              </div>
              <ChevronDown size={16} />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-md">
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE SELLER MENU */}
      {mobileMenu && (
        <div className="md:hidden bg-white border-t p-4 space-y-3">
          <button
            onClick={() => navigate("/seller/dashboard")}
            className="block w-full text-left"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/seller/theatres")}
            className="block w-full text-left"
          >
            Theatres
          </button>
          <button
            onClick={() => navigate("/seller/screens")}
            className="block w-full text-left"
          >
            Screens
          </button>
          <button
            onClick={() => navigate("/seller/shows")}
            className="block w-full text-left"
          >
            Shows
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="block w-full text-left"
          >
            Bookings
          </button>
          <button
            onClick={handleSignOut}
            className="block w-full text-left text-red-500 font-medium py-1"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

/* ===================================================
   USER NAVBAR (Public User Navbar)
=================================================== */
function UserNavbar({ movies = [] }) {
  const [city, setCity] = useState(localStorage.getItem("city") || "Mumbai");
  const [showCityMenu, setShowCityMenu] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const navigate = useNavigate();
  const [openSearch, setOpenSearch] = useState(false);

  const cityRef = useRef(null);
  const profileRef = useRef(null);
  const [search, setSearch] = useState("");

  function handleSearch(e) {
    setSearch(e.target.value);
  }

  /* 🔐 CHECK LOGIN FROM COOKIE */
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("http://localhost:8000/auth/me", {
          credentials: "include",
        });

        setLoggedIn(res.ok);
      } catch (err) {
        setLoggedIn(false);
      }
    }

    checkAuth();
  }, []);

  function selectCity(cityName) {
    setCity(cityName);
    localStorage.setItem("city", cityName);
    setShowCityMenu(false);
    window.dispatchEvent(new Event("cityChanged"));
  }

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

  /* 🔐 BACKEND LOGOUT (COOKIE BASED) */
  const handleSignOut = async () => {
    try {
      await fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      setLoggedIn(false);
      setShowProfileMenu(false);
      setMobileMenu(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
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
      icon: "https://in.bmscdn.com/m6/images/common-modules/regions/bangalore.png",
    },
    {
      name: "Hyderabad",
      icon: "https://in.bmscdn.com/m6/images/common-modules/regions/hyd.png",
    },
    {
      name: "Chennai",
      icon: "https://in.bmscdn.com/m6/images/common-modules/regions/chennai.png",
    },
    {
      name: "Pune",
      icon: "https://in.bmscdn.com/m6/images/common-modules/regions/pune.png",
    },
    {
      name: "Kolkata",
      icon: "https://in.bmscdn.com/m6/images/common-modules/regions/kolkata.png",
    },
    {
      name: "Ahmedabad",
      icon: "https://in.bmscdn.com/m6/images/common-modules/regions/ahmedabad.png",
    },
    {
      name: "Chandigarh",
      icon: "https://in.bmscdn.com/m6/images/common-modules/regions/chandigarh.png",
    },
    {
      name: "Kochi",
      icon: "https://in.bmscdn.com/m6/images/common-modules/regions/kochi.png",
    },
  ];

  return (
    <div className="relative font-sans">
      {/* TOP NAV */}
      <div className="w-full bg-white shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div
            className="flex flex-col items-start cursor-pointer"
            onClick={() => setShowCityMenu(true)}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/75/Bookmyshow-logoid.png"
              className="w-18 h-8 md:w-28 md:h-10"
              alt="logo"
            />

            {/* CITY NAME – MOBILE ONLY */}
            <span className="md:hidden text-xs text-red-400 mt-0  flex items-center gap-1">
              {city}
              <ChevronRight size={12} />
            </span>
          </div>

          <div
            onClick={() => setOpenSearch(true)}
            className="hidden lg:flex w-full max-w-xl bg-white border border-gray-300 px-4 py-2 rounded-md text-sm text-gray-500 cursor-text"
          >
            Search for Movies, Events, Plays, Sports and more
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* CITY SELECTOR */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setShowCityMenu(true)}
                className="flex items-center gap-1 hover:text-[#f84464]"
              >
                {city}
                <ChevronDown size={18} />
              </button>

              {showCityMenu && (
                <div className="fixed inset-0 z-[9999] bg-black/50 flex justify-center items-start pt-20">
                  <div
                    ref={cityRef}
                    className="bg-white w-[90%] max-w-4xl rounded-xl shadow-xl p-6 relative"
                  >
                    <input
                      type="text"
                      placeholder="Search for your city"
                      className="w-full border px-4 py-2 rounded-md outline-none"
                    />

                    <p className="mt-4 text-[#f84464] font-medium cursor-pointer">
                      📍 Detect my location
                    </p>

                    <hr className="my-5" />

                    <h3 className="text-center text-gray-600 font-semibold mb-4">
                      Popular Cities
                    </h3>

                    <div className="grid grid-cols-5 gap-5 text-center">
                      {popularCities.map((c) => (
                        <div
                          key={c.name}
                          onClick={() => selectCity(c.name)}
                          className="flex flex-col items-center cursor-pointer hover:text-[#f84464]"
                        >
                          <CityIcon src={c.icon} name={c.name} />
                          <p className="text-sm mt-2">{c.name}</p>
                        </div>
                      ))}
                    </div>

                    <hr className="my-6" />

                    <h4 className="text-center text-gray-600 font-medium mb-3">
                      Other Cities
                    </h4>

                    <div className="grid grid-cols-5 text-sm text-gray-500 gap-y-2 gap-x-4 max-h-48 overflow-y-auto">
                      {[
                        "Aalo",
                        "Addanki",
                        "Agar Malwa",
                        "Ahmedgarh",
                        "Akbarpur",
                        "Alibaug",
                        "Abohar",
                        "Agartala",
                        "Aligarh",
                        "Aizawl",
                        "Ajmer",
                        "Akola",
                        "Alappuzha",
                        "Ambala",
                        "Amravati",
                        "Anand",
                        "Ankleshwar",
                        "Arrah",
                        "Asansol",
                        "Aurangabad",
                        "Balaghat",
                        "Ballari",
                        "Banswara",
                        "Baramati",
                        "Bathinda",
                        "Belagavi",
                        "Betul",
                        "Bharatpur",
                        "Bhind",
                        "Bhiwani",
                        "Bhopal",
                        "Bikaner",
                        "Bilaspur",
                        "Bokaro",
                        "Bundi",
                        "Burhanpur",
                        "Chandausi",
                        "Chhapra",
                        "Chittorgarh",
                        "Coimbatore",
                        "Davanagere",
                        "Dehradun",
                        "Dewas",
                        "Dhanbad",
                        "Dhule",
                        "Erode",
                        "Etawah",
                        "Gandhidham",
                        "Gaya",
                        "Godhra",
                        "Gondia",
                        "Gudur",
                        "Guna",
                        "Guntur",
                        "Haldwani",
                        "Hassan",
                        "Hojai",
                        "Hoshangabad",
                        "Hubli",
                        "Ichalkaranji",
                        "Itanagar",
                        "Jabalpur",
                        "Jagdalpur",
                        "Jalgaon",
                        "Jhansi",
                        "Junagadh",
                        "Kadapa",
                        "Kaithal",
                        "Kalaburagi",
                        "Karnal",
                        "Katni",
                        "Khandwa",
                        "Kolar",
                        "Koppal",
                        "Latur",
                        "Mahoba",
                        "Malegaon",
                        "Mandya",
                        "Mirzapur",
                        "Moradabad",
                        "Mysuru",
                        "Nadiad",
                        "Nalgonda",
                        "Nanded",
                        "Neemuch",
                        "Ongole",
                        "Palanpur",
                        "Panna",
                        "Parbhani",
                        "Raichur",
                        "Rajsamand",
                        "Rewa",
                        "Sagar",
                        "Satara",
                        "Sehore",
                        "Shivpuri",
                        "Singrauli",
                        "Sirohi",
                        "Solapur",
                        "Sri Ganganagar",
                        "Sultanpur",
                        "Surendranagar",
                        "Tirunelveli",
                        "Tumakuru",
                        "Udgir",
                        "Ujjain",
                        "Una",
                        "Wani",
                        "Wardha",
                        "Yamunanagar",
                      ].map((c) => (
                        <p
                          key={c}
                          onClick={() => selectCity(c)}
                          className="cursor-pointer hover:text-[#f84464]"
                        >
                          {c}
                        </p>
                      ))}
                    </div>

                    <p
                      onClick={() => setShowCityMenu(false)}
                      className="text-center mt-6 text-[#f84464] cursor-pointer font-medium"
                    >
                      Hide all cities
                    </p>
                  </div>
                </div>
              )}
            </div>

            {!loggedIn && (
              <button
                onClick={() => navigate("/register")}
                className="bg-[#f84464] text-white px-3 py-1.5 rounded-md text-sm hidden sm:block"
              >
                Sign in
              </button>
            )}

            {/* {loggedIn && (
              <button
                onClick={handleSignOut}
                className="hidden sm:flex items-center gap-1 text-red-500 text-sm font-medium"
              >
                Sign out
              </button>
            )} */}

            {loggedIn && (
              <div ref={profileRef} className="relative hidden md:block">
                <div
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center cursor-pointer"
                >
                  <span className="text-sm text-white font-semibold">U</span>
                </div>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg z-50">
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
            {/* MOBILE SEARCH ICON */}
            <button
              onClick={() => setOpenSearch(true)}
              className="md:hidden text-gray-700"
            >
              <Search size={22} />
            </button>

            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="md:hidden"
            >
              {mobileMenu ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenu && (
        <div className="md:hidden bg-white shadow border-t p-4 space-y-4">
          <button
            onClick={() => navigate("/seller/signin")}
            className="w-full bg-[#f84464] text-white py-2 rounded-md font-medium"
          >
            List Your Show
          </button>

          <div className="border-b pb-2">
            <p className="text-sm font-semibold mb-1">Select City</p>
            {popularCities.map((c) => (
              <p
                key={c.name}
                onClick={() => selectCity(c.name)}
                className="cursor-pointer py-1"
              >
                {c.name}
              </p>
            ))}
          </div>

          {categories.map((cat) => (
            <p key={cat} className="cursor-pointer">
              {cat}
            </p>
          ))}

          {!loggedIn && (
            <button
              onClick={() => navigate("/register")}
              className="w-full bg-[#f84464] text-white py-2 rounded-md font-medium"
            >
              Sign In
            </button>
          )}

          {loggedIn && (
            <>
              <button
                onClick={() => navigate("/profile")}
                className="block w-full text-left"
              >
                My Profile
              </button>
              <button
                onClick={handleSignOut}
                className="w-full bg-[#f84464] text-white py-2 rounded-md font-medium"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}

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

      <SearchModal
        open={openSearch}
        onClose={() => {
          setOpenSearch(false);
          setSearch("");
        }}
        search={search}
        setSearch={setSearch}
        movies={movies}
      />
    </div>
  );
}

/* ===================================================
   MAIN EXPORT
=================================================== */
/* ===================================================
   MAIN EXPORT (FIXED)
=================================================== */

export default function Navbar({ movies }) {
  const location = useLocation();
  const path = location.pathname;

  // ✅ Route-based navbar rendering
  if (path.startsWith("/admin")) {
    return <AdminNavbar />;
  }

  if (path.startsWith("/seller")) {
    return <SellerNavbar />;
  }

  return <UserNavbar movies={movies} />;
}
