import { supabase } from "./supabase";

export async function fetchLessons(moduleSlug) {
  const { data, error } = await supabase
    .from("modules")
    .select(`
      id, slug, title,
      lessons (
        id, title, position,
        subsections (
          id, title, position, body
        )
      )
    `)
    .eq("slug", moduleSlug)
    .single();

  if (error || !data) return null;

  // sort and shape into the format LessonPage already expects
  return data.lessons
    .sort((a, b) => a.position - b.position)
    .map((lesson, li) => ({
      id: lesson.id,
      title: lesson.title,
      expanded: li === 0,
      subsections: lesson.subsections
        .sort((a, b) => a.position - b.position)
        .map((sub, si) => ({
          id: sub.id,
          title: sub.title,
          body: sub.body,           // ✅ real content from Supabase
          completed: false,
          selected: li === 0 && si === 0,
        })),
    }));
}