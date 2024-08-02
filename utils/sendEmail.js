import nodemailer from "nodemailer";
import { config } from "dotenv";

config(); // Load environment variables from .env file

const transporter = nodemailer.createTransport({
  service: "Gmail", // You can use any email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
