/**
 * @fileoverview Portal Editorial Controller
 * Handles HTTP requests for editorial and hint endpoints
 * Thin layer - delegates business logic to services
 */

import editorialService from '../../../services/portal/editorial.service.js';
import { editorialPortalMessages, submissionMessages, portalMessages } from '../../../constant/portalMessages.js';
import prismaClient from '../../../library/database/prismaClient.js';

/**
 * Get editorial for a problem
 * GET /api/portal/editorials/:problemId
 */
async function getEditorial(req, res) {
  try {
    const { problemId } = req.params;

    // Check if problem exists and is public
    const problem = await prismaClient.problem.findUnique({
      where: { id: problemId },
      select: { id: true, isPublic: true },
    });

    if (!problem || !problem.isPublic) {
      return res.status(404).json({
        success: false,
        message: submissionMessages.problemNotFound,
      });
    }

    const editorial = await editorialService.getEditorialByProblemId(problemId);

    return res.status(200).json({
      success: true,
      message: editorialPortalMessages.editorialFetchedSuccess,
      data: editorial,
    });
  } catch (error) {
    console.error('Error fetching editorial:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || portalMessages.internalError,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

/**
 * Get hints for a problem (without content)
 * GET /api/portal/editorials/:problemId/hints
 */
async function getHints(req, res) {
  try {
    const { problemId } = req.params;

    // Check if problem exists and is public
    const problem = await prismaClient.problem.findUnique({
      where: { id: problemId },
      select: { id: true, isPublic: true },
    });

    if (!problem || !problem.isPublic) {
      return res.status(404).json({
        success: false,
        message: submissionMessages.problemNotFound,
      });
    }

    const hints = await editorialService.getHintsByProblemId(problemId);

    return res.status(200).json({
      success: true,
      message: editorialPortalMessages.hintsFetchedSuccess,
      data: {
        problemId,
        hints,
        count: hints.length,
      },
    });
  } catch (error) {
    console.error('Error fetching hints:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || portalMessages.internalError,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

/**
 * Unlock (get content of) a specific hint
 * GET /api/portal/hints/:hintId/unlock
 */
async function unlockHint(req, res) {
  try {
    const { hintId } = req.params;

    const hint = await editorialService.unlockHint(hintId);

    return res.status(200).json({
      success: true,
      message: editorialPortalMessages.hintUnlockedSuccess,
      data: hint,
    });
  } catch (error) {
    console.error('Error unlocking hint:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || portalMessages.internalError,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

export {
  getEditorial,
  getHints,
  unlockHint,
};

export default {
  getEditorial,
  getHints,
  unlockHint,
};
