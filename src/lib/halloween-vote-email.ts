import nodemailer from "nodemailer";
import { renderKinoEmailLayout } from "@/lib/email-layout";

export class HalloweenVoteEmailError extends Error {
  readonly code: "SMTP_CONFIG" | "SMTP_AUTH" | "SMTP_TRANSPORT" | "SMTP_UNKNOWN";

  constructor(message: string, code: HalloweenVoteEmailError["code"]) {
    super(message);
    this.name = "HalloweenVoteEmailError";
    this.code = code;
  }
}

function readEnv(name: string): string | null {
  const value = process.env[name];
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function getSmtpPort(): number {
  const rawPort = readEnv("QSERVERS_SMTP_PORT") ?? "587";
  const port = Number(rawPort);

  if (!Number.isInteger(port) || port <= 0) {
    throw new HalloweenVoteEmailError("Invalid QServers SMTP port", "SMTP_CONFIG");
  }

  return port;
}

export async function sendHalloweenVerificationEmail(input: {
  recipientEmail: string;
  recipientName: string;
  verificationUrl: string;
  candidateName: string;
}): Promise<void> {
  const smtpHost = readEnv("QSERVERS_SMTP_HOST");
  const smtpUser = readEnv("QSERVERS_SMTP_USER");
  const smtpPassword = readEnv("QSERVERS_SMTP_PASSWORD");
  const fromEmail = readEnv("BOOKING_FROM_EMAIL");

  if (!smtpHost || !smtpUser || !smtpPassword || !fromEmail) {
    throw new HalloweenVoteEmailError("Halloween verification email service is not configured", "SMTP_CONFIG");
  }

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

  const html = renderKinoEmailLayout({
    eyebrow: "Halloween Vote",
    title: "Verify Your Vote",
    intro: `Hi ${input.recipientName}, your vote for ${input.candidateName} is almost complete. Click the button below to verify your email address and lock in your participation.`,
    detailsTitle: "Vote Details",
    details: [
      { label: "Name", value: input.recipientName },
      { label: "Email", value: input.recipientEmail },
      { label: "Selected", value: input.candidateName },
    ],
    highlightTitle: "Verification Window",
    highlightBody: "This link expires in 24 hours. If you opened this email on another device, return there and click the verification button to confirm your vote.",
    ctaLabel: "Verify My Email",
    ctaHref: input.verificationUrl,
    footerPrimary: "If you did not request this vote, you can ignore this email.",
    footerSecondary: "Kino Screens Halloween Voting",
  });

  const text = [
    "Halloween vote verification",
    `Hi ${input.recipientName},`,
    `Please verify your vote for ${input.candidateName} by opening the link below:`,
    input.verificationUrl,
    "This link expires in 24 hours.",
  ].join("\n");

  try {
    await transporter.sendMail({
      from: fromEmail,
      to: input.recipientEmail,
      subject: "Verify your Halloween vote",
      text,
      html,
    });
  } catch (error) {
    const smtpError = error as { code?: string; responseCode?: number };

    if (smtpError.code === "EAUTH" || smtpError.responseCode === 535) {
      throw new HalloweenVoteEmailError("SMTP authentication failed while sending Halloween verification email", "SMTP_AUTH");
    }

    if (smtpError.code) {
      throw new HalloweenVoteEmailError("SMTP transport failed while sending Halloween verification email", "SMTP_TRANSPORT");
    }

    throw new HalloweenVoteEmailError("Unknown error while sending Halloween verification email", "SMTP_UNKNOWN");
  }
}