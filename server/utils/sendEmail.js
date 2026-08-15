const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Use real credentials if provided in env
  let transporter;
  
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  } else {
    // Development fallback using Ethereal Email
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'SplitMint <noreply@splitmint.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const info = await transporter.sendMail(mailOptions);
  
  console.log('Message sent: %s', info.messageId);
  // Preview only available when sending through an Ethereal account
  if (!process.env.EMAIL_HOST) {
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
};

module.exports = sendEmail;
