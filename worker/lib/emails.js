// RunPayway — Email handling (send, contact, nurture, follow-up cron)

import { sanitizeString, sanitizeEmail, sanitizeInteger } from "./sanitize.js";

// ══════════════════════════════════════════════════════════
// SEND EMAIL (via Resend)
// ══════════════════════════════════════════════════════════

export async function handleSendEmail(body, env, corsHeaders) {
  const toEmail = sanitizeEmail(body.to);
  const score = sanitizeInteger(body.score, 0, 100, 0);

  if (!toEmail || !score) {
    return new Response(JSON.stringify({ error: "Missing or invalid to (email) or score" }), {
      status: 400, headers: corsHeaders,
    });
  }

  if (!env.RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "Email not configured" }), {
      status: 500, headers: corsHeaders,
    });
  }

  const navy = "#1C1635";
  const purple = "#4B3FAE";
  const teal = "#1F6D7A";
  const muted = "rgba(14,26,43,0.58)";
  const light = "rgba(14,26,43,0.35)";
  const sand = "#F4F1EA";
  const name = sanitizeString(body.name, 200) || "Assessment";
  const band = sanitizeString(body.band, 100);
  const industry = sanitizeString(body.industry, 200);
  const constraint = sanitizeString(body.constraint, 200);
  const interpretation = sanitizeString(body.interpretation, 2000);
  const record_id = sanitizeString(body.record_id, 100);
  const structure = sanitizeString(body.operating_structure, 200);
  const insightHook = sanitizeString(body.insight_hook, 500);
  const projectedScore = sanitizeInteger(body.projected_score, 0, 100, 0);
  const projectedLift = sanitizeInteger(body.projected_lift, 0, 100, 0);
  const actionPreviewRaw = sanitizeString(body.action_preview, 1000);
  const shortId = record_id.slice(0, 8);
  const fullId = record_id;
  const dashboardLink = fullId ? `https://peoplestar.com/RunPayway/dashboard?record=${encodeURIComponent(fullId)}` : "https://peoplestar.com/RunPayway/dashboard";
  const bandColor = score >= 75 ? teal : score >= 50 ? "#2B5EA7" : score >= 30 ? "#92640A" : "#9B2C2C";

  // Extract first sentence of action preview for teaser, blur the rest
  let actionFirst = "";
  let actionBlurred = "";
  if (actionPreviewRaw) {
    const sentenceEnd = actionPreviewRaw.search(/[.!?]\s/);
    if (sentenceEnd > 0) {
      actionFirst = actionPreviewRaw.slice(0, sentenceEnd + 1);
      const remainder = actionPreviewRaw.slice(sentenceEnd + 1).trim();
      if (remainder.length > 0) {
        actionBlurred = remainder.length > 60 ? remainder.slice(0, 60) + "..." : remainder;
      }
    } else {
      actionFirst = actionPreviewRaw;
    }
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background-color:${navy};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${navy};">

<!-- Navy pre-header spacer -->
<tr><td style="height:32px;">&nbsp;</td></tr>

<tr><td align="center" style="padding:0 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

<!-- 1. Logo bar — navy background -->
<tr><td style="padding:28px 40px 24px;text-align:left;">
<img src="https://peoplestar.com/RunPayway/runpayway-logo-blue.png" alt="RunPayway" width="140" height="17" style="display:inline-block;height:auto;filter:brightness(0) invert(1);opacity:0.85;"/>
</td></tr>

<!-- Thin gradient accent line -->
<tr><td style="padding:0 40px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="background:linear-gradient(90deg,${purple} 0%,${teal} 100%);height:2px;border-radius:1px;">&nbsp;</td></tr></table></td></tr>

<!-- White content card -->
<tr><td style="padding:0 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="background-color:#ffffff;padding:44px 40px 40px;border-radius:12px;margin-top:20px;">

<!-- 2. Insight hook — the line that makes them keep reading -->
${insightHook ? `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:0 0 28px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr>
<td width="3" style="vertical-align:top;padding-right:16px;">
<table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="width:3px;height:100%;min-height:28px;background-color:${teal};border-radius:2px;">&nbsp;</td></tr></table>
</td>
<td>
<p style="font-size:20px;font-weight:400;color:${navy};margin:0;line-height:1.45;letter-spacing:-0.01em;">${insightHook}</p>
</td>
</tr>
</table>
</td></tr>
</table>
` : ""}

<!-- Personal greeting -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td>
<p style="font-size:15px;font-weight:300;color:${navy};margin:0 0 6px;letter-spacing:-0.01em;line-height:1.4;">${name}, here\u2019s your structural measurement.</p>
<p style="font-size:13px;color:${light};line-height:1.7;margin:8px 0 0;">
We measured your income across six dimensions${industry ? ` in <strong style="color:${muted};font-weight:600;">${industry}</strong>` : ""}${structure ? ` as ${structure.match(/^[aeiou]/i) ? "an" : "a"} <strong style="color:${muted};font-weight:600;">${structure}</strong>` : ""}.
</p>
</td></tr>
</table>

<!-- Spacer -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
<tr><td style="height:1px;background-color:rgba(14,26,43,0.06);">&nbsp;</td></tr>
</table>

<!-- 3. Score display — secondary sizing -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:20px 24px;background-color:#fafaf8;border-radius:10px;border:1px solid rgba(14,26,43,0.04);">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr>
<td style="vertical-align:top;">
<p style="font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${light};margin:0 0 10px;">INCOME STABILITY SCORE</p>
<table role="presentation" cellpadding="0" cellspacing="0">
<tr>
<td style="font-size:40px;font-weight:200;color:${navy};line-height:1;letter-spacing:-0.04em;font-family:'Georgia',serif;">${score}</td>
<td style="font-size:14px;font-weight:300;color:rgba(14,26,43,0.18);vertical-align:bottom;padding-bottom:6px;padding-left:3px;">/100</td>
</tr>
</table>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:8px;">
<tr>
<td style="width:7px;height:7px;border-radius:2px;background-color:${bandColor};">&nbsp;</td>
<td style="padding-left:7px;font-size:12px;font-weight:600;color:${bandColor};letter-spacing:0.01em;">${band}</td>
</tr>
</table>
</td>
</tr>
</table>

</td></tr>
</table>

<!-- 4. Projected improvement (if making the key structural move) -->
${projectedScore > 0 ? `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
<tr><td style="padding:20px 24px;background-color:rgba(31,109,122,0.06);border-radius:10px;border:1px solid rgba(31,109,122,0.10);">
<p style="font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${teal};margin:0 0 10px;">IF YOU MAKE THIS STRUCTURAL MOVE</p>
<p style="font-size:28px;font-weight:300;color:${navy};margin:0 0 4px;letter-spacing:-0.02em;font-family:'Georgia',serif;">
${score} <span style="color:${teal};">&rarr;</span> ${projectedScore} <span style="font-size:16px;font-weight:600;color:${teal};">(+${projectedLift})</span>
</p>
<p style="font-size:13px;color:${muted};line-height:1.6;margin:8px 0 0;">Your income structure measures differently — and holds up better under pressure.</p>
</td></tr>
</table>
` : ""}

<!-- 5. What RunPayway measures (constraint context) -->
${constraint ? `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
<tr><td>
<p style="font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${light};margin:0 0 8px;">WHAT RUNPAYWAY MEASURES</p>
<p style="font-size:14px;font-weight:500;color:${navy};margin:0 0 8px;">${constraint}</p>
<p style="font-size:13px;color:${muted};line-height:1.65;margin:0;">${interpretation || "This dimension defines how your income structure behaves under pressure. Improving it is the path to a higher score."}</p>
</td></tr>
</table>
` : ""}

<!-- 6. Your structural opportunity -->
${actionFirst ? `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
<tr><td style="padding:20px 24px;background-color:rgba(31,109,122,0.06);border-radius:10px;border:1px solid rgba(31,109,122,0.10);">
<p style="font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${teal};margin:0 0 10px;">THE MOVE THAT MATTERS</p>
<p style="font-size:14px;font-weight:500;color:${navy};line-height:1.6;margin:0;">${actionFirst}${actionBlurred ? `<span style="color:rgba(14,26,43,0.18);filter:blur(0.5px);"> ${actionBlurred}</span>` : ""}</p>
<p style="margin:12px 0 0;"><a href="${dashboardLink}" style="font-size:12px;font-weight:600;color:${teal};text-decoration:none;letter-spacing:0.02em;">See complete details &rarr;</a></p>
</td></tr>
</table>
` : ""}

<!-- Spacer -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
<tr><td style="height:1px;background-color:rgba(14,26,43,0.06);">&nbsp;</td></tr>
</table>

<!-- CTA -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
<tr><td style="text-align:center;">
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
<tr><td style="background-color:${purple};border-radius:10px;">
<a href="${dashboardLink}" style="display:inline-block;padding:14px 40px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;letter-spacing:0.02em;">See Your Full Report</a>
</td></tr>
</table>
</td></tr>
</table>

<!-- 7. Record ID and model version footer -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
<tr><td>
<p style="font-size:10px;color:rgba(14,26,43,0.22);margin:0;letter-spacing:0.02em;">Record ${shortId} \u00B7 Model RP-2.0</p>
</td></tr>
</table>

</td></tr>
</table>
</td></tr>

<!-- Footer — navy -->
<tr><td style="padding:32px 52px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="text-align:center;">
<p style="font-size:11px;color:rgba(244,241,234,0.40);margin:0 0 6px;letter-spacing:0.04em;">RunPayway \u2014 Income Stability Score\u2122</p>
<p style="font-size:10px;color:rgba(244,241,234,0.22);margin:0 0 12px;">Confidential \u2014 Prepared exclusively for ${name}</p>
<a href="https://peoplestar.com/RunPayway/contact" style="font-size:10px;color:rgba(244,241,234,0.35);text-decoration:none;letter-spacing:0.06em;">CONTACT US</a>
</td></tr>
</table>
</td></tr>

<tr><td style="height:24px;">&nbsp;</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: env.FROM_EMAIL || "RunPayway <reports@peoplestar.com>",
      to: toEmail,
      subject: `${name || "Your"} Income Stability Assessment \u2014 ${band || "Results Ready"}`,
      html,
      tags: [
        { name: "type", value: "assessment-report" },
        { name: "record_id", value: shortId },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return new Response(JSON.stringify({ error: "Email failed", detail: err }), {
      status: 502, headers: corsHeaders,
    });
  }

  const result = await res.json();
  return new Response(JSON.stringify({ success: true, id: result.id }), { headers: corsHeaders });
}

