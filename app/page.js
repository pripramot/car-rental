'use client';
import { useEffect, useRef, useState } from "react";

const chatbotKnowledgeBase = {
  "responses": [
    { "keywords": ["รถรุ่นไหน", "มีรถอะไร", "รถเช่า"], "response": "🚘 รถที่มีให้เช่าและราคา: ..." },
    { "keywords": ["ราคาเช่าเริ่มต้นเท่าไหร่", "ราคาถูกสุด"], "response": "📌 ราคาเริ่มต้น ..." },
    { "keywords": ["สวัสดี", "หวัดดี"], "response": "สวัสดีค่ะ มีอะไรให้ช่วยไหมคะ?" },
    { "keywords": ["ขอบคุณ"], "response": "ขอบคุณค่ะ หากมีคำถามอื่น ๆ สอบถามได้เลยนะคะ" }
  ],
  "default_response": "ขออภัยค่ะ ตอนนี้ฉันสามารถให้ข้อมูลตามที่ระบุในเอกสารได้เท่านั้น"
};

function escapeHtml(text) {
  if (!text) return "";
  return text.replace(/[&<>"']/g, function (m) {
    return ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    })[m];
  });
}

function getRuleBasedResponse(userMessage) {
  const lower = userMessage.toLowerCase();
  for (const item of chatbotKnowledgeBase.responses) {
    for (const keyword of item.keywords) {
      if (lower.includes(keyword.toLowerCase())) {
        return item.response;
      }
    }
  }
  return null;
}

export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "สวัสดีค่ะ มีอะไรให้ช่วยไหมคะ?" }
  ]);
  const [input, setInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatEndRef = useRef();

  useEffect(() => {
    if (showChat && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, showChat]);

  async function getGeminiResponse(userMessage) {
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage })
      });
      const result = await response.json();
      return result.reply || chatbotKnowledgeBase.default_response;
    } catch {
      return chatbotKnowledgeBase.default_response;
    }
  }

  const handleSend = async () => {
    if (isBotTyping) return;
    const userMessage = input.trim();
    if (!userMessage) return;
    setMessages(msgs => [...msgs, { from: "user", text: userMessage }]);
    setInput("");
    setIsBotTyping(true);

    let botResponse = getRuleBasedResponse(userMessage);
    if (botResponse) {
      setMessages(msgs => [...msgs, { from: "bot", text: botResponse }]);
      setIsBotTyping(false);
    } else {
      botResponse = await getGeminiResponse(userMessage);
      setMessages(msgs => [...msgs, { from: "bot", text: botResponse }]);
      setIsBotTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className="fixed bottom-6 right-6 bg-pink-500 text-white p-4 rounded-full shadow-lg hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75 z-50"
        onClick={() => setShowChat(s => !s)}
        aria-label="Open chatbot"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"/>
        </svg>
      </button>
      {/* Chat Window */}
      <div className={`fixed bottom-24 right-6 w-80 h-96 bg-gray-800 rounded-xl shadow-2xl flex flex-col transition-all duration-300 z-40 border border-pink-400 ${showChat ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"} pointer-events-auto`}>
        <div className="bg-indigo-900 text-white p-4 rounded-t-xl flex justify-between items-center">
          <h3 className="text-lg font-semibold">แชทกับเรา</h3>
          <button className="text-white hover:text-indigo-200 focus:outline-none" onClick={() => setShowChat(false)} aria-label="Close chatbot">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div className="flex-grow p-4 overflow-y-auto chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`flex mb-2 ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`${msg.from === "user" ? "bg-pink-500 text-white" : "bg-gray-700 text-gray-200"} p-3 rounded-lg max-w-[70%] shadow-sm`}>
                <span dangerouslySetInnerHTML={{ __html: escapeHtml(msg.text).replace(/\n/g, "<br/>") }} />
              </div>
            </div>
          ))}
          <div ref={chatEndRef}></div>
        </div>
        <div className="p-4 border-t border-gray-700 flex rounded-b-xl">
          <input
            type="text"
            className="flex-grow p-3 border border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-900 text-white"
            placeholder="พิมพ์ข้อความ..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
            disabled={isBotTyping}
          />
          <button
            className="bg-pink-500 text-white p-3 rounded-r-lg hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75 transition-colors duration-200"
            onClick={handleSend}
            disabled={isBotTyping}
          >ส่ง</button>
        </div>
      </div>
    </>
  );
}
