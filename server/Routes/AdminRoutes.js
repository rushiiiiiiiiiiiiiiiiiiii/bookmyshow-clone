const express = require("express");
const router = express.Router();
const admin = require("../Controllers/AdminController");
const auth = require("../Middlewears/auth");
const adminAuth = require("../Middlewears/adminAuth");

// DASHBOARD
router.get("/dashboard", auth, adminAuth, admin.getDashboardStats);

// SELLERS
router.get("/sellers", auth, adminAuth, admin.getAllSellers);
router.get("/sellers/pending", auth, adminAuth, admin.getPendingSellers);
router.put("/seller/:id/status", auth, adminAuth, admin.updateSellerStatus);

// THEATRES / SCREENS / SHOWS
router.get("/theatres", auth, adminAuth, admin.getAllTheatres);
router.get("/screens", auth, adminAuth, admin.getAllScreens);
router.get("/shows", auth, adminAuth, admin.getAllShows);

router.post("/logout", admin.logout);

// BOOKINGS / REVENUE
router.get("/bookings", auth, adminAuth, admin.getAllBookings);
router.get("/revenue", auth, adminAuth, admin.getRevenue);

// THEATRE STATUS
router.put("/theatre/:id/status", auth, adminAuth, admin.updateTheatreStatus);

module.exports = router;
