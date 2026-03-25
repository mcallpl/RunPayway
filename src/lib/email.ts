// RUNPAYWAY™ — Email Service (Resend)
// Sends branded Income Stability Assessment reports via email

import { Resend } from "resend";

const FROM_ADDRESS = process.env.RESEND_FROM_EMAIL || "RunPayway™ <onboarding@resend.dev>";

function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV === "production") {
      console.error("[EMAIL] RESEND_API_KEY is not set — emails will not be sent");
    }
    return null;
  }
  return new Resend(apiKey);
}

export interface ReportEmailData {
  recipientEmail: string;
  assessmentTitle: string;
  finalScore: number;
  stabilityBand: string;
  recordId: string;
  modelVersion: string;
  issuedTimestamp: string;
  industrySector: string;
  classification: string;
  primaryConstraintLabel: string;
  bandInterpretationText: string;
  peerPercentileLabel: string;
  riskScenarioDrop?: number;
}

/**
 * Send the Income Stability Assessment report via email.
 * Returns { success: true, id } or { success: false, error }.
 */
export async function sendReportEmail(data: ReportEmailData): Promise<{
  success: boolean;
  id?: string;
  error?: string;
}> {
  const resend = getResend();
  if (!resend) {
    return { success: false, error: "Email service not configured" };
  }

  const shortId = data.recordId.slice(0, 8);
  const subject = `Your Income Stability Assessment — Score: ${data.finalScore} (${data.stabilityBand})`;

  const html = buildReportEmailHtml(data);

  try {
    const result = await resend.emails.send({
      from: FROM_ADDRESS,
      to: data.recipientEmail,
      subject,
      html,
      tags: [
        { name: "type", value: "assessment-report" },
        { name: "record_id", value: shortId },
      ],
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true, id: result.data?.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Email send failed";
    return { success: false, error: message };
  }
}

function buildReportEmailHtml(data: ReportEmailData): string {
  const shortId = data.recordId.slice(0, 8);
  const brandNavy = "#0E1A2B";
  const brandPurple = "#4B3FAE";
  const brandTeal = "#1F6D7A";
  const muted = "rgba(14,26,43,0.58)";
  const light = "rgba(14,26,43,0.42)";
  const sand = "#F4F1EA";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Income Stability Assessment</title>
</head>
<body style="margin:0; padding:0; background-color:#f7f6f3; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <!-- Wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f6f3;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%;">

          <!-- Header gradient bar -->
          <tr>
            <td style="background:linear-gradient(135deg,${brandNavy} 0%,${brandPurple} 50%,${brandTeal} 100%); height:4px; border-radius:12px 12px 0 0;">&nbsp;</td>
          </tr>

          <!-- Main card -->
          <tr>
            <td style="background-color:#ffffff; padding:40px 36px; border:1px solid #e5e7eb; border-top:none; border-radius:0 0 12px 12px;">

              <!-- Logo -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:28px; border-bottom:1px solid ${sand};">
                    <img src="https://peoplestar.com/RunPayway/runpayway-logo-blue.png" alt="RunPayway™" width="160" height="19" style="display:inline-block; height:auto;" />
                    <span style="font-size:11px; color:${light}; margin-left:8px;">Income Stability Assessment</span>
                  </td>
                </tr>
              </table>

              <!-- Score hero -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
                <tr>
                  <td>
                    <p style="font-size:12px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:${muted}; margin:0 0 10px;">INCOME STABILITY SCORE</p>
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:52px; font-weight:700; color:${brandNavy}; line-height:1; padding-right:16px;">${data.finalScore}</td>
                        <td style="vertical-align:bottom; padding-bottom:6px;">
                          <span style="font-size:16px; font-weight:600; color:${brandTeal};">${data.stabilityBand}</span>
                        </td>
                      </tr>
                    </table>
                    ${data.bandInterpretationText ? `<p style="font-size:13px; color:${muted}; line-height:1.6; margin:12px 0 0;">${data.bandInterpretationText}</p>` : ""}
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
                <tr><td style="height:1px; background-color:${sand};">&nbsp;</td></tr>
              </table>

              <!-- Key details grid -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="vertical-align:top; padding-right:12px;">
                    <p style="font-size:10px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:${light}; margin:0 0 4px;">Assessment</p>
                    <p style="font-size:13px; font-weight:500; color:${brandNavy}; margin:0 0 16px;">${data.assessmentTitle || "Income System"}</p>

                    <p style="font-size:10px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:${light}; margin:0 0 4px;">Classification</p>
                    <p style="font-size:13px; font-weight:500; color:${brandNavy}; margin:0 0 16px;">${data.classification}</p>

                    <p style="font-size:10px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:${light}; margin:0 0 4px;">Industry</p>
                    <p style="font-size:13px; font-weight:500; color:${brandNavy}; margin:0;">${data.industrySector}</p>
                  </td>
                  <td width="50%" style="vertical-align:top; padding-left:12px;">
                    <p style="font-size:10px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:${light}; margin:0 0 4px;">Peer Ranking</p>
                    <p style="font-size:13px; font-weight:500; color:${brandNavy}; margin:0 0 16px;">${data.peerPercentileLabel} percentile in ${data.industrySector}</p>

                    <p style="font-size:10px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:${light}; margin:0 0 4px;">Main Area to Improve</p>
                    <p style="font-size:13px; font-weight:500; color:${brandNavy}; margin:0 0 16px;">${data.primaryConstraintLabel}</p>

                    <p style="font-size:10px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:${light}; margin:0 0 4px;">Issued</p>
                    <p style="font-size:13px; font-weight:500; color:${brandNavy}; margin:0;">${data.issuedTimestamp}</p>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
                <tr><td style="height:1px; background-color:${sand};">&nbsp;</td></tr>
              </table>

              <!-- CTA -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:${sand}; border-radius:8px; padding:20px 24px;">
                    <p style="font-size:13px; font-weight:600; color:${brandNavy}; margin:0 0 6px;">Your full report is ready</p>
                    ${data.primaryConstraintLabel ? `<p style="font-size:12px; color:${brandNavy}; line-height:1.6; margin:0 0 12px; font-weight:500;">Your biggest opportunity: ${data.primaryConstraintLabel.toLowerCase()}. See your full report for the specific changes that would raise your score the most.</p>` : ""}
                    <p style="font-size:12px; color:${muted}; line-height:1.6; margin:0 0 16px;">
                      Your diagnostic report includes an interactive score simulator, risk scenarios, projected improvements, an action plan with specific targets and ready-to-use scripts, and tradeoff analysis.
                    </p>
                    <a href="https://peoplestar.com/RunPayway/review" style="display:inline-block; padding:10px 24px; background-color:${brandNavy}; color:#ffffff; font-size:13px; font-weight:600; text-decoration:none; border-radius:12px;">View Full Report</a>
                  </td>
                </tr>
              </table>

              <!-- Record info -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
                <tr>
                  <td>
                    <p style="font-size:10px; color:${light}; margin:0;">
                      Record ID: ${shortId}… &nbsp;|&nbsp; Model: ${data.modelVersion} &nbsp;|&nbsp;
                      Verify at <span style="font-weight:500; color:${brandNavy};">peoplestar.com/RunPayway/verify</span>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0; text-align:center;">
              <p style="font-size:11px; color:${light}; margin:0 0 4px;">
                RunPayway™ · Income Stability Score™ · Model RP-2.0
              </p>
              <p style="font-size:10px; color:${light}; margin:0;">
                Confidential — Prepared for ${data.assessmentTitle || "Assessment Subject"} · support@runpayway.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
