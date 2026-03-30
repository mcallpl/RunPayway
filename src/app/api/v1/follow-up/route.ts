// RUNPAYWAY™ — POST /api/v1/follow-up
// Retention email sequence: Day 7, Day 30, Day 90
// Triggered by cron, webhook, or manual call

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const FROM_ADDRESS = process.env.RESEND_FROM_EMAIL || "RunPayway™ <onboarding@resend.dev>";

function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

interface FollowUpRequest {
  email: string;
  name: string;
  score: number;
  band: string;
  daysSince: number;
  topAction?: string;
  topActionLift?: number;
}

const SUBJECTS: Record<string, string> = {
  day7: "Have you explored your Command Center yet?",
  day30: "30 days since your assessment — here's what to focus on",
  day90: "It's time to see how much you've improved",
};

function getEmailHtml(data: FollowUpRequest): { subject: string; html: string } {
  const { name, score, band, daysSince, topAction, topActionLift } = data;
  const displayName = name || "there";

  if (daysSince <= 14) {
    // Day 7 email
    return {
      subject: SUBJECTS.day7,
      html: `
        <div style="font-family: 'Inter', system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
          <div style="font-size: 11px; font-weight: 600; letter-spacing: 0.12em; color: #1F6D7A; text-transform: uppercase; margin-bottom: 20px;">RUNPAYWAY™</div>
          <h1 style="font-size: 24px; font-weight: 300; color: #0E1A2B; letter-spacing: -0.02em; margin-bottom: 16px;">Hi ${displayName},</h1>
          <p style="font-size: 15px; color: rgba(14,26,43,0.55); line-height: 1.65; margin-bottom: 20px;">
            Your Income Stability Score is <strong style="color: #0E1A2B;">${score}/100</strong> (${band}). Your report included three interactive tools designed to help you take action — have you tried them yet?
          </p>
          <div style="border: 1px solid rgba(14,26,43,0.08); border-left: 3px solid #4B3FAE; border-radius: 8px; padding: 16px 20px; margin-bottom: 20px;">
            <div style="font-size: 10px; font-weight: 600; letter-spacing: 0.10em; color: #4B3FAE; margin-bottom: 6px;">YOUR #1 PRIORITY</div>
            <div style="font-size: 15px; font-weight: 600; color: #0E1A2B;">${topAction || "Open your PressureMap to see where your income is most vulnerable"}</div>
            ${topActionLift ? `<div style="font-size: 13px; color: #1F6D7A; font-weight: 500; margin-top: 4px;">Potential impact: +${topActionLift} points</div>` : ""}
          </div>
          <a href="https://peoplestar.com/RunPayway/dashboard" style="display: inline-block; padding: 14px 28px; background: #0E1A2B; color: #FFFFFF; border-radius: 8px; font-size: 14px; font-weight: 600; text-decoration: none;">Open Your Command Center &rarr;</a>
          <p style="font-size: 12px; color: rgba(14,26,43,0.30); margin-top: 32px; line-height: 1.5;">RunPayway™ — A proprietary financial diagnostic tool by PeopleStar Enterprises.</p>
        </div>`,
    };
  }

  if (daysSince <= 60) {
    // Day 30 email
    return {
      subject: SUBJECTS.day30,
      html: `
        <div style="font-family: 'Inter', system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
          <div style="font-size: 11px; font-weight: 600; letter-spacing: 0.12em; color: #1F6D7A; text-transform: uppercase; margin-bottom: 20px;">RUNPAYWAY™</div>
          <h1 style="font-size: 24px; font-weight: 300; color: #0E1A2B; margin-bottom: 16px;">${daysSince} days since your assessment.</h1>
          <p style="font-size: 15px; color: rgba(14,26,43,0.55); line-height: 1.65; margin-bottom: 20px;">
            Your score of <strong style="color: #0E1A2B;">${score}</strong> has not changed because it is based on your income structure — not market conditions. The only way to improve it is to make a structural change.
          </p>
          <p style="font-size: 15px; color: rgba(14,26,43,0.55); line-height: 1.65; margin-bottom: 20px;">
            ${topAction ? `Your highest-leverage move is still: <strong style="color: #0E1A2B;">${topAction}</strong>.` : "Have you made any structural changes since your assessment?"} Use the Simulator to model the impact before you commit.
          </p>
          <a href="https://peoplestar.com/RunPayway/simulator" style="display: inline-block; padding: 14px 28px; background: #0E1A2B; color: #FFFFFF; border-radius: 8px; font-size: 14px; font-weight: 600; text-decoration: none;">Open the Simulator &rarr;</a>
          <p style="font-size: 12px; color: rgba(14,26,43,0.30); margin-top: 32px;">RunPayway™ by PeopleStar Enterprises.</p>
        </div>`,
    };
  }

  // Day 90 email
  return {
    subject: SUBJECTS.day90,
    html: `
      <div style="font-family: 'Inter', system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <div style="font-size: 11px; font-weight: 600; letter-spacing: 0.12em; color: #1F6D7A; text-transform: uppercase; margin-bottom: 20px;">RUNPAYWAY™</div>
        <h1 style="font-size: 24px; font-weight: 300; color: #0E1A2B; margin-bottom: 16px;">It has been ${daysSince} days.</h1>
        <p style="font-size: 15px; color: rgba(14,26,43,0.55); line-height: 1.65; margin-bottom: 20px;">
          If you have made structural changes to your income — signed a retainer, added a client, built a passive stream — your score may have improved. There is only one way to find out.
        </p>
        <p style="font-size: 15px; color: rgba(14,26,43,0.55); line-height: 1.65; margin-bottom: 20px;">
          A new assessment will show you exactly how much progress you have made and where to focus next.
        </p>
        <a href="https://peoplestar.com/RunPayway/pricing" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #0E1A2B, #4B3FAE); color: #FFFFFF; border-radius: 8px; font-size: 14px; font-weight: 600; text-decoration: none;">Reassess Your Score &rarr;</a>
        <p style="font-size: 12px; color: rgba(14,26,43,0.30); margin-top: 32px;">RunPayway™ by PeopleStar Enterprises.</p>
      </div>`,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: FollowUpRequest = await request.json();

    if (!body.email || !body.score) {
      return NextResponse.json({ error: "Missing email or score" }, { status: 400 });
    }

    const resend = getResend();
    if (!resend) {
      return NextResponse.json({ error: "Email service not configured" }, { status: 503 });
    }

    const { subject, html } = getEmailHtml(body);

    const result = await resend.emails.send({
      from: FROM_ADDRESS,
      to: body.email,
      subject,
      html,
    });

    return NextResponse.json({ success: true, id: result.data?.id });
  } catch (err) {
    console.error("[follow-up] Error:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
