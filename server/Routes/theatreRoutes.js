const express = require("express");
const router = express.Router();

// 🎭 THEATRES
const {
  addTheatre,
  getTheatres,
  getTheatreById,
  updateTheatre,
  deleteTheatre,
  getPublicTheatres,
} = require("../Controllers/TheatreController");

// 📽 SCREENS
const {
  addScreen,
  getScreensByTheatre,
  getAllScreens,
  deleteScreen,
  updateScreen,
} = require("../Controllers/screenController");

// 🎬 SHOWS
const {
  addShow,
  getShowsByTheatre,
  getAllShows,
  deleteShow,
  updateShow,
  getShowsByCity,
  getSeatLayout,
  getShowsByMovie,
  getShowById,
} = require("../Controllers/showController");
// const {
//   createBooking,
//   getMyBookings,
//   getBooking,
// } = require("../Controllers/bookingController");
const authMiddleware = require("../Middlewears/auth");
const { testMail } = require("../Controllers/testMail");
/* ============================
   ✅ THEATRE ROUTES
============================ */

router.post("/seller/theatre", addTheatre);
router.get("/seller/theatres", getTheatres);
router.get("/seller/theatre/:id", getTheatreById);
router.put("/seller/theatre/:id", updateTheatre);
router.delete("/seller/theatre/:id", deleteTheatre);
// ✅ PUBLIC USER ROUTE
router.get("/user/theatres", getPublicTheatres);

/* ============================
   ✅ SCREEN ROUTES
============================ */
router.post("/seller/screen/:theatreId", addScreen);
router.get("/seller/screens/:theatreId", getScreensByTheatre);
router.get("/seller/screens", getAllScreens);
router.delete("/seller/screen/:id", deleteScreen);
router.put("/seller/screen/:id", updateScreen);

/* ============================
   ✅ SHOW ROUTES
============================ */
router.post("/seller/show/:theatreId", addShow);
router.get("/seller/shows/:theatreId", getShowsByTheatre);
router.get("/seller/shows", getAllShows);
router.delete("/seller/show/:id", deleteShow);
router.put("/seller/show/:id", updateShow);
router.get("/user/shows", getShowsByCity);
router.get("/user/seats/:id", getSeatLayout);


//BOOKINING ROUTES

// router.post("/booking", authMiddleware, createBooking);
// router.get("/my-bookings", authMiddleware, getMyBookings);
// router.get("/booking/:id", authMiddleware, getBooking);



router.get("/test-mail", testMail);

module.exports = router;
