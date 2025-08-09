const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST, // From Mailtrap
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  const mailOptions = {
    from: '"Online Learning Platform" <no-reply@learning.com>',
    to: options.email,
    subject: options.subject,
    html: options.message
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
