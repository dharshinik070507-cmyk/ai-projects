import { db } from "./db";
import { gradingReports, type GradingReport, type InsertGradingReport } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  createGradingReport(report: InsertGradingReport): Promise<GradingReport>;
  getGradingReports(): Promise<GradingReport[]>;
  getGradingReport(id: number): Promise<GradingReport | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createGradingReport(report: InsertGradingReport): Promise<GradingReport> {
    const [newReport] = await db.insert(gradingReports).values(report).returning();
    return newReport;
  }

  async getGradingReports(): Promise<GradingReport[]> {
    return await db.select().from(gradingReports).orderBy(desc(gradingReports.createdAt));
  }

  async getGradingReport(id: number): Promise<GradingReport | undefined> {
    const [report] = await db.select().from(gradingReports).where(eq(gradingReports.id, id));
    return report;
  }
}

export const storage = new DatabaseStorage();
