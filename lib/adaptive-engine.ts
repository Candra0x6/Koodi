import { prisma } from './prisma/client';

/**
 * ELO RATING SYSTEM
 * Tracks user ability over time using Elo rating algorithm
 * Based on chess rating system, adapted for adaptive learning
 */

const ELO_K_FACTOR = 32; // Controls rating volatility
const BASE_ELO = 1200; // Starting rating
const ELO_MIN = 400;
const ELO_MAX = 2800;

/**
 * Calculate expected win probability based on rating difference
 * Used in Elo calculations
 */
export function calculateExpectedScore(
  playerRating: number,
  opponentRating: number
): number {
  const ratingDiff = opponentRating - playerRating;
  return 1 / (1 + Math.pow(10, ratingDiff / 400));
}

/**
 * Update player Elo rating after a match
 * @param playerRating Current player rating
 * @param opponentRating Question difficulty rating
 * @param result 1 = win (correct), 0 = loss (incorrect), 0.5 = partial
 * @returns New player rating
 */
export function updateEloRating(
  playerRating: number,
  opponentRating: number,
  result: number
): number {
  const expectedScore = calculateExpectedScore(playerRating, opponentRating);
  const newRating = playerRating + ELO_K_FACTOR * (result - expectedScore);

  // Clamp rating between min and max
  return Math.max(ELO_MIN, Math.min(ELO_MAX, newRating));
}

/**
 * QUESTION DIFFICULTY RATING
 * Calculate question difficulty based on attempt statistics
 */
export function calculateQuestionDifficulty(
  timesCorrect: number,
  timesAnswered: number,
  currentDifficulty: number
): number {
  if (timesAnswered === 0) return currentDifficulty;

  const successRate = timesCorrect / timesAnswered;

  // Adjust difficulty based on success rate
  // 50% success = maintain difficulty
  // >50% success = lower difficulty
  // <50% success = increase difficulty
  const adjustment = (0.5 - successRate) * 400;
  const newDifficulty = currentDifficulty + adjustment;

  return Math.max(ELO_MIN, Math.min(ELO_MAX, newDifficulty));
}

/**
 * DIFFICULTY TARGETING
 * Calculate optimal difficulty range for user
 * Target questions that are challenging but achievable (~50% success rate)
 */
export function calculateTargetDifficultyRange(
  userRating: number,
  variance: number = 100
): { min: number; max: number } {
  return {
    min: userRating - variance,
    max: userRating + variance,
  };
}

/**
 * QUESTION POOL FILTERING
 * Filter questions based on multiple criteria
 */
export interface FilterCriteria {
  userId: string;
  difficulty?: { min: number; max: number };
  excludeQuestionIds?: string[];
  topic?: string;
  questionType?: string;
  limit?: number;
}

export async function filterQuestionPool(criteria: FilterCriteria) {
  const {
    userId,
    difficulty,
    excludeQuestionIds = [],
    topic,
    questionType,
    limit = 5,
  } = criteria;

  // Get weak concepts for this user
  const weakConcepts = await prisma.weakConcept.findMany({
    where: { userId },
    select: { conceptId: true },
  });

  const weakConceptIds = weakConcepts.map((wc) => wc.conceptId);

  // Build query
  let query: any = {
    NOT: excludeQuestionIds.length > 0 ? { id: { in: excludeQuestionIds } } : {},
  };

  // Apply difficulty filter
  if (difficulty) {
    query.targetEloMin = { lte: difficulty.max };
    query.targetEloMax = { gte: difficulty.min };
  }

  // Apply topic filter
  if (topic) {
    query.tags = { has: topic };
  }

  // Apply question type filter
  if (questionType) {
    query.questionType = questionType;
  }

  const questions = await prisma.question.findMany({
    where: query,
    take: limit,
    select: {
      id: true,
      prompt: true,
      codeSnippet: true,
      difficulty: true,
      questionType: true,
      tags: true,
      targetEloMin: true,
      targetEloMax: true,
    },
  });

  return {
    questions,
    weakConceptCount: weakConceptIds.length,
    availableCount: questions.length,
  };
}

