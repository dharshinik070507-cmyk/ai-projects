import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post(api.grading.grade.path, async (req, res) => {
    try {
      // 1. Validate Input
      const input = api.grading.grade.input.parse(req.body);

      // 2. Call OpenAI for Analysis
      // We ask for a JSON response matching our needs
      const prompt = `
        You are an agricultural expert grading ${input.produceType}. 
        Analyze the attached image and provide a grading report.
        
        For ${input.produceType}:
        - Assess color, size, shape, and visible defects (cracks, rot, spots).
        - Determine a Grade: 'Grade A' (Premium), 'Grade B' (Standard), or 'Reject' (Poor).
        - Provide a confidence score (0-100).
        - List specific defects or observations.

        Return ONLY a valid JSON object with this structure:
        {
          "grade": "Grade A" | "Grade B" | "Reject",
          "confidence": number,
          "analysis": {
            "visual_defects": string[],
            "color": string,
            "size_estimate": string,
            "observations": string
          }
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // Using gpt-4o for vision capabilities
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${input.image}`, // Input is base64
                },
              },
            ],
          },
        ],
        response_format: { type: "json_object" },
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("Failed to get analysis from AI");
      }

      const aiResult = JSON.parse(content);

      // 3. Save to Database
      const report = await storage.createGradingReport({
        imageUrl: `data:image/jpeg;base64,${input.image}`, // Storing the base64 string
        produceType: input.produceType,
        grade: aiResult.grade,
        confidence: aiResult.confidence,
        analysis: aiResult.analysis,
      });

      // 4. Return Result
      res.status(201).json(report);

    } catch (err) {
      console.error("Grading error:", err);
      if (err instanceof z.ZodError) {
        res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      } else {
        res.status(500).json({ message: "Internal server error during grading" });
      }
    }
  });

  app.get(api.grading.list.path, async (req, res) => {
    const reports = await storage.getGradingReports();
    res.json(reports);
  });

  app.get(api.grading.get.path, async (req, res) => {
    const report = await storage.getGradingReport(Number(req.params.id));
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.json(report);
  });

  return httpServer;
}
