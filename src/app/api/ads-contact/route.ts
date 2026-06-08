import { NextRequest, NextResponse } from "next/server";
import { renderKinoEmailLayout } from "@/lib/email-layout";
import nodemailer from "nodemailer";

interface AdsContactPayload {
  fullName?: string;
  companyName?: string;
  email?: string;
  phoneNumber?: string;
  message?: string;
}

function getSmtpPort(): number {
  const rawPort = process.env.QSERVERS_SMTP_PORT ?? "587";
  const port = Number(rawPort);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("Invalid QServers SMTP port");
  }

  return port;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitize(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as AdsContactPayload;

  const fullName = sanitize(body.fullName);
  const companyName = sanitize(body.companyName);
  const email = sanitize(body.email).toLowerCase();
  const phoneNumber = sanitize(body.phoneNumber);
  const message = sanitize(body.message);

  if (fullName.length < 2 || companyName.length < 2 || !isValidEmail(email) || message.length < 10) {
    return NextResponse.json({ error: "Please complete all required fields with valid details." }, { status: 400 });
  }

  const smtpHost = process.env.QSERVERS_SMTP_HOST;
  const smtpUser = process.env.QSERVERS_SMTP_USER;
  const smtpPassword = process.env.QSERVERS_SMTP_PASSWORD;
  const fromEmail = process.env.BOOKING_FROM_EMAIL;

  if (!smtpHost || !smtpUser || !smtpPassword || !fromEmail) {
    return NextResponse.json({ error: "Email service is not configured yet." }, { status: 500 });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: getSmtpPort(),
      secure: Number(process.env.QSERVERS_SMTP_PORT ?? "587") === 465,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    const html = renderKinoEmailLayout({
      eyebrow: "KINO Screens",
      title: "New Advertise Request",
      intro: "A new advertising request was submitted on the Experience page.",
      detailsTitle: "Lead Details",
      details: [
        { label: "Name", value: fullName },
        { label: "Company", value: companyName },
        { label: "Email", value: email },
        { label: "Phone", value: phoneNumber || "Not provided" },
      ],
      highlightTitle: "Campaign Brief",
      highlightBody: message,
      footerSecondary: "KINO Lead Notification",
    });

    await transporter.sendMail({
      from: fromEmail,
      to: "contact@kinoscreens.com",
      replyTo: email,
      subject: `New KINO Ads Inquiry - ${companyName}`,
      text: [
        "KINO Advertise Request",
        `Name: ${fullName}`,
        `Company: ${companyName}`,
        `Email: ${email}`,
        `Phone: ${phoneNumber || "Not provided"}`,
        "",
        "Campaign Brief:",
        message,
      ].join("\n"),
      html,
    });

    const confirmationHtml = renderKinoEmailLayout({
      eyebrow: "Advertise With KINO",
      title: "We Received Your Request",
      intro: `Hi ${fullName}, thank you for your advertising interest. Your campaign request has been received and queued for immediate review.`,
      detailsTitle: "Submitted Details",
      details: [
        { label: "Company", value: companyName },
        { label: "Email", value: email },
        { label: "Phone", value: phoneNumber || "Not provided" },
      ],
      highlightBody:
        "We would reach out immediately from contact@kinoscreens.com with recommended slots, durations, and pricing options for your campaign.",
      footerSecondary: "KINO Screens Team",
    });

    const confirmationText = [
      "Advertise With KINO",
      `Hi ${fullName}, we received your request and will reach out immediately.`,
      `Company: ${companyName}`,
      `Email: ${email}`,
      `Phone: ${phoneNumber || "Not provided"}`,
      "",
      "Our team will contact you from contact@kinoscreens.com with campaign options.",
    ].join("\n");

    try {
      await transporter.sendMail({
        from: fromEmail,
        to: email,
        subject: "KINO Ads Inquiry Received",
        text: confirmationText,
        html: confirmationHtml,
      });
    } catch (error) {
      // Auto-reply is best effort; internal inquiry has already been delivered.
      console.error("Ads auto-reply send failed", error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ads inquiry send failed", error);
    return NextResponse.json({ error: "Unable to send request right now." }, { status: 500 });
  }
}
