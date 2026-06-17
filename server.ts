import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiInstance: GoogleGenAI | null = null;

function getAIClient() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ GEMINI_API_KEY is not set. Gemini integration will run in mock mode.");
      return null;
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route to correct/phrase questions using Gemini 3.5 Flash
  app.post("/api/correct-text", async (req, res) => {
    try {
      const { text, goal } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Text is required" });
      }

      const client = getAIClient();
      if (!client) {
        // Mock fallback if API key is not available, so it doesn't break
        const mockImproved = `${text} (עודכן למטרת ${goal || 'דיוק מתמטי עדין'}: נוסח מחדש בצורה מתמטית ברורה ותקנית)`;
        return res.json({ correctedText: mockImproved });
      }

      const systemPrompt = `אתה מורה מקצועי למתמטיקה ולשון בחטיבת הביניים בישראל. 
תפקידך לקבל נוסח של שאלת הסתברות או אי-ודאות בעברית ולשפר/לנסח אותו מחדש בהתאם לבקשת המשתמש.
הנחיות קפדניות:
1. שמור על המהות המתמטית של השאלה.
2. דאג שהניסוח יהיה בעברית תקנית, רהוטה ומזמינה לתלמידי חטיבת ביניים.
3. אל תחזיר הסברים, הקדמות או תגים מחוץ לנוסח השאלה המשופר עצמו. החזר רק את השאלה המנוסחת מחדש!
4. דאג שהמידע והנתונים בשאלה המקורית לא ישתנו אלא רק הניסוח וסגנון השאלה.`;

      const prompt = `שפר את הניסוח הבא: "${text}". 
הסגנון/המטרה המבוקשת: ${goal || 'שיפור כללי ופישוט לילדים, עברית תקנית ודיוק מתמטי'}`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        }
      });

      const correctedText = response.text?.trim() || text;
      return res.json({ correctedText });
    } catch (error: any) {
      console.error("Error calling Gemini API:", error);
      return res.status(500).json({ error: error.message || "Failed to process request" });
    }
  });

  // Serve static assets in production, or use Vite dev middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server", err);
});
