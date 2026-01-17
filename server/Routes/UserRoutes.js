const express = require("express");
const Authrouter = express.Router();
const {
  sendOtp,
  verifyOtp,
  setName,
  getMe,
  logout,
} = require("../Controllers/UserController");
const auth = require("../Middlewears/auth");

Authrouter.post("/send-otp", sendOtp);
Authrouter.post("/verify-otp", verifyOtp);
Authrouter.post("/set-name", auth, setName);
Authrouter.get("/me", auth, getMe);
Authrouter.post("/logout", logout);
module.exports = Authrouter;
