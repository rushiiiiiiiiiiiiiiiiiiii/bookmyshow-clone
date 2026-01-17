const mongoose = require("mongoose");

const lockedSeatSchema = new mongoose.Schema(
  {
    seatNumber: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: { type: Date, required: true },
  },
  { _id: false },
);

const ShowSchema = new mongoose.Schema(
  {
    theatreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theatre",
      required: true,
    },

    screenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Screen",
      required: true,
    },

    movie: {
      type: String,
      required: true,
      trim: true,
    },
    movieDescription: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    language: {
      type: String,
      required: true,
    },

    format: {
      type: String,
      enum: ["2D", "3D", "IMAX", "4DX", "Dolby Atmos"],
      default: "2D",
    },

    // Date as YYYY-MM-DD
    date: {
      type: String,
      required: true,
    },

    // Start time HH:mm
    time: {
      type: String,
      required: true,
    },

    // End time HH:mm (calculated from time + durationMinutes)
    endTime: {
      type: String,
      required: true,
    },

    // Duration in minutes
    durationMinutes: {
      type: Number,
      required: true,
      min: 30,
      max: 400,
    },

    poster: String,

    price: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "cancelled"],
      default: "active",
    },

    maxSeatsPerBooking: {
      type: Number,
      default: 10,
    },

    isSubtitled: {
      type: Boolean,
      default: false,
    },

    certificate: {
      type: String,
      enum: ["U", "UA", "U/A 7+", "U/A 13+", "A"],
      default: "UA",
    },

    // ✅ CONFIRMED BOOKINGS
    bookedSeats: [
      {
        seatNumber: String,
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        bookedAt: Date,
      },
    ],

    // ✅ TEMPORARY LOCKS (NEW)
    lockedSeats: [lockedSeatSchema],
  },
  { timestamps: true },
);

// prevent duplicate shows on same screen at same time
ShowSchema.index(
  { theatreId: 1, screenId: 1, date: 1, time: 1 },
  { unique: true },
);

module.exports = mongoose.model("Show", ShowSchema);
