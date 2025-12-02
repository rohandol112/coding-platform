/**
 * Problem Service - Dashboard
 * Handles problem management operations for administrators
 */

const axios = require('axios');
const { problemMessages } = require('../../../constant/problem');

const prismaServiceUrl = process.env.PRISMA_SERVICE_URL || 'http://localhost:3001';

/**
 * Create a new problem
 */
const createProblem = async (problemData, createdBy) => {
  try {
    const response = await axios.post(
      `${prismaServiceUrl}/api/problems`,
      {
        ...problemData,
        createdBy,
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    return response.data;
  } catch (error) {
    console.error('Create problem error:', error.response?.data || error.message);
    
    if (error.response?.status === 409) {
      throw new Error(problemMessages.slugExists);
    }
    
    throw new Error(error.response?.data?.message || 'Failed to create problem');
  }
};

/**
 * Update problem
 */
const updateProblem = async (problemId, updateData, userId) => {
  try {
    const response = await axios.put(
      `${prismaServiceUrl}/api/problems/${problemId}`,
      updateData,
      { headers: { 'Content-Type': 'application/json' } }
    );

    return response.data;
  } catch (error) {
    console.error('Update problem error:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      throw new Error(problemMessages.notFound);
    }
    
    if (error.response?.status === 409) {
      throw new Error(problemMessages.slugExists);
    }
    
    throw new Error(error.response?.data?.message || 'Failed to update problem');
  }
};

/**
 * Delete problem
 */
const deleteProblem = async (problemId, userId) => {
  try {
    await axios.delete(`${prismaServiceUrl}/api/problems/${problemId}`);
  } catch (error) {
    console.error('Delete problem error:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      throw new Error(problemMessages.notFound);
    }
    
    if (error.response?.status === 409) {
      throw new Error(problemMessages.usedInContest);
    }
    
    throw new Error(error.response?.data?.message || 'Failed to delete problem');
  }
};

/**
 * Get problem by ID
 */
const getProblemById = async (problemId, includeTestCases = false) => {
  try {
    const params = includeTestCases ? '?includeTestCases=true' : '';
    const response = await axios.get(
      `${prismaServiceUrl}/api/problems/${problemId}${params}`
    );

    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(problemMessages.notFound);
    }
    throw new Error(error.response?.data?.message || 'Failed to get problem');
  }
};

/**
 * Get all problems with filters
 */
const getProblems = async (filters) => {
  try {
    const params = new URLSearchParams({
      page: filters.page?.toString() || '1',
      limit: filters.limit?.toString() || '20',
    });

    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.tags) params.append('tags', filters.tags);
    if (filters.search) params.append('search', filters.search);
    if (filters.isPublic !== undefined) params.append('isPublic', filters.isPublic.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await axios.get(
      `${prismaServiceUrl}/api/problems?${params.toString()}`
    );

    return response.data;
  } catch (error) {
    console.error('Get problems error:', error.response?.data || error.message);
    throw new Error(problemMessages.fetchProblemsFailed);
  }
};

/**
 * Add test case to problem
 */
const addTestCase = async (problemId, testCaseData, userId) => {
  try {
    const response = await axios.post(
      `${prismaServiceUrl}/api/problems/${problemId}/testcases`,
      testCaseData,
      { headers: { 'Content-Type': 'application/json' } }
    );

    return response.data;
  } catch (error) {
    console.error('Add test case error:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      throw new Error(problemMessages.notFound);
    }
    
    throw new Error(error.response?.data?.message || 'Failed to add test case');
  }
};

/**
 * Update test case
 */
const updateTestCase = async (testCaseId, updateData, userId) => {
  try {
    const response = await axios.put(
      `${prismaServiceUrl}/api/testcases/${testCaseId}`,
      updateData,
      { headers: { 'Content-Type': 'application/json' } }
    );

    return response.data;
  } catch (error) {
    console.error('Update test case error:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      throw new Error(problemMessages.testCaseNotFound);
    }
    
    throw new Error(error.response?.data?.message || 'Failed to update test case');
  }
};

/**
 * Delete test case
 */
const deleteTestCase = async (testCaseId, userId) => {
  try {
    await axios.delete(`${prismaServiceUrl}/api/testcases/${testCaseId}`);
  } catch (error) {
    console.error('Delete test case error:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      throw new Error(problemMessages.testCaseNotFound);
    }
    
    throw new Error(error.response?.data?.message || 'Failed to delete test case');
  }
};

/**
 * Get test cases for a problem
 */
const getTestCases = async (problemId, includeHidden = true) => {
  try {
    const params = includeHidden ? '?includeHidden=true' : '';
    const response = await axios.get(
      `${prismaServiceUrl}/api/problems/${problemId}/testcases${params}`
    );

    return response.data;
  } catch (error) {
    console.error('Get test cases error:', error.response?.data || error.message);
    throw new Error(problemMessages.fetchTestCasesFailed);
  }
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