// ══════════════════════════════════════════════════════════
// CONTACT FORM
// ══════════════════════════════════════════════════════════

export async function handleContact(body, env, corsHeaders) {
  const contactName = sanitizeString(body.name, 200);
  const contactEmail = sanitizeEmail(body.email);
  const contactMessage = sanitizeString(body.message, 5000);
  const contactSubject = sanitizeString(body.subject, 200);

  if (!contactName || !contactEmail || !contactMessage) {
    return new Response(JSON.stringify({ error: "Missing required fields (name, email, message)" }), {
      status: 400, headers: corsHeaders,
    });
  }

  if (!env.RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "Email not configured" }), {
      status: 500, headers: corsHeaders,
    });
  }

  // Format admin notification based on type
  const isBriefSignup = contactSubject === "structural_income_brief";
  const adminSubject = isBriefSignup
    ? `[RunPayway] New Brief Subscriber: ${contactEmail}`
    : `[RunPayway Contact] ${(contactSubject || "General Inquiry").replace(/[\r\n]/g, "")} - ${contactName.replace(/[\r\n]/g, "")}`;

  const adminHtml = isBriefSignup
    ? `<div style="font-family:sans-serif;max-width:600px;">
<h2 style="color:#1F6D7A;margin:0 0 16px;">New Structural Income Brief Subscriber</h2>
<table style="width:100%;border-collapse:collapse;">
<tr><td style="padding:8px 0;color:#6B6155;width:100px;">Email</td><td style="padding:8px 0;color:#1C1635;font-weight:600;">${contactEmail}</td></tr>
<tr><td style="padding:8px 0;color:#6B6155;">Source</td><td style="padding:8px 0;color:#1C1635;font-weight:500;">${contactMessage.includes("homepage") ? "Homepage" : contactMessage.includes("footer") ? "Footer" : contactMessage.includes("free-score") ? "Free Score Page" : "Website"}</td></tr>
<tr><td style="padding:8px 0;color:#6B6155;">Date</td><td style="padding:8px 0;color:#1C1635;font-weight:500;">${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</td></tr>
</table>
<div style="margin:16px 0;padding:16px;background:#F0FDF4;border-radius:8px;border:1px solid #BBF7D0;">
<p style="margin:0;color:#166534;line-height:1.6;font-weight:500;">This subscriber will receive the 3-email nurture sequence automatically (Day 0, Day 3, Day 7).</p>
</div>
</div>`
    : `<div style="font-family:sans-serif;max-width:600px;">
<h2 style="color:#1C1635;margin:0 0 16px;">New Contact Form Submission</h2>
<table style="width:100%;border-collapse:collapse;">
<tr><td style="padding:8px 0;color:#6B6155;width:100px;">Name</td><td style="padding:8px 0;color:#1C1635;font-weight:500;">${contactName}</td></tr>
<tr><td style="padding:8px 0;color:#6B6155;">Email</td><td style="padding:8px 0;color:#1C1635;font-weight:500;">${contactEmail}</td></tr>
<tr><td style="padding:8px 0;color:#6B6155;">Subject</td><td style="padding:8px 0;color:#1C1635;font-weight:500;">${contactSubject || "General"}</td></tr>
</table>
<div style="margin:16px 0;padding:16px;background:#F8F6F1;border-radius:8px;border:1px solid #E8E5DE;">
<p style="margin:0;color:#1C1635;line-height:1.6;">${contactMessage.replace(/\n/g, "<br/>")}</p>
</div>
<p style="font-size:12px;color:#6B6155;margin:16px 0 0;">Reply directly to this email to respond to ${contactName}.</p>
</div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: env.FROM_EMAIL || "RunPayway <reports@peoplestar.com>",
      to: "info@peoplestar.com",
      reply_to: contactEmail,
      subject: adminSubject,
      html: adminHtml,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return new Response(JSON.stringify({ error: "Send failed", detail: err }), {
      status: 502, headers: corsHeaders,
    });
  }

  // ── Nurture sequence: enroll and send email 1 for brief signups ──
  if (contactSubject === "structural_income_brief") {
    try {
      // Check if already enrolled (idempotent)
      const existing = await env.DB.prepare(
        "SELECT email, emails_sent FROM nurture_queue WHERE email = ?"
      ).bind(contactEmail).first();

      if (!existing) {
        const now = new Date().toISOString();
        await env.DB.prepare(
          `INSERT INTO nurture_queue (email, name, signed_up_at, emails_sent, score, band, constraint_name, industry)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          contactEmail,
          contactName || "there",
          now,
          "1", // email 1 will be sent immediately
          0,   // score not yet available
          "",  // band not yet available
          "",  // constraint not yet available
          ""   // industry not yet available
        ).run();

        // Send nurture email 1 immediately (welcome version without score)
        const welcomeResult = buildNurtureWelcomeEmail({ name: contactName || "there" });
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: env.FROM_EMAIL || "RunPayway <reports@peoplestar.com>",
            to: contactEmail,
            subject: welcomeResult.subject,
            html: welcomeResult.html,
            tags: [{ name: "type", value: "nurture-1" }],
          }),
        });
        console.log(`[Nurture] Enrolled ${contactEmail} and sent welcome email`);
      } else {
        console.log(`[Nurture] ${contactEmail} already enrolled, skipping`);
      }
    } catch (err) {
      // Nurture enrollment failure should not break the contact form
      console.error(`[Nurture] Enrollment error for ${contactEmail}:`, err);
    }
  }

  return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
}

// ══════════════════════════════════════════════════════════
// NURTURE SEQUENCE — D1-backed scheduler
// ══════════════════════════════════════════════════════════

