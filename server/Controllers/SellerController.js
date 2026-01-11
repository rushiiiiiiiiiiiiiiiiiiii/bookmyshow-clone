const Seller = require("../Schemas/Seller");
const Booking = require("../Schemas/Booking");
const otpStore = require("../utils/sellerOtpStore");
const { sendOtpEmail } = require("../utils/brevoMailer");

const jwt = require("jsonwebtoken");

// 📌 SEND OTP
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ ok: false, message: "Email required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes

    otpStore[email] = { otp, expires };

    await sendOtpEmail({
      to: email,
      subject: "Your Seller OTP",
      html: `
        <h3>Your Seller Login OTP</h3>
        <p style="font-size:22px;font-weight:bold">${otp}</p>
        <p>This OTP is valid for 5 minutes. Do NOT share it.</p>
      `,
    });

    return res.json({ ok: true, message: "OTP sent" });
  } catch (err) {
    console.error("SELLER OTP ERROR:", err.response?.data || err.message);
    return res.status(500).json({ ok: false, message: "Error sending OTP" });
  }
};

// 📌 VERIFY OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log(email, otp);

    if (!email || !otp)
      return res
        .status(400)
        .json({ ok: false, message: "Email and OTP required" });

    const record = otpStore[email];
    if (!record || record.otp !== otp)
      return res.status(400).json({ ok: false, message: "Invalid OTP" });

    if (Date.now() > record.expires) {
      delete otpStore[email];
      return res.status(400).json({ ok: false, message: "OTP expired" });
    }

    delete otpStore[email];

    let seller = await Seller.findOne({ email });
    let isNewSeller = false;

    if (!seller) {
      seller = await Seller.create({ email, isVerified: true });
      isNewSeller = true;
    }

    const token = jwt.sign(
      { id: seller._id, role: "seller" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res
      .cookie("seller_token", token, {
        //production
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        partitioned: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,

        //local
        // httpOnly: true,
        // secure: false,
        // sameSite: "lax",
        // path: "/",
        // partitioned: true,
        // maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ ok: true, isNewSeller });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    return res.status(500).json({ ok: false, message: "Error verifying OTP" });
  }
};

// 📌 ONBOARD SELLER (SAVE DETAILS)
exports.onboard = async (req, res) => {
  try {
    const seller = await Seller.findById(req.user.id);

    if (!seller)
      return res.status(404).json({ ok: false, message: "Seller not found" });

    const { bizName, businessType, address, city, pincode, phone } = req.body;

    seller.name = bizName;
    seller.phone = phone || seller.phone;
    seller.businessName = bizName;
    seller.businessType = businessType;
    seller.businessAddress = address;
    seller.businessCity = city;
    seller.businessPincode = pincode;
    seller.isVerified = true;

    await seller.save();

    res.json({ ok: true, seller });
  } catch (err) {
    res.status(500).json({ ok: false, message: "Error onboarding" });
  }
};

exports.getMe = async (req, res) => {
  try {
    const seller = await Seller.findById(req.user.id);
    if (!seller) return res.json({ ok: false, seller: null });

    res.json({ ok: true, seller });
  } catch (err) {
    res.json({ ok: false, seller: null });
  }
};

exports.getSellerBookings = async (req, res) => {
  try {
    const sellerId = req.user.id; // ✅ FIXED

    const bookings = await Booking.find()
      .populate({
        path: "theatre",
        match: { sellerId },
        select: "name sellerId",
      })
      .populate("screen", "name")
      .sort({ createdAt: -1 });

    const sellerBookings = bookings.filter((b) => b.theatre);

    res.json({
      ok: true,
      bookings: sellerBookings,
      total: sellerBookings.length,
    });
  } catch (err) {
    console.error("SELLER BOOKINGS ERROR:", err);
    res.status(500).json({ ok: false, message: "Failed to load bookings" });
  }
};

// Controllers/SellerAuthController.js

exports.sellerLogout = async (req, res) => {
  try {
    res.clearCookie("seller_token", {
      // httpOnly: true,
      // secure: false,
      // sameSite: "lax",
      // path: "/",

      //production
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    return res.status(200).json({
      ok: true,
      message: "Seller logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      ok: false,
      message: "Logout failed",
    });
  }
};
