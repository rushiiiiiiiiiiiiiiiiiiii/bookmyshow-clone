const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token =
    req.cookies.seller_token ||   // ✅ Seller token
    req.cookies.token ||          // ✅ User token
    req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: decoded.id, role: decoded.role }; // ✅ contains seller / user
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
