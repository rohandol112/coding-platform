import analyticsService from '../../services/dashboard/analytics.service.js';
import { analyticsMessages } from '../../constant/userMessages.js';

// Get dashboard analytics (overview)
const getDashboardAnalytics = async (req, res) => {
  try {
    const analytics = await analyticsService.getDashboardAnalytics();

    res.status(200).json({
      success: true,
      message: analyticsMessages.analyticsFetchedSuccess,
      data: analytics
    });
  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: analyticsMessages.analyticsFetchFailed
    });
  }
};

// Get submission statistics
const getSubmissionStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const stats = await analyticsService.getSubmissionStats({ startDate, endDate });

    res.status(200).json({
      success: true,
      message: analyticsMessages.statsFetchedSuccess,
      data: stats
    });
  } catch (error) {
    console.error('Get submission stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get problem statistics
const getProblemStats = async (req, res) => {
  try {
    const stats = await analyticsService.getProblemStats();

    res.status(200).json({
      success: true,
      message: analyticsMessages.statsFetchedSuccess,
      data: stats
    });
  } catch (error) {
    console.error('Get problem stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export default {
  getDashboardAnalytics,
  getSubmissionStats,
  getProblemStats
};
