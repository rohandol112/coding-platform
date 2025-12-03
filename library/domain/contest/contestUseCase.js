/**
 * @fileoverview Contest Use Cases - Business Logic
 * Core domain logic for contest operations
 */

import { v4 as uuidv4 } from 'uuid';
import contestRepository from './contestRepository.js';
import { contestStatus, contestMessages, contestLimits } from '../../../constant/contest.js';

/**
 * Create Contest Use Case
 */
class CreateContestUseCase {
  constructor({ eventPublisher } = {}) {
    this.eventPublisher = eventPublisher;
  }

  async execute(data, createdBy) {
    // Business Rule: Validate title length
    if (data.title.length > contestLimits.titleMaxLength) {
      throw new Error(contestMessages.titleTooLong);
    }

    // Business Rule: Validate description length
    if (data.description && data.description.length > contestLimits.descriptionMaxLength) {
      throw new Error(contestMessages.descriptionTooLong);
    }

    // Business Rule: Validate date range
    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);
    
    if (endTime <= startTime) {
      throw new Error(contestMessages.invalidDateRange);
    }

    // Business Rule: Registration deadline must be before start time
    if (data.registrationDeadline) {
      const regDeadline = new Date(data.registrationDeadline);
      if (regDeadline >= startTime) {
        throw new Error(contestMessages.invalidRegistrationDeadline);
      }
    }

    // Business Rule: Slug uniqueness
    if (data.slug && await contestRepository.slugExists(data.slug)) {
      throw new Error(contestMessages.slugExists);
    }

    const contestId = uuidv4();
    const contest = await contestRepository.create({
      id: contestId,
      ...data,
      status: contestStatus.draft,
      createdBy,
      createdAt: new Date(),
    });

    // Publish domain event
    if (this.eventPublisher) {
      await this.eventPublisher.publishContestCreated({
        contestId: contest.id,
        title: contest.title,
        createdBy,
        timestamp: new Date().toISOString(),
      });
    }

    return contest;
  }
}

/**
 * Update Contest Use Case
 */
class UpdateContestUseCase {
  async execute(contestId, data, userId) {
    const contest = await contestRepository.findById(contestId);

    if (!contest) {
      const error = new Error(contestMessages.notFound);
      error.statusCode = 404;
      throw error;
    }

    // Business Rule: Cannot modify running or ended contests
    if (contest.status === contestStatus.running || contest.status === contestStatus.ended) {
      throw new Error(contestMessages.cannotModifyStarted);
    }

    // Business Rule: Validate title length if provided
    if (data.title && data.title.length > contestLimits.titleMaxLength) {
      throw new Error(contestMessages.titleTooLong);
    }

    // Business Rule: Validate description length if provided
    if (data.description && data.description.length > contestLimits.descriptionMaxLength) {
      throw new Error(contestMessages.descriptionTooLong);
    }

    // Business Rule: Validate date range if times are being updated
    if (data.startTime || data.endTime) {
      const startTime = new Date(data.startTime || contest.startTime);
      const endTime = new Date(data.endTime || contest.endTime);
      
      if (endTime <= startTime) {
        throw new Error(contestMessages.invalidDateRange);
      }
    }

    // Business Rule: Slug uniqueness if being updated
    if (data.slug && data.slug !== contest.slug) {
      if (await contestRepository.slugExists(data.slug, contestId)) {
        throw new Error(contestMessages.slugExists);
      }
    }

    return await contestRepository.update(contestId, {
      ...data,
      updatedAt: new Date(),
    });
  }
}

/**
 * Delete Contest Use Case
 */
class DeleteContestUseCase {
  async execute(contestId, userId) {
    const contest = await contestRepository.findById(contestId);

    if (!contest) {
      const error = new Error(contestMessages.notFound);
      error.statusCode = 404;
      throw error;
    }

    // Business Rule: Cannot delete running contests
    if (contest.status === contestStatus.running) {
      throw new Error(contestMessages.cannotDeleteStarted);
    }

    // Business Rule: Cannot delete ended contests with participants (data integrity)
    if (contest.status === contestStatus.ended) {
      const { participants } = await contestRepository.getParticipants(contestId, { limit: 1 });
      if (participants.length > 0) {
        throw new Error(contestMessages.cannotDeleteWithParticipants);
      }
    }

    await contestRepository.deleteById(contestId);
  }
}

/**
 * Get Contest Use Case
 */
class GetContestUseCase {
  async execute(contestId, options = {}) {
    const contest = await contestRepository.findById(contestId, options);

    if (!contest) {
      const error = new Error(contestMessages.notFound);
      error.statusCode = 404;
      throw error;
    }

    return contest;
  }
}

/**
 * Get Contests Use Case
 */
class GetContestsUseCase {
  async execute(filters) {
    return await contestRepository.findMany(filters);
  }
}

/**
 * Add Problem to Contest Use Case
 */
class AddProblemToContestUseCase {
  async execute(contestId, problemData) {
    const contest = await contestRepository.findById(contestId);

    if (!contest) {
      const error = new Error(contestMessages.notFound);
      error.statusCode = 404;
      throw error;
    }

    // Business Rule: Cannot modify running or ended contests
    if (contest.status === contestStatus.running || contest.status === contestStatus.ended) {
      throw new Error(contestMessages.cannotModifyStarted);
    }

    // Business Rule: Maximum problems limit
    const { contests: [contestWithProblems] } = await contestRepository.findMany({
      page: 1,
      limit: 1,
    });
    
    const currentProblemCount = contestWithProblems?._count?.problems || 0;
    if (currentProblemCount >= contestLimits.maxProblems) {
      throw new Error(contestMessages.maxProblemsReached);
    }

    // Business Rule: Points must be positive
    if (problemData.points <= 0) {
      throw new Error(contestMessages.invalidPoints);
    }

    return await contestRepository.addProblem(
      contestId,
      problemData.problemId,
      {
        orderIndex: problemData.orderIndex,
        points: problemData.points,
        bonusPoints: problemData.bonusPoints
      }
    );
  }
}

