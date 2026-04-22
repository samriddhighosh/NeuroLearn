export interface TopicProgress {
  topicId: string;
  mastery: number;
  forgettingProbability: number;
  difficultyComfort: number;
  engagementScore: number;
}

export function calculateRecommendationScore(
  topic: TopicProgress
): number {
  return (
    (1 - topic.mastery) * 0.4 +
    topic.forgettingProbability * 0.3 +
    (1 - topic.difficultyComfort) * 0.2 +
    topic.engagementScore * 0.1
  );
}

export function rankTopics(
  topics: TopicProgress[]
): TopicProgress[] {
  return topics.sort(
    (a, b) =>
      calculateRecommendationScore(b) -
      calculateRecommendationScore(a)
  );
}
