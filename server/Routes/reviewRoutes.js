const express = require("express");
const Review = require("../Schemas/Review");
const auth = require("../Middlewears/auth");

const router = express.Router();

// GET reviews by movie
router.get("/:movie", async (req, res) => {
  const reviews = await Review.find({ movie: req.params.movie })
    .sort({ createdAt: -1 });

  res.json({ ok: true, reviews });
});

// ADD review
router.post("/", auth, async (req, res) => {
  const { movie, rating, comment } = req.body;

  const review = await Review.create({
    movie,
    rating,
    comment,
    user: req.user.id,
    userName: req.user.name || "User",
  });

  res.json({ ok: true, review });
});

module.exports = router;
