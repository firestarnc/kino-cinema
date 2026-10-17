/* eslint-disable @typescript-eslint/no-require-imports */

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.QSERVERS_SMTP_HOST,
  port: Number(process.env.QSERVERS_SMTP_PORT || 465),
  secure: Number(process.env.QSERVERS_SMTP_PORT || 465) === 465,
  auth: {
    user: process.env.QSERVERS_SMTP_USER,
    pass: process.env.QSERVERS_SMTP_PASSWORD,
  }
});

(async () => {
  try {
    const info = await transporter.sendMail({
      from: process.env.BOOKING_FROM_EMAIL || 'Kino Screens <bookings@kinoscreens.com>',
      to: process.env.TEST_EMAIL_TO || 'firestar.nc@gmail.com',
      subject: 'Test email',
      text: 'Test'
    });
    console.log('Sent:', info);
  } catch (err) {
    console.error('Send error:', err);
  }
})();