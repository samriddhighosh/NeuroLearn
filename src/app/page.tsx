"use client";
import React, { useState, useEffect } from "react";  // ✅ add useEffect here
import { supabase } from "../../lib/supabase";  
import { Icon, TopNav, StatPills, CourseCard } from "../components/Shared";
import { useRouter } from "next/navigation";

const STARTER_COURSES = [
  { id: 1, slug: "neural-networks",       title: "Neural Networks",       topic: "How the brain wires itself",   category: "Neuroscience", icon: "network", progress: 75, xp: 240, lessons: 12, streak: true },
  { id: 2, slug: "synaptic-transmission", title: "Synaptic Transmission", topic: "Signals across the gap",       category: "Biology",      icon: "pulse",   progress: 40, xp: 180, lessons: 9  },
  { id: 3, slug: "brain-plasticity",      title: "Brain Plasticity",      topic: "How learning rewires neurons", category: "Neuroscience", icon: "dna",     progress: 0,  xp: 280, lessons: 14 },
  { id: 4, slug: "neuro-engineering",     title: "Neuro-engineering",     topic: "Brain-computer interfaces",    category: "Engineering",  icon: "chip",    progress: 0,  xp: 360, lessons: 18 },
];

const PATHWAY_LESSONS = [
  { title: "Neural Networks",       topic: "Foundations",        done: true  },
  { title: "Synaptic Transmission", topic: "Signal propagation", done: true  },
  { title: "Brain Plasticity",      topic: "Learning & memory",  done: true  },
  { title: "Neuro-engineering",     topic: "BCI interfaces",     done: true  },
  { title: "Neuro-economics",       topic: "Decision & reward",  done: false, active: true },
];

const ICONS_LIST = ["network", "pulse", "dna", "chip", "bars"];

