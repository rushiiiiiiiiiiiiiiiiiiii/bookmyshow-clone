const transporter = require("../utils/Mail");

exports.testMail = async (req, res) => {
  try {
    await transporter.sendMail({
      from: `"BookMyShow" 9cd194001@smtp-brevo.com`,
      to: "rushikesharote14@gmail.com",
      subject: "SMTP TEST",
      text: "Brevo SMTP working from Render ✅",
    });

    res.json({ ok: true, message: "Mail sent" });

  } catch (err) {
    console.error("TEST MAIL ERROR:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};
