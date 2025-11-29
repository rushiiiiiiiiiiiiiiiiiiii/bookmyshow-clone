const jwt = require("jsonwebtoken");
const Theatre = require("../Schemas/Theatre");
const slugify = require("slugify");

/* ============================
   ✅ ADD THEATRE
============================ */
exports.addTheatre = async (req, res) => {
  try {
    // ✅ Authentication
    const token = req.cookies.seller_token;
    if (!token) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const {
      name,
      city,
      pincode,
      address,
      contactEmail,
      contactPhone,
      brand,
      theatreType,
      openingTime,
      closingTime,
      amenities,
      location,
    } = req.body;

    // ✅ Validation
    if (!name || !city || !address || !contactEmail || !contactPhone) {
      return res.status(400).json({
        ok: false,
        message: "Required fields missing",
      });
    }

    // ✅ Prevent duplicate theatre
    const exists = await Theatre.findOne({ name, city });
    if (exists) {
      return res.status(409).json({
        ok: false,
        message: "Theatre already exists in this city",
      });
    }

    // ✅ Create new theatre
    const theatre = await Theatre.create({
      sellerId: decoded.id,
      name,
      city,
      pincode,
      address,
      contactEmail,
      contactPhone,
      brand,
      theatreType,
      openingTime,
      closingTime,
      amenities,
      location,
      slug: slugify(`${name}-${city}`, { lower: true }),
      status: "approved",
    });

    return res.json({
      ok: true,
      message: "Theatre added successfully",
      theatre,
    });

  } catch (err) {
    console.error("ADD THEATRE ERROR:", err);
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
};


/* ============================
   ✅ GET SELLER THEATRES
============================ */
  exports.getTheatres = async (req, res) => {
    try {
      const token = req.cookies.seller_token;
      if (!token) {
        return res.status(401).json({ ok: false, message: "Unauthorized" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const theatres = await Theatre.find({
        sellerId: decoded.id,
        isActive: true,
      }).sort({ createdAt: -1 });

      return res.json({
        ok: true,
        theatres,
        total: theatres.length,
      });

    } catch (err) {
      console.error("GET THEATRES ERROR:", err);
      return res.status(500).json({
        ok: false,
        message: "Failed to fetch theatres",
      });
    }
  };


/* ============================
   ✅ GET SINGLE THEATRE DETAILS
============================ */
exports.getTheatreById = async (req, res) => {
  try {
    const token = req.cookies.seller_token;
    if (!token) return res.status(401).json({ ok: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = req.params;

    const theatre = await Theatre.findOne({
      _id: id,
      sellerId: decoded.id,
    });

    if (!theatre) {
      return res.status(404).json({
        ok: false,
        message: "Theatre not found",
      });
    }

    return res.json({ ok: true, theatre });

  } catch (err) {
    console.error("GET THEATRE ERROR:", err);
    return res.status(500).json({ ok: false });
  }
};


/* ============================
   ✅ UPDATE THEATRE
============================ */
exports.updateTheatre = async (req, res) => {
  try {
    const token = req.cookies.seller_token;
    if (!token) return res.status(401).json({ ok: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = req.params;

    const theatre = await Theatre.findOne({
      _id: id,
      sellerId: decoded.id,
    });

    if (!theatre) {
      return res.status(403).json({
        ok: false,
        message: "You do not own this theatre",
      });
    }

    Object.assign(theatre, req.body);
    await theatre.save();

    return res.json({
      ok: true,
      message: "Theatre updated",
      theatre,
    });

  } catch (err) {
    console.error("UPDATE THEATRE ERROR:", err);
    return res.status(500).json({ ok: false });
  }
};


/* ============================
   ✅ SOFT DELETE THEATRE
============================ */
exports.deleteTheatre = async (req, res) => {
  try {
    const token = req.cookies.seller_token;
    if (!token) return res.status(401).json({ ok: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = req.params;

    const theatre = await Theatre.findOne({
      _id: id,
      sellerId: decoded.id,
    });

    if (!theatre) {
      return res.status(403).json({
        ok: false,
        message: "Not authorized",
      });
    }

    theatre.isActive = false;
    theatre.status = "blocked";
    await theatre.save();

    return res.json({
      ok: true,
      message: "Theatre disabled successfully",
    });

  } catch (err) {
    console.error("DELETE THEATRE ERROR:", err);
    return res.status(500).json({ ok: false });
  }
};

// ===================================
// ✅ PUBLIC THEATRES API (FOR USERS)
// ===================================
exports.getPublicTheatres = async (req, res) => {
  try {
    const { city } = req.query;

    const filter = { isActive: true };

    if (city) filter.city = city;

    const theatres = await Theatre.find(filter).sort({ createdAt: -1 });

    res.json({
      ok: true,
      theatres
    });
  } catch (err) {
    console.error("PUBLIC THEATRES ERROR:", err);
    res.status(500).json({
      ok: false,
      message: "Failed to fetch theatres"
    });
  }
};
