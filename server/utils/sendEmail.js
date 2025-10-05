import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use App Password, not regular password
  },
});

export const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: `"VyahaWeb" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", result.messageId);
    return result;
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw error;
  }
};