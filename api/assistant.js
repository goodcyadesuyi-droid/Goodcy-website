// Vercel serverless endpoint for Mamba FX Academy assistant.
// Configure OPENAI_API_KEY in Vercel Project Settings > Environment Variables.
// Never put the key in browser code or GitHub.
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "";
const MODEL = process.env.OPENAI_MODEL || "gpt-6-astra";
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;
const hits = new Map();

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { error: "Method not allowed." });
  }

  const origin = req.headers.origin || "";
  if (ALLOWED_ORIGIN && origin && origin !== ALLOWED_ORIGIN) {
    return send(res, 403, { error: "This website origin is not allowed." });
  }

  const ip = (req.headers["x-forwarded-for"] || "unknown").toString().split(",")[0].trim();
  const now = Date.now();
  const entry = hits.get(ip) || { count: 0, start: now };
  if (now - entry.start > WINDOW_MS) { entry.count = 0; entry.start = now; }
  entry.count += 1;
  hits.set(ip, entry);
  if (entry.count > MAX_REQUESTS) {
    return send(res, 429, { error: "Too many messages. Please wait one minute and try again." });
  }

  if (!process.env.OPENAI_API_KEY) {
    return send(res, 503, { error: "The AI service is not configured yet. Add OPENAI_API_KEY to the private hosting environment." });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { return send(res, 400, { error: "Invalid JSON request." }); }
  }
  const message = typeof body?.message === "string" ? body.message.trim().slice(0, 2000) : "";
  if (!message) return send(res, 400, { error: "Please enter a message." });

  const market = body?.market || {};
  const symbols = ["EURUSD", "GBPUSD", "USDJPY", "XAUUSD", "BTCUSD"];
  const timeframes = ["15m", "1h", "4h", "1D", "1W"];
  const system = [
    "You are Mamba FX Academy's trading education assistant.",
    "Answer clearly, accurately and helpfully. Never promise profit or certainty. Explain financial risk.",
    "You may suggest only safe interface actions: change chart symbol among EURUSD, GBPUSD, USDJPY, XAUUSD, BTCUSD; change timeframe among 15m, 1h, 4h, 1D, 1W; or open the Positions, Pending, History, or Account tab.",
    "Never place, modify, or close trades; never transfer money; never request passwords, OTPs, API keys, or broker credentials.",
    "Return ONLY valid JSON with keys reply and action. reply is a helpful user-facing string. action is null or an object with only symbol, timeframe, or tab.",
    "Current chart: " + String(market.symbol || "EURUSD") + " on " + String(market.timeframe || "1h") + "."
  ].join("\n");

  try {
    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        instructions: system,
        input: message,
        max_output_tokens: 700
      })
    });
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      console.error("OpenAI API error", upstream.status, data?.error?.code || "");
      return send(res, 502, { error: "The AI provider could not complete that request. Please try again shortly." });
    }
    const output = (data.output || [])
      .flatMap(item => item.content || [])
      .filter(part => part.type === "output_text")
      .map(part => part.text)
      .join("\n").trim();
    if (!output) return send(res, 502, { error: "The AI provider returned an empty response." });

    let parsed;
    try { parsed = JSON.parse(output); }
    catch { parsed = { reply: output, action: null }; }

    const action = parsed.action && typeof parsed.action === "object" ? parsed.action : null;
    const safeAction = action ? {
      ...(symbols.includes(action.symbol) ? { symbol: action.symbol } : {}),
      ...(timeframes.includes(action.timeframe) ? { timeframe: action.timeframe } : {}),
      ...(["positions", "pending", "history", "account"].includes(action.tab) ? { tab: action.tab } : {})
    } : null;

    return send(res, 200, {
      reply: typeof parsed.reply === "string" && parsed.reply.trim() ? parsed.reply.trim().slice(0, 4000) : output.slice(0, 4000),
      chart_action: safeAction
    });
  } catch (error) {
    console.error("Assistant request failed", error?.message || "unknown");
    return send(res, 500, { error: "The assistant service is temporarily unavailable." });
  }
};
