import type { Database } from "@/lib/database.types";
import { renderKinoEmailLayout } from "@/lib/email-layout";
import nodemailer from "nodemailer";

type PrivateBookingRow = Database["public"]["Tables"]["private_bookings"]["Row"];

function getSmtpPort(): number {
  const rawPort = process.env.QSERVERS_SMTP_PORT ?? "587";
  const port = Number(rawPort);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("Invalid QServers SMTP port");
  }

  return port;
}

export async function sendBookingConfirmationEmail(booking: PrivateBookingRow): Promise<void> {
  const smtpHost = process.env.QSERVERS_SMTP_HOST;
  const smtpUser = process.env.QSERVERS_SMTP_USER;
  const smtpPassword = process.env.QSERVERS_SMTP_PASSWORD;
  const fromEmail = process.env.BOOKING_FROM_EMAIL;

  if (!smtpHost || !smtpUser || !smtpPassword || !fromEmail) {
    return;
  }

  const bookingLabel = `${booking.booking_date} • ${booking.time_slot}`;
  const movieValue = booking.film_title ?? "To be selected in person at the cinema";
  const movieLine = `Movie: ${movieValue}`;
  const amountPaid = `₦${booking.package_price_ngn.toLocaleString()}`;

  const html = renderKinoEmailLayout({
    eyebrow: "Booking Confirmed",
    title: "Your Kino Screens Reservation Is Ready",
    intro: `Hi ${booking.full_name}, your private cinema booking has been successfully confirmed. We are preparing an unforgettable screening for you.`,
    detailsTitle: "Booking Details",
    details: [
      { label: "Package", value: booking.package_name },
      { label: "Amount Paid", value: amountPaid },
      { label: "Schedule", value: bookingLabel },
      { label: "Movie", value: movieValue },
      { label: "Reference", value: booking.paystack_reference },
    ],
    highlightBody:
      "Anything outside the menu is available upon request. Reply to this email with your preferences and our team will arrange it immediately.",
    footerPrimary:
      "Need assistance before your arrival? Contact us at contact@kinoscreens.com.",
    footerSecondary: "The Kino Screens Team",
  });

  const text = [
    "Your Kino Screens booking is confirmed",
    `Hi ${booking.full_name},`,
    "We have confirmed your private cinema reservation.",
    `Package: ${booking.package_name}`,
    `Amount Paid: ${amountPaid}`,
    `Schedule: ${bookingLabel}`,
    movieLine,
    `Reference: ${booking.paystack_reference}`,
    "Anything outside the menu is available upon request.",
    "Contact: contact@kinoscreens.com",
  ].join("\n");

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: getSmtpPort(),
    secure: Number(process.env.QSERVERS_SMTP_PORT ?? "587") === 465,
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
  });

  await transporter.sendMail({
    from: fromEmail,
    to: booking.email,
    subject: "Kino Screens booking confirmation",
    text,
    html,
  });
}
