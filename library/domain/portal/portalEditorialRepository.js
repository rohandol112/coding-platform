/**
 * @fileoverview Portal Editorial Repository
 * Contains database operations for portal (user-facing) editorial endpoints
 */

import prismaClient from '../../database/prismaClient.js';

/**
 * Get published editorial for a problem
 * @param {string} problemId - Problem ID
 * @returns {Promise<Object|null>} Editorial or null
 */
async function getEditorialByProblemId(problemId) {
  return await prismaClient.editorial.findFirst({
    where: {
      problemId,
      isPublished: true,
    },
    select: {
      id: true,
      problemId: true,
      title: true,
      content: true,
      approach: true,
      complexity: true,
      codeExamples: true,
      relatedTopics: true,
      createdAt: true,
      problem: {
        select: {
          id: true,
          title: true,
          slug: true,
          difficulty: true,
        },
      },
    },
  });
}

/**
 * Get hints for a problem
 * @param {string} problemId - Problem ID
 * @returns {Promise<Array>} Hints
 */
async function getHintsByProblemId(problemId) {
  const editorial = await prismaClient.editorial.findFirst({
    where: {
      problemId,
      isPublished: true,
    },
    select: {
      id: true,
      hints: {
        orderBy: { orderIndex: 'asc' },
        select: {
          id: true,
          orderIndex: true,
          penalty: true,
          // Don't include content - user must request it separately
        },
      },
    },
  });

  if (!editorial) return [];
  return editorial.hints;
}

/**
 * Get single hint by ID (for unlocking)
 * @param {string} hintId - Hint ID
 * @returns {Promise<Object|null>} Hint with content
 */
async function getHintById(hintId) {
  return await prismaClient.hint.findUnique({
    where: { id: hintId },
    select: {
      id: true,
      content: true,
      orderIndex: true,
      penalty: true,
      editorial: {
        select: {
          isPublished: true,
          problemId: true,
        },
      },
    },
  });
}

/**
 * Track hint usage (for future - store unlocked hints per user)
 * This would need a new HintUsage model in schema
 * For now, hints are unlocked client-side
 */

export default {
  getEditorialByProblemId,
  getHintsByProblemId,
  getHintById,
};

export {
  getEditorialByProblemId,
  getHintsByProblemId,
  getHintById,
};