// Ensure the nurture_queue table exists (idempotent)
export async function ensureNurtureTable(env) {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS nurture_queue (
      email TEXT PRIMARY KEY,
      name TEXT NOT NULL DEFAULT 'there',
      signed_up_at TEXT NOT NULL,
      emails_sent TEXT NOT NULL DEFAULT '1',
      score INTEGER DEFAULT 0,
      band TEXT DEFAULT '',
      constraint_name TEXT DEFAULT '',
      industry TEXT DEFAULT ''
    )
  `).run();
}

// Process the nurture queue — called by cron trigger daily at 2pm UTC
export async function processNurtureQueue(env) {
  if (!env.RESEND_API_KEY) {
    console.log("[Nurture Cron] No RESEND_API_KEY configured, skipping");
    return;
  }

  try {
    await ensureNurtureTable(env);
  } catch (err) {
    console.error("[Nurture Cron] Failed to ensure table:", err);
    return;
  }

  const fromEmail = env.FROM_EMAIL || "RunPayway <reports@peoplestar.com>";

  // Fetch all nurture records that still have emails to send
  let rows;
  try {
    rows = await env.DB.prepare(
      "SELECT * FROM nurture_queue ORDER BY signed_up_at ASC LIMIT 50"
    ).all();
  } catch (err) {
    console.error("[Nurture Cron] Failed to query nurture_queue:", err);
    return;
  }

  if (!rows?.results?.length) {
    console.log("[Nurture Cron] No records to process");
    return;
  }

  console.log(`[Nurture Cron] Processing ${rows.results.length} nurture records`);
  const now = Date.now();

  for (const row of rows.results) {
    const emailsSent = row.emails_sent ? row.emails_sent.split(",").map(Number) : [];
    const signedUpAt = new Date(row.signed_up_at).getTime();
    const daysSince = Math.floor((now - signedUpAt) / (1000 * 60 * 60 * 24));

    const params = {
      name: row.name || "there",
      score: row.score || 0,
      band: row.band || "",
      constraint: row.constraint_name || "Income Concentration",
      industry: row.industry || "",
    };

    try {
      // Day 3+: send email 2 (the structural move email)
      if (daysSince >= 3 && !emailsSent.includes(2)) {
        let emailContent;
        if (params.score > 0) {
          // Have score data — send the full nurture email 2
          emailContent = buildNurtureEmail2(params);
        } else {
          // No score yet — send a reminder to take the assessment
          emailContent = buildNurtureReminder2(params);
        }

        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${env.RESEND_API_KEY}` },
          body: JSON.stringify({
            from: fromEmail,
            to: row.email,
            subject: emailContent.subject,
            html: emailContent.html,
            tags: [{ name: "type", value: "nurture-2" }],
          }),
        });

        if (res.ok) {
          emailsSent.push(2);
          await env.DB.prepare(
            "UPDATE nurture_queue SET emails_sent = ? WHERE email = ?"
          ).bind(emailsSent.join(","), row.email).run();
          console.log(`[Nurture Cron] Sent email 2 to ${row.email} (day ${daysSince})`);
        } else {
          console.error(`[Nurture Cron] Failed to send email 2 to ${row.email}: ${await res.text()}`);
        }
        continue; // Process one email per record per cron run
      }

      // Day 7+: send email 3 (the industry patterns email)
      if (daysSince >= 7 && !emailsSent.includes(3)) {
        let emailContent;
        if (params.score > 0) {
          emailContent = buildNurtureEmail3(params);
        } else {
          emailContent = buildNurtureReminder3(params);
        }

        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${env.RESEND_API_KEY}` },
          body: JSON.stringify({
            from: fromEmail,
            to: row.email,
            subject: emailContent.subject,
            html: emailContent.html,
            tags: [{ name: "type", value: "nurture-3" }],
          }),
        });

        if (res.ok) {
          emailsSent.push(3);
          await env.DB.prepare(
            "UPDATE nurture_queue SET emails_sent = ? WHERE email = ?"
          ).bind(emailsSent.join(","), row.email).run();
          console.log(`[Nurture Cron] Sent email 3 to ${row.email} (day ${daysSince})`);
        } else {
          console.error(`[Nurture Cron] Failed to send email 3 to ${row.email}: ${await res.text()}`);
        }
        continue;
      }

      // All 3 emails sent — clean up the record
      if (emailsSent.includes(1) && emailsSent.includes(2) && emailsSent.includes(3)) {
        await env.DB.prepare("DELETE FROM nurture_queue WHERE email = ?").bind(row.email).run();
        console.log(`[Nurture Cron] Completed sequence for ${row.email}, record removed`);
      }
    } catch (err) {
      // Individual record failure should not stop processing others
      console.error(`[Nurture Cron] Error processing ${row.email}:`, err);
    }
  }

  console.log("[Nurture Cron] Processing complete");
}

// ══════════════════════════════════════════════════════════
// NURTURE EMAIL ENDPOINT
// ══════════════════════════════════════════════════════════

export async function handleNurture(body, env, corsHeaders) {
  const email = sanitizeEmail(body.email);
  const name = sanitizeString(body.name, 200);
  const score = sanitizeInteger(body.score, 0, 100, 0);
  const band = sanitizeString(body.band, 100);
  const constraint = sanitizeString(body.constraint, 200);
  const industry = sanitizeString(body.industry, 200);
  const emailNumber = body.emailNumber;

  if (!email || !emailNumber || !name) {
    return new Response(JSON.stringify({ error: "Missing required fields: email, name, emailNumber" }), {
      status: 400, headers: corsHeaders,
    });
  }

  if (![1, 2, 3].includes(emailNumber)) {
    return new Response(JSON.stringify({ error: "emailNumber must be 1, 2, or 3" }), {
      status: 400, headers: corsHeaders,
    });
  }

  if (!env.RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "Email not configured" }), {
      status: 500, headers: corsHeaders,
    });
  }

  const params = {
    name: name || "there",
    score: score || 0,
    band: band || "",
    constraint: constraint || "Income Concentration",
    industry: industry || "",
  };

  let subject, html;

  if (emailNumber === 1) {
    const result = buildNurtureEmail1(params);
    subject = result.subject;
    html = result.html;
  } else if (emailNumber === 2) {
    const result = buildNurtureEmail2(params);
    subject = result.subject;
    html = result.html;
  } else {
    const result = buildNurtureEmail3(params);
    subject = result.subject;
    html = result.html;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: env.FROM_EMAIL || "RunPayway <reports@peoplestar.com>",
        to: email,
        subject,
        html,
        tags: [
          { name: "type", value: `nurture-${emailNumber}` },
          { name: "score", value: String(score || 0) },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ error: "Email failed", detail: err }), {
        status: 502, headers: corsHeaders,
      });
    }

    const result = await res.json();
    return new Response(JSON.stringify({ success: true, id: result.id }), { headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Send failed", detail: String(err) }), {
      status: 500, headers: corsHeaders,
    });
  }
}

// ══════════════════════════════════════════════════════════
// FOLLOW-UP EMAIL CRON
// ══════════════════════════════════════════════════════════

// followup_sent bitmask: 0=none, 1=day7, 2=day30, 4=day90

export async function handleFollowUpCron(env) {
  if (!env.RESEND_API_KEY) return;
  const fromEmail = env.FROM_EMAIL || "RunPayway <reports@peoplestar.com>";

  // Query records with email that haven't received all follow-ups
  const rows = await env.DB.prepare(
    `SELECT id, email, assessment_title, score, band, top_action, industry, created_at, followup_sent
     FROM records
     WHERE email != '' AND email IS NOT NULL AND followup_sent < 7
     ORDER BY created_at ASC LIMIT 50`
  ).all();

  if (!rows?.results?.length) return;

  const now = Date.now();

  for (const row of rows.results) {
    const daysSince = Math.floor((now - new Date(row.created_at).getTime()) / (1000 * 60 * 60 * 24));
    const sent = row.followup_sent || 0;
    const name = row.assessment_title || "there";

    let email = null;

    // Day 7 (send between day 6-14)
    if (daysSince >= 6 && daysSince <= 14 && !(sent & 1)) {
      email = {
        flag: 1,
        subject: `${name}, have you explored your Command Center yet?`,
        html: followUpDay7(name, row.score, row.band, row.top_action, row.id, row.industry),
      };
    }
    // Day 30 (send between day 28-45)
    else if (daysSince >= 28 && daysSince <= 45 && !(sent & 2)) {
      email = {
        flag: 2,
        subject: `${daysSince} days since your assessment \u2014 here\u2019s what to focus on`,
        html: followUpDay30(name, row.score, row.top_action, daysSince, row.id, row.industry),
      };
    }
    // Day 90 (send between day 85-120)
    else if (daysSince >= 85 && daysSince <= 120 && !(sent & 4)) {
      email = {
        flag: 4,
        subject: `${name}, it\u2019s time to see how much you\u2019ve improved`,
        html: followUpDay90(name, daysSince, row.id, row.industry),
      };
    }

    if (!email) continue;

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${env.RESEND_API_KEY}` },
        body: JSON.stringify({
          from: fromEmail,
          to: row.email,
          subject: email.subject,
          html: email.html,
          tags: [{ name: "type", value: "follow-up" }, { name: "record_id", value: row.id.slice(0, 8) }],
        }),
      });
      if (res.ok) {
        await env.DB.prepare("UPDATE records SET followup_sent = ? WHERE id = ?").bind(sent | email.flag, row.id).run();
      }
    } catch { /* email send failed — will retry next cron */ }
  }
}

