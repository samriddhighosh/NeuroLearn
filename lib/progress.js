import { supabase } from "./supabase";

// ─── XP VALUES ────────────────────────────────────────
const XP = {
  subsection:  10,
  lesson:      25,
  course:     100,
  dailyStreak: 15,
};

// ─── COMPLETE A SUBSECTION ────────────────────────────
export async function completeSubsection(userId, subsectionId, lessonId, courseId) {
  // 1. mark subsection complete
  const { error } = await supabase.from("user_progress").upsert({
    user_id:       userId,
    subsection_id: subsectionId,
    completed:     true,
    completed_at:  new Date().toISOString(),
  }, { onConflict: "user_id,subsection_id" });

  if (error) throw error;

  let totalXP = XP.subsection;
  const events = [{ user_id: userId, source: "subsection_complete", amount: XP.subsection }];

  // 2. check if this completed the whole lesson
  const lessonDone = await checkLessonComplete(userId, lessonId);
  if (lessonDone) {
    totalXP += XP.lesson;
    events.push({ user_id: userId, source: "lesson_complete", amount: XP.lesson });
  }

  // 3. check if this completed the whole course
  const { data: courseCheck } = await supabase
    .rpc("check_course_complete", { uid: userId, cid: courseId });
  if (courseCheck) {
    totalXP += XP.course;
    events.push({ user_id: userId, source: "course_complete", amount: XP.course });
  }

  // 4. log all XP events + update profile in parallel
  await Promise.all([
    supabase.from("xp_events").insert(events),
    supabase.rpc("increment_xp", { uid: userId, amount: totalXP }),
  ]);

  return { totalXP, lessonDone, courseDone: !!courseCheck };
}

// ─── CHECK LESSON COMPLETE ────────────────────────────
async function checkLessonComplete(userId, lessonId) {
  const { data: allSubs } = await supabase
    .from("subsections")
    .select("id")
    .eq("lesson_id", lessonId);

  const { data: doneSubs } = await supabase
    .from("user_progress")
    .select("subsection_id")
    .eq("user_id", userId)
    .eq("completed", true)
    .in("subsection_id", allSubs.map(s => s.id));

  return doneSubs?.length === allSubs?.length;
}

// ─── DAILY LOGIN STREAK ───────────────────────────────
export async function logDailyStreak(userId) {
  const today = new Date().toISOString().split("T")[0];

  // check if already logged today
  const { data: existing } = await supabase
    .from("streak_log")
    .select("date")
    .eq("user_id", userId)
    .eq("date", today)
    .single();

  if (existing) return { streak: null, xpAwarded: 0 }; // already done today

  // log today
  await supabase.from("streak_log")
    .upsert({ user_id: userId, date: today }, { onConflict: "user_id,date" });

  // count consecutive days
  const { data: logs } = await supabase
    .from("streak_log")
    .select("date")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  let streak = 0;
  let cursor = new Date();
  for (const row of logs ?? []) {
    const diff = Math.round((cursor - new Date(row.date)) / 86400000);
    if (diff > 1) break;
    streak++;
    cursor = new Date(row.date);
  }

  // award streak XP + update profile
  await Promise.all([
    supabase.from("xp_events").insert({
      user_id: userId, source: "daily_streak", amount: XP.dailyStreak
    }),
    supabase.rpc("increment_xp", { uid: userId, amount: XP.dailyStreak }),
    supabase.from("profiles").update({ streak, last_active: today }).eq("id", userId),
  ]);

  return { streak, xpAwarded: XP.dailyStreak };
}

// ─── FETCH PROFILE (XP + tier) ────────────────────────
export async function fetchProfile(userId) {
  const { data } = await supabase
    .from("profiles")
    .select("xp, tier, streak, display_name, avatar_url")
    .eq("id", userId)
    .single();
  return data;
}