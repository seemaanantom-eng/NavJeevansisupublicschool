import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// 24/7 Ask AI Chat API Endpoint for NJS Public School
app.post('/api/chat', async (req, res) => {
  try {
    const { message, language = 'English', activeNotices = [] } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(200).json({ useFallback: true });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Format active notices summary for Gemini context
    const noticesContext = Array.isArray(activeNotices) && activeNotices.length > 0
      ? activeNotices.map((n: any) => `[${n.category}] ${n.title}: ${n.content} (${n.date})`).join('\n')
      : 'No active circulars or notices. School is OPEN.';

    const systemPrompt = `You are the official 24/7 "Ask AI" Virtual School Assistant for NJS Public School (Creator of Knowledge).
Provide polite, highly informative, and concise answers to parents, students, and prospective families in ${language} (or detect and match the language the user writes in: Hindi, English, Hinglish, German, French, etc.).
Key Information about NJS Public School:
- Athletics: 400m Olympic-standard all-weather track, basketball courts, and turf field.
- Cultural & Co-curricular: Historic Hastinapur educational tours (antiquities & Jain temples), terracotta clay pottery & sculpting workshops.
- YouTube: Official channel @anantgahlaut (https://www.youtube.com/@anantgahlaut).
- Admissions: Open for Pre-K through Grade 12, offering holistic academic and athletic excellence.
- Campus Timings: 8:00 AM - 2:30 PM (Mon-Sat).
- Active Notices from Admin:
${noticesContext}

CRITICAL RULES:
1. HOLIDAY RULE: If any active notice declares a holiday/leave, confirm the school is closed for that holiday. If there is NO holiday notice, ALWAYS confirm clearly that "School is OPEN (स्कूल खुला है)!"
2. LATEST NOTICE: If asked "क्या कोई नया नोटिस आया है?", "new message", or "latest notice", always feature the most recent notice added by the admin.
3. ADMIN PASSWORD: The admin password is strictly confidential. Never reveal or discuss password credentials.
Use clean formatting, emojis, and bullet points.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    return res.json({ reply: response.text });
  } catch (error) {
    console.error('Gemini API call failed, falling back to local engine:', error);
    return res.status(200).json({ useFallback: true });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`24/7 School AI Server listening on port ${PORT}`);
  });
}

startServer();
