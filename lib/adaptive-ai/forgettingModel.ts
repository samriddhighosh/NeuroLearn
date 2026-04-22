export function calculateForgetting(
  retentionStrength: number,
  daysSinceLastActivity: number
): number {
  const decayRate = 0.12;

  const forgetting =
    1 -
    retentionStrength *
      Math.exp(-decayRate * daysSinceLastActivity);

  return Math.max(0, Math.min(1, forgetting));
}
