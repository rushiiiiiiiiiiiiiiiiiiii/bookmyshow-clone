const Seller = require("../Schemas/Seller");
const Theatre = require("../Schemas/Theatre");
const Screen = require("../Schemas/Screen");
const Show = require("../Schemas/Show");
const Booking = require("../Schemas/Booking");

/* =====================================================
   📊 ADMIN DASHBOARD STATS
   GET /api/admin/dashboard
===================================================== */
exports.getDashboardStats = async (req, res) => {
  try {
    const [sellers, theatres, screens, shows, bookings, revenueAgg] =
      await Promise.all([
        Seller.countDocuments(),
        Theatre.countDocuments(),
        Screen.countDocuments(),
        Show.countDocuments(),
        Booking.countDocuments(),
        Booking.aggregate([
          { $match: { status: "confirmed" } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
      ]);

    res.json({
      ok: true,
      sellers,
      theatres,
      screens,
      shows,
      bookings,
      revenue: revenueAgg[0]?.total || 0,
    });
  } catch (err) {
    console.error("ADMIN DASHBOARD ERROR:", err);
    res.status(500).json({ ok: false });
  }
};

/* =====================================================
   👤 SELLERS
   GET /api/admin/sellers
===================================================== */
exports.getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.find().sort({ createdAt: -1 });
    res.json({ ok: true, sellers });
  } catch (err) {
    res.status(500).json({ ok: false });
  }
};

/* =====================================================
   ⏳ PENDING SELLERS
   GET /api/admin/sellers/pending
===================================================== */
exports.getPendingSellers = async (req, res) => {
  try {
    const sellers = await Seller.find({ status: "pending" });
    res.json({ ok: true, sellers });
  } catch (err) {
    res.status(500).json({ ok: false });
  }
};

/* =====================================================
   🏢 THEATRES
   GET /api/admin/theatres
===================================================== */
exports.getAllTheatres = async (req, res) => {
  try {
    const theatres = await Theatre.find()
      .populate("sellerId", "name email")
      .sort({ createdAt: -1 });

    res.json({ ok: true, theatres });
  } catch (err) {
    res.status(500).json({ ok: false });
  }
};

/* =====================================================
   🖥️ SCREENS
   GET /api/admin/screens
===================================================== */
exports.getAllScreens = async (req, res) => {
  try {
    const screens = await Screen.find()
      .populate("theatreId", "name city area")
      .sort({ createdAt: -1 });

    res.json({ ok: true, screens });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false });
  }
};

/* =====================================================
   🎬 SHOWS
   GET /api/admin/shows
===================================================== */

exports.getAllShows = async (req, res) => {
  try {
    const shows = await Show.find()
      .populate("theatreId", "name")
      .populate("screenId", "name");

    res.json({
      ok: true,
      shows,
    });
  } catch (error) {
    console.error("❌ getAllShows error:", error);
    res.status(500).json({
      ok: false,
      message: "Failed to fetch shows",
    });
  }
};

/* =====================================================
   🎟️ BOOKINGS (PLATFORM)
   GET /api/admin/bookings
===================================================== */
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("theatre", "name city")
      .populate("screen", "name")
      .sort({ createdAt: -1 });

    const confirmedBookings = bookings.filter(
      (b) => b.status === "confirmed" && b.paymentStatus === "success"
    );

    const totalRevenue = confirmedBookings.reduce(
      (sum, b) => sum + (b.amount || 0),
      0
    );

    res.json({
      ok: true,
      bookings,
      totalBookings: confirmedBookings.length,
      totalRevenue,
    });
  } catch (err) {
    console.error("ADMIN BOOKINGS ERROR:", err);
    res.status(500).json({ ok: false });
  }
};

/* =====================================================
   💰 TOTAL REVENUE
   GET /api/admin/revenue
===================================================== */
exports.getRevenue = async (req, res) => {
  try {
    const result = await Booking.aggregate([
      { $match: { status: "confirmed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({
      ok: true,
      total: result[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ ok: false });
  }
};

/* =====================================================
   ✅ APPROVE / BLOCK SELLER (OPTIONAL BUT IMPORTANT)
   PUT /api/admin/seller/:id/status
===================================================== */
exports.updateSellerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // approved | blocked | pending

    await Seller.findByIdAndUpdate(id, { status });

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false });
  }
};

