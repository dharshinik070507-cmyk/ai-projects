import mongoose from "mongoose";

/* ===== SCHEMA ===== */

const GradingSchema = new mongoose.Schema({
  userId: { type: String, required: true },   // 🔥 user link
  imageUrl: String,
  produceType: String,
  grade: String,
  confidence: Number,
  analysis: Object,
}, { timestamps: true });

const Report = mongoose.model("Report", GradingSchema);

/* ===== FUNCTIONS ===== */

export const storage = {

  async createGradingReport(data: any) {
    return await Report.create(data);
  },

  async getGradingReports(userId: string) {
    return await Report.find({ userId }).sort({ createdAt: -1 });
  },

  async getGradingReport(id: number, userId: string) {
    return await Report.findOne({ _id: id, userId });
  }

};
