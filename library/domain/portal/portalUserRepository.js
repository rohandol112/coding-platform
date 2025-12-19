/**
 * @fileoverview Portal User Repository - User Profile Data Access
 * Contains database operations for portal (user-facing) user profile endpoints
 */

import prismaClient from '../../database/prismaClient.js';

/**
 * Get public user profile by username
 * @param {string} username - Username
 * @returns {Promise<Object|null>} Public profile or null
 */
async function getPublicProfile(username) {
  const user = await prismaClient.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      firstName: true,
      lastName: true,
      avatar: true,
      createdAt: true,
      _count: {
        select: {
          submissions: true,
          contestParticipations: true,
        },
      },
    },
  });

  if (!user) return null;

  // Get submission statistics
  const [
    acceptedSubmissions,
    problemsSolved,
    difficultyStats,
    recentActivity,
  ] = await Promise.all([
    prismaClient.submission.count({
      where: { userId: user.id, status: 'ACCEPTED' },
    }),
    prismaClient.submission.findMany({
      where: { userId: user.id, status: 'ACCEPTED' },
      distinct: ['problemId'],
      select: { problemId: true },
    }),
    // Get problems solved by difficulty
    prismaClient.$queryRaw`
      SELECT p.difficulty, COUNT(DISTINCT s."problemId") as count
      FROM submissions s
      JOIN problems p ON s."problemId" = p.id
      WHERE s."userId" = ${user.id}
      AND s.status = 'ACCEPTED'
      GROUP BY p.difficulty
    `,
    // Recent submissions
    prismaClient.submission.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        status: true,
        language: true,
        createdAt: true,
        problem: {
          select: {
            title: true,
            slug: true,
            difficulty: true,
          },
        },
      },
    }),
  ]);

  // Format difficulty stats
  const difficultyBreakdown = {
    EASY: 0,
    MEDIUM: 0,
    HARD: 0,
  };
  difficultyStats.forEach((stat) => {
    difficultyBreakdown[stat.difficulty] = parseInt(stat.count);
  });

  return {
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: user.avatar,
    memberSince: user.createdAt,
    statistics: {
      problemsSolved: problemsSolved.length,
      totalSubmissions: user._count.submissions,
      acceptedSubmissions,
      contestsParticipated: user._count.contestParticipations,
      easyProblems: difficultyBreakdown.EASY,
      mediumProblems: difficultyBreakdown.MEDIUM,
      hardProblems: difficultyBreakdown.HARD,
    },
    recentSubmissions: recentActivity.map(s => ({
      problemTitle: s.problem.title,
      problemSlug: s.problem.slug,
      difficulty: s.problem.difficulty,
      status: s.status,
      language: s.language,
      createdAt: s.createdAt,
    })),
  };
}

/**
 * Get global leaderboard
 * @param {Object} options - Options
 * @returns {Promise<Object>} Leaderboard
 */
async function getGlobalLeaderboard({ page = 1, limit = 50, timeframe = 'ALL_TIME' } = {}) {
  const skip = (page - 1) * Math.min(limit, 100);
  const take = Math.min(limit, 100);

  // Build date filter based on timeframe
  let dateFilter = {};
  const now = new Date();
  if (timeframe === 'WEEKLY') {
    dateFilter = {
      createdAt: { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) },
    };
  } else if (timeframe === 'MONTHLY') {
    dateFilter = {
      createdAt: { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) },
    };
  }

  // Get all distinct accepted submissions with problem difficulty in a single query (fixes N+1)
  const acceptedSubmissions = await prismaClient.submission.findMany({
    where: {
      status: 'ACCEPTED',
      ...dateFilter,
      user: {
        isActive: true,
        role: 'USER',
      },
    },
    distinct: ['userId', 'problemId'],
    select: {
      userId: true,
      problem: {
        select: {
          difficulty: true,
        },
      },
    },
  });

  // Build user scores map from submissions
  const userScoresMap = new Map();
  for (const submission of acceptedSubmissions) {
    const { userId, problem } = submission;
    if (!userScoresMap.has(userId)) {
      userScoresMap.set(userId, { userId, totalScore: 0, problemsSolved: 0 });
    }
    const entry = userScoresMap.get(userId);
    entry.problemsSolved += 1;
    if (problem?.difficulty === 'EASY') entry.totalScore += 100;
    else if (problem?.difficulty === 'MEDIUM') entry.totalScore += 200;
    else if (problem?.difficulty === 'HARD') entry.totalScore += 300;
  }

  // Get user details for users with scores
  const userIdsWithScores = Array.from(userScoresMap.keys());
  const usersWithDetails = await prismaClient.user.findMany({
    where: {
      id: { in: userIdsWithScores },
      isActive: true,
      role: 'USER',
    },
    select: {
      id: true,
      username: true,
      firstName: true,
      lastName: true,
      avatar: true,
      _count: {
        select: {
          contestParticipations: true,
        },
      },
    },
  });

  // Combine user details with scores
  const userScores = usersWithDetails.map((user) => {
    const scoreData = userScoresMap.get(user.id) || { totalScore: 0, problemsSolved: 0 };
    return {
      user: {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
      },
      problemsSolved: scoreData.problemsSolved,
      totalScore: scoreData.totalScore,
      contestsParticipated: user._count.contestParticipations,
    };
  });

  // Sort by score and apply pagination
  userScores.sort((a, b) => b.totalScore - a.totalScore || b.problemsSolved - a.problemsSolved);
  
  const total = userScores.length;
  const paginatedScores = userScores.slice(skip, skip + take);

  // Add ranks
  const leaderboard = paginatedScores.map((entry, index) => ({
    rank: skip + index + 1,
    ...entry,
  }));

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
 * Get user's current profile (authenticated user)
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} Full profile
 */
