let reports: any[] = [];
let idCounter = 1;

export const storage = {
  async createGradingReport(data: any) {
    const report = {
      id: idCounter++,
      createdAt: new Date(),
      ...data,
    };
    reports.push(report);
    return report;
  },

  async getGradingReports() {
    return reports;
  },

  async getGradingReport(id: number) {
    return reports.find(r => r.id === id);
  },
};
