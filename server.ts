import express from "express";
import path from "path";
import fs from "fs";
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

  // API Route to synchronize to GitHub
  app.post("/api/github-sync", async (req, res) => {
    const { token, message = "עדכון אוטומטי של דפי העבודה והכללים" } = req.body;
    if (!token) {
      return res.status(400).json({ error: "חובה להזין מפתח אישי (Personal Access Token) של GitHub" });
    }

    const owner = "yanivmizrachiy";
    const repo = "i-vadaut-ai-studio";
    const filesToSync = [
      { localPath: "src/types.ts", repoPath: "src/types.ts" },
      { localPath: "src/data.ts", repoPath: "src/data.ts" },
      { localPath: "src/App.tsx", repoPath: "src/App.tsx" },
      { localPath: "README.md", repoPath: "README.md" },
      { localPath: "RULES.md", repoPath: "RULES.md" },
    ];

    try {
      const repoInfoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          "Authorization": `token ${token}`,
          "Accept": "application/vnd.github.v3+json",
          "User-Agent": "aistudio-build-sync"
        }
      });

      if (!repoInfoResponse.ok) {
        const errText = await repoInfoResponse.text();
        return res.status(repoInfoResponse.status).json({ 
          error: `התחברות ל-GitHub נכשלה. אנא ודא שהאסימון (Token) תקין ושיש לו הרשאות כתיבה לריפו. שגיאה: ${errText}` 
        });
      }

      const repoInfo = await repoInfoResponse.json() as any;
      const branch = repoInfo.default_branch || "main";

      const results: string[] = [];

      for (const file of filesToSync) {
        const fullLocalPath = path.join(process.cwd(), file.localPath);
        if (!fs.existsSync(fullLocalPath)) {
          results.push(`⚠️ קובץ מקומי ${file.localPath} אינו קיים במערכת`);
          continue;
        }

        const fileContent = fs.readFileSync(fullLocalPath, "utf-8");
        const base64Content = Buffer.from(fileContent).toString("base64");

        let sha: string | undefined;
        const getFileResponse = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/${file.repoPath}?ref=${branch}`,
          {
            headers: {
              "Authorization": `token ${token}`,
              "Accept": "application/vnd.github.v3+json",
              "User-Agent": "aistudio-build-sync"
            }
          }
        );

        if (getFileResponse.ok) {
          const repoFile = await getFileResponse.json() as any;
          sha = repoFile.sha;
        }

        const putResponse = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/${file.repoPath}`,
          {
            method: "PUT",
            headers: {
              "Authorization": `token ${token}`,
              "Content-Type": "application/json",
              "Accept": "application/vnd.github.v3+json",
              "User-Agent": "aistudio-build-sync"
            },
            body: JSON.stringify({
              message,
              content: base64Content,
              sha,
              branch
            })
          }
        );

        if (!putResponse.ok) {
          const putErr = await putResponse.text();
          throw new Error(`שגיאה בהעלאת ${file.repoPath}: ${putErr}`);
        }

        results.push(`✅ הקובץ ${file.repoPath} סונכרן בהצלחה!`);
      }

      return res.json({ success: true, results, branch });
    } catch (error: any) {
      console.error("GitHub Sync Error:", error);
      return res.status(500).json({ error: error.message || "תהליך הסינכרון נכשל" });
    }
  });

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
