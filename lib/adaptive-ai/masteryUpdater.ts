export function updateMastery(
  currentMastery: number,
  quizScore: number
): number {
  const learningRate = 0.15;

  const updated =
    currentMastery +
    learningRate * (quizScore - currentMastery);

  return Math.max(0, Math.min(1, updated));
}

export function updateRetention(
  currentRetention: number,
  quizScore: number
): number {
  const retentionRate = 0.05;

  const updated =
    currentRetention +
    retentionRate * (quizScore - currentRetention);

  return Math.max(0.1, Math.min(1, updated));
}
