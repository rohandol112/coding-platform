/**
 * @fileoverview Submission Admin Repository - Data Access Layer
 * Provides admin-level access to all submissions for monitoring and management
 */

import prisma from '../../database/prismaClient.js';

/**
 * Submission Admin Repository
 * Handles submission queries with enhanced filtering for admin dashboard
 */
class SubmissionAdminRepository {
  /**
   * Find submissions with advanced filtering and pagination
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Paginated submissions with user and problem details
   */
  async findMany({ page = 1, limit = 20, userId, problemId, status, language, startDate, endDate, sortBy = 'createdAt', sortOrder = 'desc' }) {
    const skip = (page - 1) * limit;
    const where = {};

    if (userId) where.userId = userId;
    if (problemId) where.problemId = problemId;
    if (status) where.status = status;
    if (language) where.language = language;
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [submissions, total] = await Promise.all([
      prisma.submission.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              username: true,
              firstName: true,
              lastName: true
            }
          },
          problem: {
            select: {
              id: true,
              title: true,
              slug: true,
              difficulty: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder }
      }),
      prisma.submission.count({ where })
    ]);

    return {
      submissions,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findById(submissionId) {
    return await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            firstName: true,
            lastName: true
          }
        },
        problem: {
          select: {
            id: true,
            title: true,
            slug: true,
            difficulty: true,
            timeLimit: true,
            memoryLimit: true
          }
        }
      }
    });
  }

  async delete(submissionId) {
    return await prisma.submission.delete({
      where: { id: submissionId }
    });
  }

  async updateStatus(submissionId, status) {
    return await prisma.submission.update({
      where: { id: submissionId },
      data: { 
        status,
        judgedAt: new Date()
      }
    });
  }
}

export default new SubmissionAdminRepository();
