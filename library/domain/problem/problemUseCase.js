/**
 * @fileoverview Problem Use Cases - Business Logic
 * Core domain logic for problem operations
 */

const { v4: uuidv4 } = require('uuid');
const problemRepository = require('./problemRepository');
const { problemMessages, problemLimits, testCaseLimits } = require('../../../constant/problem');

/**
 * Create Problem Use Case
 */
class CreateProblemUseCase {
  constructor({ eventPublisher } = {}) {
    this.eventPublisher = eventPublisher;
  }

  async execute(data, createdBy) {
    // Business Rule: Validate title length
    if (data.title.length > problemLimits.titleMaxLength) {
      throw new Error(problemMessages.titleTooLong);
    }

    // Business Rule: Validate description length
    if (data.description && data.description.length > problemLimits.descriptionMaxLength) {
      throw new Error(problemMessages.descriptionTooLong);
    }

    // Business Rule: Validate tags count
    if (data.tags && data.tags.length > problemLimits.maxTags) {
      throw new Error(problemMessages.tooManyTags);
    }

    // Business Rule: Slug uniqueness
    if (data.slug && await problemRepository.slugExists(data.slug)) {
      const error = new Error(problemMessages.slugExists);
      error.statusCode = 409;
      throw error;
    }

    // Business Rule: Time limit must be positive
    if (data.timeLimit <= 0) {
      throw new Error(problemMessages.invalidTimeLimit);
    }

    // Business Rule: Memory limit must be positive
    if (data.memoryLimit <= 0) {
      throw new Error(problemMessages.invalidMemoryLimit);
    }

    const problemId = uuidv4();
    const problem = await problemRepository.create({
      id: problemId,
      ...data,
      createdBy,
      createdAt: new Date(),
    });

    // Publish domain event
    if (this.eventPublisher) {
      await this.eventPublisher.publishProblemCreated({
        problemId: problem.id,
        title: problem.title,
        slug: problem.slug,
        difficulty: problem.difficulty,
        createdBy,
        timestamp: new Date().toISOString(),
      });
    }

    return problem;
  }
}

/**
 * Update Problem Use Case
 */
class UpdateProblemUseCase {
  async execute(problemId, data, userId) {
    const problem = await problemRepository.findById(problemId);

    if (!problem) {
      const error = new Error(problemMessages.notFound);
      error.statusCode = 404;
      throw error;
    }

    // Business Rule: Validate title length if provided
    if (data.title && data.title.length > problemLimits.titleMaxLength) {
      throw new Error(problemMessages.titleTooLong);
    }

    // Business Rule: Validate description length if provided
    if (data.description && data.description.length > problemLimits.descriptionMaxLength) {
      throw new Error(problemMessages.descriptionTooLong);
    }

    // Business Rule: Validate tags count if provided
    if (data.tags && data.tags.length > problemLimits.maxTags) {
      throw new Error(problemMessages.tooManyTags);
    }

    // Business Rule: Slug uniqueness if being updated
    if (data.slug && data.slug !== problem.slug) {
      if (await problemRepository.slugExists(data.slug, problemId)) {
        const error = new Error(problemMessages.slugExists);
        error.statusCode = 409;
        throw error;
      }
    }

    // Business Rule: Time limit must be positive if provided
    if (data.timeLimit !== undefined && data.timeLimit <= 0) {
      throw new Error(problemMessages.invalidTimeLimit);
    }

    // Business Rule: Memory limit must be positive if provided
    if (data.memoryLimit !== undefined && data.memoryLimit <= 0) {
      throw new Error(problemMessages.invalidMemoryLimit);
    }

    return await problemRepository.update(problemId, {
      ...data,
      updatedAt: new Date(),
    });
  }
}

/**
 * Delete Problem Use Case
 */
class DeleteProblemUseCase {
  async execute(problemId, userId) {
    const problem = await problemRepository.findById(problemId);

    if (!problem) {
      const error = new Error(problemMessages.notFound);
      error.statusCode = 404;
      throw error;
    }

    // Business Rule: Cannot delete problem if used in contests
    if (await problemRepository.isUsedInContest(problemId)) {
      const error = new Error(problemMessages.usedInContest);
      error.statusCode = 409;
      throw error;
    }

    await problemRepository.deleteById(problemId);
  }
}

