import { inngest } from "../client";
import { supabase } from "../../lib/supabase";
import { processQuiz, initializeProfile } from "../../lib/adaptive-ai/processQuiz";

export const processQuizAttempt = inngest.createFunction(
  { id: "process-quiz-attempt" },
  { event: "quiz/attempt.created" },
  async ({ event, step }) => {
    const { user_id, subsection_id, course_id, correct, question } = event.data;

    // 1. fetch or create learning profile
    const learningProfile = await step.run("fetch-learning-profile", async () => {
      const { data } = await supabase
        .from("learning_profiles")
        .select("*")
        .eq("user_id", user_id)
        .single();

      if (data) {
        return { userId: user_id, topics: data.topics, globalTraits: data.global_traits };
      }

      // first time — initialize
      const fresh = initializeProfile(user_id);
      await supabase.from("learning_profiles").insert({
        user_id,
        topics:        fresh.topics,
        global_traits: fresh.globalTraits,
      });
      return fresh;
    });

    // 2. get topic slug from subsection
    const topicId = await step.run("fetch-topic-id", async () => {
      const { data } = await supabase
        .from("subsections")
        .select("lessons(modules(slug))")
        .eq("id", subsection_id)
        .single();
      return data?.lessons?.modules?.slug ?? subsection_id.toString();
    });

    // 3. ensure topic exists in profile
    const quizScore = correct ? 1 : 0;
    if (!learningProfile.topics.find(t => t.topicId === topicId)) {
      learningProfile.topics.push({
        topicId,
        mastery:              0.5,
        retentionStrength:    0.6,
        forgettingProbability: 0.5,
        lastActivity:         Date.now(),
        difficultyComfort:    0.5,
        engagementScore:      0.5,
      });
    }

    // 4. run the adaptive engine
    const { updatedProfile, nextTopic } = await step.run("run-adaptive-engine", async () => {
      return processQuiz(learningProfile, topicId, quizScore);
    });

    // 5. save updated profile
    await step.run("save-profile", async () => {
      await supabase.from("learning_profiles").upsert({
        user_id,
        topics:        updatedProfile.topics,
        global_traits: updatedProfile.globalTraits ?? {},
        updated_at:    new Date().toISOString(),
      }, { onConflict: "user_id" });
    });

    // 6. save struggle insight if mastery is low
    await step.run("save-insights", async () => {
      const topic = updatedProfile.topics.find(t => t.topicId === topicId);
      if (topic && topic.mastery < 0.4) {
        const { data: sub } = await supabase
          .from("subsections").select("title").eq("id", subsection_id).single();

        await supabase.from("study_insights").upsert({
          user_id,
          type: "struggle",
          payload: {
            subsection_id,
            subsection_title: sub?.title,
            course_id,
            mastery:          Math.round(topic.mastery * 100),
            forgetting:       Math.round(topic.forgettingProbability * 100),
          },
        }, { onConflict: "user_id,type" });
      }
    });

    return { nextTopic, updatedProfile };
  }
);