exports.updateSellerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["blocked", "approved"].includes(status)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid status change",
      });
    }

    const seller = await Seller.findById(id);

    if (!seller) {
      return res.status(404).json({
        ok: false,
        message: "Seller not found",
      });
    }

    if (seller.status === status) {
      return res.status(400).json({
        ok: false,
        message: `Seller already ${status}`,
      });
    }

    /* -----------------------------
       1️⃣ Update seller status
    ----------------------------- */
    seller.status = status;
    await seller.save();

    /* -----------------------------
       2️⃣ Find seller theatres
    ----------------------------- */
    const theatres = await Theatre.find({ sellerId: seller._id }, { _id: 1 });

    const theatreIds = theatres.map((t) => t._id);

    /* -----------------------------
       3️⃣ Cascade update
    ----------------------------- */
    if (status === "blocked") {
      // BLOCK FLOW
      await Theatre.updateMany({ sellerId: seller._id }, { status: "blocked" });

      if (theatreIds.length > 0) {
        await Screen.updateMany(
          { theatreId: { $in: theatreIds } },
          { status: "blocked" }
        );

        await Show.updateMany(
          { theatreId: { $in: theatreIds } },
          { status: "inactive" }
        );
      }
    } else {
      // UNBLOCK FLOW
      await Theatre.updateMany(
        { sellerId: seller._id },
        { status: "approved" }
      );

      if (theatreIds.length > 0) {
        await Screen.updateMany(
          { theatreId: { $in: theatreIds } },
          { status: "active" }
        );

        await Show.updateMany(
          { theatreId: { $in: theatreIds } },
          { status: "active" }
        );
      }
    }

    res.json({
      ok: true,
      message:
        status === "blocked"
          ? "Seller blocked successfully"
          : "Seller unblocked successfully",
    });
  } catch (err) {
    console.error("SELLER STATUS ERROR:", err);
    res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
};

// controllers/AdminController.js
exports.updateTheatreStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Only approved / blocked allowed
    if (!["approved", "blocked"].includes(status)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid status",
      });
    }

    const theatre = await Theatre.findById(id);
    if (!theatre) {
      return res.status(404).json({
        ok: false,
        message: "Theatre not found",
      });
    }

    if (theatre.status === status) {
      return res.status(400).json({
        ok: false,
        message: `Theatre already ${status}`,
      });
    }

    /* -----------------------------
       1️⃣ Update theatre
    ----------------------------- */
    theatre.status = status;
    await theatre.save();

    /* -----------------------------
       2️⃣ CASCADE EFFECT (ADMIN POWER)
    ----------------------------- */

    // 🔴 BLOCK THEATRE
    if (status === "blocked") {
      await Screen.updateMany(
        { theatreId: theatre._id },
        { status: "blocked" }
      );

      await Show.updateMany(
        { theatreId: theatre._id },
        { status: "inactive" }
      );
    }

    // 🟢 UNBLOCK THEATRE
    if (status === "approved") {
      await Screen.updateMany(
        { theatreId: theatre._id },
        { status: "active" }
      );

      await Show.updateMany(
        { theatreId: theatre._id },
        { status: "active" }
      );
    }

    res.json({
      ok: true,
      message: `Theatre ${status} successfully`,
    });
  } catch (err) {
    console.error("THEATRE STATUS ERROR:", err);
    res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
};
exports.logout = async (req, res) => {
  try {
    res.clearCookie("admin_token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      partitioned: true,
    });
    

    return res.status(200).json({
      ok: true,
      message: "Admin logged out successfully",
    });
  } catch (err) {
    console.error("ADMIN LOGOUT ERROR:", err);
    return res.status(500).json({
      ok: false,
      message: "Logout failed",
    });
  }
};
