/**
 * @fileoverview Portal Editorial Service
 * Business logic for portal editorial operations
 * Delegates to repository for data access
 */

import portalEditorialRepository from '../../../library/domain/portal/portalEditorialRepository.js';
import { editorialPortalMessages } from '../../../constant/portalMessages.js';

/**
 * Get published editorial for a problem
 * @param {string} problemId - Problem ID
 * @returns {Promise<Object>} Editorial
 * @throws {Error} If editorial not found
 */
async function getEditorialByProblemId(problemId) {
  const editorial = await portalEditorialRepository.getEditorialByProblemId(problemId);

  if (!editorial) {
    const error = new Error(editorialPortalMessages.editorialNotFound);
    error.statusCode = 404;
    throw error;
  }

  return editorial;
}

/**
 * Get hints for a problem
 * @param {string} problemId - Problem ID
 * @returns {Promise<Array>} Hints without content
 */
async function getHintsByProblemId(problemId) {
  return await portalEditorialRepository.getHintsByProblemId(problemId);
}

/**
 * Unlock a hint (get hint with content)
 * @param {string} hintId - Hint ID
 * @returns {Promise<Object>} Hint with content
 * @throws {Error} If hint not found or not available
 */
async function unlockHint(hintId) {
  const hint = await portalEditorialRepository.getHintById(hintId);

  if (!hint) {
    const error = new Error(editorialPortalMessages.hintNotFound);
    error.statusCode = 404;
    throw error;
  }

  if (!hint.editorial?.isPublished) {
    const error = new Error(editorialPortalMessages.hintNotAvailable);
    error.statusCode = 403;
    throw error;
  }

  return {
    id: hint.id,
    content: hint.content,
    orderIndex: hint.orderIndex,
    penalty: hint.penalty,
  };
}

export default {
  getEditorialByProblemId,
  getHintsByProblemId,
  unlockHint,
};

export {
  getEditorialByProblemId,
  getHintsByProblemId,
  unlockHint,
};
