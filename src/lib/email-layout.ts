interface EmailDetailItem {
  label: string;
  value: string;
}

interface KinoEmailLayoutOptions {
  eyebrow: string;
  title: string;
  intro: string;
  detailsTitle?: string;
  details?: EmailDetailItem[];
  highlightTitle?: string;
  highlightBody?: string;
  footerPrimary?: string;
  footerSecondary?: string;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeHtmlWithLineBreaks(value: string): string {
  return escapeHtml(value).replaceAll("\n", "<br />");
}

function renderDetails(details: EmailDetailItem[] | undefined, detailsTitle: string | undefined): string {
  if (!details?.length) {
    return "";
  }

  const rows = details
    .map((detail) => {
      const label = escapeHtml(detail.label);
      const safeValue = escapeHtmlWithLineBreaks(detail.value);

      return `<p style=\"margin:0 0 8px;font-size:14px;line-height:1.65;color:#fff7fa;\"><strong style=\"color:#ffffff;\">${label}:</strong> ${safeValue}</p>`;
    })
    .join("");

  const titleBlock = detailsTitle
    ? `<p style=\"margin:0 0 10px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#f3d58a;\">${escapeHtml(detailsTitle)}</p>`
    : "";

  return `
    <tr>
      <td style=\"padding:20px 26px 8px;\">
        <div style=\"background:#2a0f1b;border:1px solid #8f264a;border-radius:12px;padding:16px 16px 14px;\">
          ${titleBlock}
          ${rows}
        </div>
      </td>
    </tr>
  `;
}

function renderHighlight(title: string | undefined, body: string | undefined): string {
  if (!title && !body) {
    return "";
  }

  const titleBlock = title
    ? `<p style=\"margin:0 0 6px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#f3d58a;\">${escapeHtml(title)}</p>`
    : "";

  const bodyBlock = body
    ? `<p style=\"margin:0;font-size:13px;line-height:1.7;color:#fff0f5;\">${escapeHtmlWithLineBreaks(body)}</p>`
    : "";

  return `
    <tr>
      <td style=\"padding:10px 26px 6px;\">
        <div style=\"background:#250f18;border-left:4px solid #f3d58a;border-radius:10px;padding:14px 14px 12px;\">
          ${titleBlock}
          ${bodyBlock}
        </div>
      </td>
    </tr>
  `;
}

export function renderKinoEmailLayout(options: KinoEmailLayoutOptions): string {
  const {
    eyebrow,
    title,
    intro,
    detailsTitle,
    details,
    highlightTitle,
    highlightBody,
    footerPrimary,
    footerSecondary,
  } = options;

  const footerPrimaryBlock = footerPrimary
    ? `<p style=\"margin:0 0 6px;font-size:13px;line-height:1.7;color:#fff0f5;\">${escapeHtmlWithLineBreaks(footerPrimary)}</p>`
    : "";

  const footerSecondaryBlock = footerSecondary
    ? `<p style=\"margin:0;font-size:12px;line-height:1.7;color:#e9d2dc;\">${escapeHtmlWithLineBreaks(footerSecondary)}</p>`
    : "";

  return `
    <div style=\"background:#12060b;padding:28px 12px;font-family:Outfit,Segoe UI,Arial,sans-serif;color:#fff6fa;\">
      <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"max-width:620px;margin:0 auto;background:#1a0811;border:1px solid #92264b;border-radius:16px;overflow:hidden;\">
        <tr>
          <td style=\"padding:28px 26px 18px;background:#8c173e;border-bottom:1px solid #a42d57;\">
            <p style=\"margin:0 0 10px;font-size:11px;letter-spacing:0.24em;text-transform:uppercase;color:#f3d58a;\">${escapeHtml(eyebrow)}</p>
            <h1 style=\"margin:0;font-family:'Playfair Display',Georgia,serif;font-size:30px;line-height:1.2;font-style:italic;color:#ffffff;\">${escapeHtml(title)}</h1>
            <p style=\"margin:12px 0 0;font-size:15px;line-height:1.65;color:#fff0f5;\">${escapeHtmlWithLineBreaks(intro)}</p>
          </td>
        </tr>

        ${renderDetails(details, detailsTitle)}
        ${renderHighlight(highlightTitle, highlightBody)}

        <tr>
          <td style=\"padding:18px 26px 26px;\">
            ${footerPrimaryBlock}
            ${footerSecondaryBlock}
          </td>
        </tr>
      </table>
    </div>
  `;
}
