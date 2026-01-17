const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    movie: { type: String, required: true }, // movie name
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userName: { type: String },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
