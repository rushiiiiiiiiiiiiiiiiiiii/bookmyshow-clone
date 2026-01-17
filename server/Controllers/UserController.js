const User = require("../Schemas/User");
const { sendOtpEmail } = require("../utils/brevoMailer");

const otpStore = require("../utils/otpStore");
const jwt = require("jsonwebtoken");

// SEND OTP
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ ok: false, message: "Email required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 5 * 60 * 1000; // 5 min

    // ✅ STORE AS OBJECT
    otpStore[email] = { otp, expires };

    await sendOtpEmail({
      to: email,
      subject: "Your OTP Code",
      html: `
        <h2>Your OTP Code</h2>
        <p style="font-size:24px;font-weight:bold">${otp}</p>
        <p>Valid for 5 minutes</p>
      `,
    });

    res.json({ ok: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("USER OTP ERROR:", err.response?.data || err.message);
    res.status(500).json({ ok: false, message: "Error sending OTP" });
  }
};

// VERIFY OTP (USER + ADMIN)
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        ok: false,
        message: "Email and OTP are required",
      });
    }

    const record = otpStore[email];

    // OTP not found or mismatch
    if (!record || record.otp !== otp) {
      return res.status(400).json({
        ok: false,
        message: "Invalid OTP",
      });
    }

    // OTP expired
    if (Date.now() > record.expires) {
      delete otpStore[email];
      return res.status(400).json({
        ok: false,
        message: "OTP expired",
      });
    }

    // OTP verified → remove from store
    delete otpStore[email];

    let user = await User.findOne({ email });
    let isNewUser = false;

    // Create user if not exists
    if (!user) {
      isNewUser = true;
      user = await User.create({
        email,
        isVerified: true,
        role: "user", // default role
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Role-based cookie name
    const cookieName = user.role === "admin" ? "admin_token" : "token";

    /* ============================
       PRODUCTION (HOSTED)
    ============================ */
    res.cookie(cookieName, token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      partitioned:true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    /* ============================
       LOCAL DEVELOPMENT
    ============================ */
    // res.cookie(cookieName, token, {
    //   httpOnly: true,
    //   secure: false,
    //   sameSite: "lax",
    //   path: "/",
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });

    return res.status(200).json({
      ok: true,
      role: user.role,
      isNewUser,
    });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    return res.status(500).json({
      ok: false,
      message: "Error verifying OTP",
    });
  }
};


// LOGOUT (USER / ADMIN)
exports.logout = async (req, res) => {
  try {
    // role from auth middleware (JWT payload)
    const role = req.user?.role || "user";

    // role-based cookie
    const cookieName = role === "admin" ? "admin_token" : "token";

    /* ============================
       PRODUCTION (HOSTED)
    ============================ */
    res.clearCookie(cookieName, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      partitioned: true
    });

    /* ============================
       LOCAL DEVELOPMENT
    ============================ */
    // res.clearCookie(cookieName, {
    //   httpOnly: true,
    //   secure: false,
    //   sameSite: "lax",
    //   path: "/",
    // });

    return res.status(200).json({
      ok: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    console.error("LOGOUT ERROR:", err);
    return res.status(500).json({
      ok: false,
      message: "Logout failed",
    });
  }
};



// SET NAME
exports.setName = async (req, res) => {
  try {
    const { name } = req.body;

    const user = await User.findById(req.user.id);

    user.name = name;
    user.isVerified = true;

    await user.save();

    res.json({ ok: true, user });
  } catch (err) {
    console.log(err);
    res.json({ ok: false, message: "Error saving name" });
  }
};

// GET LOGGED-IN USER
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ ok: true, user });
  } catch (err) {
    res.json({ ok: false, message: "User not found" });
  }
};

// LOGOUT (USER / ADMIN)
