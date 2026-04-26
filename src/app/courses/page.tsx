"use client";
import React, { useState, useEffect } from "react";
import { Icon, TopNav, StatPills, CourseCard } from "../../components/Shared";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function CoursesPage({ onNavigate }) {
  const router = useRouter();
  const [courseTypes, setCourseTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/auth"); return; }
      const userId = session.user.id;

      // fetch all course types
      const { data: types } = await supabase
        .from("course_types")
        .select("*")
        .order("id");

      // fetch all courses with subsections for progress
      const { data: rawCourses } = await supabase
        .from("courses")
        .select(`*, modules ( lessons ( subsections ( id ) ) )`)
        .order("id");

      if (!rawCourses?.length || !types?.length) { setLoading(false); return; }

      // fetch user progress
      const { data: progressData } = await supabase
        .from("user_progress")
        .select("subsection_id")
        .eq("user_id", userId)
        .eq("completed", true);

      const completedIds = new Set(progressData?.map((p: any) => p.subsection_id) ?? []);

      // compute progress for each course first
      const withProgress = rawCourses.map((c: any) => {
        const allSubs = c.modules?.flatMap((m: any) =>
          m.lessons?.flatMap((l: any) => l.subsections ?? []) ?? []
        ) ?? [];
        const total = allSubs.length;
        const done  = allSubs.filter((s: any) => completedIds.has(s.id)).length;
        const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
        return { ...c, progress: pct };
      });

      // second pass — now withProgress exists so locked is safe
      const final = withProgress.map((c: any, i: number) => ({
        ...c,
        locked: i > 0 && withProgress[i - 1].progress < 100,
      }));

      // group courses under their course_type by matching category → type slug
      const grouped = types.map((t: any) => ({
        ...t,
        courses: final.filter((c: any) =>
          c.category?.toLowerCase() === t.slug?.toLowerCase()
        ),
      }));

      setCourseTypes(grouped);
      setLoading(false);
    }
    load();
  }, []);

  const totalProgress = courseTypes.length
    ? Math.round(
        courseTypes.flatMap(t => t.courses).reduce((a: number, c: any) => a + (c.progress ?? 0), 0) /
        Math.max(courseTypes.flatMap(t => t.courses).length, 1)
      )
    : 0;

  return (
    <div className="bg-white min-h-screen text-[#191919]"
      style={{ fontFamily: '"Avenir Next","Poppins","Segoe UI",sans-serif' }}>
      <TopNav activeTab="courses" onNavigate={onNavigate} />

      <div className="max-w-[1180px] mx-auto px-6 py-8">

        <div className="mb-7">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[#6e687f] mb-1.5 m-0">
            Course Library
          </p>
          <div className="flex items-start justify-between gap-5 flex-wrap">
            <h2 className="text-[1.6rem] font-extrabold tracking-[-0.03em] m-0 leading-snug">
              All courses
            </h2>
            <StatPills />
          </div>
          <div className="max-w-[760px] mt-5">
            <div className="flex justify-between mb-1.5">
              <span className="text-[12px] font-bold text-[#6e687f]">Overall progress</span>
              <span className="text-[12px] font-bold text-[#7b61d9]">{totalProgress}%</span>
            </div>
            <div className="h-2 bg-[#e9e7e8] rounded-full overflow-hidden">
              <div className="h-full bg-[#7257B1] rounded-full transition-all" style={{ width: `${totalProgress}%` }} />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col gap-10">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <div className="h-7 w-48 bg-[#f0ecf8] rounded-lg mb-4 animate-pulse" />
                <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="rounded-[18px] border border-[#e8e4f0] p-5 h-[220px] animate-pulse bg-[#faf9fc]" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {courseTypes.map(type => (
              <div key={type.id}>
                {/* clickable heading → pathway */}
                <button
                  onClick={() => router.push(`/pathways/${type.slug}`)}
                  className="flex items-center gap-2 mb-4 group bg-transparent border-none cursor-pointer p-0"
                >
                  <h3 className="text-[1.1rem] font-extrabold tracking-[-0.02em] m-0 text-[#1a1628] group-hover:text-[#7b61d9] transition-colors">
                    {type.title}
                  </h3>
                  <Icon type="chevR" size={18} color="#9490a8" />
                </button>

                {type.courses.length === 0 ? (
                  <p className="text-[13px] text-[#9490a8]">No courses yet.</p>
                ) : (
                  <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
                    {type.courses.map((c: any) => (
                      <CourseCard
                        key={c.id}
                        course={c}
                        onNavigate={() => router.push(`/lesson/${c.slug}`)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}