/**
 * Remove Problem from Contest Use Case
 */
class RemoveProblemFromContestUseCase {
  async execute(contestId, problemId) {
    const contest = await contestRepository.findById(contestId);

    if (!contest) {
      const error = new Error(contestMessages.notFound);
      error.statusCode = 404;
      throw error;
    }

    // Business Rule: Cannot modify running or ended contests
    if (contest.status === contestStatus.running || contest.status === contestStatus.ended) {
      throw new Error(contestMessages.cannotModifyStarted);
    }

    await contestRepository.removeProblem(contestId, problemId);
  }
}

/**
 * Update Contest Status Use Case
 */
class UpdateContestStatusUseCase {
  constructor({ eventPublisher } = {}) {
    this.eventPublisher = eventPublisher;
  }

  async execute(contestId, newStatus) {
    const contest = await contestRepository.findById(contestId);

    if (!contest) {
      const error = new Error(contestMessages.notFound);
      error.statusCode = 404;
      throw error;
    }

    // Business Rule: Validate status transition
    const validTransitions = {
      [contestStatus.draft]: [contestStatus.scheduled],
      [contestStatus.scheduled]: [contestStatus.running, contestStatus.cancelled],
      [contestStatus.running]: [contestStatus.ended],
      [contestStatus.ended]: [], // No transitions from ended
      [contestStatus.cancelled]: [], // No transitions from cancelled
    };

    if (!validTransitions[contest.status].includes(newStatus)) {
      throw new Error(contestMessages.invalidStatusTransition);
    }

    const updatedContest = await contestRepository.update(contestId, {
      status: newStatus,
      updatedAt: new Date(),
    });

    // Publish status change event
    if (this.eventPublisher) {
      await this.eventPublisher.publishContestStatusChanged({
        contestId,
        oldStatus: contest.status,
        newStatus,
        timestamp: new Date().toISOString(),
      });
    }

    return updatedContest;
  }
}

/**
 * Get Contest Participants Use Case
 */
class GetContestParticipantsUseCase {
  async execute(contestId, pagination) {
    const contest = await contestRepository.findById(contestId);

    if (!contest) {
      const error = new Error(contestMessages.notFound);
      error.statusCode = 404;
      throw error;
    }

    return await contestRepository.getParticipants(contestId, pagination);
  }
}

/**
 * Get Contest Leaderboard Use Case
 */
class GetContestLeaderboardUseCase {
  async execute(contestId, pagination) {
    const contest = await contestRepository.findById(contestId);

    if (!contest) {
      const error = new Error(contestMessages.notFound);
      error.statusCode = 404;
      throw error;
    }

    return await contestRepository.getLeaderboard(contestId, pagination);
  }
}

/**
 * Clone Contest Use Case
 */
class CloneContestUseCase {
  async execute(contestId, newSlug, newTitle, userId) {
    // Get source contest with all problems
    const sourceContest = await contestRepository.findById(contestId);
    if (!sourceContest) {
      const error = new Error(contestMessages.notFound);
      error.statusCode = 404;
      throw error;
    }

    // Check if new slug already exists
    if (await contestRepository.slugExists(newSlug)) {
      const error = new Error('Contest with this slug already exists');
      error.statusCode = 400;
      throw error;
    }

    // Create new contest with same properties
    const newContestData = {
      title: newTitle || `${sourceContest.title} (Copy)`,
      slug: newSlug,
      description: sourceContest.description,
      startTime: sourceContest.startTime,
      endTime: sourceContest.endTime,
      duration: sourceContest.duration,
      type: sourceContest.type,
      status: contestStatus.draft, // Always start as draft
      rules: sourceContest.rules,
      prizes: sourceContest.prizes,
      maxParticipants: sourceContest.maxParticipants,
      registrationDeadline: sourceContest.registrationDeadline,
      isPublic: sourceContest.isPublic,
      createdBy: userId
    };

    const newContestId = uuidv4();
    await contestRepository.create({
      id: newContestId,
      ...newContestData
    });

    // Clone all problems with same order and points
    if (sourceContest.problems && sourceContest.problems.length > 0) {
      for (const problem of sourceContest.problems) {
        await contestRepository.addProblem(newContestId, problem.problemId, {
          points: problem.points,
          bonusPoints: problem.bonusPoints,
          orderIndex: problem.orderIndex
        });
      }
    }

    return await contestRepository.findById(newContestId);
  }
}

const cloneContestUseCase = new CloneContestUseCase();

// Export instantiated use cases
export const createContestUseCase = new CreateContestUseCase();
export const updateContestUseCase = new UpdateContestUseCase();
export const deleteContestUseCase = new DeleteContestUseCase();
export const getContestUseCase = new GetContestUseCase();
export const getContestsUseCase = new GetContestsUseCase();
export const addProblemToContestUseCase = new AddProblemToContestUseCase();
export const removeProblemFromContestUseCase = new RemoveProblemFromContestUseCase();
export const updateContestStatusUseCase = new UpdateContestStatusUseCase();
export const getContestParticipantsUseCase = new GetContestParticipantsUseCase();
export const getContestLeaderboardUseCase = new GetContestLeaderboardUseCase();
export { cloneContestUseCase };
