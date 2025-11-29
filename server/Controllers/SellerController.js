const Seller = require("../Schemas/Seller");
const Booking = require('../Schemas/Booking')
const otpStore = require("../utils/sellerOtpStore");
const transporter = require("../utils/mail");
const jwt = require("jsonwebtoken");

// 📌 SEND OTP
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ ok: false, message: "Email required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes

    otpStore[email] = { otp, expires };

    await transporter.sendMail({
      from: `"BookMyShow Clone" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Your Seller OTP",
      html: `
        <h3>Your Seller Login OTP</h3>
        <p style="font-size: 22px; font-weight: bold;">${otp}</p>
        <p>This OTP is valid for 5 minutes. Do NOT share it.</p>
      `,
    });

    return res.json({ ok: true, message: "OTP sent" });
  } catch (err) {
    console.error("SEND OTP ERROR:", err);
    return res.status(500).json({ ok: false, message: "Error sending OTP" });
  }
};

// 📌 VERIFY OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

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
        httpOnly: false,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
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
    const token = req.cookies.seller_token;
    if (!token)
      return res.status(401).json({ ok: false, message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const seller = await Seller.findById(decoded.id);

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

    return res.json({ ok: true, seller });
  } catch (err) {
    console.error("ONBOARD ERROR:", err);
    return res.status(500).json({ ok: false, message: "Error onboarding" });
  }
};
exports.getMe = async (req, res) => {
  try {
    const token = req.cookies.seller_token;
    if (!token) return res.json({ ok: false, seller: null });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const seller = await Seller.findById(decoded.id);

    if (!seller) return res.json({ ok: false, seller: null });

    res.json({ ok: true, seller });
  } catch (err) {
    return res.json({ ok: false, seller: null });
  }
};
// ===================================
// ✅ SELLER BOOKINGS
// ===================================
exports.getSellerBookings = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const bookings = await Booking.find()
      .populate("theatre", "name sellerId")
      .populate("screen", "name")
      .sort({ createdAt: -1 });

    // show only bookings belonging to this seller
    const sellerBookings = bookings.filter(
      (b) => b.theatre?.sellerId?.toString() === sellerId.toString()
    );

    res.json({
      ok: true,
      bookings: sellerBookings,
      total: sellerBookings.length,
    });
  } catch (err) {
    console.error("SELLER BOOKINGS ERROR FULL:", err);
    return res.status(500).json({
      ok: false,
      msg: err.message || "Failed to load bookings",
    });
  }
};
