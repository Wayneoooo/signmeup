// sendEmail.js
const { Resend } = require("resend"); // <-- note the destructuring
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail({ to, subject, html }) {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev", // verified sender
      to,
      subject,
      html,
    });
    console.log("Email sent to", to);
  } catch (err) {
    console.error("Failed to send email:", err);
  }
}

module.exports = sendEmail;