/**
 * WEAK CONCEPT TRACKING
 * Identify concepts user struggles with
 */
export async function trackWeakConcept(
  userId: string,
  conceptId: string,
  isCorrect: boolean
) {
  if (isCorrect) {
    // Remove from weak concepts if user gets it right
    await prisma.weakConcept.deleteMany({
      where: { userId, conceptId },
    });
    return { action: 'removed' };
  }

  // Find or create weak concept
  const existing = await prisma.weakConcept.findUnique({
    where: {
      userId_conceptId: { userId, conceptId },
    },
  });

  if (existing) {
    // Increment failure count
    const updated = await prisma.weakConcept.update({
      where: {
        userId_conceptId: { userId, conceptId },
      },
      data: {
        failureCount: { increment: 1 },
        lastFailedDate: new Date(),
        recommendedReview: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h later
      },
    });
    return { action: 'incremented', failureCount: updated.failureCount };
  }

  // Create new weak concept
  const created = await prisma.weakConcept.create({
    data: {
      userId,
      conceptId,
      failureCount: 1,
      lastFailedDate: new Date(),
      recommendedReview: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  return { action: 'created', failureCount: created.failureCount };
}

/**
 * PICK NEXT QUESTION ALGORITHM
 * Select the optimal question based on user ability and weak concepts
 */
export async function pickNextQuestion(userId: string) {
  // Get user's current Elo rating
  const masteryLevel = await prisma.masteryLevel.findFirst({
    where: { userId },
    orderBy: { eloRating: 'desc' },
  });

  const userElo = masteryLevel?.eloRating ?? BASE_ELO;

  // Calculate target difficulty range
  const targetRange = calculateTargetDifficultyRange(userElo);

  // Get questions user has already attempted recently
  const recentAttempts = await prisma.questionAttempt.findMany({
    where: {
      userId,
      createdAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
      },
    },
    select: { questionId: true },
    take: 50,
  });

  const recentQuestionIds = recentAttempts.map((a) => a.questionId);

  // Get weak concepts to prioritize
  const weakConcepts = await prisma.weakConcept.findMany({
    where: {
      userId,
      recommendedReview: { lte: new Date() },
    },
    orderBy: { failureCount: 'desc' },
    take: 3,
  });

  // Try to find a question matching weak concepts first
  if (weakConcepts.length > 0) {
    const weakConceptTags = weakConcepts.map((wc) => wc.conceptId);

    const weakConceptQuestion = await prisma.question.findFirst({
      where: {
        tags: { hasSome: weakConceptTags },
        id: { notIn: recentQuestionIds },
        targetEloMin: { lte: targetRange.max },
        targetEloMax: { gte: targetRange.min },
      },
      orderBy: { timesAnswered: 'asc' }, // Prefer less-seen questions
    });

    if (weakConceptQuestion) {
      return weakConceptQuestion;
    }
  }

  // Otherwise, find a question in target difficulty range
  const targetQuestion = await prisma.question.findFirst({
    where: {
      id: { notIn: recentQuestionIds },
      targetEloMin: { lte: targetRange.max },
      targetEloMax: { gte: targetRange.min },
    },
    orderBy: [
      { timesAnswered: 'asc' }, // Prefer less-seen questions
      { difficulty: 'asc' }, // Then by difficulty
    ],
  });

  return targetQuestion || null;
}

/**
 * PROCESS ANSWER SUBMISSION
 * Update user ability, track weak concepts, update question stats
 */
export async function processAnswerSubmission(
  userId: string,
  questionId: string,
  isCorrect: boolean,
  timeSpent: number
) {
  const question = await prisma.question.findUnique({
    where: { id: questionId },
  });

  if (!question) {
    throw new Error('Question not found');
  }

  // Get user's mastery level
  let masteryLevel = await prisma.masteryLevel.findUnique({
    where: {
      userId_skillId: {
        userId,
        skillId: question.tags[0] || 'general',
      },
    },
  });

  if (!masteryLevel) {
    // Create default mastery level
    masteryLevel = await prisma.masteryLevel.create({
      data: {
        userId,
        skillId: question.tags[0] || 'general',
        eloRating: BASE_ELO,
      },
    });
  }

  // Update Elo rating
  const userCurrentElo = masteryLevel.eloRating;
  const questionDifficulty =
    question.targetEloMax && question.targetEloMin
      ? (question.targetEloMax + question.targetEloMin) / 2
      : 1200;

  const result = isCorrect ? 1 : 0;
  const newUserElo = updateEloRating(userCurrentElo, questionDifficulty, result);

  // Update question difficulty based on attempts
  const newQuestionDifficulty = calculateQuestionDifficulty(
    isCorrect ? question.timesCorrect + 1 : question.timesCorrect,
    question.timesAnswered + 1,
    question.targetEloMin || 1200
  );

  // Track weak concept if incorrect
  await trackWeakConcept(userId, question.tags[0] || 'general', isCorrect);

  // Update all entities in transaction
  const [updatedMastery, updatedQuestion] = await Promise.all([
    prisma.masteryLevel.update({
      where: {
        userId_skillId: {
          userId,
          skillId: question.tags[0] || 'general',
        },
      },
      data: {
        eloRating: newUserElo,
        totalAttempts: { increment: 1 },
        correctAnswers: isCorrect ? { increment: 1 } : undefined,
        accuracy: {
          set: isCorrect
            ? ((masteryLevel.correctAnswers + 1) /
                (masteryLevel.totalAttempts + 1)) *
              100
            : (masteryLevel.correctAnswers / (masteryLevel.totalAttempts + 1)) *
              100,
        },
        lastPracticedDate: new Date(),
      },
    }),
    prisma.question.update({
      where: { id: questionId },
      data: {
        timesAnswered: { increment: 1 },
        timesCorrect: isCorrect ? { increment: 1 } : undefined,
        targetEloMin: Math.round(newQuestionDifficulty - 100),
        targetEloMax: Math.round(newQuestionDifficulty + 100),
      },
    }),
  ]);

  const xpEarned = isCorrect ? 10 : 0;

  return {
    userElo: {
      previous: userCurrentElo,
      current: newUserElo,
      change: newUserElo - userCurrentElo,
    },
    questionDifficulty: {
      previous: question.targetEloMin || 1200,
      current: Math.round(newQuestionDifficulty),
    },
    xpEarned,
    isCorrect,
  };
}

/**
 * INITIALIZE USER ABILITY
 * Create initial mastery level for new user
 */
export async function initializeUserAbility(userId: string) {
  return prisma.masteryLevel.create({
    data: {
      userId,
      skillId: 'general',
      eloRating: BASE_ELO,
      status: 'not_started',
    },
  });
}

/**
 * GET USER ABILITY SUMMARY
 * Retrieve user's current ability across all skills
 */
export async function getUserAbilitySummary(userId: string) {
  const masteryLevels = await prisma.masteryLevel.findMany({
    where: { userId },
  });

  const weakConcepts = await prisma.weakConcept.findMany({
    where: { userId },
  });

  const avgElo =
    masteryLevels.length > 0
      ? masteryLevels.reduce((sum, m) => sum + m.eloRating, 0) /
        masteryLevels.length
      : BASE_ELO;

  return {
    userId,
    averageElo: Math.round(avgElo),
    skillCount: masteryLevels.length,
    weakConceptCount: weakConcepts.length,
    masteryLevels: masteryLevels.map((m) => ({
      skillId: m.skillId,
      elo: Math.round(m.eloRating),
      accuracy: m.accuracy,
      attempts: m.totalAttempts,
      correct: m.correctAnswers,
    })),
    weakConcepts: weakConcepts.map((wc) => ({
      conceptId: wc.conceptId,
      failureCount: wc.failureCount,
      needsReview: wc.recommendedReview ? wc.recommendedReview <= new Date() : false,
    })),
  };
}