function PathwaySidebar() {
  return (
    <div className="w-[280px] flex-shrink-0 bg-[#faf9fc] border border-[#e8e4f0] rounded-[18px] py-0 overflow-hidden">
      <div className="px-4 py-3.5 border-b border-[#e8e4f0]">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] bg-[#ffc84d] text-[#3a2d00] px-2.5 py-1 rounded-md">
          Learning Pathway
        </span>
      </div>
      <div className="flex flex-col gap-0 py-1">
        {PATHWAY_LESSONS.map((l, i) => (
          <div key={i} className={[
            "flex items-center gap-3 px-4 py-2.5 border-l-[3px] transition-colors",
            l.active ? "bg-[rgba(123,97,217,0.06)] border-[#7b61d9]" : "border-transparent",
          ].join(" ")}>
            <div className={[
              "w-9 h-9 rounded-[10px] flex-shrink-0 flex items-center justify-center border",
              l.done   ? "bg-[rgba(123,97,217,0.09)] border-[rgba(123,97,217,0.15)]"
              : l.active ? "bg-white border-[#ddd6ff]"
              : "bg-[#f5f4f7] border-[#e8e4f0]",
            ].join(" ")}>
              <Icon type={ICONS_LIST[i]} size={18} color={l.done || l.active ? "#7b61d9" : "#a5a0b7"} />
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-[13px] truncate ${l.active ? "font-bold text-[#1a1628]" : "font-medium text-[#3e3657]"}`}>{l.title}</div>
              <div className="text-[11px] text-[#a5a0b7] mt-0.5">{l.topic}</div>
            </div>
            {l.done
              ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7b61d9" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="8"/><path d="M8.8 12.2l2.1 2.2 4.3-4.8"/></svg>
              : l.active
              ? <svg width="18" height="18" viewBox="0 0 24 24" fill="#7b61d9" stroke="none"><path d="M8 5.5l11 6.5-11 6.5z"/></svg>
              : <div className="w-4 h-4 rounded-full border-[1.5px] border-[#e8e4f0] bg-white" />
            }
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroBanner({ course }) {
  return (
    <div className="flex-1 relative overflow-hidden rounded-[18px] border-[1.5px] border-[rgba(34,25,60,0.14)] bg-[#f8f5ff] px-8 py-10">
      <div className="absolute -top-8 -left-5 w-40 h-40 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(255,215,149,0.22), transparent 65%)" }} />
      <span className="relative text-[10px] font-bold uppercase tracking-[0.08em] bg-[#222] text-white px-2 py-1 rounded-md">
        Song O
      </span>
      <h3 className="relative text-[1.8rem] font-extrabold tracking-[-0.02em] mt-3.5 mb-1 text-[#191919] leading-[1.2] max-w-[22ch]">
        Continue with {course.title}
      </h3>
      <p className="relative text-[14px] text-[#6e687f] m-0">Goal: 45 mins</p>

      {/* progress dots */}
      <div className="flex flex-wrap gap-2.5 mt-5 relative">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className={[
            "w-9 h-9 rounded-full flex items-center justify-center border-[1.5px]",
            "shadow-[0_4px_10px_rgba(33,29,44,0.08)]",
            i < 3 ? "bg-[#7257B1] border-[#7257B1]" : "bg-white border-[#e8e4f0]",
          ].join(" ")}>
            {i < 3
              ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"><path d="M5 12l5 5 9-9"/></svg>
              : <Icon type="dna" size={15} color="#a5a0b7" />
            }
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage({ onNavigate }) {
  const router = useRouter();
  const [user, setUser]       = useState(null);
  const [courses, setCourses] = useState(STARTER_COURSES); 
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { router.push("/auth"); return; }
      const u = data.session.user;
      setUser(u);

      supabase.from("courses").select("*").order("id").limit(4)
      .then(({ data }) => { if (data?.length) setCourses(data); });

      supabase
        .from("profiles")
        .select("display_name, xp, tier")
        .eq("id", u.id)
        .single()
        .then(({ data: p }) => setProfile(p));
    });
  }, []);

  //   useEffect(() => {
  //   // check session
  //   supabase.auth.getSession().then(({ data }) => {
  //     if (!data.session) router.push("/auth");
  //     else setUser(data.session.user);
  //   });

  //   // fetch live courses
  //   supabase.from("courses").select("*").order("id").limit(4)
  //     .then(({ data }) => { if (data?.length) setCourses(data); });
  // }, []);

  // show nothing while checking auth
  if (!user) return null;

  const activeCourse = courses[0];

  return (
    <div className="bg-white min-h-screen text-[#191919]" style={{ fontFamily: '"Avenir Next","Poppins","Segoe UI",sans-serif' }}>
      <style>{`* { box-sizing: border-box; }`}</style>

      <TopNav activeTab="dashboard" onNavigate={onNavigate} />

      <div className="max-w-[1180px] mx-auto px-6 py-7">

        {/* header */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <h2 className="text-[1.35rem] font-extrabold tracking-[-0.03em] m-0">
            Hi, <span className="text-[#7b61d9]">
    {profile?.display_name?.split(" ")[0]        // email/password signup name
      ?? user?.user_metadata?.full_name?.split(" ")[0]  // Google name
      ?? "there"}                                 // fallback
  </span>!
          </h2>
          <StatPills />
        </div>

        {/* hero + stripe */}
        <div className="grid gap-3.5 mb-12" style={{ gridTemplateColumns: "1fr 110px" }}>
          <HeroBanner course={activeCourse} />
          <div className="relative rounded-[18px] bg-[#ffdca8] overflow-hidden min-h-[120px]">
            {[22, 52, 82].map(top => (
              <span key={top} className="absolute -left-2 h-2.5 w-9 rounded-full bg-white border border-[rgba(40,35,60,0.28)]" style={{ top }} />
            ))}
          </div>
        </div>

        {/* courses + pathway */}
        <div className="grid gap-5 items-start" style={{ gridTemplateColumns: "1fr 280px" }}>
          <div className="grid grid-cols-2 gap-6">
            {courses.map(c => (
              <CourseCard key={c.id} course={c} onNavigate={() => onNavigate?.("courses")} />
            ))}
          </div>
          <PathwaySidebar />
        </div>

      </div>
    </div>
  );
}