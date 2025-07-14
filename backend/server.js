require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Proxy endpoint สำหรับเชื่อมต่อ Gemini API
app.post('/api/gemini', async (req, res) => {
  try {
    const payload = req.body;

    // ปรับ URL endpoint ตาม Gemini API ที่คุณใช้งานจริง
    const response = await axios.post(
      'https://api.gemini.com/v1/your-endpoint',
      payload,
      {
        headers: {
          'Authorization': `Bearer ${GEMINI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Gemini API error', message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
