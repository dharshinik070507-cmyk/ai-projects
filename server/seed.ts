import { storage } from "./storage";

async function seed() {
  console.log("Seeding database...");

  const existing = await storage.getGradingReports();
  if (existing.length > 0) {
    console.log("Database already seeded.");
    return;
  }

  // Sample 1: Good Coconut
  await storage.createGradingReport({
    imageUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", // 1x1 red pixel placeholder
    produceType: "coconut",
    grade: "Grade A",
    confidence: 95,
    analysis: {
      visual_defects: [],
      color: "Uniform brown",
      size_estimate: "Large (approx 15cm dia)",
      observations: "Excellent condition, no visible cracks or leakage."
    }
  });

  // Sample 2: Average Turmeric
  await storage.createGradingReport({
    imageUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", // 1x1 pixel placeholder
    produceType: "turmeric",
    grade: "Grade B",
    confidence: 82,
    analysis: {
      visual_defects: ["Minor surface dirt", "Small irregular shapes"],
      color: "Deep orange-yellow",
      size_estimate: "Mixed sizes",
      observations: "Good color but some cleaning required. Acceptable for powdering."
    }
  });

  // Sample 3: Rejected Coconut
  await storage.createGradingReport({
    imageUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==", // 1x1 pixel placeholder
    produceType: "coconut",
    grade: "Reject",
    confidence: 98,
    analysis: {
      visual_defects: ["Large crack", "Mold visible"],
      color: "Dark patches",
      size_estimate: "Medium",
      observations: "Significant damage visible. Likely spoiled. Rejected."
    }
  });

  console.log("Seeding complete.");
}

seed().catch(console.error);
