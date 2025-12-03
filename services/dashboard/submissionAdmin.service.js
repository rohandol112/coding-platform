import {
  getSubmissionsUseCase,
  getSubmissionUseCase,
  deleteSubmissionUseCase,
  rejudgeSubmissionUseCase
} from '../../library/domain/submissionAdmin/submissionAdminUseCase.js';

class SubmissionAdminService {
  async getSubmissions(filters) {
    return await getSubmissionsUseCase.execute(filters);
  }

  async getSubmission(submissionId) {
    return await getSubmissionUseCase.execute(submissionId);
  }

  async deleteSubmission(submissionId) {
    return await deleteSubmissionUseCase.execute(submissionId);
  }

  async rejudgeSubmission(submissionId) {
    return await rejudgeSubmissionUseCase.execute(submissionId);
  }
}

export default new SubmissionAdminService();
