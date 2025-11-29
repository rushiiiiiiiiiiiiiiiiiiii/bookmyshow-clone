const mongoose = require("mongoose");

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
      max: 400, // covers long movies as well
    },
    poster: {
      type: String,
      required: false,
    },

    price: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "cancelled"],
      default: "active",
    },

    // Max seats user can book in one transaction
    maxSeatsPerBooking: {
      type: Number,
      default: 10,
    },

    // Subtitles flag (e.g. English subtitles for Hindi audio)
    isSubtitled: {
      type: Boolean,
      default: false,
    },

    // Certification similar to BMS tags
    certificate: {
      type: String,
      enum: ["U", "UA", "U/A 7+", "U/A 13+", "A"],
      default: "UA",
    },

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
  },
  { timestamps: true }
);
ShowSchema.index({ theatreId: 1, screenId: 1, date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model("Show", ShowSchema);
