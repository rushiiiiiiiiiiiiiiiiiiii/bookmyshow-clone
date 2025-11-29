const Show = require("../Schemas/Show");
const Booking = require("../Schemas/Booking");

// ===================================
// ✅ CREATE BOOKING (BOOKMYSHOW STYLE)
// ===================================
exports.createBooking = async (req, res) => {
  try {
    const { showId, seats, amount } = req.body;

    // ✅ Auth check
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ ok: false, msg: "Login required" });
    }

    // ✅ Get show
    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ ok: false, msg: "Show not found" });
    }

    // =============================
    // ✅ CHECK ALREADY BOOKED SEATS
    // =============================
    const alreadyBooked = show.bookedSeats.map((s) => s.seatNumber);
    const conflict = seats.some((seat) => alreadyBooked.includes(seat));

    if (conflict) {
      return res.json({
        ok: false,
        msg: "Some seats are already booked",
      });
    }

    // =============================
    // ✅ CREATE BOOKING
    // =============================
    const booking = await Booking.create({
      user: userId,
      showId: show._id,
      movie: show.movie,
      poster: show.poster,
      seats,
      amount,
      theatre: show.theatreId,
      screen: show.screenId,
      date: show.date,
      time: show.time,
    });

    // =============================
    // ✅ LOCK SEATS
    // =============================
    const seatObjects = seats.map((seat) => ({
      seatNumber: seat,
      userId,
      bookedAt: new Date(),
    }));

    await Show.findByIdAndUpdate(showId, {
      $push: { bookedSeats: { $each: seatObjects } },
    });

    // =============================
    // ✅ SUCCESS RESPONSE
    // =============================
    res.json({
      ok: true,
      booking,
    });
  } catch (err) {
    console.error("BOOKING ERROR FULL:", err);

    res.status(500).json({
      ok: false,
      msg: err.message, // 👈 show real error
    });
  }
};

// ===================================
// ✅ GET MY BOOKINGS
// ===================================
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("theatre", "name city")
      .populate("screen", "name");

    res.json({ ok: true, bookings });
  } catch (err) {
    console.error("FETCH BOOKINGS ERROR:", err);
    res.status(500).json({ ok: false, msg: "Failed to load bookings" });
  }
};

// ===================================
// ✅ GET SINGLE BOOKING
// ===================================
exports.getBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate("theatre", "name city")
      .populate("screen", "name");

    if (!booking) {
      return res.status(404).json({ ok: false, msg: "Booking not found" });
    }

    // ✅ User can view only his own booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ ok: false, msg: "Access denied" });
    }

    res.json({ ok: true, booking });
  } catch (err) {
    console.error("FETCH TICKET ERROR:", err);
    res.status(500).json({ ok: false, msg: "Failed to fetch ticket" });
  }
};
