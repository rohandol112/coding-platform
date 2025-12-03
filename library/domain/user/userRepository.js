/**
 * @fileoverview User Repository - Data Access Layer
 * Handles all database operations for user management
 */

import prisma from '../../database/prismaClient.js';

/**
 * User Repository
 * Provides methods for user CRUD operations and queries
 */
class UserRepository {
  /**
   * Find user by ID with statistics
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} User object with submission and contest counts
   */
  async findById(userId) {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        phone: true,
        firstName: true,
        lastName: true,
        avatar: true,
        provider: true,
        role: true,
        isActive: true,
        isVerified: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            submissions: true,
            contestParticipations: true
          }
        }
      }
    });
  }

  /**
   * Find users with pagination and filters
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.role - Filter by role (USER, ADMIN, MODERATOR)
   * @param {boolean} params.isActive - Filter by active status
   * @param {string} params.search - Search term for email, username, name
   * @param {string} params.sortBy - Field to sort by
   * @param {string} params.sortOrder - Sort order (asc, desc)
   * @returns {Promise<Object>} Paginated users with metadata
   */
  async findMany({ page = 1, limit = 20, role, isActive, search, sortBy = 'createdAt', sortOrder = 'desc' }) {
    const skip = (page - 1) * limit;
    const where = {};

    if (role) {
      where.role = role;
    }

    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          username: true,
          phone: true,
          firstName: true,
          lastName: true,
          avatar: true,
          provider: true,
          role: true,
          isActive: true,
          isVerified: true,
          lastLoginAt: true,
          createdAt: true,
          _count: {
            select: {
              submissions: true,
              contestParticipations: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder }
      }),
      prisma.user.count({ where })
    ]);

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async update(userId, data) {
    return await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        username: true,
        phone: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        isVerified: true
      }
    });
  }

  async updateRole(userId, role) {
    return await this.update(userId, { role });
  }

  async updateStatus(userId, isActive) {
    return await this.update(userId, { isActive });
  }

  async delete(userId) {
    return await prisma.user.delete({
      where: { id: userId }
    });
  }

  async getStats() {
    const [totalUsers, activeUsers, verifiedUsers, roleDistribution] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { isVerified: true } }),
      prisma.user.groupBy({
        by: ['role'],
        _count: true
      })
    ]);

    return {
      totalUsers,
      activeUsers,
      verifiedUsers,
      roleDistribution: roleDistribution.reduce((acc, item) => {
        acc[item.role] = item._count;
        return acc;
      }, {})
    };
  }
}

export default new UserRepository();
