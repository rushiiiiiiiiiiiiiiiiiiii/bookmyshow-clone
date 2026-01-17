const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    let token = null;

    // 🔐 STRICT priority
    if (req.cookies.admin_token) token = req.cookies.admin_token;
    else if (req.cookies.seller_token) token = req.cookies.seller_token;
    else if (req.cookies.token) token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ ok: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }

    next();
  } catch {
    return res.status(401).json({ ok: false });
  }
};