/**
 * Get Problem Use Case
 */
class GetProblemUseCase {
  async execute(problemId, options = {}) {
    const problem = await problemRepository.findById(problemId, options);

    if (!problem) {
      const error = new Error(problemMessages.notFound);
      error.statusCode = 404;
      throw error;
    }

    return problem;
  }
}

/**
 * Get Problems Use Case
 */
class GetProblemsUseCase {
  async execute(filters) {
    return await problemRepository.findMany(filters);
  }
}

/**
 * Add Test Case Use Case
 */
class AddTestCaseUseCase {
  async execute(problemId, testCaseData, userId) {
    const problem = await problemRepository.findById(problemId);

    if (!problem) {
      const error = new Error(problemMessages.notFound);
      error.statusCode = 404;
      throw error;
    }

    // Business Rule: Maximum test cases limit
    const currentCount = await problemRepository.countTestCases(problemId);
    if (currentCount >= testCaseLimits.maxTestCases) {
      throw new Error(problemMessages.maxTestCasesReached);
    }

    // Business Rule: Validate input length
    if (testCaseData.input && testCaseData.input.length > testCaseLimits.inputMaxLength) {
      throw new Error(problemMessages.inputTooLarge);
    }

    // Business Rule: Validate output length
    if (testCaseData.output && testCaseData.output.length > testCaseLimits.outputMaxLength) {
      throw new Error(problemMessages.outputTooLarge);
    }

    // Business Rule: Points must be non-negative
    if (testCaseData.points < 0) {
      throw new Error(problemMessages.invalidPoints);
    }

    const testCaseId = uuidv4();
    return await problemRepository.createTestCase({
      id: testCaseId,
      problemId,
      ...testCaseData,
      createdAt: new Date(),
    });
  }
}

/**
 * Update Test Case Use Case
 */
class UpdateTestCaseUseCase {
  async execute(testCaseId, data, userId) {
    const testCase = await problemRepository.findTestCaseById(testCaseId);

    if (!testCase) {
      const error = new Error(problemMessages.testCaseNotFound);
      error.statusCode = 404;
      throw error;
    }

    // Business Rule: Validate input length if provided
    if (data.input && data.input.length > testCaseLimits.inputMaxLength) {
      throw new Error(problemMessages.inputTooLarge);
    }

    // Business Rule: Validate output length if provided
    if (data.output && data.output.length > testCaseLimits.outputMaxLength) {
      throw new Error(problemMessages.outputTooLarge);
    }

    // Business Rule: Points must be non-negative if provided
    if (data.points !== undefined && data.points < 0) {
      throw new Error(problemMessages.invalidPoints);
    }

    return await problemRepository.updateTestCase(testCaseId, {
      ...data,
      updatedAt: new Date(),
    });
  }
}

/**
 * Delete Test Case Use Case
 */
class DeleteTestCaseUseCase {
  async execute(testCaseId, userId) {
    const testCase = await problemRepository.findTestCaseById(testCaseId);

    if (!testCase) {
      const error = new Error(problemMessages.testCaseNotFound);
      error.statusCode = 404;
      throw error;
    }

    await problemRepository.deleteTestCase(testCaseId);
  }
}

/**
 * Get Test Cases Use Case
 */
class GetTestCasesUseCase {
  async execute(problemId, includeHidden = true) {
    const problem = await problemRepository.findById(problemId);

    if (!problem) {
      const error = new Error(problemMessages.notFound);
      error.statusCode = 404;
      throw error;
    }

    return await problemRepository.getTestCases(problemId, includeHidden);
  }
}

module.exports = {
  CreateProblemUseCase,
  UpdateProblemUseCase,
  DeleteProblemUseCase,
  GetProblemUseCase,
  GetProblemsUseCase,
  AddTestCaseUseCase,
  UpdateTestCaseUseCase,
  DeleteTestCaseUseCase,
  GetTestCasesUseCase,
};
