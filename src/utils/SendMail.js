require("dotenv/config");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendMail = async (email) => {
  try {
    await transporter.sendMail(email);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  sendMail,
  transporter,
};