async function getCurrentUserProfile(userId) {
  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      phone: true,
      firstName: true,
      lastName: true,
      avatar: true,
      role: true,
      isActive: true,
      isVerified: true,
      provider: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });

  if (!user) return null;

  // Get detailed statistics
  const [
    totalSubmissions,
    acceptedSubmissions,
    problemsSolved,
    contestsParticipated,
    recentSubmissions,
  ] = await Promise.all([
    prismaClient.submission.count({ where: { userId } }),
    prismaClient.submission.count({ 
      where: { userId, status: 'ACCEPTED' } 
    }),
    prismaClient.submission.findMany({
      where: { userId, status: 'ACCEPTED' },
      distinct: ['problemId'],
      select: { problemId: true },
    }),
    prismaClient.contestParticipant.count({ where: { userId } }),
    prismaClient.submission.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        status: true,
        language: true,
        createdAt: true,
        problem: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
    }),
  ]);

  return {
    ...user,
    statistics: {
      totalSubmissions,
      acceptedSubmissions,
      problemsSolved: problemsSolved.length,
      contestsParticipated,
      acceptanceRate: totalSubmissions > 0 
        ? Math.round((acceptedSubmissions / totalSubmissions) * 100 * 10) / 10
        : 0,
    },
    recentSubmissions,
  };
}

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated user
 */
async function updateProfile(userId, data) {
  const allowedFields = ['firstName', 'lastName', 'avatar'];
  const updateData = {};
  
  allowedFields.forEach(field => {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  });

  return await prismaClient.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      username: true,
      email: true,
      firstName: true,
      lastName: true,
      avatar: true,
    },
  });
}

/**
 * Get user's submission calendar (activity heatmap)
 * @param {string} userId - User ID
 * @param {number} months - Number of months back
 * @returns {Promise<Array>} Activity data
 */
async function getActivityCalendar(userId, months = 12) {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  const submissions = await prismaClient.submission.findMany({
    where: {
      userId,
      createdAt: { gte: startDate },
    },
    select: {
      createdAt: true,
      status: true,
    },
  });

  // Group by date
  const activityMap = {};
  submissions.forEach(s => {
    const dateKey = s.createdAt.toISOString().split('T')[0];
    if (!activityMap[dateKey]) {
      activityMap[dateKey] = { total: 0, accepted: 0 };
    }
    activityMap[dateKey].total++;
    if (s.status === 'ACCEPTED') {
      activityMap[dateKey].accepted++;
    }
  });

  return Object.entries(activityMap).map(([date, data]) => ({
    date,
    submissions: data.total,
    accepted: data.accepted,
  }));
}

/**
 * Get user's global rank
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Rank info
 */
async function getUserRank(userId) {
  // Get total active users count
  const totalUsers = await prismaClient.user.count({
    where: { isActive: true, role: 'USER' },
  });

  if (totalUsers === 0) {
    return {
      globalRank: null,
      totalUsers: 0,
      score: 0,
      problemsSolved: 0,
      percentile: 0,
    };
  }

  // Fetch all distinct accepted problems per active user in a single query (fixes N+1)
  const acceptedSubmissions = await prismaClient.submission.findMany({
    where: {
      status: 'ACCEPTED',
      user: {
        isActive: true,
        role: 'USER',
      },
    },
    distinct: ['userId', 'problemId'],
    select: {
      userId: true,
      problem: {
        select: {
          difficulty: true,
        },
      },
    },
  });

  // Aggregate scores and problems solved per user
  const scoreMap = new Map();
  for (const submission of acceptedSubmissions) {
    const { userId: uid, problem } = submission;
    let entry = scoreMap.get(uid);
    if (!entry) {
      entry = { userId: uid, score: 0, problemsSolved: 0 };
      scoreMap.set(uid, entry);
    }
    entry.problemsSolved += 1;
    if (problem?.difficulty === 'EASY') entry.score += 100;
    else if (problem?.difficulty === 'MEDIUM') entry.score += 200;
    else if (problem?.difficulty === 'HARD') entry.score += 300;
  }

  const userScores = Array.from(scoreMap.values());
  
  // Sort by score desc, then problemsSolved desc
  userScores.sort((a, b) => b.score - a.score || b.problemsSolved - a.problemsSolved);

  // Find the requested user's entry
  let userIndex = userScores.findIndex((u) => u.userId === userId);
  let userEntry = userIndex >= 0 ? userScores[userIndex] : null;

  // If user has no solved problems but is an active USER, place them after all others
  if (userIndex < 0) {
    const activeUser = await prismaClient.user.findFirst({
      where: { id: userId, isActive: true, role: 'USER' },
      select: { id: true },
    });
    if (activeUser) {
      userIndex = userScores.length;
      userEntry = { userId, score: 0, problemsSolved: 0 };
    }
  }

  const hasRank = userIndex >= 0;
  const globalRank = hasRank ? userIndex + 1 : null;
  const denominator = totalUsers || userScores.length || 1;
  const percentile = hasRank
    ? Math.round((1 - userIndex / denominator) * 100 * 10) / 10
    : 0;

  return {
    globalRank,
    totalUsers,
    score: userEntry?.score || 0,
    problemsSolved: userEntry?.problemsSolved || 0,
    percentile,
  };
}

export default {
  getPublicProfile,
  getGlobalLeaderboard,
  getCurrentUserProfile,
  updateProfile,
  getActivityCalendar,
  getUserRank,
};

export {
  getPublicProfile,
  getGlobalLeaderboard,
  getCurrentUserProfile,
  updateProfile,
  getActivityCalendar,
  getUserRank,
};
