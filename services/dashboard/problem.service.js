/**
 * Problem Service - Dashboard
 * Thin wrapper that delegates to domain use cases
 */

const {
  CreateProblemUseCase,
  UpdateProblemUseCase,
  DeleteProblemUseCase,
  GetProblemUseCase,
  GetProblemsUseCase,
  AddTestCaseUseCase,
  UpdateTestCaseUseCase,
  DeleteTestCaseUseCase,
  GetTestCasesUseCase,
} = require('../../library/domain/problem/problemUseCase');
const kafkaService = require('../messaging/kafkaService');

// Initialize use cases with dependencies
const createProblemUseCase = new CreateProblemUseCase({ eventPublisher: kafkaService });
const updateProblemUseCase = new UpdateProblemUseCase();
const deleteProblemUseCase = new DeleteProblemUseCase();
const getProblemUseCase = new GetProblemUseCase();
const getProblemsUseCase = new GetProblemsUseCase();
const addTestCaseUseCase = new AddTestCaseUseCase();
const updateTestCaseUseCase = new UpdateTestCaseUseCase();
const deleteTestCaseUseCase = new DeleteTestCaseUseCase();
const getTestCasesUseCase = new GetTestCasesUseCase();

/**
 * Create a new problem (delegates to use case)
 */
const createProblem = async (problemData, createdBy) => {
  return await createProblemUseCase.execute(problemData, createdBy);
};

/**
 * Update problem (delegates to use case)
 */
const updateProblem = async (problemId, updateData, userId) => {
  return await updateProblemUseCase.execute(problemId, updateData, userId);
};

/**
 * Delete problem (delegates to use case)
 */
const deleteProblem = async (problemId, userId) => {
  return await deleteProblemUseCase.execute(problemId, userId);
};

/**
 * Get problem by ID (delegates to use case)
 */
const getProblemById = async (problemId, includeTestCases = false) => {
  return await getProblemUseCase.execute(problemId, { includeTestCases });
};

/**
 * Get all problems with filters (delegates to use case)
 */
const getProblems = async (filters) => {
  return await getProblemsUseCase.execute(filters);
};

/**
 * Add test case to problem (delegates to use case)
 */
const addTestCase = async (problemId, testCaseData, userId) => {
  return await addTestCaseUseCase.execute(problemId, testCaseData, userId);
};

/**
 * Update test case (delegates to use case)
 */
const updateTestCase = async (testCaseId, updateData, userId) => {
  return await updateTestCaseUseCase.execute(testCaseId, updateData, userId);
};

/**
 * Delete test case (delegates to use case)
 */
const deleteTestCase = async (testCaseId, userId) => {
  return await deleteTestCaseUseCase.execute(testCaseId, userId);
};

/**
 * Get test cases for a problem (delegates to use case)
 */
const getTestCases = async (problemId, includeHidden = true) => {
  return await getTestCasesUseCase.execute(problemId, includeHidden);
};

module.exports = {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemById,
  getProblems,
  addTestCase,
  updateTestCase,
  deleteTestCase,
  getTestCases,
};
