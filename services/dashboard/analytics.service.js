import {
  getDashboardAnalyticsUseCase,
  getSubmissionStatsUseCase,
  getProblemStatsUseCase
} from '../../library/domain/analytics/analyticsUseCase.js';

class AnalyticsService {
  async getDashboardAnalytics() {
    return await getDashboardAnalyticsUseCase.execute();
  }

  async getSubmissionStats(filters) {
    return await getSubmissionStatsUseCase.execute(filters);
  }

  async getProblemStats() {
    return await getProblemStatsUseCase.execute();
  }
}

export default new AnalyticsService();
