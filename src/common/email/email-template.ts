// Shared visual shell for every outbound email the platform sends — academy-
// level (EmailService) and platform-level (PlatformEmailService) alike —
// so a password reset, a payment-link email, and a lead notification all
// read as coming from the same, deliberately formal product rather than
// each being its own one-off inline-HTML string. Mirrors the marketing
// site's own palette (near-black header, lime accent) rather than
// introducing a second brand look just for email.
//
// Deliberately inline-styled throughout, not a <style> block: many webmail
// clients (Gmail chief among them) strip <head> styles entirely, and this
// template is simple enough that inheriting color/font-size from the
// containing <td> is reliable across clients without per-paragraph styling
// at every call site.
const INK = '#0B0F0A';
const LIME = '#A3E635';
const BODY_TEXT = '#3a3a35';
const MUTED_TEXT = '#8a8a82';
const BORDER = '#e5e5e0';
const PANEL_BG = '#f4f4f1';
const FOOTER_BG = '#f8f8f5';

export function renderEmailLayout(params: { title: string; bodyHtml: string }): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:${PANEL_BG};font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PANEL_BG};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid ${BORDER};">
            <tr>
              <td style="background:${INK};padding:24px 32px;">
                <span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:${LIME};margin-right:8px;vertical-align:middle;"></span>
                <span style="color:#ffffff;font-size:15px;font-weight:700;letter-spacing:0.5px;vertical-align:middle;">SAMS</span>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 32px 4px;">
                <h1 style="margin:0;font-size:20px;line-height:1.3;color:${INK};font-weight:700;">${params.title}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 32px 32px;color:${BODY_TEXT};font-size:15px;line-height:1.65;">
                ${params.bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:18px 32px;background:${FOOTER_BG};border-top:1px solid ${BORDER};color:${MUTED_TEXT};font-size:12px;line-height:1.6;">
                Soccer Academy Management System<br />
                <a href="mailto:adabo@variablexsolutions.com" style="color:${MUTED_TEXT};text-decoration:underline;">adabo@variablexsolutions.com</a>
                &nbsp;·&nbsp; 0500 008 001
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

// A primary call-to-action link, styled as a solid button — matches the
// marketing site's own lime CTA buttons. Use sparingly: one per email, same
// as the product's own forms.
// Any value from a public, unauthenticated form (or echoed back from an
// academy's own settings) must be escaped before landing in an email's HTML
// — otherwise it can inject markup/links into a message the recipient opens
// and trusts.
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function emailButton(label: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 20px;">
    <tr>
      <td style="border-radius:10px;background:${LIME};">
        <a href="${url}" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:700;color:${INK};text-decoration:none;">${label}</a>
      </td>
    </tr>
  </table>`;
}

// A quiet, de-emphasized line for the "if the button doesn't work" fallback
// link, or any other small print under the main message.
export function emailFootnote(html: string): string {
  return `<p style="margin:0;font-size:13px;color:${MUTED_TEXT};word-break:break-all;">${html}</p>`;
}
