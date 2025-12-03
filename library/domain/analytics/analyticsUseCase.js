import analyticsRepository from './analyticsRepository.js';

class GetDashboardAnalyticsUseCase {
  async execute() {
    return await analyticsRepository.getDashboardStats();
  }
}

class GetSubmissionStatsUseCase {
  async execute(filters) {
    return await analyticsRepository.getSubmissionStats(filters);
  }
}

class GetProblemStatsUseCase {
  async execute() {
    return await analyticsRepository.getProblemStats();
  }
}

// Initialize use cases
export const getDashboardAnalyticsUseCase = new GetDashboardAnalyticsUseCase();
export const getSubmissionStatsUseCase = new GetSubmissionStatsUseCase();
export const getProblemStatsUseCase = new GetProblemStatsUseCase();
