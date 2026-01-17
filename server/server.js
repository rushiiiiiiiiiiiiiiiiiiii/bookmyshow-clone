require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Conn = require("./Connection/Conn");
const cookieParser = require("cookie-parser");

const Authrouter = require("./Routes/UserRoutes");
// const transporter = require("./utils/Mail");
const { sendOtpEmail } = require("./utils/brevoMailer");

const app = express();
app.use(cookieParser());
app.set("trust proxy", 1);
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://book-my-show-frontend-ashen.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

Conn();
app.get("/", (req, res) => {
  res.send("Working Fine");
});
app.use("/api", require("./Routes/theatreRoutes"));
app.use("/api", require("./Routes/BookingRoutes"));
app.use("/api/admin", require("./Routes/AdminRoutes"));
app.use("/auth", Authrouter);
app.use("/api/seller", require("./Routes/SellerRoutes"));
app.use("/api/reviews", require("./Routes/reviewRoutes"));
app.use("/api", require("./Routes/ShowRoutes"));


// app.get("/test-mail", async (req, res) => {
//   try {
//     await transporter.sendMail({
//       from: process.env.SMTP_USER,
//       to: "rushikesharote14@gmail.com",
//       subject: "OTP Test",
//       text: "Brevo SMTP Working ✅"
//     });

//     res.send("Email Sent ✅");
//   } catch (err) {
//     console.error(err);
//     res.status(500).json(err);
//   }
// });

app.listen(process.env.PORT, () => {
  console.log(`Server Started on PORT ${process.env.PORT}`);
});
