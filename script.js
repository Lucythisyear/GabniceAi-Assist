const chat = document.getElementById("chat");
const text = document.getElementById("text");
const send = document.getElementById("send");

function addMsg(content, who = "bot") {
  const div = document.createElement("div");
  div.className = `msg ${who}`;
  div.textContent = content;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function sendMsg() {
  const msg = text.value.trim();
  if (!msg) return;
  addMsg(msg, "user");
  text.value = "";

  // show thinking placeholder
  const thinking = document.createElement("div");
  thinking.className = "msg bot";
  thinking.textContent = "…";
  chat.appendChild(thinking);
  chat.scrollTop = chat.scrollHeight;

  try {
    const res = await fetch("/.netlify/functions/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg })
    });

    const data = await res.json().catch(() => ({}));
    thinking.remove();
    if (!res.ok) {
      addMsg(`Error: ${data.error || res.statusText || "Request failed"}`, "bot");
      return;
    }
    addMsg(data.reply || "No reply received.", "bot");
  } catch (e) {
    thinking.remove();
    addMsg(`Network error: ${e.message}`, "bot");
  }
}

send.addEventListener("click", sendMsg);
text.addEventListener("keydown", (e) => { if (e.key === "Enter") sendMsg(); });
