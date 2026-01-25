import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const gradingReports = pgTable("grading_reports", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(), // Storing as base64 data URI for MVP simplicity
  produceType: text("produce_type").notNull(), // 'coconut' or 'turmeric'
  grade: text("grade").notNull(), // e.g., 'Grade A', 'Grade B', 'Reject'
  confidence: integer("confidence").notNull(), // 0-100
  analysis: jsonb("analysis").notNull(), // Structured analysis from AI
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// === SCHEMAS ===
export const insertGradingReportSchema = createInsertSchema(gradingReports).omit({ 
  id: true, 
  createdAt: true 
});

// === TYPES ===
export type GradingReport = typeof gradingReports.$inferSelect;
export type InsertGradingReport = z.infer<typeof insertGradingReportSchema>;

// Request type for the grading endpoint
export const gradeRequestSchema = z.object({
  image: z.string(), // Base64 encoded image
  produceType: z.enum(["coconut", "turmeric"]),
});

export type GradeRequest = z.infer<typeof gradeRequestSchema>;
