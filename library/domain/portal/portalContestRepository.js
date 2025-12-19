/**
 * @fileoverview Portal Contest Repository - Public Contest Data Access
 * Contains database operations for portal (user-facing) contest endpoints
 */

import prismaClient from '../../database/prismaClient.js';

/**
 * Find public contests with filters and pagination
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} Paginated contests
 */
async function findPublicContests(filters = {}) {
  const {
    page = 1,
    limit = 20,
    status,
    type,
    search,
    sortBy = 'startTime',
    sortOrder = 'desc',
  } = filters;

  const where = {
    isPublic: true,
  };
  
  if (status) where.status = status;
  if (type) where.type = type;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const skip = (page - 1) * Math.min(limit, 100);
  const take = Math.min(limit, 100);
  const orderBy = { [sortBy]: sortOrder };

  const [contests, total] = await Promise.all([
    prismaClient.contest.findMany({
      where,
      skip,
      take,
      orderBy,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        startTime: true,
        endTime: true,
        duration: true,
        type: true,
        status: true,
        maxParticipants: true,
        registrationDeadline: true,
        createdAt: true,
        _count: {
          select: {
            participants: true,
            problems: true,
          },
        },
      },
    }),
    prismaClient.contest.count({ where }),
  ]);

  const contestsFormatted = contests.map(contest => ({
    ...contest,
    participantCount: contest._count.participants,
    problemCount: contest._count.problems,
    _count: undefined,
  }));

  return {
    contests: contestsFormatted,
    pagination: {
      page,
      limit: take,
      total,
      totalPages: Math.ceil(total / take),
    },
  };
}

/**
 * Find public contest by slug with details
 * @param {string} slug - Contest slug
 * @param {string} userId - Optional user ID to check registration
 * @returns {Promise<Object|null>} Contest or null
 */
async function findPublicContestBySlug(slug, userId = null) {
  const contest = await prismaClient.contest.findFirst({
    where: {
      slug,
      isPublic: true,
    },
    include: {
      _count: {
        select: {
          participants: true,
          problems: true,
        },
      },
    },
  });

  if (!contest) return null;

  // Check if user is registered
  let isRegistered = false;
  let userParticipation = null;
  if (userId) {
    userParticipation = await prismaClient.contestParticipant.findUnique({
      where: {
        contestId_userId: {
          contestId: contest.id,
          userId,
        },
      },
    });
    isRegistered = !!userParticipation;
  }

  // Get problems only if contest is running/ended or user is registered
  let problems = [];
  const now = new Date();
  const contestStarted = new Date(contest.startTime) <= now;
  
  if (contestStarted || isRegistered) {
    problems = await prismaClient.contestProblem.findMany({
      where: { contestId: contest.id },
      orderBy: { orderIndex: 'asc' },
      include: {
        problem: {
          select: {
            id: true,
            title: true,
            slug: true,
            difficulty: true,
            timeLimit: true,
            memoryLimit: true,
          },
        },
      },
    });

    // Get solve count for each problem
    problems = await Promise.all(
      problems.map(async (cp) => {
        const solvedCount = await prismaClient.submission.count({
          where: {
            problemId: cp.problemId,
            contestId: contest.id,
            status: 'ACCEPTED',
          },
          distinct: ['userId'],
        });

        return {
          problemId: cp.problemId,
          title: cp.problem.title,
          slug: cp.problem.slug,
          difficulty: cp.problem.difficulty,
          points: cp.points,
          bonusPoints: cp.bonusPoints,
          orderIndex: cp.orderIndex,
          timeLimit: cp.problem.timeLimit,
          memoryLimit: cp.problem.memoryLimit,
          solvedCount,
        };
      })
    );
  }

  return {
    id: contest.id,
    title: contest.title,
    slug: contest.slug,
    description: contest.description,
    startTime: contest.startTime,
    endTime: contest.endTime,
    duration: contest.duration,
    type: contest.type,
    status: contest.status,
    rules: contest.rules,
    prizes: contest.prizes,
    maxParticipants: contest.maxParticipants,
    registrationDeadline: contest.registrationDeadline,
    participantCount: contest._count.participants,
    problemCount: contest._count.problems,
    problems,
    isRegistered,
    userRank: userParticipation?.rank || null,
    userScore: userParticipation?.score || 0,
  };
}

/**
 * Register user for contest
 * @param {string} contestId - Contest ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Participation record
 */
async function registerForContest(contestId, userId) {
  return await prismaClient.contestParticipant.create({
    data: {
      contestId,
      userId,
      registeredAt: new Date(),
    },
    include: {
      contest: {
        select: {
          title: true,
          startTime: true,
        },
      },
    },
  });
}

/**
 * Check if user is registered for contest
 * @param {string} contestId - Contest ID
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} True if registered
 */
async function isUserRegistered(contestId, userId) {
  const participation = await prismaClient.contestParticipant.findUnique({
    where: {
      contestId_userId: {
        contestId,
        userId,
      },
    },
  });
  return !!participation;
}

/**
 * Unregister user from contest
 * @param {string} contestId - Contest ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Deleted participation record
 */
async function unregisterFromContest(contestId, userId) {
  return await prismaClient.contestParticipant.delete({
    where: {
      contestId_userId: {
        contestId,
        userId,
      },
    },
  });
}

