import type { Database } from "@/lib/database.types";
import { renderKinoEmailLayout } from "@/lib/email-layout";
import nodemailer from "nodemailer";

export type PrivateBookingRow = Database["public"]["Tables"]["private_bookings"]["Row"];

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
    console.error("[email] Missing SMTP configuration for booking confirmation", {
      hasHost: Boolean(smtpHost),
      hasUser: Boolean(smtpUser),
      hasPassword: Boolean(smtpPassword),
      hasFrom: Boolean(fromEmail),
      reference: booking.paystack_reference,
    });
    return;
  }

  const bookingLabel = `${booking.booking_date} • ${booking.time_slot}`;
  const movieValue = booking.booking_type === "movie-package"
    ? `${booking.content_title ?? "To be selected in person"}${booking.content_platform ? ` • ${booking.content_platform}` : ""}`
    : booking.film_title ?? "To be selected in person at the cinema";
  const movieLine = `${booking.booking_type === "movie-package" ? "Title" : "Movie"}: ${movieValue}`;
  const amountPaid = `₦${booking.package_price_ngn.toLocaleString()}`;
  const bookingTypeLabel = booking.booking_type;
  const extraGuestValue = booking.booking_type === "movie-package" ? String(booking.additional_guests) : null;
  const roseDecorationValue = booking.include_rose_decoration ? "Yes (+₦10,000)" : "No";

  const html = renderKinoEmailLayout({
    eyebrow: "Booking Confirmed",
    title: "Your Kino Screens Reservation Is Ready",
    intro: `Hi ${booking.full_name}, your private cinema booking has been successfully confirmed. We are preparing an unforgettable screening for you.`,
    detailsTitle: "Booking Details",
    details: [
      { label: "Booking Type", value: bookingTypeLabel },
      { label: "Package", value: booking.package_name },
      { label: "Amount Paid", value: amountPaid },
      { label: "Rose Decoration", value: roseDecorationValue },
      { label: "Schedule", value: bookingLabel },
      { label: booking.booking_type === "movie-package" ? "Title" : "Movie", value: movieValue },
      ...(extraGuestValue ? [{ label: "Extra Guests", value: extraGuestValue }] : []),
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
    `Booking Type: ${bookingTypeLabel}`,
    `Package: ${booking.package_name}`,
    `Amount Paid: ${amountPaid}`,
    `Rose Decoration: ${roseDecorationValue}`,
    `Schedule: ${bookingLabel}`,
    movieLine,
    ...(extraGuestValue ? [`Extra Guests: ${extraGuestValue}`] : []),
    `Reference: ${booking.paystack_reference}`,
    "Anything outside the menu is available upon request.",
    "Contact: contact@kinoscreens.com",
  ].join("\n");

  try {
    const smtpPort = getSmtpPort();
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    const info = await transporter.sendMail({
      from: fromEmail,
      to: booking.email,
      subject: "Kino Screens booking confirmation",
      text,
      html,
    });
    console.info("[email] Sent booking confirmation", {
      reference: booking.paystack_reference,
      recipient: booking.email,
      messageId: (info as any)?.messageId,
      response: (info as any)?.response,
    });
  } catch (error) {
    console.error("[email] Failed to send booking confirmation", {
      reference: booking.paystack_reference,
      recipient: booking.email,
      error,
      smtpResponse: (error as any)?.response,
      code: (error as any)?.code,
    });
    throw error;
  }
}

export async function sendAdminNotification(booking: PrivateBookingRow): Promise<void> {
  const smtpHost = process.env.QSERVERS_SMTP_HOST;
  const smtpUser = process.env.QSERVERS_SMTP_USER;
  const smtpPassword = process.env.QSERVERS_SMTP_PASSWORD;
  const fromEmail = process.env.BOOKING_FROM_EMAIL;

  if (!smtpHost || !smtpUser || !smtpPassword || !fromEmail) {
    console.error("[email] Missing SMTP configuration for admin notification", {
      hasHost: Boolean(smtpHost),
      hasUser: Boolean(smtpUser),
      hasPassword: Boolean(smtpPassword),
      hasFrom: Boolean(fromEmail),
      reference: booking.paystack_reference,
    });
    return;
  }

  const rawRecipients = process.env.ADMIN_NOTIFICATION_EMAILS ?? "courageamayo1@gmail.com";
  const recipients = rawRecipients.split(",").map((s) => s.trim()).filter(Boolean);
  if (!recipients.length) return;

  const bookingLabel = `${booking.booking_date} • ${booking.time_slot}`;
  const amountPaid = `₦${booking.package_price_ngn.toLocaleString()}`;
  const roseDecorationValue = booking.include_rose_decoration ? "Yes (+₦10,000)" : "No";

  const subject = `Booking paid: ${booking.paystack_reference}`;

  const html = renderKinoEmailLayout({
    eyebrow: "Booking Paid",
    title: "Booking Paid",
    intro: "A booking has been marked paid.",
    detailsTitle: "Booking Details",
    details: [
      { label: "Full name", value: booking.full_name },
      { label: "Email", value: booking.email },
      { label: "Phone", value: booking.phone_number ?? "-" },
      { label: "Reference", value: booking.paystack_reference },
      { label: "Package", value: booking.package_name },
      { label: "Amount", value: amountPaid },
      { label: "Rose Decoration", value: roseDecorationValue },
      { label: "Schedule", value: bookingLabel },
      { label: "Notes", value: booking.notes ?? "-" },
    ],
    highlightBody: "View the admin dashboard for more details.",
    footerPrimary: "This notification was generated automatically.",
    footerSecondary: "The Kino Screens Team",
  });

  const text = [
    "Booking paid",
    `Name: ${booking.full_name}`,
    `Email: ${booking.email}`,
    `Phone: ${booking.phone_number ?? "-"}`,
    `Reference: ${booking.paystack_reference}`,
    `Package: ${booking.package_name}`,
    `Amount: ${amountPaid}`,
    `Rose Decoration: ${roseDecorationValue}`,
    `Schedule: ${bookingLabel}`,
    `Notes: ${booking.notes ?? "-"}`,
  ].join("\n");

  try {
    const smtpPort = getSmtpPort();
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    const info = await transporter.sendMail({
      from: fromEmail,
      to: recipients.join(","),
      subject,
      text,
      html,
    });
    console.info("[email] Sent admin notification", {
      reference: booking.paystack_reference,
      recipients,
      messageId: (info as any)?.messageId,
      response: (info as any)?.response,
    });
  } catch (error) {
    console.error("[email] Failed to send admin notification", {
      reference: booking.paystack_reference,
      recipients,
      error,
      smtpResponse: (error as any)?.response,
      code: (error as any)?.code,
    });
    throw error;
  }
}
