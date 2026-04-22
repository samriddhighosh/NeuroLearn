# Adaptive AI — Learning profile intelligence

This module provides **pure logic** for mastery, retention, forgetting, and topic ranking. The backend fetches/saves the profile; this code only updates it.

---

## `processQuiz(profile, topicId, quizScore)`

Updates the user's profile after a quiz: adjusts mastery and retention for the completed topic, recalculates forgetting for all topics, and returns the updated profile plus the next recommended topic.

**Backend flow:** fetch user profile → call `processQuiz(profile, topicId, quizScore)` → save `updatedProfile` → optionally send email with `nextTopic`.

### INPUT

```ts
profile: {
  userId: string;
  topics: [
    {
      topicId: string;
      mastery: number;
      retentionStrength?: number;   // optional, defaults to 0.6
      forgettingProbability: number;
      lastActivity?: number;        // Unix ms (Date.now()); optional
      difficultyComfort?: number;   // optional for ranking
      engagementScore?: number;     // optional for ranking
    },
    ...
  ];
  globalTraits?: Record<string, unknown>;  // optional
}
topicId: string;   // topic that was quizzed
quizScore: number; // 0–1 (e.g. correctAnswers / totalQuestions)
```

### OUTPUT

```ts
{
  updatedProfile: LearningProfile;  // same shape as input profile, mutated
  nextTopic: string | undefined;    // topicId to recommend next, or undefined if none
}
```

### Example

```ts
import { processQuiz } from "./adaptive-ai/processQuiz";

const profile = await fetchProfileFromDb(userId);
const { updatedProfile, nextTopic } = processQuiz(profile, "neurobiology", 0.85);
await saveProfileToDb(updatedProfile);
if (nextTopic) {
  await sendEmail(userId, `Recommended next topic: ${nextTopic}`);
}
```

---

## `initializeProfile(userId)`

Returns a new empty learning profile for a user. Call after signup and persist to the database.

### INPUT

- `userId: string`

### OUTPUT

```ts
{
  userId: string;
  topics: [];
  globalTraits: {};
}
```

### Example

```ts
import { initializeProfile } from "./adaptive-ai/processQuiz";

const profile = initializeProfile(newUser.id);
await saveProfileToDb(profile);
```

---

## Integration summary

| Step | Who | Action |
|------|-----|--------|
| 1 | Backend | Fetch profile from DB (Supabase or other). |
| 2 | Backend | Call `processQuiz(profile, topicId, quizScore)`. |
| 3 | Backend | Save `updatedProfile` to DB. |
| 4 | Backend | Optionally send email / notification with `nextTopic`. |

No database access lives in this module; it only accepts a profile and returns an updated one.
