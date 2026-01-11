const axios = require("axios");

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;

if (!BREVO_API_KEY) {
  console.error("❌ BREVO_API_KEY missing");
}

console.log("BREVO KEY PREFIX:", process.env.BREVO_API_KEY?.slice(0, 8));


async function sendOtpEmail({ to, subject, html }) {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          email: SENDER_EMAIL,
          name: "BookMyShow Clone",
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": BREVO_API_KEY,   // 🔥 THIS IS THE KEY FIX
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error(
      "BREVO MAIL ERROR:",
      err.response?.data || err.message
    );
    throw err;
  }
}

module.exports = { sendOtpEmail };



// const SibApiV3Sdk = require("sib-api-v3-sdk");

// const client = SibApiV3Sdk.ApiClient.instance;
// console.log("BREVO_API_KEY AT START:", process.env.BREVO_API_KEY);

// // 🔑 API KEY AUTH
// client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

// const transactionalApi = new SibApiV3Sdk.TransactionalEmailsApi();

// exports.sendOtpEmail = async ({ to, subject, html }) => {
//   try {
//     const response = await transactionalApi.sendTransacEmail({
//       sender: {
//         email: process.env.BREVO_SENDER_EMAIL,
//         name: "BookMyShow Clone",
//       },
//       to: [{ email: to }],
//       subject,
//       htmlContent: html,
//     });

//     return response;
//   } catch (error) {
//     console.error("BREVO MAIL ERROR:", error.response?.body || error.message);
//     throw error;
//   }
// };
