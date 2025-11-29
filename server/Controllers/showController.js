const jwt = require("jsonwebtoken");
const Show = require("../Schemas/Show");
const Screen = require("../Schemas/Screen");
const Theatre = require("../Schemas/Theatre");

// Helper: add minutes to a time string "HH:mm"
function addMinutesToTime(timeStr, minutesToAdd) {
  const [h, m] = timeStr.split(":").map(Number);
  const dur = Number(minutesToAdd);

  if (Number.isNaN(h) || Number.isNaN(m) || Number.isNaN(dur)) {
    return null;
  }

  let total = h * 60 + m + dur;
  const minutesInDay = 24 * 60;
  total = ((total % minutesInDay) + minutesInDay) % minutesInDay;

  const hh = String(Math.floor(total / 60)).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

/* ============================
   ✅ ADD NEW SHOW
============================ */
exports.addShow = async (req, res) => {
  console.log("API HIT", Date.now());

  try {
    const token = req.cookies.seller_token;
    if (!token) {
      return res.status(401).json({ ok: false, message: "Unauthorized access" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { theatreId } = req.params;

    const {
      screenId,
      movie,
      poster,
      language,
      format,
      time,
      startDate,
      endDate,
      price,
      status,
      durationMinutes,
      isSubtitled,
      certificate,
      maxSeatsPerBooking,
    } = req.body;

    // ✅ Validation
    if (!screenId || !movie || !language || !format || !startDate || !endDate || !time || !price || !durationMinutes) {
      return res.status(400).json({ ok: false, message: "All fields are required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return res.status(400).json({ ok: false, message: "Invalid date range" });
    }

    // ✅ Confirm ownership
    const theatre = await Theatre.findOne({ _id: theatreId, sellerId: decoded.id });
    if (!theatre) {
      return res.status(403).json({ ok: false, message: "Not your theatre" });
    }

    // ✅ Validate screen
    const screen = await Screen.findOne({ _id: screenId, theatreId });
    if (!screen) {
      return res.status(400).json({ ok: false, message: "Invalid screen" });
    }

    const endTime = addMinutesToTime(time, durationMinutes);
    if (!endTime) {
      return res.status(400).json({ ok: false, message: "Invalid time or duration" });
    }

    const showsCreated = [];
    let loopDate = new Date(start);

    console.log("Creating shows from:", startDate, "to", endDate);

    while (loopDate <= end) {
      const dateStr = loopDate.toISOString().split("T")[0];

      const exists = await Show.findOne({
        theatreId,
        screenId,
        date: dateStr,
        time,
        status: { $ne: "cancelled" },
      });

      if (!exists) {
        const show = await Show.create({
          theatreId,
          screenId,
          movie,
          poster,
          language,
          format,
          date: dateStr,
          time,
          endTime,
          durationMinutes,
          price,
          status: status || "active",
          isSubtitled: !!isSubtitled,
          certificate: certificate || "UA",
          maxSeatsPerBooking: maxSeatsPerBooking || 10,
          totalSeats: screen.totalSeats,
        });
        showsCreated.push(show);
      }

      loopDate.setDate(loopDate.getDate() + 1);
    }

    return res.json({
      ok: true,
      message: `${showsCreated.length} shows created successfully`,
      showsCreated,
    });

  } catch (err) {
    console.error("ADD SHOW ERROR:", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
};



/* ============================
   ✅ GET SHOWS BY THEATRE
============================ */
exports.getShowsByTheatre = async (req, res) => {
  try {
    const token = req.cookies.seller_token;
    if (!token) return res.status(401).json({ ok: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { theatreId } = req.params;

    const theatre = await Theatre.findOne({
      _id: theatreId,
      sellerId: decoded.id,
    });

    if (!theatre) {
      return res.status(403).json({
        ok: false,
        message: "Unauthorized theatre access",
      });
    }

    const shows = await Show.find({ theatreId })
      .populate("screenId", "name totalSeats")
      .sort({ date: 1, time: 1 });

    // ✅ add fillPercent like BookMyShow occupancy
    const enriched = shows.map((show) => {
      const totalSeats = show.totalSeats || show.screenId?.totalSeats || 0;
      const fillPercent =
        totalSeats > 0
          ? Math.round((show.bookedSeats.length / totalSeats) * 100)
          : 0;

      return {
        ...show.toObject(),
        fillPercent,
      };
    });

    res.json({
      ok: true,
      count: enriched.length,
      shows: enriched,
    });
  } catch (err) {
    console.error("GET SHOWS ERROR:", err);
    res.status(500).json({
      ok: false,
      message: "Failed to load shows",
    });
  }
};

/* ============================
   ✅ GET ALL SHOWS (SELLER)
============================ */
exports.getAllShows = async (req, res) => {
  try {
    const token = req.cookies.seller_token;
    if (!token) return res.status(401).json({ ok: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const theatres = await Theatre.find({ sellerId: decoded.id }).select("_id");
    const theatreIds = theatres.map((t) => t._id);

    const shows = await Show.find({ theatreId: { $in: theatreIds } })
      .populate("theatreId", "name city")
      .populate("screenId", "name totalSeats")
      .sort({ createdAt: -1 });

    const enriched = shows.map((show) => {
      const totalSeats = show.totalSeats || show.screenId?.totalSeats || 0;
      const fillPercent =
        totalSeats > 0
          ? Math.round((show.bookedSeats.length / totalSeats) * 100)
          : 0;

      return {
        ...show.toObject(),
        fillPercent,
      };
    });

    res.json({
      ok: true,
      total: enriched.length,
      shows: enriched,
    });
  } catch (err) {
    console.error("GET ALL SHOWS ERROR:", err);
    res.status(500).json({
      ok: false,
      message: "Failed to load shows",
    });
  }
};

/* ============================
   ✅ DELETE / CANCEL SHOW
============================ */
exports.deleteShow = async (req, res) => {
  try {
    const token = req.cookies.seller_token;
    if (!token) return res.status(401).json({ ok: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = req.params;

    const show = await Show.findById(id);
    if (!show) {
      return res.status(404).json({
        ok: false,
        message: "Show not found",
      });
    }

    const theatre = await Theatre.findOne({
      _id: show.theatreId,
      sellerId: decoded.id,
    });

    if (!theatre) {
      return res.status(403).json({
        ok: false,
        message: "Not authorized",
      });
    }

    // If there are bookings → mark cancelled instead of hard delete
    if (show.bookedSeats && show.bookedSeats.length > 0) {
      show.status = "cancelled";
      await show.save();

      return res.json({
        ok: true,
        message: "Show cancelled (has bookings)",
      });
    }

    await Show.findByIdAndDelete(id);

    res.json({
      ok: true,
      message: "Show deleted successfully",
    });
  } catch (err) {
    console.error("DELETE SHOW ERROR:", err);
    res.status(500).json({
      ok: false,
      message: "Failed to delete show",
    });
  }
};

/* ============================
   ✅ UPDATE SHOW
============================ */
exports.updateShow = async (req, res) => {
  try {
    const token = req.cookies.seller_token;
    if (!token) return res.status(401).json({ ok: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = req.params;

    const {
      movie,
      language,
      format,
      date,
      time,
      durationMinutes,
      price,
      status,
      isSubtitled,
      certificate,
      maxSeatsPerBooking,
      screenId,
    } = req.body;

    const show = await Show.findById(id);
    if (!show) {
      return res.status(404).json({ ok: false, message: "Show not found" });
    }

    // ✅ Verify ownership
    const theatre   = await Theatre.findOne({
      _id: show.theatreId,
      sellerId: decoded.id,
    });

    if (!theatre) {
      return res.status(403).json({
        ok: false,
        message: "Not authorized to update",
      });
    }

    // ✅ Check duplicate clash (same screen + date + time)
    if (screenId || date || time) {
      const conflict = await Show.findOne({
        _id: { $ne: id },
        theatreId: show.theatreId,
        screenId: screenId || show.screenId,
        date: date || show.date,
        time: time || show.time,
        status: { $ne: "cancelled" },
      });

      if (conflict) {
        return res.status(409).json({
          ok: false,
          message: "Another show already exists at this time",
        });
      }
    }

    // ✅ Update core fields
    show.movie = movie || show.movie;
    show.language = language || show.language;
    show.format = format || show.format;
    show.date = date || show.date;
    show.time = time || show.time;
    show.durationMinutes = durationMinutes || show.durationMinutes;
    show.price = price || show.price;
    show.status = status || show.status;
    show.isSubtitled = isSubtitled ?? show.isSubtitled;
    show.certificate = certificate || show.certificate;
    show.maxSeatsPerBooking = maxSeatsPerBooking || show.maxSeatsPerBooking;
    show.screenId = screenId || show.screenId;

    // ✅ Recalculate end time if needed
    if (time || durationMinutes) {
      const endTime = addMinutesToTime(show.time, show.durationMinutes);
      show.endTime = endTime;
    }

    await show.save();

    res.json({
      ok: true,
      message: "Show updated successfully",
      show,
    });
  } catch (err) {
    console.error("UPDATE SHOW ERROR:", err);
    res.status(500).json({
      ok: false,
      message: "Failed to update show",
    });
  }
};
exports.getShowsByCity = async (req, res) => {
  try {
    const { city } = req.query;

    const theatres = await Theatre.find({ city, status: "approved" }, "_id");

    const shows = await Show.find({
      theatreId: { $in: theatres.map((t) => t._id) },
      status: "active",
      date: { $gte: new Date().toISOString().split("T")[0] },
    })
      .populate("theatreId", "name city")
      .populate("screenId", "name totalSeats");

    const enriched = shows.map((show) => {
      const total = show.totalSeats || show.screenId?.totalSeats || 0;
      const booked = show.bookedSeats.length;
      const fillPercent = total ? Math.round((booked / total) * 100) : 0;
      return { ...show.toObject(), fillPercent };
    });

    res.json({ ok: true, shows: enriched });
  } catch (err) {
    console.error("CITY SHOW ERROR:", err);
    res.status(500).json({ ok: false });
  }
};

exports.getSeatLayout = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id).populate("screenId");
    if (!show) return res.status(404).json({ ok: false });

    res.json({
      ok: true,
      booked: show.bookedSeats || [],
      screen: {
        rows: show.screenId.rows,
        seatsPerRow: show.screenId.seatsPerRow,
        totalSeats: show.screenId.totalSeats,
        screenType: show.screenId.screenType,
      },
    });
  } catch (err) {
    console.error("SEAT API ERROR", err);
    res.status(500).json({ ok: false });
  }
};



exports.getShowsByMovie = async (req, res) => {
  try {
    const { movie } = req.query;

    if (!movie) {
      return res.status(400).json({
        ok: false,
        message: "Movie name is required",
      });
    }

    const shows = await Show.find({
      movie: new RegExp("^" + movie + "$", "i"), // case-insensitive match
      status: "active",
      date: { $gte: new Date().toISOString().split("T")[0] },
    })
      .populate("theatreId", "name city")
      .populate("screenId", "name totalSeats");

    const enriched = shows.map((show) => {
      const total = show.totalSeats || show.screenId?.totalSeats || 0;
      const booked = show.bookedSeats.length;
      const fillPercent = total ? Math.round((booked / total) * 100) : 0;

      return { ...show.toObject(), fillPercent };
    });

    res.json({
      ok: true,
      total: enriched.length,
      shows: enriched,
    });

  } catch (err) {
    console.error("GET MOVIE SHOW ERROR:", err);
    res.status(500).json({
      ok: false,
      message: "Failed to load movie shows",
    });
  }
};
exports.getShowById = async (req, res) => {
  try {
    const { id } = req.params;

    const show = await Show.findById(id)
      .populate("theatreId", "name city")
      .populate("screenId", "name totalSeats");

    if (!show) {
      return res.status(404).json({ ok: false, message: "Show not found" });
    }

    const total = show.totalSeats || show.screenId?.totalSeats || 0;
    const booked = show.bookedSeats.length;
    const fillPercent = total ? Math.round((booked / total) * 100) : 0;

    res.json({
      ok: true,
      show: { ...show.toObject(), fillPercent },
    });

  } catch (err) {
    console.error("GET SHOW ID ERROR:", err);
    res.status(500).json({ ok: false });
  }
};
