document.addEventListener('DOMContentLoaded', function () {
    // Chatbot elements
    const chatbotToggleBtn = document.getElementById('chatbotToggleBtn');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');

    // Rule-based responses from the provided document
    const chatbotKnowledgeBase = {
        "รถรุ่นไหน": "🚘 รถที่มีให้เช่าและราคา:\nรุ่น\tราคา/วัน\tเกียร์\tเชื้อเพลิง\nYaris Sport / Almera / Ciaz\t฿800\tAuto\tเบนซิน\nCity Turbo / Yaris Ativ\t฿1,000\tAuto\tเบนซิน\nRanger Raptor\t฿2,500\tAuto\tดีเซล\nVeloz / Xpander / Cross\t฿1,800\tAuto\tเบนซิน\nPajero Sport Elite / MU-X\t฿1,990–2,200\tAuto\tดีเซล",
        "ราคาเช่าเริ่มต้นเท่าไหร่": "📌 จากข้อมูลล่าสุดในเว็บไซต์ของ รุ่งโรจน์ คาร์เร้นท์ 💸 รถเช่าราคาต่ำสุดอยู่ที่ 800 บาท/วัน ซึ่งมีหลายรุ่นให้เลือก ดังนี้:\n🚗 รุ่นที่ราคาเริ่มต้นที่ 800 บาท/วัน\nรุ่นรถ\tเกียร์\tเชื้อเพลิง\nNew Yaris Sport\tAutomatic\tเบนซิน\nAlmera Sportech\tAutomatic\tเบนซิน\nCiaz\tAutomatic\tเบนซิน\nรถเหล่านี้เหมาะมากสำหรับการใช้งานในเมือง — ขับง่าย ประหยัดน้ำมัน และราคาสบายกระเป๋ 😊",
        "สาขาอยู่ที่ไหน": "📍 สาขาในอุดรธานี: สาขาหลักอยู่ที่อุดรธานี และมีสาขาที่สนามบินอุดรธานี ซอยบ้านช้าง ต.หมากแข้ง อ.เมือง ☎️ โทร. +66 86-634-8619",
        "ขั้นตอนการจอง": "ขั้นตอนการจองรถทำอย่างไร?\n1. ติดต่อสอบถามรถว่างและโปรโมชั่นผ่านช่องทางต่างๆ\n2. เลือกรุ่นรถและวันที่ต้องการใช้งาน\n3. ชำระค่ามัดจำ (เริ่มต้น ฿3,000) เพื่อยืนยันการจอง\n4. เตรียมเอกสารให้พร้อมสำหรับวันรับรถ",
        "โปรโมชั่น": "🎉 โปรโมชั่นปัจจุบัน:\nวันนี้ – 31 สิงหาคม: ✅ ฟรีประกันภัยชั้น 1 ✅ บริการรับ–ส่งฟรีในตัวเมืองอุดรธานีและสนามบิน",
        "ค่ามัดจำ": "5. 🔐 การมัดจำรถยนต์:\nค่ามัดจำเริ่มต้น ฿3,000 แล้วแต่รุ่นและเงื่อนไข\nคืนเงินทันทีเมื่อส่งคืนรถตามสภาพปกติ",
        "เช่ารถหลายวันมีส่วนลดไหม": "โปรโมชั่น: สอบถามโปรโมชั่นล่าสุดได้โดยตรงกับเจ้าหน้าที่ อาจมีส่วนลดสำหรับการเช่าระยะยาวหรือโปรโมชั่นตามฤดูกาล",
        "เอกสารอะไรบ้าง": "เช่ารถต้องใช้เอกสารอะไรบ้าง?\n- บัตรประชาชน\n- ใบขับขี่รถยนต์\n- เอกสารยืนยันตัวตนอื่นๆ (สอบถามเพิ่มเติม)",
        "เงื่อนไขการเช่า": "เงื่อนไขการเช่ามีอะไรบ้าง?\nโปรดสอบถามเงื่อนไขการเช่าโดยละเอียดกับเจ้าหน้าที่โดยตรง เพื่อความเข้าใจที่ถูกต้องและครบถ้วน",
        "ราคารวมประกันรึยัง": "ประกัน: ราคาเช่าพื้นฐานยังไม่รวมประกันเสริมพิเศษ ท่านสามารถซื้อเพิ่มได้เพื่อความคุ้มครองที่ครอบคลุมยิ่งขึ้น (ประมาณ ฿300–฿500/วัน)",
        "รับ-คืนรถที่สนามบิน": "6. 🛬 การรับ–ส่งรถ:\nรับรถที่ สนามบินอุดรธานี หรือโรงแรม (แจ้งล่วงหน้า)\nเปิดบริการรับ–คืน: 8:00 – 21:30 ทุกวัน\nบริการรับนอกเวลาทำการมีให้ (โปรดแจ้งล่วงหน้า)",
        "บริการส่งรถที่โรงแรม": "6. 🛬 การรับ–ส่งรถ:\nรับรถที่ สนามบินอุดรธานี หรือโรงแรม (แจ้งล่วงหน้า)\nเปิดบริการรับ–คืน: 8:00 – 21:30 ทุกวัน\nบริการรับนอกเวลาทำการมีให้ (โปรดแจ้งล่วงหน้า)",
        "รับรถนอกเวลาทำการ": "6. 🛬 การรับ–ส่งรถ:\nบริการรับนอกเวลาทำการมีให้ (โปรดแจ้งล่วงหน้า)",
        "ติดต่อเจ้าหน้าที่": "📍 ติดต่อเจ้าของร้าน:\nรุ่งโรจน์ คาร์เร้นท์ 📞 เบอร์โทร: +66 86-634-8619 🏢 สำนักงานใหญ่: 12/6 ต.หมูม่น เมืองอุดรธานี ✈️ สาขาสนามบิน: ซอยบ้านช้าง เมืองอุดรธานี",
        "เบอร์โทรติดต่อด่วน": "📞 เบอร์โทรติดต่อด่วน: +66 86-634-8619",
        "รถสำหรับไปเที่ยวภูเขา": "ขอแนะนำ “MU-X” และ “Pajero Sport Elite” ค่ะ เป็นรถ SUV ช่วงล่างสูง เหมาะสำหรับทางขึ้นดอยและเดินทางไกลค่ะ 😊",
        "สวัสดี": "สวัสดีครับ มีอะไรให้ช่วยไหมครับ?",
        "ขอบคุณ": "ยินดีให้บริการครับ/ค่ะ! หากมีคำถามอื่น ๆ สามารถสอบถามได้เลยนะครับ/ค่ะ",
        "ไม่เข้าใจ": "ขออภัยครับ/ค่ะ ไม่ทราบว่าต้องการสอบถามเรื่องอะไรเป็นพิเศษครับ/ค่ะ? ลองพิมพ์คำถามสั้นๆ หรือเลือกจากหมวดหมู่ที่สนใจได้เลยครับ",
        "อื่นๆ": "ขออภัยครับ/ค่ะ ตอนนี้ฉันสามารถให้ข้อมูลตามที่ระบุในเอกสารได้เท่านั้น หากต้องการข้อมูลเพิ่มเติม กรุณาติดต่อเจ้าหน้าที่โดยตรงที่เบอร์ +66 86-634-8619 ครับ/ค่ะ"
    };

    function getRuleBasedResponse(userMessage) {
        userMessage = userMessage.toLowerCase();
        for (const keyword in chatbotKnowledgeBase) {
            if (userMessage.includes(keyword)) {
                return chatbotKnowledgeBase[keyword];
            }
        }
        return chatbotKnowledgeBase["อื่นๆ"];
    }

    // Function to toggle chatbot window visibility
    function toggleChatbotWindow() {
        chatbotWindow.classList.toggle('translate-y-full');
        chatbotWindow.classList.toggle('opacity-0');
        chatbotWindow.classList.toggle('translate-y-0');
        chatbotWindow.classList.toggle('opacity-100');
        if (chatbotWindow.classList.contains('opacity-100')) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    // Function to add a message to the chat window
    function addMessage(sender, message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex mb-2 ${isUser ? 'justify-end' : 'justify-start'}`;
        messageDiv.innerHTML = `
            <div class="${isUser ? 'bg-pink-500 text-white' : 'bg-blue-100 text-blue-900'} p-3 rounded-lg max-w-[70%] shadow-sm">
                ${message.replace(/\n/g, '<br>')}
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Function to handle sending messages
    function handleSendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addMessage('user', message, true);
            const botResponse = getRuleBasedResponse(message);
            setTimeout(() => { // Simulate typing delay
                addMessage('bot', botResponse, false);
            }, 500);
            chatInput.value = '';
        }
    }

    // Event Listeners for chatbot
    chatbotToggleBtn.addEventListener('click', toggleChatbotWindow);
    closeChatBtn.addEventListener('click', toggleChatbotWindow);

    sendMessageBtn.addEventListener('click', handleSendMessage);

    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    });
});
