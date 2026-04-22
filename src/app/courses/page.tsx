"use client";
import React, { useState } from "react";
import { Icon, TopNav, StatPills, CourseCard } from "../../components/Shared";
import LessonPage from "../lesson/[slug]/page";

export const COURSES = [
  { id: 1, slug: "neural-networks",       title: "Neural Networks",            topic: "How the brain wires itself",   category: "Neuroscience", difficulty: "Beginner",     icon: "network", progress: 75, xp: 240, lessons: 12, streak: true },
  { id: 2, slug: "synaptic-transmission", title: "Synaptic Transmission",      topic: "Signals across the gap",       category: "Biology",      difficulty: "Intermediate", icon: "pulse",   progress: 40, xp: 180, lessons: 9  },
  { id: 3, slug: "brain-plasticity",      title: "Brain Plasticity",           topic: "How learning rewires neurons", category: "Neuroscience", difficulty: "Intermediate", icon: "dna",     progress: 0,  xp: 280, lessons: 14 },
  { id: 4, slug: "neuro-engineering",     title: "Neuro-engineering",          topic: "Brain-computer interfaces",    category: "Engineering",  difficulty: "Advanced",     icon: "chip",    progress: 0,  xp: 360, lessons: 18 },
  { id: 5, slug: "computational-neuro",   title: "Computational Neuroscience", topic: "Math models of the brain",     category: "Science",      difficulty: "Advanced",     icon: "bars",    progress: 0,  xp: 440, lessons: 22 },
  { id: 6, slug: "neuro-economics",       title: "Neuro-economics",            topic: "Decision-making and reward",   category: "Economics",    difficulty: "Beginner",     icon: "flask",   progress: 0,  xp: 200, lessons: 10 },
];

const FILTERS = ["All", "Neuroscience", "Biology", "Engineering", "Science", "Economics"];

export default function CoursesPage({ onNavigate }) {
  const [filter, setFilter]             = useState("All");
  const [activeCourse, setActiveCourse] = useState(null);

  const filtered      = filter === "All" ? COURSES : COURSES.filter(c => c.category === filter);
  const totalProgress = Math.round(COURSES.reduce((a, c) => a + c.progress, 0) / COURSES.length);

  if (activeCourse) {
    return <LessonPage course={activeCourse} onBack={() => setActiveCourse(null)} onNavigate={onNavigate} />;
  }

  return (
    <div className="bg-white min-h-screen text-[#191919]" style={{ fontFamily: '"Avenir Next","Poppins","Segoe UI",sans-serif' }}>
      <TopNav activeTab="courses" onNavigate={onNavigate} />

      <div className="max-w-[1180px] mx-auto px-6 py-8">

        {/* header */}
        <div className="mb-7">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[#6e687f] mb-1.5 m-0">
            Course Library
          </p>
          <div className="flex items-start justify-between gap-5 flex-wrap">
            <h2 className="text-[1.6rem] font-extrabold tracking-[-0.03em] m-0 max-w-[38rem] leading-snug">
              Pick any course to open its dedicated pathway page.
            </h2>
            <StatPills />
          </div>

          {/* overall progress */}
          <div className="max-w-[760px] mt-5">
            <div className="flex justify-between mb-1.5">
              <span className="text-[12px] font-bold text-[#6e687f]">Overall progress</span>
              <span className="text-[12px] font-bold text-[#7b61d9]">{totalProgress}%</span>
            </div>
            <div className="h-5 bg-[#e9e7e8] rounded-full overflow-hidden">
              <div className="h-full bg-[#7257B1] rounded-full" style={{ width: `${totalProgress}%` }} />
            </div>
          </div>
        </div>

        <p className="text-[1.1rem] font-extrabold tracking-[-0.03em] mb-3.5">Neuro + AI Courses</p>

        {/* filters */}
        <div className="flex gap-2 flex-wrap mb-5">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={[
                "text-[13px] font-bold px-4 py-[7px] rounded-full border cursor-pointer transition-colors",
                filter === f
                  ? "bg-[#7257B1] text-white border-[#7257B1]"
                  : "bg-[#f5f4f7] text-[#3e3657] border-transparent hover:bg-[#efecf7]",
              ].join(" ")}
            >
              {f}
            </button>
          ))}
        </div>

        {/* grid — overflow-visible so no clipping */}
        <div className="grid gap-4 overflow-visible" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
          {filtered.map(c => (
            <CourseCard key={c.id} course={c} onNavigate={setActiveCourse} />
          ))}
        </div>

      </div>
    </div>
  );
}