// ── Industry-Specific Reassessment Prompts ────────────────────────

export const INDUSTRY_REASSESSMENT_PROMPTS = {
  real_estate: {
    recurrence: "Have you added any property management contracts, rental units, or team override arrangements since your last assessment that now generate monthly income without requiring a closing?",
    concentration: "Has the share of your GCI coming from your single largest referral source or client changed — have you added new lead sources, or has one relationship become even more dominant?",
    diversification: "Are you now earning income from transaction types or market areas you were not active in before — commercial, rentals, new construction, or a different geographic farm?",
    forward: "Do you currently have more or fewer signed listing agreements and pre-approved buyers in your pipeline compared to your last assessment?",
    variability: "Over the past six months, has the gap between your highest-earning month and lowest-earning month narrowed or widened?",
    labor: "Have you hired showing assistants, buyer's agents, or established referral partnerships that generate income without your personal presence at every transaction?",
  },
  consulting_professional_services: {
    recurrence: "Have you converted any project clients to monthly retainer arrangements, or added subscription-based services that now generate predictable monthly revenue?",
    concentration: "Has the percentage of your total revenue coming from your single largest client increased or decreased since your last assessment?",
    diversification: "Are you now serving clients in industries or functional areas that you were not active in previously?",
    forward: "Do you currently have more signed engagement letters and committed retainers extending into the next quarter than you did at your last assessment?",
    variability: "Over the last two quarters, has the spread between your highest-revenue month and lowest-revenue month narrowed?",
    labor: "Have you hired associates, engaged subcontractors, or launched any productized offerings that generate revenue without requiring your personal delivery hours?",
  },
  technology: {
    recurrence: "Have you added maintenance contracts, SaaS subscriptions, or any recurring billing arrangements since your last assessment?",
    concentration: "Has the share of revenue from your single largest client or platform changed — have you onboarded new clients, or has one account grown more dominant?",
    diversification: "Are you now generating income from technology stacks, platforms, or client industries you were not serving before?",
    forward: "Do you have more or fewer signed SOWs and committed engagements on the books compared to your last assessment?",
    variability: "Has the gap between your highest and lowest billing months over the past two quarters narrowed or widened?",
    labor: "Have you launched products, hired subcontractors, or built automation that generates revenue without your direct billable hours?",
  },
  healthcare: {
    recurrence: "Have you enrolled new patients in a membership or concierge program, added chronic care management billing, or established any recurring monthly revenue since your last assessment?",
    concentration: "Has the percentage of your collections from your single largest insurance payer or referral source changed significantly?",
    diversification: "Are you now offering clinical services, payer types, or treatment modalities that you were not providing at your last assessment?",
    forward: "Is your patient schedule booked further in advance than it was previously — do you have more pre-scheduled visits and committed treatment plans on the books?",
    variability: "Over the past six months, has the spread between your highest-collection month and lowest-collection month narrowed or widened?",
    labor: "Have you hired associate providers, launched telehealth services, or created any revenue streams that do not require your direct clinical presence?",
  },
  legal_services: {
    recurrence: "Have you converted any hourly clients to monthly retainer arrangements, or established subscription legal services that now generate predictable monthly revenue?",
    concentration: "Has the share of your total billings from your single largest client increased or decreased since your last assessment?",
    diversification: "Are you now practicing in areas of law or serving client industries that you were not active in previously?",
    forward: "Do you have more signed engagement letters, committed retainers, and active matters on the books than at your last assessment?",
    variability: "Over the past two quarters, has the difference between your highest and lowest billing months narrowed?",
    labor: "Have you hired associates, engaged contract attorneys, or launched any legal products or services that generate revenue without your direct billable hours?",
  },
  finance_banking: {
    recurrence: "Have you converted commission-based client relationships to fee-based advisory accounts, or added flat-fee planning subscriptions that generate new recurring revenue?",
    concentration: "Has the percentage of your AUM held by your top three households increased or decreased since your last assessment?",
    diversification: "Are you now serving client demographics, asset classes, or planning niches that you were not active in before?",
    forward: "Do you have more signed multi-year advisory agreements or prepaid planning commitments on the books than at your last assessment?",
    variability: "Over the past four quarters, has the impact of market fluctuations on your fee revenue been reduced by fixed-fee or subscription components?",
    labor: "Have you hired associate advisors, paraplanners, or implemented technology that allows your practice to serve clients without your direct involvement in every interaction?",
  },
  insurance: {
    recurrence: "Has your renewal commission income grown as a percentage of total compensation — are renewals now covering a larger share of your expenses than at your last assessment?",
    concentration: "Has the share of your total commissions coming from your single largest account or carrier changed significantly?",
    diversification: "Are you now writing coverage lines, serving industries, or placed with carriers that you were not active with before?",
    forward: "Do you have more bound policies and signed applications in the pipeline than you did at your last assessment?",
    variability: "Over the past six months, has the gap between your highest and lowest commission months narrowed?",
    labor: "Have you hired service staff, added sub-producers, or implemented quoting automation that generates production without your direct effort?",
  },
  sales_brokerage: {
    recurrence: "Have you established residual commission arrangements, override structures, or recurring advisory fees that now generate income without requiring you to close a new deal?",
    concentration: "Has the share of your total commission income from your single largest account or deal type changed since your last assessment?",
    diversification: "Are you now closing deals in industries, product categories, or geographic markets you were not active in before?",
    forward: "Do you have more signed commitments, LOIs, or binding agreements in your pipeline than at your last assessment?",
    variability: "Over the past two quarters, has the difference between your best and worst commission months narrowed?",
    labor: "Have you added junior reps, automated your prospecting process, or built any income streams that generate commissions without your direct deal involvement?",
  },
  creative_media: {
    recurrence: "Have you launched a membership program, signed retainer-based brand partnerships, or established any licensing arrangements that now generate predictable monthly revenue?",
    concentration: "Has the percentage of your income from a single brand partner, platform, or content buyer changed since your last assessment?",
    diversification: "Are you now earning revenue from content formats, platforms, or brand categories you were not active in previously?",
    forward: "Do you have more signed production contracts, confirmed sponsorships, and pre-sold content packages than at your last assessment?",
    variability: "Over the past six months, has the gap between your highest-earning and lowest-earning months narrowed?",
    labor: "Have you hired production support, launched digital products, or built systems that generate revenue without requiring your personal creative involvement in every deliverable?",
  },
  construction_trades: {
    recurrence: "Have you added maintenance contracts, service agreements, or any recurring monthly revenue arrangements since your last assessment?",
    concentration: "Has the share of your total project revenue from your single largest client or GC relationship changed — have you added new project sources, or has one relationship become more dominant?",
    diversification: "Are you now performing work types, serving market segments, or bidding project categories that you were not active in before?",
    forward: "Do you currently have more awarded bids and signed contracts on your books than at your last assessment?",
    variability: "Over the past six months, has the gap between your highest-revenue and lowest-revenue months narrowed?",
    labor: "Have you developed crew leaders who can manage job sites independently, acquired rental assets, or built any income streams that generate revenue without your personal presence on the job site?",
  },
  education_training: {
    recurrence: "Have you added any new ongoing contracts, subscription courses, or recurring training retainers since your last assessment?",
    concentration: "Has the share of income from your largest institution or client changed — did you reduce dependency or did it grow?",
    diversification: "Are you now serving new types of buyers — different sectors, new platforms, or different learner demographics — compared to before?",
    forward: "How far out is your teaching calendar booked? Do you have confirmed engagements further into the future than last time?",
    variability: "Did your month-to-month income even out, or are the peaks and valleys still as dramatic as before?",
    labor: "Have you launched any asynchronous courses, licensed materials, or other income streams that do not require your live presence?",
  },
  retail_ecommerce: {
    recurrence: "Have you added any subscription offerings, auto-replenishment programs, or recurring wholesale orders since your last assessment?",
    concentration: "Is your revenue more spread across channels now, or has your dependence on a single marketplace grown since last time?",
    diversification: "Have you expanded your product catalog, entered new customer segments, or opened new sales channels?",
    forward: "Do you have more confirmed pre-orders, standing purchase orders, or contracted wholesale commitments than before?",
    variability: "Has your month-to-month revenue become more consistent, or are the seasonal spikes and valleys still extreme?",
    labor: "Have you automated more operations or hired help, or are you still the bottleneck for daily fulfillment and customer service?",
  },
  hospitality: {
    recurrence: "Have you secured any new standing accounts, recurring event contracts, or membership subscriptions since your last assessment?",
    concentration: "Has your largest client's share of revenue decreased, or have you become even more dependent on them?",
    diversification: "Are you generating revenue from new service types or client segments that you were not serving before?",
    forward: "How far into the future is your events and reservations calendar booked compared to last time?",
    variability: "Have your off-peak months improved, or is the gap between your best and worst months still just as wide?",
    labor: "Can your operation run without you for a week now? Have you reduced the number of tasks that only you can perform?",
  },
  transportation: {
    recurrence: "Have you converted any spot lanes into standing contracts or added new recurring freight commitments since your last assessment?",
    concentration: "Has your freight volume become more diversified across shippers, or are you still heavily dependent on one or two accounts?",
    diversification: "Are you hauling for new industries, running new lane types, or serving new geographies compared to before?",
    forward: "How many weeks of confirmed loads do you have booked ahead? Is your forward visibility longer or shorter than last time?",
    variability: "Has your rate per mile and weekly revenue become more consistent, or are you still riding the spot market roller coaster?",
    labor: "Have you improved driver retention, added capacity, or reduced your personal involvement in daily dispatch operations?",
  },
  manufacturing: {
    recurrence: "Have you secured any new blanket orders, long-term supply agreements, or standing production contracts since your last assessment?",
    concentration: "Has your production volume become more balanced across customers, or has your top buyer's share increased?",
    diversification: "Are you now serving customers in new industries or producing new product types compared to before?",
    forward: "How deep is your production backlog in weeks? Do you have more confirmed orders on the books than last time?",
    variability: "Has your monthly production volume stabilized, or do you still experience dramatic swings between busy and idle periods?",
    labor: "Have you reduced skill bottlenecks through cross-training, documentation, or automation since your last assessment?",
  },
  nonprofit: {
    recurrence: "Have you added any new multi-year grants, monthly donors, or recurring program fee revenue since your last assessment?",
    concentration: "Has your largest funder's share of your total budget decreased, or has your dependency on them grown?",
    diversification: "Are you receiving funding from new source types — earned revenue, corporate partners, new government programs — that you were not tapping before?",
    forward: "How many months of committed funding do you have confirmed? Is your financial runway longer or shorter than last time?",
    variability: "Has your monthly cash flow stabilized, or are you still experiencing dramatic swings between funding peaks and valleys?",
    labor: "Could your fundraising and programs continue if you personally stepped away for a month? Have you reduced single-person dependencies?",
  },
  agriculture: {
    recurrence: "Have you added any new CSA subscriptions, forward contracts, or recurring supply agreements since your last assessment?",
    concentration: "Has your revenue become more balanced across buyers and crops, or are you still heavily concentrated in one commodity or one sales channel?",
    diversification: "Are you generating income from new sources — value-added products, agritourism, new crops, or secondary livestock — that were not part of your operation before?",
    forward: "What percentage of your next harvest is already committed or forward-priced? Is your pre-season revenue certainty higher than last year?",
    variability: "Has your monthly cash flow smoothed out, or is your income still arriving in one or two large lumps around harvest?",
    labor: "Could your farm operate for two weeks without you personally in the field? Have you reduced your physical dependency through equipment, training, or hired help?",
  },
  energy: {
    recurrence: "Have you added any new maintenance contracts, PPA income, or recurring monitoring agreements since your last assessment?",
    concentration: "Is your project volume more diversified across referral sources, technologies, and client types, or has dependency on a single channel increased?",
    diversification: "Are you now serving new customer segments, offering new services, or operating in new territories compared to before?",
    forward: "How deep is your signed project backlog? Do you have more committed, permitted projects on the books than last time?",
    variability: "Has your monthly revenue stabilized through recurring services, or is it still driven entirely by project-based installation timing?",
    labor: "Have you expanded your team's capacity or reduced your personal involvement in on-site project execution?",
  },
  fitness_wellness: {
    recurrence: "Have you added any new monthly memberships, coaching retainers, or subscription-based offerings since your last assessment?",
    concentration: "Has your income become more distributed across clients, or are you still heavily dependent on a handful of premium bookings?",
    diversification: "Are you generating revenue from new channels — digital products, corporate wellness, group programming, workshops — that you were not using before?",
    forward: "How far ahead is your booking calendar filled? Do you have more pre-paid commitments and locked-in clients than last time?",
    variability: "Have your seasonal income swings reduced, or is January still dramatically better than July?",
    labor: "Have you created any income source that does not require your physical presence — digital programs, group formats, passive products?",
  },
  default: {
    recurrence: "Have you established any new recurring revenue arrangements since your last assessment?",
    concentration: "Has the share of revenue from your largest client changed?",
    diversification: "Are you now serving markets or offering services you were not active in before?",
    forward: "Do you have more signed commitments extending into the future than at your last assessment?",
    variability: "Has the spread between your best and worst months narrowed over the past two quarters?",
    labor: "Have you added team members, products, or systems that generate revenue without your direct involvement?",
  },
};

