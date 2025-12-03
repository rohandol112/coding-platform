/**
 * @fileoverview Analytics Repository - Data Access Layer
 * Provides aggregated data for dashboard analytics and statistics
 */

import prisma from '../../database/prismaClient.js';

/**
 * Analytics Repository
 * Handles complex aggregation queries for analytics and reporting
 */
class AnalyticsRepository {
  /**
   * Get comprehensive dashboard statistics
   * @returns {Promise<Object>} Dashboard stats including users, problems, contests, submissions
   */
  async getDashboardStats() {
    const [
      totalUsers,
      activeUsers,
      totalProblems,
      publishedProblems,
      totalContests,
      activeContests,
      totalSubmissions,
      todaySubmissions,
      recentUsers,
      popularProblems,
      upcomingContests
    ] = await Promise.all([
      // User stats
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      
      // Problem stats
      prisma.problem.count(),
      prisma.problem.count({ where: { isPublic: true } }),
      
      // Contest stats
      prisma.contest.count(),
      prisma.contest.count({ where: { status: 'RUNNING' } }),
      
      // Submission stats
      prisma.submission.count(),
      prisma.submission.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),
      
      // Recent users (last 5)
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          createdAt: true
        }
      }),
      
      // Popular problems (most submissions)
      prisma.problem.findMany({
        take: 5,
        orderBy: {
          submissions: {
            _count: 'desc'
          }
        },
        select: {
          id: true,
          title: true,
          slug: true,
          difficulty: true,
          _count: {
            select: {
              submissions: true
            }
          }
        }
      }),
      
      // Upcoming contests
      prisma.contest.findMany({
        where: {
          startTime: {
            gte: new Date()
          }
        },
        take: 5,
        orderBy: { startTime: 'asc' },
        select: {
          id: true,
          title: true,
          slug: true,
          startTime: true,
          endTime: true,
          duration: true
        }
      })
    ]);

    return {
      users: {
        total: totalUsers,
        active: activeUsers
      },
      problems: {
        total: totalProblems,
        published: publishedProblems
      },
      contests: {
        total: totalContests,
        active: activeContests
      },
      submissions: {
        total: totalSubmissions,
        today: todaySubmissions
      },
      recentUsers,
      popularProblems,
      upcomingContests
    };
  }

  async getSubmissionStats({ startDate, endDate }) {
    const where = {};
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [totalSubmissions, statusDistribution, languageDistribution] = await Promise.all([
      prisma.submission.count({ where }),
      
      prisma.submission.groupBy({
        by: ['status'],
        where,
        _count: true
      }),
      
      prisma.submission.groupBy({
        by: ['language'],
        where,
        _count: true
      })
    ]);

    return {
      total: totalSubmissions,
      byStatus: statusDistribution.reduce((acc, item) => {
        acc[item.status] = item._count;
        return acc;
      }, {}),
      byLanguage: languageDistribution.reduce((acc, item) => {
        acc[item.language] = item._count;
        return acc;
      }, {})
    };
  }

  async getProblemStats() {
    const [difficultyDistribution, tagDistribution] = await Promise.all([
      prisma.problem.groupBy({
        by: ['difficulty'],
        _count: true
      }),
      
      // Get all problems with tags
      prisma.problem.findMany({
        where: {
          tags: {
            isEmpty: false
          }
        },
        select: {
          tags: true
        }
      })
    ]);

    // Count tag occurrences
    const tagCounts = {};
    tagDistribution.forEach(problem => {
      problem.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    return {
      byDifficulty: difficultyDistribution.reduce((acc, item) => {
        acc[item.difficulty] = item._count;
        return acc;
      }, {}),
      byTag: tagCounts
    };
  }
}

export default new AnalyticsRepository();
