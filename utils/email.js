const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) create transport
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //2) define email options
  const mailOptions = {
    from: 'Akash Prasad <akashorasad2000@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //3) actually send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
