import submissionAdminRepository from './submissionAdminRepository.js';
import { submissionAdminMessages } from '../../../constant/userMessages.js';

class GetSubmissionsUseCase {
  async execute(filters) {
    return await submissionAdminRepository.findMany(filters);
  }
}

class GetSubmissionUseCase {
  async execute(submissionId) {
    const submission = await submissionAdminRepository.findById(submissionId);
    if (!submission) {
      throw new Error(submissionAdminMessages.submissionNotFound);
    }
    return submission;
  }
}

class DeleteSubmissionUseCase {
  async execute(submissionId) {
    const submission = await submissionAdminRepository.findById(submissionId);
    if (!submission) {
      throw new Error(submissionAdminMessages.submissionNotFound);
    }
    return await submissionAdminRepository.delete(submissionId);
  }
}

class RejudgeSubmissionUseCase {
  async execute(submissionId) {
    const submission = await submissionAdminRepository.findById(submissionId);
    if (!submission) {
      throw new Error(submissionAdminMessages.submissionNotFound);
    }

    // Reset status to PENDING for rejudge
    await submissionAdminRepository.updateStatus(submissionId, 'PENDING');
    
    // TODO: Queue submission for rejudge (integrate with worker queue)
    // This would push the submission back to RabbitMQ/Kafka for processing
    
    return { submissionId, status: 'PENDING' };
  }
}

// Initialize use cases
export const getSubmissionsUseCase = new GetSubmissionsUseCase();
export const getSubmissionUseCase = new GetSubmissionUseCase();
export const deleteSubmissionUseCase = new DeleteSubmissionUseCase();
export const rejudgeSubmissionUseCase = new RejudgeSubmissionUseCase();