export function getReassessmentPrompts(industry) {
  if (!industry) return INDUSTRY_REASSESSMENT_PROMPTS.default;
  const key = industry.toLowerCase().replace(/[\s\/&]+/g, "_").replace(/[^a-z0-9_]/g, "");
  return INDUSTRY_REASSESSMENT_PROMPTS[key] || INDUSTRY_REASSESSMENT_PROMPTS.default;
}

// ══════════════════════════════════════════════════════════
// FOLLOW-UP EMAIL TEMPLATES
// ══════════════════════════════════════════════════════════

export function followUpDay7(name, score, band, topAction, recordId, industry) {
  const link = recordId ? `https://peoplestar.com/RunPayway/dashboard?record=${encodeURIComponent(recordId)}` : "https://peoplestar.com/RunPayway/dashboard";
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#1C1635;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#1C1635;"><tr><td style="height:32px;"></td></tr>
<tr><td align="center" style="padding:0 16px;">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="padding:28px 40px 24px;"><img src="https://peoplestar.com/RunPayway/runpayway-logo-blue.png" alt="RunPayway" width="140" height="17" style="height:auto;filter:brightness(0) invert(1);opacity:0.85;"/></td></tr>
<tr><td style="padding:0 40px;"><table width="100%"><tr><td style="background:linear-gradient(90deg,#4B3FAE,#1F6D7A);height:2px;border-radius:1px;"></td></tr></table></td></tr>
<tr><td style="padding:0 12px;"><table width="100%" cellpadding="0" cellspacing="0">
<tr><td style="background:#ffffff;padding:44px 40px 40px;border-radius:12px;">
<p style="font-size:22px;font-weight:300;color:#1C1635;margin:0 0 12px;">${name}, your Command Center is waiting.</p>
<p style="font-size:14px;color:rgba(14,26,43,0.55);line-height:1.65;margin:0 0 24px;">Your Income Stability Score is <strong style="color:#1C1635;">${score}/100</strong> (${band}). Your 12-week roadmap, PressureMap, and What-If Simulator are ready.</p>
${topAction ? `<div style="border-left:3px solid #4B3FAE;padding:16px 20px;background:rgba(75,63,174,0.04);border-radius:0 8px 8px 0;margin-bottom:24px;">
<div style="font-size:10px;font-weight:700;letter-spacing:0.12em;color:#4B3FAE;margin-bottom:6px;">YOUR #1 PRIORITY</div>
<div style="font-size:15px;font-weight:600;color:#1C1635;">${topAction}</div></div>` : ""}
${(() => { const p = getReassessmentPrompts(industry); return `<div style="border-left:3px solid #1F6D7A;padding:16px 20px;background:rgba(31,109,122,0.04);border-radius:0 8px 8px 0;margin-bottom:24px;">
<div style="font-size:10px;font-weight:700;letter-spacing:0.12em;color:#1F6D7A;margin-bottom:6px;">QUICK CHECK</div>
<div style="font-size:14px;color:rgba(14,26,43,0.7);line-height:1.6;">${p.recurrence}</div></div>`; })()}
<table cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr><td style="background:#4B3FAE;border-radius:10px;">
<a href="${link}" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">Open Your Command Center</a>
</td></tr></table>
</td></tr></table></td></tr>
<tr><td style="padding:24px 40px;text-align:center;">
<p style="font-size:10px;color:rgba(244,241,234,0.30);margin:0;">RunPayway\u2122 \u2014 Income Stability Score \u2014 <a href="https://peoplestar.com/RunPayway/contact" style="color:rgba(244,241,234,0.35);text-decoration:none;">Contact</a></p>
</td></tr>
</table></td></tr></table></body></html>`;
}

export function followUpDay30(name, score, topAction, daysSince, recordId, industry) {
  const link = recordId ? `https://peoplestar.com/RunPayway/dashboard?record=${encodeURIComponent(recordId)}` : "https://peoplestar.com/RunPayway/dashboard";
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#1C1635;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#1C1635;"><tr><td style="height:32px;"></td></tr>
<tr><td align="center" style="padding:0 16px;">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="padding:28px 40px 24px;"><img src="https://peoplestar.com/RunPayway/runpayway-logo-blue.png" alt="RunPayway" width="140" height="17" style="height:auto;filter:brightness(0) invert(1);opacity:0.85;"/></td></tr>
<tr><td style="padding:0 40px;"><table width="100%"><tr><td style="background:linear-gradient(90deg,#4B3FAE,#1F6D7A);height:2px;border-radius:1px;"></td></tr></table></td></tr>
<tr><td style="padding:0 12px;"><table width="100%" cellpadding="0" cellspacing="0">
<tr><td style="background:#ffffff;padding:44px 40px 40px;border-radius:12px;">
<p style="font-size:22px;font-weight:300;color:#1C1635;margin:0 0 12px;">${daysSince} days since your assessment.</p>
<p style="font-size:14px;color:rgba(14,26,43,0.55);line-height:1.65;margin:0 0 16px;">Your score of <strong style="color:#1C1635;">${score}</strong> reflects your income structure \u2014 not market conditions. The only way to change it is to make a structural change.</p>
<p style="font-size:14px;color:rgba(14,26,43,0.55);line-height:1.65;margin:0 0 24px;">${topAction ? `Your highest-leverage move${industry ? ` as a ${industry.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())} professional` : ""} is still: <strong style="color:#1C1635;">${topAction}</strong>. ` : ""}Use the Simulator to model the impact before you commit.</p>
${(() => { const p = getReassessmentPrompts(industry); return `<div style="border-left:3px solid #1F6D7A;padding:16px 20px;background:rgba(31,109,122,0.04);border-radius:0 8px 8px 0;margin-bottom:24px;">
<div style="font-size:10px;font-weight:700;letter-spacing:0.12em;color:#1F6D7A;margin-bottom:8px;">HAS ANYTHING CHANGED?</div>
<div style="font-size:13px;color:rgba(14,26,43,0.65);line-height:1.65;margin-bottom:10px;">${p.recurrence}</div>
<div style="font-size:13px;color:rgba(14,26,43,0.65);line-height:1.65;margin-bottom:10px;">${p.concentration}</div>
<div style="font-size:13px;color:rgba(14,26,43,0.65);line-height:1.65;">${p.forward}</div></div>`; })()}
<table cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr><td style="background:#4B3FAE;border-radius:10px;">
<a href="${link}" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">Open the Simulator</a>
</td></tr></table>
</td></tr></table></td></tr>
<tr><td style="padding:24px 40px;text-align:center;">
<p style="font-size:10px;color:rgba(244,241,234,0.30);margin:0;">RunPayway\u2122 \u2014 Income Stability Score \u2014 <a href="https://peoplestar.com/RunPayway/contact" style="color:rgba(244,241,234,0.35);text-decoration:none;">Contact</a></p>
</td></tr>
</table></td></tr></table></body></html>`;
}

export function followUpDay90(name, daysSince, _recordId, industry) {
  const prompts = getReassessmentPrompts(industry);
  // Build industry-specific examples for the "structural changes" line
  const examplesMap = {
    real_estate: "added a property management contract, diversified your listing sources, or built rental portfolio income",
    consulting_professional_services: "converted a project client to a retainer, added a new industry vertical, or launched a productized service",
    technology: "added maintenance contracts, launched a SaaS offering, or onboarded clients in a new tech stack",
    healthcare: "enrolled patients in a membership program, added a new payer type, or hired an associate provider",
    legal_services: "converted hourly clients to retainers, expanded into a new practice area, or engaged contract attorneys",
    finance_banking: "converted commission clients to fee-based accounts, diversified your AUM across households, or hired a paraplanner",
    insurance: "grown your renewal book, diversified your carrier placements, or added sub-producers to your team",
    sales_brokerage: "established residual commission arrangements, expanded into new markets, or added junior reps",
    creative_media: "signed retainer-based brand deals, launched a membership program, or licensed your content",
    construction_trades: "added maintenance contracts, diversified your GC relationships, or developed independent crew leaders",
    education_training: "launched subscription courses, added new institutional clients, or created asynchronous content",
    retail_ecommerce: "added subscription offerings, opened new sales channels, or automated your fulfillment",
    hospitality: "secured standing accounts, launched a membership program, or booked recurring event contracts",
    transportation: "converted spot lanes to standing contracts, diversified your shipper base, or added capacity",
    manufacturing: "secured blanket orders, diversified your customer base, or reduced skill bottlenecks",
    nonprofit: "added multi-year grants, grown your monthly donor base, or launched earned revenue programs",
    agriculture: "added CSA subscriptions, forward-priced your harvest, or diversified into value-added products",
    energy: "added maintenance contracts, diversified your project pipeline, or expanded your service territory",
    fitness_wellness: "added monthly memberships, launched digital products, or booked corporate wellness contracts",
    default: "signed a retainer, added a new client, or built a recurring income stream",
  };
  const industryKey = industry ? industry.toLowerCase().replace(/[\s\/&]+/g, "_").replace(/[^a-z0-9_]/g, "") : "";
  const examples = examplesMap[industryKey] || "signed a retainer, added a client, or built a recurring stream";
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#1C1635;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#1C1635;"><tr><td style="height:32px;"></td></tr>
<tr><td align="center" style="padding:0 16px;">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="padding:28px 40px 24px;"><img src="https://peoplestar.com/RunPayway/runpayway-logo-blue.png" alt="RunPayway" width="140" height="17" style="height:auto;filter:brightness(0) invert(1);opacity:0.85;"/></td></tr>
<tr><td style="padding:0 40px;"><table width="100%"><tr><td style="background:linear-gradient(90deg,#4B3FAE,#1F6D7A);height:2px;border-radius:1px;"></td></tr></table></td></tr>
<tr><td style="padding:0 12px;"><table width="100%" cellpadding="0" cellspacing="0">
<tr><td style="background:#ffffff;padding:44px 40px 40px;border-radius:12px;">
<p style="font-size:22px;font-weight:300;color:#1C1635;margin:0 0 12px;">It has been ${daysSince} days.</p>
<p style="font-size:14px;color:rgba(14,26,43,0.55);line-height:1.65;margin:0 0 16px;">If you have made structural changes to your income \u2014 ${examples} \u2014 your score may have improved. There is only one way to find out.</p>
<p style="font-size:14px;color:rgba(14,26,43,0.55);line-height:1.65;margin:0 0 24px;">A new assessment will show you exactly how much progress you have made and where to focus next.</p>
<table cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr><td style="background:#1C1635;border-radius:10px;">
<a href="https://peoplestar.com/RunPayway/pricing" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">Reassess Your Score</a>
</td></tr></table>
<div style="border-left:3px solid #1F6D7A;padding:16px 20px;background:rgba(31,109,122,0.04);border-radius:0 8px 8px 0;margin-top:24px;">
<div style="font-size:10px;font-weight:700;letter-spacing:0.12em;color:#1F6D7A;margin-bottom:8px;">ASK YOURSELF</div>
<div style="font-size:13px;color:rgba(14,26,43,0.55);line-height:1.6;margin-bottom:10px;">${prompts.recurrence}</div>
<div style="font-size:13px;color:rgba(14,26,43,0.55);line-height:1.6;margin-bottom:10px;">${prompts.diversification}</div>
<div style="font-size:13px;color:rgba(14,26,43,0.55);line-height:1.6;">${prompts.labor}</div>
</div>
</td></tr></table></td></tr>
<tr><td style="padding:24px 40px;text-align:center;">
<p style="font-size:10px;color:rgba(244,241,234,0.30);margin:0;">RunPayway\u2122 \u2014 Income Stability Score \u2014 <a href="https://peoplestar.com/RunPayway/contact" style="color:rgba(244,241,234,0.35);text-decoration:none;">Contact</a></p>
</td></tr>
</table></td></tr></table></body></html>`;
}

