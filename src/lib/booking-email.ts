import type { Database } from "@/lib/database.types";
import { renderKinoEmailLayout } from "@/lib/email-layout";
import nodemailer from "nodemailer";

export type PrivateBookingRow = Database["public"]["Tables"]["private_bookings"]["Row"];

type SerializableErrorMeta = {
  response?: unknown;
  code?: unknown;
};

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
      messageId: info.messageId,
    });
  } catch (error) {
    const errorMeta = error as SerializableErrorMeta;
    console.error("[email] Failed to send booking confirmation", {
      reference: booking.paystack_reference,
      recipient: booking.email,
      error,
      smtpResponse: errorMeta.response,
      code: errorMeta.code,
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
      messageId: info.messageId,
    });
  } catch (error) {
    const errorMeta = error as SerializableErrorMeta;
    console.error("[email] Failed to send admin notification", {
      reference: booking.paystack_reference,
      recipients,
      error,
      smtpResponse: errorMeta.response,
      code: errorMeta.code,
    });
    throw error;
  }
}

export function getHalloweenCampaignSubject(): string {
  return "WIN N200,000 CASH | Girls-Only Halloween Movie Experience at Kino";
}

export async function sendHalloweenCampaignEmail(input: {
  recipientEmail: string;
  recipientName: string;
  bookingUrl: string;
}): Promise<void> {
  const smtpHost = process.env.QSERVERS_SMTP_HOST;
  const smtpUser = process.env.QSERVERS_SMTP_USER;
  const smtpPassword = process.env.QSERVERS_SMTP_PASSWORD;
  const fromEmail = process.env.BOOKING_FROM_EMAIL;

  if (!smtpHost || !smtpUser || !smtpPassword || !fromEmail) {
    throw new Error("Campaign email service is not configured");
  }

  const subject = getHalloweenCampaignSubject();

  const html = renderKinoEmailLayout({
    eyebrow: "Halloween Event",
    title: "Compete to WIN N200,000 Cash at Kino",
    intro: `Hi ${input.recipientName}, this October 31st we are hosting a girls-only Halloween movie experience at Kino.`
      + " Come in your best Halloween outfit, get professionally filmed, and compete for a N200,000 cash prize for best dressed.",
    detailsTitle: "Event Highlights",
    details: [
      { label: "Grand Prize", value: "N200,000 CASH for best dressed" },
      { label: "Date", value: "October 31" },
      { label: "Price", value: "N30,000 per person" },
      { label: "Includes", value: "Popcorn, small wine, water, banana bread, and a Kino branded gift" },
      { label: "Sessions", value: "9am-12pm, 12pm-3pm, 3pm-6pm, 6pm-9pm" },
    ],
    highlightTitle: "N200,000 GRAND PRIZE",
    highlightBody:
      "The best-dressed winner takes home N200,000 cash. Outfit videos will be posted on our socials and free voting will open on our website."
      + " Social likes and website votes help determine finalists. Judges make the final decision and the winner is announced live on TikTok on November 1st.",
    ctaLabel: "Reserve Your Slot to Compete",
    ctaHref: input.bookingUrl,
    footerPrimary:
      "You can book individually or choose the same session as a friend, subject to availability."
      + " Need help? Reply to this email or contact contact@kinoscreens.com.",
    footerSecondary:
      "If you prefer not to receive campaign updates, reply with UNSUBSCRIBE and we will remove you from future broadcasts.",
  });

  const text = [
    `Hi ${input.recipientName},`,
    "",
    "GRAND PRIZE: N200,000 CASH for best dressed.",
    "",
    "It is a girls-only Halloween movie experience at Kino on October 31st.",
    "",
    "Come in your Halloween outfit, show off your look, and get professionally filmed by our videographer.",
    "Afterwards, settle in for a movie with refreshments.",
    "",
    "Price: N30,000 per person",
    "Includes: popcorn, small wine, water, banana bread, and a Kino branded gift.",
    "",
    "Sessions:",
    "- 9am-12pm",
    "- 12pm-3pm",
    "- 3pm-6pm",
    "- 6pm-9pm",
    "",
    "Outfit videos will be posted on our socials. Free voting opens on our website.",
    "Social likes and website votes help decide finalists.",
    "Winner announcement: Live on TikTok, November 1st.",
    "Grand prize: N200,000.",
    "",
    `Reserve your session: ${input.bookingUrl}`,
    "",
    "You can book individually or choose the same session as a friend, subject to availability.",
    "",
    "Do not miss your chance to compete for N200,000 cash - limited session slots available.",
    "",
    "To opt out of future campaign updates, reply with UNSUBSCRIBE.",
  ].join("\n");

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

  await transporter.sendMail({
    from: fromEmail,
    to: input.recipientEmail,
    subject,
    text,
    html,
  });
}
