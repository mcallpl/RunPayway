// RunPayway PressureMap Proxy — Cloudflare Worker
// Holds the Anthropic API key securely. Client calls this instead of Anthropic directly.

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const corsHeaders = {
      "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
      "Content-Type": "application/json",
    };

    try {
      const body = await request.json();

      const systemPrompt = `You are the PressureMap engine for RunPayway, an income stability assessment platform. You generate real-time structural intelligence briefings for individuals based on their specific industry, operating structure, income model, and assessment results.

CRITICAL RULES:
- Never provide financial advice, investment recommendations, or predictions
- Never mention specific companies, stocks, or investment vehicles
- Never fabricate statistics — use directional language (rising, declining, accelerating) not fake numbers
- Write in confident, institutional prose — like a strategy briefing, not a blog post
- Address the user directly (your, you)
- Connect every observation back to the user's specific structural profile
- Keep each section to 2-3 sentences maximum — concise, dense, no filler
- Use present tense — this is about right now, not the future
- Be SPECIFIC to the exact intersection of their industry, operating structure, and income model
- Do NOT use generic language that could apply to any industry`;

      const userPrompt = `Generate a PressureMap briefing for this individual:

PROFILE:
- Industry: ${body.industry || "General"}
- Operating Structure: ${body.operating_structure || "Independent"}
- Income Model: ${body.income_model || "Mixed"}
- Years in current structure: ${body.years_in_structure || "Unknown"}
- Income Stability Score: ${body.score || 0}/100 (${body.band || "Unknown"})
- Weakest structural factor: ${body.weakest_factor || "Unknown"} (current value: ${body.weakest_factor_value || "Unknown"})

STRUCTURAL DATA:
- Recurring revenue: ${body.recurrence_pct || 0}%
- Top client concentration: ${body.concentration_pct || 0}%
- Forward visibility: ${body.forward_visibility_pct || 0}%
- Labor dependence: ${body.labor_dependence_pct || 0}%
- Earnings variability: ${body.variability_level || "moderate"}

Return EXACTLY three sections in this JSON format:
{
  "pressure": "[2-3 sentences] What real-world forces in their SPECIFIC industry (${body.industry}), for their SPECIFIC operating structure (${body.operating_structure}) and income model (${body.income_model}), are currently working AGAINST their weakest structural factor. Reference their exact numbers. Do NOT use language that could apply to any industry.",
  "tailwind": "[2-3 sentences] What current condition in ${body.industry} specifically gives this ${body.operating_structure} with a ${body.income_model} model a structural advantage or window of opportunity right now.",
  "leverage_move": "[2-3 sentences] The single highest-leverage structural change this specific ${body.operating_structure} in ${body.industry} earning through ${body.income_model} could make RIGHT NOW. Be operational and specific — name the exact type of arrangement, offer, or structural change that fits their profile."
}

Return ONLY the JSON object, no other text.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-5-20250514",
          max_tokens: 600,
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }],
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        return new Response(JSON.stringify({ error: "Anthropic API error", detail: err }), {
          status: 502, headers: corsHeaders,
        });
      }

      const data = await response.json();
      const text = data.content?.[0]?.text || "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        return new Response(JSON.stringify({ error: "Failed to parse response" }), {
          status: 502, headers: corsHeaders,
        });
      }

      const parsed = JSON.parse(jsonMatch[0]);
      if (!parsed.pressure || !parsed.tailwind || !parsed.leverage_move) {
        return new Response(JSON.stringify({ error: "Incomplete response" }), {
          status: 502, headers: corsHeaders,
        });
      }

      return new Response(JSON.stringify({
        pressure: parsed.pressure,
        tailwind: parsed.tailwind,
        leverage_move: parsed.leverage_move,
      }), { headers: corsHeaders });

    } catch (err) {
      return new Response(JSON.stringify({ error: "Worker error", detail: String(err) }), {
        status: 500, headers: corsHeaders,
      });
    }
  },
};
