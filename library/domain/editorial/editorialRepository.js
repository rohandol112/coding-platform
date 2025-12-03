/**
 * @fileoverview Editorial Repository - Data Access Layer
 * Manages problem editorials and hints for educational content
 */

import prisma from '../../database/prismaClient.js';

/**
 * Editorial Repository
 * Provides CRUD operations for problem editorials and associated hints
 */
class EditorialRepository {
  /**
   * Create a new editorial
   * @param {Object} data - Editorial data
   * @returns {Promise<Object>} Created editorial with hints
   */
  async create(data) {
    return await prisma.editorial.create({
      data,
      include: {
        hints: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    });
  }

  async findByProblemId(problemId) {
    return await prisma.editorial.findUnique({
      where: { problemId },
      include: {
        hints: {
          orderBy: { orderIndex: 'asc' }
        },
        problem: {
          select: {
            id: true,
            title: true,
            slug: true,
            difficulty: true
          }
        }
      }
    });
  }

  async findById(editorialId) {
    return await prisma.editorial.findUnique({
      where: { id: editorialId },
      include: {
        hints: {
          orderBy: { orderIndex: 'asc' }
        },
        problem: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        }
      }
    });
  }

  async update(editorialId, data) {
    return await prisma.editorial.update({
      where: { id: editorialId },
      data,
      include: {
        hints: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    });
  }

  async delete(editorialId) {
    return await prisma.editorial.delete({
      where: { id: editorialId }
    });
  }

  async exists(problemId) {
    const count = await prisma.editorial.count({
      where: { problemId }
    });
    return count > 0;
  }

  // Hint methods
  async createHint(editorialId, data) {
    return await prisma.hint.create({
      data: {
        ...data,
        editorialId
      }
    });
  }

  async findHintById(hintId) {
    return await prisma.hint.findUnique({
      where: { id: hintId }
    });
  }

  async getHints(editorialId) {
    return await prisma.hint.findMany({
      where: { editorialId },
      orderBy: { orderIndex: 'asc' }
    });
  }

  async updateHint(hintId, data) {
    return await prisma.hint.update({
      where: { id: hintId },
      data
    });
  }

  async deleteHint(hintId) {
    return await prisma.hint.delete({
      where: { id: hintId }
    });
  }

  async countHints(editorialId) {
    return await prisma.hint.count({
      where: { editorialId }
    });
  }
}

export default new EditorialRepository();