// ══════════════════════════════════════════════════════════
// NURTURE EMAIL TEMPLATE BUILDERS
// ══════════════════════════════════════════════════════════

function nurtureEmailWrapper(bodyContent, recipientName) {
  const navy = "#1C1635";
  const purple = "#4B3FAE";
  const teal = "#1F6D7A";
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background-color:${navy};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${navy};">
<tr><td style="height:32px;">&nbsp;</td></tr>
<tr><td align="center" style="padding:0 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="padding:28px 40px 24px;text-align:left;">
<img src="https://peoplestar.com/RunPayway/runpayway-logo-blue.png" alt="RunPayway" width="140" height="17" style="display:inline-block;height:auto;filter:brightness(0) invert(1);opacity:0.85;"/>
</td></tr>
<tr><td style="padding:0 40px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="background:linear-gradient(90deg,${purple} 0%,${teal} 100%);height:2px;border-radius:1px;">&nbsp;</td></tr></table></td></tr>
<tr><td style="padding:0 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="background-color:#ffffff;padding:44px 40px 40px;border-radius:12px;margin-top:20px;">
${bodyContent}
</td></tr>
</table>
</td></tr>
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

function nurtureCta(text, href) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
<tr><td style="background-color:#4B3FAE;border-radius:10px;">
<a href="${href}" style="display:inline-block;padding:14px 40px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;letter-spacing:0.02em;">${text}</a>
</td></tr>
</table>`;
}

function nurtureBandColor(score) {
  return score >= 75 ? "#1F6D7A" : score >= 50 ? "#2B5EA7" : score >= 30 ? "#92640A" : "#9B2C2C";
}

export function buildNurtureWelcomeEmail({ name }) {
  const navy = "#1C1635";
  const muted = "rgba(14,26,43,0.58)";
  const light = "rgba(14,26,43,0.35)";

  const body = `
<p style="font-size:22px;font-weight:300;color:${navy};margin:0 0 6px;letter-spacing:-0.02em;line-height:1.3;">Welcome to the Structural Income Brief, ${name}.</p>
<p style="font-size:13px;color:${light};line-height:1.7;margin:8px 0 0;">You are now receiving structural intelligence about how income holds up under pressure.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="height:1px;background-color:rgba(14,26,43,0.06);">&nbsp;</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:0;">
<tr><td>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0 0 12px;">Most professionals have no structural view of their income. They know what they earn, but not how it behaves under disruption \u2014 what happens when a client leaves, a contract ends, or the market shifts.</p>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0 0 12px;">The RunPayway Income Stability Score measures exactly this: how your income holds up when conditions change. It looks at six structural dimensions \u2014 concentration, recurrence, forward visibility, labor dependence, variability, and continuity \u2014 and produces a single number that tells you where you stand.</p>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0;">Take your free assessment to receive your personalized income structure analysis. It takes under 3 minutes.</p>
</td></tr></table>
${nurtureCta("Take Your Free Assessment", "https://peoplestar.com/RunPayway/begin")}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
<tr><td style="padding:20px 24px;border-radius:8px;background-color:#fafaf8;border:1px solid rgba(14,26,43,0.04);">
<p style="font-size:13px;font-weight:600;color:${navy};margin:0 0 6px;">What to expect</p>
<p style="font-size:12px;color:${muted};line-height:1.65;margin:0;">Over the next week, you will receive two more briefs: your primary structural constraint and how to address it, and how income patterns in your industry compare. Each one builds on the last.</p>
</td></tr></table>`;

  return { subject: `Welcome to the Structural Income Brief, ${name}`, html: nurtureEmailWrapper(body, name) };
}

export function buildNurtureReminder2({ name }) {
  const navy = "#1C1635";
  const muted = "rgba(14,26,43,0.58)";
  const light = "rgba(14,26,43,0.35)";

  const body = `
<p style="font-size:22px;font-weight:300;color:${navy};margin:0 0 6px;letter-spacing:-0.02em;line-height:1.3;">${name}, your structural analysis is waiting.</p>
<p style="font-size:13px;color:${light};line-height:1.7;margin:8px 0 0;">We have not received your assessment yet. Here is why it matters.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="height:1px;background-color:rgba(14,26,43,0.06);">&nbsp;</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:0;">
<tr><td>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0 0 12px;">The difference between income that feels stable and income that is structurally stable is not always obvious. Most people discover the gap only when something disrupts their earning pattern \u2014 a lost client, an industry shift, an unexpected change.</p>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0;">The free assessment takes under 3 minutes. It maps six structural dimensions of your income and identifies the single highest-leverage change you can make. No financial advice, no sales pitch \u2014 just a structural reading of how your income actually works.</p>
</td></tr></table>
${nurtureCta("Start Your Free Assessment", "https://peoplestar.com/RunPayway/begin")}`;

  return { subject: `${name}, your structural analysis is waiting`, html: nurtureEmailWrapper(body, name) };
}

export function buildNurtureReminder3({ name }) {
  const navy = "#1C1635";
  const muted = "rgba(14,26,43,0.58)";
  const light = "rgba(14,26,43,0.35)";

  const body = `
<p style="font-size:22px;font-weight:300;color:${navy};margin:0 0 6px;letter-spacing:-0.02em;line-height:1.3;">One structural question for ${name}.</p>
<p style="font-size:13px;color:${light};line-height:1.7;margin:8px 0 0;">This is the last email in the series without your assessment.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="height:1px;background-color:rgba(14,26,43,0.06);">&nbsp;</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:0;">
<tr><td>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0 0 12px;">If your largest income source disappeared tomorrow \u2014 how many months could your current structure sustain you?</p>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0 0 12px;">Most professionals answer this question with a feeling, not a number. The Income Stability Score replaces that feeling with a structural measurement. Six dimensions, one score, one clear priority.</p>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0;">It takes under 3 minutes. The result will either confirm that your structure is sound, or it will show you exactly where it is not.</p>
</td></tr></table>
${nurtureCta("See Where You Stand", "https://peoplestar.com/RunPayway/begin")}`;

  return { subject: `One structural question for ${name}`, html: nurtureEmailWrapper(body, name) };
}

function buildNurtureEmail1({ name, score, band, constraint, industry }) {
  const navy = "#1C1635";
  const muted = "rgba(14,26,43,0.58)";
  const light = "rgba(14,26,43,0.35)";
  const color = nurtureBandColor(score);

  const body = `
<p style="font-size:22px;font-weight:300;color:${navy};margin:0 0 6px;letter-spacing:-0.02em;line-height:1.3;">${name}, here is what your score means.</p>
<p style="font-size:13px;color:${light};line-height:1.7;margin:8px 0 0;">Your Income Stability Score places you in context against structural benchmarks.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="height:1px;background-color:rgba(14,26,43,0.06);">&nbsp;</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:24px 28px;background-color:#fafaf8;border-radius:10px;border:1px solid rgba(14,26,43,0.04);">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="font-size:48px;font-weight:200;color:${navy};line-height:1;letter-spacing:-0.04em;font-family:'Georgia',serif;">${score}</td>
<td style="font-size:14px;font-weight:300;color:rgba(14,26,43,0.18);vertical-align:bottom;padding-bottom:8px;padding-left:4px;">/100</td>
<td style="vertical-align:bottom;padding-bottom:8px;padding-left:16px;">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="width:8px;height:8px;border-radius:2px;background-color:${color};">&nbsp;</td>
<td style="padding-left:8px;font-size:13px;font-weight:600;color:${color};">${band}</td>
</tr></table></td>
</tr></table>
</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;"><tr><td>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0 0 12px;">
A score of ${score} in the <strong style="color:${navy};font-weight:600;">${band}</strong> band means your income structure ${score >= 50 ? "has a functional foundation but carries specific vulnerabilities" : "is exposed to structural disruption in ways that may not be visible day to day"}. ${industry ? `For professionals in ${industry}, this is a common pattern` : "This is a common pattern"} \u2014 and it is addressable.</p>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0;">
Your primary constraint is <strong style="color:${navy};font-weight:600;">${(constraint || "").toLowerCase()}</strong>. This is the single structural factor holding your score where it is. Addressing it changes the trajectory of your entire income architecture.</p>
</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
<tr><td style="padding:20px 24px;border-radius:8px;background-color:#fafaf8;border:1px solid rgba(14,26,43,0.04);">
<p style="font-size:13px;font-weight:600;color:${navy};margin:0 0 6px;">See the full picture</p>
<p style="font-size:12px;color:${muted};line-height:1.65;margin:0 0 16px;">The diagnostic reveals every dimension of your income structure, maps your specific risks, and gives you a step-by-step plan to improve your score.</p>
${nurtureCta("See Your Full Diagnostic", "https://peoplestar.com/RunPayway/pricing")}
</td></tr></table>`;

  return { subject: `${name}, here\u2019s what your ${score} means`, html: nurtureEmailWrapper(body, name) };
}

function buildNurtureEmail2({ name, score, band, constraint, industry }) {
  const navy = "#1C1635";
  const muted = "rgba(14,26,43,0.58)";
  const light = "rgba(14,26,43,0.35)";

  const constraintActions = {
    "Income Concentration": "Begin converting one existing client relationship into a retainer or standing agreement. Even a partial shift \u2014 moving 15\u201320% of project-based work into a recurring arrangement \u2014 changes how your income behaves under pressure.",
    "Forward Visibility": "Propose a 3-month or 6-month engagement framework to your most consistent revenue source. The goal is not to lock in every dollar \u2014 it is to extend the horizon of income you can see ahead of you.",
    "Labor Dependence": "Identify one deliverable you currently produce manually and package it as a repeatable, scalable offering. A productized service, a template library, a licensing arrangement \u2014 something that generates revenue without requiring your direct time.",
    "Low Recurrence": "Convert your most reliable one-time engagements into recurring structures. A retainer, a maintenance contract, a subscription-based access model. The structural shift matters more than the dollar amount.",
    "Source Diversification": "Open a second revenue channel that does not depend on your primary source. This does not mean working more hours \u2014 it means distributing income risk across independent relationships.",
    "Earnings Variability": "Introduce a floor into your income structure. A minimum monthly retainer, a base-rate agreement, or a prepaid package that guarantees a threshold regardless of project volume.",
    "Structural Durability": "Strengthen the agreements underpinning your income. Move from verbal commitments to documented terms. Extend contract durations where possible.",
    "Income Continuity": "Build a buffer of income that continues if you stop active work for 30 days. This could be deferred revenue, a licensing stream, or pre-sold capacity that does not require your presence to deliver.",
  };

  const action = constraintActions[constraint] || `Focus on addressing ${(constraint || "").toLowerCase()} \u2014 this is the single highest-leverage structural change available to you.`;

  const body = `
<p style="font-size:22px;font-weight:300;color:${navy};margin:0 0 6px;letter-spacing:-0.02em;line-height:1.3;">The single structural move for ${name}.</p>
<p style="font-size:13px;color:${light};line-height:1.7;margin:8px 0 0;">Based on your score of ${score} and your primary constraint.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="height:1px;background-color:rgba(14,26,43,0.06);">&nbsp;</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:20px 24px;background-color:#fafaf8;border-radius:10px;border:1px solid rgba(14,26,43,0.04);">
<p style="font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${light};margin:0 0 8px;">YOUR PRIMARY CONSTRAINT</p>
<p style="font-size:18px;font-weight:600;color:${navy};margin:0;">${constraint}</p>
</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;"><tr><td>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0 0 16px;">${action}</p>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0;">${industry ? `In ${industry}, this type of structural adjustment typically produces measurable score improvement within 60\u201390 days.` : "This type of structural adjustment typically produces measurable score improvement within 60\u201390 days."} The full diagnostic includes the complete action plan \u2014 with specific targets, timelines, and ready-to-use negotiation scripts.</p>
</td></tr></table>
${nurtureCta("See Your Full Action Plan", "https://peoplestar.com/RunPayway/pricing")}`;

  return { subject: `The single structural move for ${name}`, html: nurtureEmailWrapper(body, name) };
}

function buildNurtureEmail3({ name, score, band, constraint, industry }) {
  const navy = "#1C1635";
  const muted = "rgba(14,26,43,0.58)";
  const light = "rgba(14,26,43,0.35)";
  const color = nurtureBandColor(score);
  const displayIndustry = industry || "your sector";

  const body = `
<p style="font-size:22px;font-weight:300;color:${navy};margin:0 0 6px;letter-spacing:-0.02em;line-height:1.3;">Income patterns in ${displayIndustry}.</p>
<p style="font-size:13px;color:${light};line-height:1.7;margin:8px 0 0;">Where most professionals in your industry score \u2014 and what separates the top from the rest.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="height:1px;background-color:rgba(14,26,43,0.06);">&nbsp;</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:24px 28px;background-color:#fafaf8;border-radius:10px;border:1px solid rgba(14,26,43,0.04);">
<p style="font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${light};margin:0 0 8px;">INDUSTRY BASELINE</p>
<p style="font-size:16px;font-weight:500;color:${navy};margin:0 0 16px;">${displayIndustry}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td width="50%" style="vertical-align:top;">
<p style="font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${light};margin:0 0 4px;">YOUR SCORE</p>
<p style="font-size:28px;font-weight:200;color:${navy};margin:0;font-family:'Georgia',serif;">${score}</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:6px;"><tr>
<td style="width:6px;height:6px;border-radius:2px;background-color:${color};">&nbsp;</td>
<td style="padding-left:6px;font-size:12px;font-weight:600;color:${color};">${band}</td>
</tr></table></td>
<td width="50%" style="vertical-align:top;border-left:1px solid rgba(14,26,43,0.06);padding-left:16px;">
<p style="font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${light};margin:0 0 4px;">PRIMARY CONSTRAINT</p>
<p style="font-size:14px;font-weight:600;color:${navy};margin:0;">${constraint}</p>
</td></tr></table>
</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;"><tr><td>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0 0 12px;">Most professionals in ${displayIndustry} operate in the Developing to Established range. The most common constraints are forward visibility and income concentration \u2014 structural patterns that are endemic to the industry, not individual failures.</p>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0 0 12px;">What distinguishes the top quartile is not earning more \u2014 it is how income is structured. Retainer-based arrangements, diversified client relationships, and contracted forward visibility create scores that hold up under disruption.</p>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0;">Your score of ${score} reflects your specific position within these patterns. The full diagnostic maps exactly where you stand relative to industry benchmarks and gives you the structural moves to improve.</p>
</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
<tr><td style="padding:20px 24px;border-radius:8px;background-color:#fafaf8;border:1px solid rgba(14,26,43,0.04);">
<p style="font-size:13px;font-weight:600;color:${navy};margin:0 0 6px;">Your full diagnostic is ready to generate</p>
<p style="font-size:12px;color:${muted};line-height:1.65;margin:0 0 16px;">Personalized action plan, risk scenarios, 12-week roadmap with your actual numbers, and ready-to-use negotiation scripts. Full refund if it does not reveal something new.</p>
${nurtureCta("Unlock Your Full Diagnostic", "https://peoplestar.com/RunPayway/pricing")}
</td></tr></table>`;

  return { subject: `Income patterns in ${displayIndustry}`, html: nurtureEmailWrapper(body, name) };
}
