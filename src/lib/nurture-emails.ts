// RUNPAYWAY — Nurture Email Templates
// Three-email sequence for post-assessment conversion.
// Uses the same HTML email structure as the assessment report email.

const navy = "#1C1635";
const purple = "#4B3FAE";
const teal = "#1F6D7A";
const muted = "rgba(14,26,43,0.58)";
const light = "rgba(14,26,43,0.35)";
const sand = "#F4F1EA";

interface NurtureParams {
  name: string;
  score: number;
  band: string;
  constraint: string;
  industry: string;
}

function bandColor(score: number): string {
  return score >= 75 ? teal : score >= 50 ? "#2B5EA7" : score >= 30 ? "#92640A" : "#9B2C2C";
}

function emailWrapper(bodyContent: string, recipientName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background-color:${navy};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${navy};">

<!-- Navy pre-header spacer -->
<tr><td style="height:32px;">&nbsp;</td></tr>

<tr><td align="center" style="padding:0 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

<!-- Logo bar -->
<tr><td style="padding:28px 40px 24px;text-align:left;">
<img src="https://peoplestar.com/RunPayway/runpayway-logo-blue.png" alt="RunPayway" width="140" height="17" style="display:inline-block;height:auto;filter:brightness(0) invert(1);opacity:0.85;"/>
</td></tr>

<!-- Gradient accent line -->
<tr><td style="padding:0 40px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="background:linear-gradient(90deg,${purple} 0%,${teal} 100%);height:2px;border-radius:1px;">&nbsp;</td></tr></table></td></tr>

<!-- White content card -->
<tr><td style="padding:0 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="background-color:#ffffff;padding:44px 40px 40px;border-radius:12px;margin-top:20px;">

${bodyContent}

</td></tr>
</table>
</td></tr>

<!-- Footer -->
<tr><td style="padding:32px 52px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="text-align:center;">
<p style="font-size:11px;color:rgba(244,241,234,0.40);margin:0 0 6px;letter-spacing:0.04em;">RunPayway \u2014 Income Stability Score\u2122</p>
<p style="font-size:10px;color:rgba(244,241,234,0.22);margin:0 0 12px;">Confidential \u2014 Prepared exclusively for ${recipientName}</p>
<a href="https://peoplestar.com/RunPayway/contact" style="font-size:10px;color:rgba(244,241,234,0.35);text-decoration:none;letter-spacing:0.06em;">CONTACT US</a>
<span style="font-size:10px;color:rgba(244,241,234,0.18);margin:0 8px;">&middot;</span>
<a href="https://peoplestar.com/RunPayway/contact?subject=unsubscribe" style="font-size:10px;color:rgba(244,241,234,0.35);text-decoration:none;letter-spacing:0.06em;">UNSUBSCRIBE</a>
</td></tr>
</table>
</td></tr>

<tr><td style="height:24px;">&nbsp;</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

function ctaButton(text: string, href: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
<tr><td style="background-color:${purple};border-radius:10px;">
<a href="${href}" style="display:inline-block;padding:14px 40px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;letter-spacing:0.02em;">${text}</a>
</td></tr>
</table>`;
}

/**
 * Email 1 — "Your Score in Context"
 * Sent immediately after free score reveal.
 */
export function nurtureEmail1(params: NurtureParams): { subject: string; html: string } {
  const { name, score, band, constraint, industry } = params;
  const color = bandColor(score);

  const body = `
<!-- Greeting -->
<p style="font-size:22px;font-weight:300;color:${navy};margin:0 0 6px;letter-spacing:-0.02em;line-height:1.3;">${name}, here is what your score means.</p>
<p style="font-size:13px;color:${light};line-height:1.7;margin:8px 0 0;">
Your Income Stability Score places you in context against structural benchmarks.
</p>

<!-- Divider -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
<tr><td style="height:1px;background-color:rgba(14,26,43,0.06);">&nbsp;</td></tr>
</table>

<!-- Score display -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:24px 28px;background-color:#fafaf8;border-radius:10px;border:1px solid rgba(14,26,43,0.04);">
<table role="presentation" cellpadding="0" cellspacing="0">
<tr>
<td style="font-size:48px;font-weight:200;color:${navy};line-height:1;letter-spacing:-0.04em;font-family:'Georgia',serif;">${score}</td>
<td style="font-size:14px;font-weight:300;color:rgba(14,26,43,0.18);vertical-align:bottom;padding-bottom:8px;padding-left:4px;">/100</td>
<td style="vertical-align:bottom;padding-bottom:8px;padding-left:16px;">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="width:8px;height:8px;border-radius:2px;background-color:${color};">&nbsp;</td>
<td style="padding-left:8px;font-size:13px;font-weight:600;color:${color};">${band}</td>
</tr></table>
</td>
</tr>
</table>
</td></tr>
</table>

<!-- Interpretation -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
<tr><td>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0 0 12px;">
A score of ${score} in the <strong style="color:${navy};font-weight:600;">${band}</strong> band means your income structure ${score >= 50 ? "has a functional foundation but carries specific vulnerabilities" : "is exposed to structural disruption in ways that may not be visible day to day"}. ${industry ? `For professionals in ${industry}, this is a common pattern` : "This is a common pattern"} \u2014 and it is addressable.
</p>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0;">
Your primary constraint is <strong style="color:${navy};font-weight:600;">${constraint.toLowerCase()}</strong>. This is the single structural factor holding your score where it is. Addressing it changes the trajectory of your entire income architecture.
</p>
</td></tr>
</table>

<!-- CTA -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
<tr><td style="padding:20px 24px;border-radius:8px;background-color:#fafaf8;border:1px solid rgba(14,26,43,0.04);">
<p style="font-size:13px;font-weight:600;color:${navy};margin:0 0 6px;">See the full picture</p>
<p style="font-size:12px;color:${muted};line-height:1.65;margin:0 0 16px;">
The diagnostic reveals every dimension of your income structure, maps your specific risks, and gives you a step-by-step plan to improve your score \u2014 with exact targets and ready-to-use scripts.
</p>
${ctaButton("See Your Full Diagnostic", "https://peoplestar.com/RunPayway/pricing")}
</td></tr>
</table>`;

  return {
    subject: `${name}, here\u2019s what your ${score} means`,
    html: emailWrapper(body, name),
  };
}

/**
 * Email 2 — "The One Thing That Would Change Your Score"
 * Sent Day 3 after assessment.
 */
export function nurtureEmail2(params: NurtureParams): { subject: string; html: string } {
  const { name, score, band, constraint, industry } = params;

  const constraintActions: Record<string, string> = {
    "Income Concentration": "Begin converting one existing client relationship into a retainer or standing agreement. Even a partial shift \u2014 moving 15\u201320% of project-based work into a recurring arrangement \u2014 changes how your income behaves under pressure.",
    "Forward Visibility": "Propose a 3-month or 6-month engagement framework to your most consistent revenue source. The goal is not to lock in every dollar \u2014 it is to extend the horizon of income you can see ahead of you.",
    "Labor Dependence": "Identify one deliverable you currently produce manually and package it as a repeatable, scalable offering. A productized service, a template library, a licensing arrangement \u2014 something that generates revenue without requiring your direct time.",
    "Low Recurrence": "Convert your most reliable one-time engagements into recurring structures. A retainer, a maintenance contract, a subscription-based access model. The structural shift matters more than the dollar amount.",
    "Source Diversification": "Open a second revenue channel that does not depend on your primary source. This does not mean working more hours \u2014 it means distributing income risk across independent relationships.",
    "Earnings Variability": "Introduce a floor into your income structure. A minimum monthly retainer, a base-rate agreement, or a prepaid package that guarantees a threshold regardless of project volume.",
    "Structural Durability": "Strengthen the agreements underpinning your income. Move from verbal commitments to documented terms. Extend contract durations where possible. The structure needs to hold under pressure.",
    "Income Continuity": "Build a buffer of income that continues if you stop active work for 30 days. This could be deferred revenue, a licensing stream, or pre-sold capacity that does not require your presence to deliver.",
  };

  const action = constraintActions[constraint] || `Focus on addressing ${constraint.toLowerCase()} \u2014 this is the single highest-leverage structural change available to you. The full diagnostic includes the specific steps and scripts to make this move.`;

  const body = `
<!-- Greeting -->
<p style="font-size:22px;font-weight:300;color:${navy};margin:0 0 6px;letter-spacing:-0.02em;line-height:1.3;">The single structural move for ${name}.</p>
<p style="font-size:13px;color:${light};line-height:1.7;margin:8px 0 0;">
Based on your score of ${score} and your primary constraint.
</p>

<!-- Divider -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
<tr><td style="height:1px;background-color:rgba(14,26,43,0.06);">&nbsp;</td></tr>
</table>

<!-- Constraint callout -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:20px 24px;background-color:#fafaf8;border-radius:10px;border:1px solid rgba(14,26,43,0.04);">
<p style="font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${light};margin:0 0 8px;">YOUR PRIMARY CONSTRAINT</p>
<p style="font-size:18px;font-weight:600;color:${navy};margin:0;">${constraint}</p>
</td></tr>
</table>

<!-- The one move -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
<tr><td>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0 0 16px;">
${action}
</p>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0;">
${industry ? `In ${industry}, this type of structural adjustment typically produces measurable score improvement within 60\u201390 days.` : "This type of structural adjustment typically produces measurable score improvement within 60\u201390 days."} The full diagnostic includes the complete action plan \u2014 with specific targets, timelines, and ready-to-use negotiation scripts.
</p>
</td></tr>
</table>

<!-- CTA -->
${ctaButton("See Your Full Action Plan", "https://peoplestar.com/RunPayway/pricing")}`;

  return {
    subject: `The single structural move for ${name}`,
    html: emailWrapper(body, name),
  };
}

/**
 * Email 3 — "What {industry} Professionals Are Seeing"
 * Sent Day 7 after assessment.
 */
export function nurtureEmail3(params: NurtureParams): { subject: string; html: string } {
  const { name, score, band, constraint, industry } = params;
  const color = bandColor(score);
  const displayIndustry = industry || "your sector";

  const body = `
<!-- Greeting -->
<p style="font-size:22px;font-weight:300;color:${navy};margin:0 0 6px;letter-spacing:-0.02em;line-height:1.3;">Income patterns in ${displayIndustry}.</p>
<p style="font-size:13px;color:${light};line-height:1.7;margin:8px 0 0;">
Where most professionals in your industry score \u2014 and what separates the top from the rest.
</p>

<!-- Divider -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
<tr><td style="height:1px;background-color:rgba(14,26,43,0.06);">&nbsp;</td></tr>
</table>

<!-- Industry context -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:24px 28px;background-color:#fafaf8;border-radius:10px;border:1px solid rgba(14,26,43,0.04);">
<p style="font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${light};margin:0 0 8px;">INDUSTRY BASELINE</p>
<p style="font-size:16px;font-weight:500;color:${navy};margin:0 0 16px;">${displayIndustry}</p>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr>
<td width="50%" style="vertical-align:top;">
<p style="font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${light};margin:0 0 4px;">YOUR SCORE</p>
<p style="font-size:28px;font-weight:200;color:${navy};margin:0;font-family:'Georgia',serif;">${score}</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:6px;"><tr>
<td style="width:6px;height:6px;border-radius:2px;background-color:${color};">&nbsp;</td>
<td style="padding-left:6px;font-size:12px;font-weight:600;color:${color};">${band}</td>
</tr></table>
</td>
<td width="50%" style="vertical-align:top;border-left:1px solid rgba(14,26,43,0.06);padding-left:16px;">
<p style="font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${light};margin:0 0 4px;">PRIMARY CONSTRAINT</p>
<p style="font-size:14px;font-weight:600;color:${navy};margin:0;">${constraint}</p>
</td>
</tr>
</table>
</td></tr>
</table>

<!-- Analysis -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
<tr><td>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0 0 12px;">
Most professionals in ${displayIndustry} operate in the Developing to Established range. The most common constraints are forward visibility and income concentration \u2014 structural patterns that are endemic to the industry, not individual failures.
</p>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0 0 12px;">
What distinguishes the top quartile is not earning more \u2014 it is how income is structured. Retainer-based arrangements, diversified client relationships, and contracted forward visibility create scores that hold up under disruption.
</p>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0;">
Your score of ${score} reflects your specific position within these patterns. The full diagnostic maps exactly where you stand relative to industry benchmarks and gives you the structural moves to improve.
</p>
</td></tr>
</table>

<!-- CTA -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
<tr><td style="padding:20px 24px;border-radius:8px;background-color:#fafaf8;border:1px solid rgba(14,26,43,0.04);">
<p style="font-size:13px;font-weight:600;color:${navy};margin:0 0 6px;">Your full diagnostic is ready to generate</p>
<p style="font-size:12px;color:${muted};line-height:1.65;margin:0 0 16px;">
Personalized action plan, risk scenarios, 12-week roadmap with your actual numbers, and ready-to-use negotiation scripts. Full refund if it does not reveal something new.
</p>
${ctaButton("Unlock Your Full Diagnostic", "https://peoplestar.com/RunPayway/pricing")}
</td></tr>
</table>`;

  return {
    subject: `Income patterns in ${displayIndustry}`,
    html: emailWrapper(body, name),
  };
}