/**
 * Get contest leaderboard
 * @param {string} contestId - Contest ID
 * @param {Object} pagination - Pagination options
 * @returns {Promise<Object>} Paginated leaderboard
 */
async function getContestLeaderboard(contestId, { page = 1, limit = 100 } = {}) {
  const skip = (page - 1) * Math.min(limit, 200);
  const take = Math.min(limit, 200);

  const [participants, total] = await Promise.all([
    prismaClient.contestParticipant.findMany({
      where: { 
        contestId,
        isDisqualified: false,
      },
      skip,
      take,
      orderBy: [
        { score: 'desc' },
        { penalty: 'asc' },
        { lastSubmissionAt: 'asc' },
      ],
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    }),
    prismaClient.contestParticipant.count({
      where: { 
        contestId,
        isDisqualified: false,
      },
    }),
  ]);

  // Calculate ranks
  const leaderboard = participants.map((p, index) => ({
    rank: skip + index + 1,
    user: p.user,
    score: p.score,
    penalty: p.penalty,
    problemsSolved: 0, // Will be calculated
    lastSubmissionAt: p.lastSubmissionAt,
  }));

  // Get problems solved count for each participant in a single query (fixes N+1)
  const userIds = leaderboard.map((entry) => entry.user.id);
  if (userIds.length > 0) {
    const solvedSubmissions = await prismaClient.submission.findMany({
      where: {
        contestId,
        status: 'ACCEPTED',
        userId: { in: userIds },
      },
      distinct: ['userId', 'problemId'],
      select: {
        userId: true,
      },
    });
    
    // Count solved problems per user
    const solvedCountsByUser = new Map();
    for (const submission of solvedSubmissions) {
      const current = solvedCountsByUser.get(submission.userId) || 0;
      solvedCountsByUser.set(submission.userId, current + 1);
    }
    
    // Apply counts to leaderboard entries
    for (const entry of leaderboard) {
      entry.problemsSolved = solvedCountsByUser.get(entry.user.id) || 0;
    }
  }

  return {
    leaderboard,
    pagination: {
      page,
      limit: take,
      total,
      totalPages: Math.ceil(total / take),
    },
  };
}

/**
 * Get upcoming contests
 * @param {number} limit - Max number of contests
 * @returns {Promise<Array>} Upcoming contests
 */
async function getUpcomingContests(limit = 5) {
  return await prismaClient.contest.findMany({
    where: {
      isPublic: true,
      status: { in: ['SCHEDULED', 'DRAFT'] },
      startTime: { gt: new Date() },
    },
    orderBy: { startTime: 'asc' },
    take: limit,
    select: {
      id: true,
      title: true,
      slug: true,
      startTime: true,
      duration: true,
      type: true,
      _count: {
        select: { participants: true },
      },
    },
  });
}

/**
 * Get running contests
 * @returns {Promise<Array>} Running contests
 */
async function getRunningContests() {
  return await prismaClient.contest.findMany({
    where: {
      isPublic: true,
      status: 'RUNNING',
    },
    orderBy: { endTime: 'asc' },
    select: {
      id: true,
      title: true,
      slug: true,
      startTime: true,
      endTime: true,
      duration: true,
      type: true,
      _count: {
        select: { 
          participants: true,
          problems: true,
        },
      },
    },
  });
}

/**
 * Get user's registered contests
 * @param {string} userId - User ID
 * @param {Object} pagination - Pagination options
 * @returns {Promise<Object>} User's contests
 */
async function getUserContests(userId, { page = 1, limit = 20 } = {}) {
  const skip = (page - 1) * limit;

  const [participations, total] = await Promise.all([
    prismaClient.contestParticipant.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { registeredAt: 'desc' },
      include: {
        contest: {
          select: {
            id: true,
            title: true,
            slug: true,
            startTime: true,
            endTime: true,
            status: true,
            type: true,
          },
        },
      },
    }),
    prismaClient.contestParticipant.count({
      where: { userId },
    }),
  ]);

  return {
    contests: participations.map(p => ({
      ...p.contest,
      rank: p.rank,
      score: p.score,
      registeredAt: p.registeredAt,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Update participant score
 * @param {string} contestId - Contest ID
 * @param {string} userId - User ID
 * @param {Object} data - Score data
 * @returns {Promise<Object>} Updated participation
 */
async function updateParticipantScore(contestId, userId, data) {
  return await prismaClient.contestParticipant.update({
    where: {
      contestId_userId: {
        contestId,
        userId,
      },
    },
    data: {
      score: data.score,
      penalty: data.penalty,
      lastSubmissionAt: data.lastSubmissionAt || new Date(),
    },
  });
}

export default {
  findPublicContests,
  findPublicContestBySlug,
  registerForContest,
  isUserRegistered,
  unregisterFromContest,
  getContestLeaderboard,
  getUpcomingContests,
  getRunningContests,
  getUserContests,
  updateParticipantScore,
};

export {
  findPublicContests,
  findPublicContestBySlug,
  registerForContest,
  isUserRegistered,
  unregisterFromContest,
  getContestLeaderboard,
  getUpcomingContests,
  getRunningContests,
  getUserContests,
  updateParticipantScore,
};
