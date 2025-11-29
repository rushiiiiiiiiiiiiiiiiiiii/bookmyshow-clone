const router = require("express").Router();
const { sendOtp, verifyOtp, onboard, getMe, getSellerBookings} = require("../controllers/sellerController");
const authMiddleware = require("../Middlewears/authMiddleware");

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/onboard", onboard);
router.get("/me", getMe);
router.get("/bookings", authMiddleware, getSellerBookings);

module.exports = router;
