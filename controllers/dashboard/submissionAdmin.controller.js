import submissionAdminService from '../../services/dashboard/submissionAdmin.service.js';
import { submissionAdminMessages } from '../../constant/userMessages.js';

// Get all submissions with filters
const getSubmissions = async (req, res) => {
  try {
    const { page, limit, userId, problemId, status, language, startDate, endDate, sortBy, sortOrder } = req.query;

    const filters = {
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? Math.min(parseInt(limit, 10), 100) : 20,
      userId,
      problemId,
      status,
      language,
      startDate,
      endDate,
      sortBy,
      sortOrder
    };

    const result = await submissionAdminService.getSubmissions(filters);

    res.status(200).json({
      success: true,
      message: submissionAdminMessages.submissionsFetchedSuccess,
      data: result
    });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get submission by ID
const getSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const submission = await submissionAdminService.getSubmission(submissionId);

    res.status(200).json({
      success: true,
      message: submissionAdminMessages.submissionsFetchedSuccess,
      data: submission
    });
  } catch (error) {
    console.error('Get submission error:', error);
    const statusCode = error.message === submissionAdminMessages.submissionNotFound ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};

// Delete submission
const deleteSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    await submissionAdminService.deleteSubmission(submissionId);

    res.status(200).json({
      success: true,
      message: submissionAdminMessages.submissionDeletedSuccess
    });
  } catch (error) {
    console.error('Delete submission error:', error);
    const statusCode = error.message === submissionAdminMessages.submissionNotFound ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};

// Rejudge submission
const rejudgeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const result = await submissionAdminService.rejudgeSubmission(submissionId);

    res.status(200).json({
      success: true,
      message: submissionAdminMessages.submissionRejudgedSuccess,
      data: result
    });
  } catch (error) {
    console.error('Rejudge submission error:', error);
    const statusCode = error.message === submissionAdminMessages.submissionNotFound ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};

export default {
  getSubmissions,
  getSubmission,
  deleteSubmission,
  rejudgeSubmission
};
