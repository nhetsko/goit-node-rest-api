import "dotenv/config";
import nodemailer from "nodemailer";

const { MAILTRAP_USERNAME, MAILTRAP_PASSWORD } = process.env;

const config = {
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: MAILTRAP_USERNAME,
    pass: MAILTRAP_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);

export const sendEmail = async (data) => {
  const email = { ...data, from: MAILTRAP_USERNAME };
  try {
    await transporter.sendMail(email);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};