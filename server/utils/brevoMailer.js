const SibApiV3Sdk = require("sib-api-v3-sdk");

const client = SibApiV3Sdk.ApiClient.instance;

// ✅ CORRECT AUTH KEY NAME
client.authentications["apiKey"].apiKey = process.env.BREVO_API_KEY;

const transactionalApi = new SibApiV3Sdk.TransactionalEmailsApi();

exports.sendOtpEmail = async ({ to, subject, html }) => {
  try {
    const response = await transactionalApi.sendTransacEmail({
      sender: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: "BookMyShow Clone",
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });

    return response;
  } catch (error) {
    console.error("BREVO MAIL ERROR:", error.response?.body || error.message);
    throw error;
  }
};
