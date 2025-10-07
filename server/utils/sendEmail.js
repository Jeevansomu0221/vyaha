// server/utils/sendEmail.js
import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  try {
    console.log("📧 Attempting to send email...");
    console.log("From:", process.env.EMAIL_USER);
    console.log("To:", to);

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Email credentials missing in .env file");
    }

    // ✅ Corrected: use createTransport (not createTransporter)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify transporter
    await transporter.verify();
    console.log("✅ Email transporter verified");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully! Message ID:", result.messageId);
    return result;
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    console.error("Full error details:", error);
    throw error;
  }
};

export default sendEmail;
