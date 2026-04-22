import { updateMastery, updateRetention } from "./masteryUpdater";
import { calculateForgetting } from "./forgettingModel";
import { rankTopics, type TopicProgress } from "./recommendationEngine";

export interface ProfileTopic {
  topicId: string;
  mastery: number;
  retentionStrength?: number;
  forgettingProbability: number;
  lastActivity?: number;
  difficultyComfort?: number;
  engagementScore?: number;
}

export interface LearningProfile {
  userId: string;
  topics: ProfileTopic[];
  globalTraits?: Record<string, unknown>;
}

/**
 * Process a quiz submission: update mastery and retention for the topic,
 * recalculate forgetting for all topics, re-rank, and return the updated
 * profile plus the next recommended topic.
 *
 * Backend: fetch profile → call processQuiz(profile, topicId, quizScore) → save updated profile.
 */
export function processQuiz(
  profile: LearningProfile,
  topicId: string,
  quizScore: number
): { updatedProfile: LearningProfile; nextTopic: string | undefined } {
  const topic = profile.topics.find((t) => t.topicId === topicId);
  if (!topic) {
    return { updatedProfile: profile, nextTopic: undefined };
  }

  topic.mastery = updateMastery(topic.mastery, quizScore);
  topic.retentionStrength = updateRetention(
    topic.retentionStrength ?? 0.6,
    quizScore
  );
  topic.lastActivity = Date.now();

  profile.topics.forEach((t) => {
    const lastActivity = t.lastActivity ?? Date.now();
    const daysSince =
      (Date.now() - lastActivity) / (1000 * 60 * 60 * 24);
    t.forgettingProbability = calculateForgetting(
      t.retentionStrength ?? 0.6,
      Math.max(0, daysSince)
    );
  });

  const forRanking: TopicProgress[] = profile.topics.map((t) => ({
    topicId: t.topicId,
    mastery: t.mastery,
    forgettingProbability: t.forgettingProbability,
    difficultyComfort: t.difficultyComfort ?? 0.5,
    engagementScore: t.engagementScore ?? 0.5,
  }));
  const ranked = rankTopics(forRanking);

  return {
    updatedProfile: profile,
    nextTopic: ranked[0]?.topicId,
  };
}

/**
 * Create an empty learning profile for a new user.
 * Backend can call this after signup and persist to the database.
 */
export function initializeProfile(userId: string): LearningProfile {
  return {
    userId,
    topics: [],
    globalTraits: {},
  };
}
