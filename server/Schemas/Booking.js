const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    showId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show",
      required: true,
    },

    movie: {
      type: String,
      required: true,
    },

    poster: {
      type: String,
    },

    seats: {
      type: [String],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theatre",
      required: true,
    },

    screen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Screen",
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["confirmed", "cancelled", "refunded"],
      default: "confirmed",
    },

    paymentStatus: {
      type: String,
      enum: ["success", "failed", "pending"],
      default: "success",
    },

    bookingToken: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);


// ✅ Auto-generate ticket code
BookingSchema.pre("save", function () {
  this.bookingToken = `BMS-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;
});


module.exports = mongoose.model("Booking", BookingSchema);
