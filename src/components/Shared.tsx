"use client";
import React from "react";

/* ═══════════════════════════════════════════════════════
   SHARED ICONS
════════════════════════════════════════════════════════ */
export function Icon({ type, size = 20, color, className = "" }) {
  const c = color || "currentColor";
  const s = { width: size, height: size, stroke: c, fill: "none", strokeWidth: 1.9, flexShrink: 0, display: "block" };
  const f = { width: size, height: size, fill: c, stroke: "none", flexShrink: 0, display: "block" };
  switch (type) {
    case "network":  return <svg viewBox="0 0 24 24" style={s} className={className}><circle cx="6" cy="12" r="2.2"/><circle cx="18" cy="7" r="2.2"/><circle cx="18" cy="17" r="2.2"/><path d="M8.2 11l7.4-3M8.2 13l7.4 3" strokeLinecap="round"/></svg>;
    case "pulse":    return <svg viewBox="0 0 24 24" style={s} className={className}><path d="M3 12h4l2-4 4 8 2-4h6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case "dna":      return <svg viewBox="0 0 24 24" style={s} className={className}><path d="M8 4c6 3 6 13 0 16M16 4c-6 3-6 13 0 16M9 7h6M8 12h8M9 17h6" strokeLinecap="round"/></svg>;
    case "chip":     return <svg viewBox="0 0 24 24" style={s} className={className}><rect x="7" y="7" width="10" height="10" rx="2"/><path d="M9 2.8v2.4M15 2.8v2.4M9 18.8v2.4M15 18.8v2.4M2.8 9h2.4M18.8 9h2.4M2.8 15h2.4M18.8 15h2.4" strokeLinecap="round"/></svg>;
    case "bars":     return <svg viewBox="0 0 24 24" style={s} className={className}><path d="M5 18V9M12 18V6M19 18v-4" strokeLinecap="round"/></svg>;
    case "flask":    return <svg viewBox="0 0 24 24" style={s} className={className}><path d="M10 3.75h4M10.75 3.75v5.1l-4.9 7.5A3 3 0 0 0 8.35 21h7.3a3 3 0 0 0 2.5-4.65l-4.9-7.5v-5.1" strokeLinecap="round" strokeLinejoin="round"/><path d="M8.5 14.5h7" strokeLinecap="round"/></svg>;
    case "head":     return <svg viewBox="0 0 24 24" style={s} className={className}><path d="M12 4a6 6 0 0 0-6 6v2.3c0 1.8.9 3.4 2.4 4.4V20h6.2a3.4 3.4 0 0 0 3.4-3.4V10A6 6 0 0 0 12 4z" strokeLinecap="round" strokeLinejoin="round"/><path d="M10.2 10.2c.7-.9 2.7-.9 3.4 0" strokeLinecap="round"/></svg>;
    case "wave":     return <svg viewBox="0 0 24 24" style={s} className={className}><path d="M3 14c2.2 0 2.2-4 4.4-4s2.2 4 4.4 4 2.2-4 4.4-4 2.2 4 4.4 4" strokeLinecap="round"/></svg>;
    case "spark":    return <svg viewBox="0 0 24 24" style={f} className={className}><path d="M12 3.75l1.5 4.05 4.05 1.5-4.05 1.5L12 14.85l-1.5-4.05-4.05-1.5 4.05-1.5L12 3.75zm6.15 8.4l.825 2.175 2.175.825-2.175.825-.825 2.175-.825-2.175-2.175-.825 2.175-.825.825-2.175z"/></svg>;
    case "star":     return <svg viewBox="0 0 24 24" style={s} className={className}><path d="M12 3.75l2.5 5.05 5.575.8-4.037 3.938.953 5.563L12 16.5l-4.99 2.6.953-5.563L3.925 9.6l5.575-.8z" strokeLinejoin="round"/></svg>;
    case "check":    return <svg viewBox="0 0 24 24" style={s} className={className}><circle cx="12" cy="12" r="8"/><path d="M8.8 12.2l2.1 2.2 4.3-4.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case "flame":    return <svg viewBox="0 0 24 24" style={f} className={className}><path d="M12 2c0 0-6 5-6 11a6 6 0 0 0 12 0c0-3-1.5-5.5-3-7.5C14.5 7 13 9 13 11a1 1 0 0 1-2 0c0-2.5 1-5 1-9z"/></svg>;
    case "lock":     return <svg viewBox="0 0 24 24" style={s} className={className}><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4" strokeLinecap="round"/></svg>;
    case "play":     return <svg viewBox="0 0 24 24" style={f} className={className}><path d="M8 5.5l11 6.5-11 6.5z"/></svg>;
    case "bookmark": return <svg viewBox="0 0 24 24" style={s} className={className}><path d="M8 5.25h8a1.75 1.75 0 0 1 1.75 1.75v11.7l-5.75-3.15-5.75 3.15V7A1.75 1.75 0 0 1 8 5.25z" strokeLinejoin="round"/></svg>;
    case "clock":    return <svg viewBox="0 0 24 24" style={s} className={className}><circle cx="12" cy="12" r="7.25"/><path d="M12 8.6v4.1l2.8 1.6" strokeLinecap="round"/></svg>;
    case "chevL":    return <svg viewBox="0 0 24 24" style={s} className={className}><path d="M15 18l-6-6 6-6" strokeLinecap="round"/></svg>;
    case "chevR":    return <svg viewBox="0 0 24 24" style={s} className={className}><path d="M9 18l6-6-6-6" strokeLinecap="round"/></svg>;
    default: return null;
  }
}

