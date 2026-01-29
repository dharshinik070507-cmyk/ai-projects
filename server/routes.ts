import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { GoogleGenerativeAI } from "@google/generative-ai";
import admin from "firebase-admin";

/* ================= FIREBASE ADMIN (ENV BASED) ================= */

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FB_PROJECT_ID,
      clientEmail: process.env.FB_CLIENT_EMAIL,
      privateKey: process.env.FB_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

async function verifyUser(req: any, res: any, next: any) {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: "No auth token" });

    const token = header.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);

    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

/* ================= GEMINI SETUP ================= */

const geminiKey = process.env.GEMINI_API_KEY;
console.log("Gemini Key Loaded:", !!geminiKey);

let model: any = null;

if (geminiKey) {
  const genAI = new GoogleGenerativeAI(geminiKey);
  model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
} else {
  console.log("⚠ GEMINI KEY NOT FOUND — Using demo grading");
}

/* ================= ROUTES ================= */

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  /* --------- CREATE GRADING (AUTH REQUIRED) --------- */
  app.post(api.grading.grade.path, verifyUser, async (req: any, res) => {
    try {
      const input = api.grading.grade.input.parse(req.body);
      let aiResult;

      if (model) {
        const cleanImage = input.image.replace(/^data:image\/\w+;base64,/, "");

        const result = await model.generateContent([
          "You are an agricultural grading expert. Return ONLY JSON.",
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanImage,
            },
          },
        ]);

        let text = result.response.text().replace(/```json|```/g, "").trim();
        console.log("AI RAW:", text);

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          aiResult = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("AI returned no JSON");
        }

      } else {
        aiResult = {
          grade: "Grade A",
          confidence: 85,
          analysis: {
            visual_defects: ["Minor surface spots"],
            color: "Healthy",
            size_estimate: "Average",
            observations: "Demo fallback result",
          },
        };
      }

      const report = await storage.createGradingReport({
        userId: req.user.uid,
        imageUrl: input.image,
        produceType: input.produceType,
        grade: aiResult.grade,
        confidence: aiResult.confidence,
        analysis: aiResult.analysis,
      });

      res.status(201).json(report);

    } catch (err) {
      console.error("Grading error:", err);

      const safeResult = {
        grade: "Grade B",
        confidence: 70,
        analysis: {
          visual_defects: ["AI response formatting issue"],
          color: "Natural",
          size_estimate: "Average",
          observations: "Fallback grading used due to AI error.",
        },
      };

      const input = req.body;

      const report = await storage.createGradingReport({
        userId: req.user.uid,
        imageUrl: input.image,
        produceType: input.produceType,
        ...safeResult,
      });

      res.status(201).json(report);
    }
  });

  /* --------- LIST USER REPORTS --------- */
  app.get(api.grading.list.path, verifyUser, async (req: any, res) => {
    const reports = await storage.getGradingReports(req.user.uid);
    res.json(reports);
  });

  /* --------- GET SINGLE REPORT --------- */
  app.get(api.grading.get.path, verifyUser, async (req: any, res) => {
    const report = await storage.getGradingReport(
      Number(req.params.id),
      req.user.uid
    );

    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json(report);
  });

  return httpServer;
}
