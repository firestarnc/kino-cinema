const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'mail.kinoscreens.com',
  port: 465,        // try 465 first (implicit TLS). If it times out, switch to 587 below.
  secure: true,     // true for 465, false for 587
  auth: { user: 'bookings@kinoscreens.com', pass: '+SE+qOIq12x#u#db' }
});

(async () => {
  try {
    const info = await transporter.sendMail({
      from: 'Kino Screens <bookings@kinoscreens.com>',
      to: 'firestar.nc@gmail.com',
      subject: 'Test email',
      text: 'Test'
    });
    console.log('Sent:', info);
  } catch (err) {
    console.error('Send error:', err);
  }
})();