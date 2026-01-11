const router = require("express").Router();
const {
  sendOtp,
  verifyOtp,
  onboard,
  getMe,
  getSellerBookings,
  sellerLogout,
} = require("../Controllers/SellerController");

const auth = require("../Middlewears/auth");
const sellerAuth = require("../Middlewears/sellerAuth");
router.post("/logout", sellerLogout);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

router.post("/onboard", auth, sellerAuth, onboard);
router.get("/me", auth, sellerAuth, getMe);
router.get("/bookings", auth, sellerAuth, getSellerBookings);

module.exports = router;
