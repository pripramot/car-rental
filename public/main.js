document.addEventListener('DOMContentLoaded', function () {
    // --- Chatbot Logic ---
    const chatbotKnowledgeBase = {
        "responses": [
            { "keywords": ["รถรุ่นไหน", "มีรถอะไร", "รถเช่า"], "response": "🚘 รถที่มีให้เช่าและราคา: ..." },
            { "keywords": ["ราคาเช่าเริ่มต้นเท่าไหร่", "ราคาถูกสุด"], "response": "📌 ราคาเริ่มต้น ..." },
            { "keywords": ["สวัสดี", "หวัดดี"], "response": "สวัสดีค่ะ มีอะไรให้ช่วยไหมคะ?" },
            { "keywords": ["ขอบคุณ"], "response": "ขอบคุณค่ะ หากมีคำถามอื่น ๆ สอบถามได้เลยนะคะ" }
            // ... เพิ่ม/ปรับตามจริง ...
        ],
        "default_response": "ขออภัยค่ะ ตอนนี้ฉันสามารถให้ข้อมูลตามที่ระบุในเอกสารได้เท่านั้น"
    };

    // Chatbot Elements
    const chatbotToggleBtn = document.getElementById('chatbotToggleBtn');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    let isBotTyping = false;

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function addMessage(sender, message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex mb-2 ${isUser ? 'justify-end' : 'justify-start'}`;
        messageDiv.innerHTML = `
            <div class="${isUser ? 'bg-pink-500 text-white' : 'bg-gray-700 text-gray-200'} p-3 rounded-lg max-w-[70%] shadow-sm">
                ${escapeHtml(message).replace(/\n/g, '<br>')}
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
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

    // Proxy Gemini API ผ่าน backend เท่านั้น!
    async function getGeminiResponse(userMessage) {
        try {
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage })
            });
            const result = await response.json();
            return result.reply || chatbotKnowledgeBase.default_response;
        } catch (error) {
            return chatbotKnowledgeBase.default_response;
        }
    }

    async function handleSendMessage() {
        if (isBotTyping) return;
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;
        addMessage('user', userMessage, true);
        chatInput.value = '';
        isBotTyping = true;

        let botResponse = getRuleBasedResponse(userMessage);
        if (botResponse) {
            addMessage('bot', botResponse, false);
            isBotTyping = false;
        } else {
            botResponse = await getGeminiResponse(userMessage);
            addMessage('bot', botResponse, false);
            isBotTyping = false;
        }
    }

    function toggleChatbotWindow() {
        chatbotWindow.classList.toggle('translate-y-full');
        chatbotWindow.classList.toggle('opacity-0');
        chatbotWindow.classList.toggle('translate-y-0');
        chatbotWindow.classList.toggle('opacity-100');
        if (chatbotWindow.classList.contains('opacity-100')) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    chatbotToggleBtn.addEventListener('click', toggleChatbotWindow);
    closeChatBtn.addEventListener('click', toggleChatbotWindow);
    sendMessageBtn.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') handleSendMessage();
    });

    document.getElementById('current-year').textContent = new Date().getFullYear();
});