/* ═══════════════════════════════════════════════════════
   TOP NAV  — sticky, white, border-bottom
   activeTab: "dashboard" | "courses" | "pathway"
════════════════════════════════════════════════════════ */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase"; 
import { usePathname } from "next/navigation";

export function TopNav({ activeTab = "dashboard", onNavigate }) {
  const pathname = usePathname();
  const router = useRouter(); // ✅ add this

  const links = [
    { id: "dashboard", label: "Dashboard", href: "/" },
    { id: "courses",   label: "All Courses", href: "/courses" },
    { id: "pathway",   label: "Pathway", href: "/pathways/neuroscience" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[rgba(34,25,60,0.1)] px-6">
      <div className="max-w-[1180px] mx-auto flex items-center justify-between h-[60px]">
        <div>
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[#6e687f] m-0">
            NeuroAcademy
          </p>
          <h1 className="text-[1.05rem] font-extrabold tracking-[-0.03em] m-0 text-[#191919]">
            Explore ideas the way Brilliant-style pathways feel
          </h1>
        </div>

        <div className="flex items-center gap-3"> {/* ✅ wrap nav + button */}
          <nav className="flex gap-2">
            {links.map((l) => {
              const isActive = pathname === l.href;
              return (
                <Link
                  key={l.id}
                  href={l.href}
                  className={`
                    rounded-full px-5 py-[8px] text-[0.85rem] font-bold transition-all active:scale-95 no-underline
                    ${isActive
                      ? "bg-[rgba(123,97,217,0.12)] text-[#7b61d9]"
                      : "bg-[#f5f4f7] text-[#3e3657] hover:bg-[#efecf7]"}
                  `}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={() => supabase.auth.signOut().then(() => router.push("/auth"))}
            className="text-[13px] font-bold text-[#9490a8] bg-[#f5f4f7] px-4 py-2 rounded-full border-none cursor-pointer hover:bg-[#efecf7] transition-colors"
          >
            Sign out
          </button>
        </div>

      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════
   STAT PILLS  — XP / streak / gold
════════════════════════════════════════════════════════ */
import { useProfile } from "../../lib/useProfile";

export function StatPills() {
  const ctx = useProfile();
  const xp   = ctx?.profile?.xp   ?? 0;
  const tier = ctx?.profile?.tier ?? "Bronze";

  const tierColor = 
    tier === "Gold"   ? "#d89a2c" : 
    tier === "Silver" ? "#7a8fa6" : 
    "#a5a0b7";

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[0.88rem] font-bold bg-[rgba(123,97,217,0.09)] text-[#7b61d9]">
        <Icon type="spark" size={15} color="#7b61d9" /> {xp} XP
      </span>
      <span className="inline-flex items-center gap-1.5 text-[0.88rem] font-bold" style={{ color: tierColor }}>
        <Icon type="star" size={16} color={tierColor} /> {tier}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   COURSE CARD  — NO hover popup (popup only on pathway)
════════════════════════════════════════════════════════ */
export function CourseCard({ course, onNavigate }) {
  const [saved, setSaved] = React.useState(false);
  const started = course.progress > 0;
  const locked  = !started && course.id > 2;

  return (
    <div
      onClick={() => !locked && onNavigate?.(course)}
      className={[
        "bg-white rounded-[18px] border border-[rgba(34,25,60,0.14)] p-5 flex flex-col gap-4",
        "transition-all duration-200 shadow-[0_2px_10px_rgba(47,40,79,0.06)]",
        locked ? "opacity-60 cursor-default" : "cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(47,40,79,0.10)] hover:border-[rgba(123,97,217,0.35)]",
      ].join(" ")}
    >
      {/* category + bookmark */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.08em] bg-[#222] text-white px-2 py-1 rounded-md">
          {course.category}
        </span>
        <div className="flex items-center gap-2">
          {course.streak && (
            <span className="text-[11px] font-bold bg-[rgba(165,160,183,0.1)] text-[#a5a0b7] rounded-full px-2.5 py-0.5 flex items-center gap-1">
              <Icon type="flame" size={11} color="#a5a0b7" /> Streak
            </span>
          )}
          <button
            onClick={e => { e.stopPropagation(); setSaved(!saved); }}
            className={[
              "w-7 h-7 rounded-lg border border-[rgba(34,25,60,0.14)] flex items-center justify-center cursor-pointer",
              saved ? "bg-[rgba(123,97,217,0.09)]" : "bg-white",
            ].join(" ")}
          >
            <Icon type="bookmark" size={14} color={saved ? "#7b61d9" : "#3e3657"} />
          </button>
        </div>
      </div>

      {/* icon + title + topic */}
      <div className="flex items-center gap-3">
        <div className="w-[50px] h-[50px] rounded-xl flex-shrink-0 bg-[rgba(123,97,217,0.09)] border border-[rgba(123,97,217,0.15)] flex items-center justify-center">
          <Icon type={course.icon || "flask"} size={24} color="#7b61d9" />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-[#1f1c1c] tracking-[-0.03em] leading-tight m-0">
            {course.title}
          </h3>
          <p className="text-[13px] text-[#6e687f] mt-0.5 m-0">Topic: {course.topic}</p>
        </div>
      </div>

      {/* progress */}
      <div>
        <p className="text-[12px] text-[#6e687f] mb-1.5 m-0">Course {course.progress}% complete</p>
        <div className="h-[5px] bg-[#e9e7e8] rounded-full overflow-hidden">
          <div className="h-full bg-[#7257B1] rounded-full" style={{ width: `${course.progress}%` }} />
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={e => { e.stopPropagation(); !locked && onNavigate?.(course); }}
        disabled={locked}
        className={[
          "w-full py-[11px] rounded-[10px] text-sm font-bold flex items-center justify-center gap-1.5 border-none transition-opacity",
          locked
            ? "bg-[#e8e4f0] text-[#b0a8c0] cursor-default"
            : "bg-[#7257B1] text-white cursor-pointer hover:opacity-90 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]",
        ].join(" ")}
      >
        {locked
          ? <><Icon type="lock" size={13} color="#b0a8c0" /> Locked</>
          : started
          ? <><Icon type="play" size={13} color="#fff" /> Continue</>
          : <><Icon type="play" size={13} color="#fff" /> Open Lesson</>
        }
      </button>
    </div>
  );
}