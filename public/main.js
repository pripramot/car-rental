async function sendToGemini(chatData) {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(chatData)
  });
  const result = await response.json();
  // ทำงานกับ result ได้เลย
}
