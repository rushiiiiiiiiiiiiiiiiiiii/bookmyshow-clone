const express = require("express");
const router = express.Router();

const {
  getSuggestedMovies,
  getShowsByMovie,
  getShowById,
} = require("../Controllers/showController");

/* ============================
   PUBLIC SHOW ROUTES
============================ */

router.get("/shows/suggested", getSuggestedMovies);
router.get("/shows/movie", getShowsByMovie);
router.get("/shows/:id", getShowById);

module.exports = router;
