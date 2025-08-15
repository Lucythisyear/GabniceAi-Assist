// netlify/functions/ai.js
// Uses native fetch (Node 18+) — no extra packages needed.

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { message } = JSON.parse(event.body || "{}");
    if (!message || !message.trim()) {
      return { statusCode: 400, body: "Message is required" };
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, body: "OPENAI_API_KEY not set" };
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.6,
        messages: [
          { role: "system", content: "You are GabniceAi Assist — friendly, concise, and helpful." },
          { role: "user", content: message }
        ]
      }),
    });

    if (!response.ok) {
      const txt = await response.text();
      return { statusCode: response.status, body: txt };
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Hmm, I couldn't find a reply.";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    return { statusCode: 500, body: `Server error: ${err.message}` };
  }
};
