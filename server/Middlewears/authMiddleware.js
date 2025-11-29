const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  console.log("COOKIES:", req.cookies); // keep for testing, remove later

  const token = req.cookies.token; // ✅ FIXED COOKIE NAME

  if (!token) {
    return res.status(401).json({ message: "Login required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: decoded.id };  // ✅ ensure _id exists
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
