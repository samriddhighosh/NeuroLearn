import { updateMastery, updateRetention } from "./masteryUpdater";
import { calculateForgetting } from "./forgettingModel";
import {
  rankTopics,
  TopicProgress,
} from "./recommendationEngine";

/**
 * Run the multi-topic simulation for a user: each "session" we rank topics,
 * study the top-ranked one (update mastery + retention), advance time for others.
 * Returns the same topics array with updated masteries and forgetting probabilities.
 */
export function runSimulation(
  topics: TopicProgress[],
  sessions = 10
): TopicProgress[] {
  const retentionStrength: Record<string, number> = {};
  const daysSinceLastActivity: Record<string, number> = {};
  for (const t of topics) {
    retentionStrength[t.topicId] = 0.7;
    daysSinceLastActivity[t.topicId] = 0;
  }

  function recalcForgetting() {
    for (const t of topics) {
      t.forgettingProbability = calculateForgetting(
        retentionStrength[t.topicId],
        daysSinceLastActivity[t.topicId]
      );
    }
  }

  recalcForgetting();

  for (let session = 1; session <= sessions; session++) {
    const ranked = rankTopics([...topics]);
    const toStudy = ranked[0];
    const quizScore = 0.4 + Math.random() * 0.55;

    toStudy.mastery = updateMastery(toStudy.mastery, quizScore);
    retentionStrength[toStudy.topicId] = updateRetention(
      retentionStrength[toStudy.topicId],
      quizScore
    );
    daysSinceLastActivity[toStudy.topicId] = 0;

    for (const t of topics) {
      if (t.topicId !== toStudy.topicId) {
        daysSinceLastActivity[t.topicId] =
          (daysSinceLastActivity[t.topicId] ?? 0) +
          Math.floor(Math.random() * 3) +
          1;
      }
    }

    recalcForgetting();
  }

  return topics;
}

// CLI: run simulation when this file is executed directly
const defaultTopics: TopicProgress[] = [
  {
    topicId: "computational_neuroscience",
    mastery: 0.6,
    forgettingProbability: 0.4,
    difficultyComfort: 0.6,
    engagementScore: 0.8,
  },
  {
    topicId: "neurobiology",
    mastery: 0.3,
    forgettingProbability: 0.6,
    difficultyComfort: 0.5,
    engagementScore: 0.7,
  },
  {
    topicId: "cognitive_modeling",
    mastery: 0.8,
    forgettingProbability: 0.2,
    difficultyComfort: 0.9,
    engagementScore: 0.6,
  },
];

console.log("Initial Topics:", defaultTopics.map((t) => t.topicId));
let ranked = rankTopics([...defaultTopics]);
console.log("Initial Recommended Order:", ranked.map((t) => t.topicId));

const updated = runSimulation(
  defaultTopics.map((t) => ({ ...t })),
  10
);

console.log(
  "\nFinal Recommended Order:",
  rankTopics([...updated]).map((t) => t.topicId)
);
console.log(
  "Final Masteries:",
  Object.fromEntries(updated.map((t) => [t.topicId, t.mastery.toFixed(3)]))
);
