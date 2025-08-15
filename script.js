document.getElementById("send-btn").addEventListener("click", sendMessage);

async function sendMessage() {
  const inputField = document.getElementById("user-input");
  const message = inputField.value.trim();
  if (!message) return;

  displayMessage("You", message);
  inputField.value = "";

  try {
    const res = await fetch("/.netlify/functions/ai", {
      method: "POST",
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    displayMessage("GabniceAI", data.reply);
  } catch (error) {
    displayMessage("GabniceAI", "Error: " + error.message);
  }
}

function displayMessage(sender, text) {
  const chatBox = document.getElementById("chat-box");
  chatBox.innerHTML += `<p><strong>${sender}:</strong> ${text}</p>`;
  chatBox.scrollTop = chatBox.scrollHeight;
}
