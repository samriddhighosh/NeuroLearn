"use client";
import React, { useEffect, useRef, useState } from "react";
import { TopNav } from "../../../components/Shared";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import { useAuth } from "../../../../lib/useAuth";

// fixed positions for up to 8 nodes on the map
const NODE_POSITIONS = [
  { x: 9,  y: 22 },
  { x: 30, y: 38 },
  { x: 55, y: 18 },
  { x: 78, y: 34 },
  { x: 93, y: 60 },
  { x: 20, y: 82 },
  { x: 44, y: 88 },
  { x: 74, y: 90 },
];

const CONNECTIONS_TEMPLATE = [
  [0,1], [1,2], [2,3], [3,4], [5,6], [6,7], [7,4]
];

function Icon({ type, size = 22 }) {
  const s = { width: size, height: size, strokeWidth: 1.8, stroke: "currentColor", fill: "none", flexShrink: 0 };
  switch (type) {
    case "dna":     return <svg viewBox="0 0 24 24" style={s}><path d="M8 4c6 3 6 13 0 16M16 4c-6 3-6 13 0 16M9 7h6M8 12h8M9 17h6" strokeLinecap="round"/></svg>;
    case "head":    return <svg viewBox="0 0 24 24" style={s}><path d="M12 4a6 6 0 0 0-6 6v2.3c0 1.8.9 3.4 2.4 4.4V20h6.2a3.4 3.4 0 0 0 3.4-3.4V10A6 6 0 0 0 12 4z" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case "chip":    return <svg viewBox="0 0 24 24" style={s}><rect x="7" y="7" width="10" height="10" rx="2"/><path d="M9 2.8v2.4M15 2.8v2.4M9 18.8v2.4M15 18.8v2.4M2.8 9h2.4M18.8 9h2.4M2.8 15h2.4M18.8 15h2.4" strokeLinecap="round"/></svg>;
    case "bars":    return <svg viewBox="0 0 24 24" style={s}><path d="M5 18V9M12 18V6M19 18v-4" strokeLinecap="round"/></svg>;
    case "network": return <svg viewBox="0 0 24 24" style={s}><circle cx="6" cy="12" r="2.2"/><circle cx="18" cy="7" r="2.2"/><circle cx="18" cy="17" r="2.2"/><path d="M8.2 11l7.4-3M8.2 13l7.4 3" strokeLinecap="round"/></svg>;
    case "pulse":   return <svg viewBox="0 0 24 24" style={s}><path d="M3 12h4l2-4 4 8 2-4h6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case "wave":    return <svg viewBox="0 0 24 24" style={s}><path d="M3 14c2.2 0 2.2-4 4.4-4s2.2 4 4.4 4 2.2-4 4.4-4 2.2 4 4.4 4" strokeLinecap="round"/></svg>;
    case "flask":   return <svg viewBox="0 0 24 24" style={s}><path d="M10 3.75h4M10.75 3.75v5.1l-4.9 7.5A3 3 0 0 0 8.35 21h7.3a3 3 0 0 0 2.5-4.65l-4.9-7.5v-5.1" strokeLinecap="round" strokeLinejoin="round"/><path d="M8.5 14.5h7" strokeLinecap="round"/></svg>;
    case "star":    return <svg viewBox="0 0 24 24" style={s}><path d="M12 3.75l2.5 5.05 5.575.8-4.037 3.938.953 5.563L12 16.5l-4.99 2.6.953-5.563L3.925 9.6l5.575-.8z" strokeLinejoin="round"/></svg>;
    case "play":    return <svg viewBox="0 0 24 24" style={{...s, fill:"currentColor", stroke:"none"}}><path d="M8 5.5l11 6.5-11 6.5z"/></svg>;
    case "chevL":   return <svg viewBox="0 0 24 24" style={s}><path d="M15 18l-6-6 6-6" strokeLinecap="round"/></svg>;
    default:        return null;
  }
}

const S = {
  page:      { fontFamily: '"DM Sans","Helvetica Neue",sans-serif', background: "#ffffff", minHeight: "100vh", padding: "24px", color: "#1a1628" },
  inner:     { maxWidth: 1140, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 },
  mapWrap:   { position: "relative", width: "100%", height: 520, borderRadius: 14, border: "1px solid #f0ecf8", background: "#fdfcff", overflow: "visible" },
  mapSvg:    { position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" },
  nodeWrap:  { position: "absolute", transform: "translate(-50%,-50%)", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 9 },
  nodeRing:  { borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform .2s cubic-bezier(.34,1.56,.64,1), box-shadow .2s" },
  nodeLg:    { width: 92, height: 92 },
  nodeMd:    { width: 80, height: 80 },
  nodeDone:  { background: "#3d2a7a", border: "2px solid #2e1f60", boxShadow: "0 2px 12px rgba(40,20,80,0.18)" },
  nodeActive:{ background: "#ffffff", border: "2px solid #7b61d9", boxShadow: "0 0 0 4px rgba(123,97,217,0.15), 0 0 22px rgba(123,97,217,0.22)" },
  nodeLocked:{ background: "#ede9f5", border: "1.5px solid #d8d2e8" },
  nodeInner: { width: "40%", height: "40%", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" },
  nodeLabel: { fontSize: 12, fontWeight: 600, color: "#1a1628", textAlign: "center", maxWidth: 110, lineHeight: 1.25 },
  mainPanel: { background: "#fff", border: "1px solid #e8e4f0", borderRadius: 18, padding: "24px 28px" },
  progressSection: { background: "#fff", border: "1px solid #e8e4f0", borderRadius: 14, padding: "18px 22px" },
  mapLegend: { display: "flex", gap: 18, marginTop: 14, paddingTop: 12, borderTop: "1px solid #f0ecf8" },
  legendItem:{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#9490a8" },
  legendDot: { width: 9, height: 9, borderRadius: "50%", flexShrink: 0 },
};

// ─── NODE POPUP ──────────────────────────────────────────────
function NodePopup({ node, onContinue }) {
  const progress = node.state === "done" ? 100 : node.state === "active" ? node.progressPct ?? 40 : 0;
  return (
    <div style={{ position:"absolute", bottom:"110%", left:"50%", transform:"translateX(-50%)", width:220, background:"#fff", borderRadius:18, padding:20, boxShadow:"0 16px 40px rgba(47,40,79,0.14)", border:"1px solid rgba(34,25,60,0.14)", zIndex:100 }}
      onClick={e => e.stopPropagation()}>
      <div style={{ position:"absolute", bottom:-6, left:"50%", transform:"translateX(-50%) rotate(45deg)", width:12, height:12, background:"#fff", borderRight:"1px solid rgba(34,25,60,0.14)", borderBottom:"1px solid rgba(34,25,60,0.14)" }} />
      <div style={{ width:56, height:56, margin:"0 auto 10px", borderRadius:16, background:"rgba(123,97,217,0.09)", border:"1px solid rgba(123,97,217,0.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <Icon type={node.icon} size={28} />
      </div>
      <div style={{ textAlign:"center" }}>
        <p style={{ fontSize:15, fontWeight:800, margin:"0 0 2px", color:"#1f1c1c" }}>{node.label}</p>
        <p style={{ fontSize:12, color:"#6e687f", margin:"0 0 10px" }}>{node.moduleCount} modules · {node.xp_reward} XP</p>
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", borderTop:"1px solid rgba(34,25,60,0.07)", borderBottom:"1px solid rgba(34,25,60,0.07)", marginBottom:15 }}>
        <div style={{ textAlign:"center" }}>
          <p style={{ fontSize:15, fontWeight:800, color:"#7b61d9", margin:0 }}>{node.xp_reward ?? 0}</p>
          <p style={{ fontSize:10, fontWeight:600, color:"#a5a0b7", margin:0 }}>XP</p>
        </div>
        <div style={{ width:1, height:24, background:"rgba(34,25,60,0.1)" }} />
        <div style={{ textAlign:"center" }}>
          <p style={{ fontSize:15, fontWeight:800, color:"#3e3657", margin:0 }}>{node.lesson_count ?? 0}</p>
          <p style={{ fontSize:10, fontWeight:600, color:"#a5a0b7", margin:0 }}>LESSONS</p>
        </div>
        <div style={{ width:1, height:24, background:"rgba(34,25,60,0.1)" }} />
        <svg width="34" height="34" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="14" fill="none" stroke="#ede8f5" strokeWidth="4"/>
          <circle cx="18" cy="18" r="14" fill="none" stroke="#7b61d9" strokeWidth="4"
            strokeDasharray={`${(progress/100)*88} 88`} strokeDashoffset="22" strokeLinecap="round"/>
          <text x="18" y="21" textAnchor="middle" fontSize="9" fontWeight="800" fill="#7b61d9">{progress}%</text>
        </svg>
      </div>
      {node.state !== "locked" && (
        <button
          style={{ width:"100%", background:"#7257B1", color:"#fff", border:"none", borderRadius:12, padding:11, fontWeight:700, fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}
          onClick={() => onContinue(node)}
        >
          <Icon type="play" size={12} />
          {node.state === "done" ? "Review" : "Continue"}
        </button>
      )}
    </div>
  );
}

// ─── MAP ────────────────────────────────────────────────────
function PathwayMap({ nodes, onContinue }) {
  const svgRef   = useRef(null);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !nodes.length) return;
    svg.querySelectorAll(".conn").forEach(e => e.remove());
    const VW = 1000, VH = 520;

    CONNECTIONS_TEMPLATE.forEach(([fi, ti]) => {
      const f = nodes[fi], t = nodes[ti];
      if (!f || !t) return;
      const x1 = f.x/100*VW, y1 = f.y/100*VH;
      const x2 = t.x/100*VW, y2 = t.y/100*VH;
      const line = document.createElementNS("http://www.w3.org/2000/svg","line");
      line.setAttribute("class","conn");
      line.setAttribute("x1",x1); line.setAttribute("y1",y1);
      line.setAttribute("x2",x2); line.setAttribute("y2",y2);
      const bothDone = f.state==="done" && t.state==="done";
      line.setAttribute("stroke", bothDone ? "#3d2a7a" : "#ddd6f0");
      line.setAttribute("stroke-width", bothDone ? "3" : "1.5");
      line.setAttribute("stroke-linecap","round");
      svg.prepend(line);
    });
  }, [nodes]);

  return (
    <div style={S.mapWrap}>
      <svg ref={svgRef} style={S.mapSvg} viewBox="0 0 1000 520" preserveAspectRatio="none" />
      {nodes.map(node => {
        const ringStyle = node.state==="done" ? S.nodeDone : node.state==="active" ? S.nodeActive : S.nodeLocked;
        const innerBg   = node.state==="done" ? "rgba(255,255,255,0.15)" : node.state==="active" ? "#f0ecff" : "#e8e2f2";
        const iconColor = node.state==="done" ? "#c8b8ff" : node.state==="active" ? "#6b4fcf" : "#a099b8";
        return (
          <div key={node.id} style={{ ...S.nodeWrap, left:`${node.x}%`, top:`${node.y}%` }}
            onMouseEnter={() => node.state!=="locked" && setHovered(node.id)}
            onMouseLeave={() => setHovered(null)}>
            <div style={{
              ...S.nodeRing,
              ...(node.state==="active" ? S.nodeLg : S.nodeMd),
              ...ringStyle,
              transform: hovered===node.id ? "scale(1.08)" : "scale(1)",
              cursor: node.state==="locked" ? "default" : "pointer",
              ...(node.state==="active" ? { animation:"nodeGlow 2.4s ease-in-out infinite" } : {}),
            }}>
              <div style={{ ...S.nodeInner, background:innerBg }}>
                <Icon type={node.icon} size={20} color={iconColor} />
              </div>
            </div>
            <span style={{ ...S.nodeLabel, opacity: node.state==="locked" ? 0.5 : 1,
              ...(node.state==="done" ? { color:"#3d2a7a", fontWeight:700 } : {}) }}>
              {node.label}
            </span>
            {hovered===node.id && <NodePopup node={node} onContinue={onContinue} />}
          </div>
        );
      })}
    </div>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────
export default function PathwayPage({ onNavigate }) {
  const router   = useRouter();
  const params   = useParams();
  const typeSlug = params?.name as string;
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const [courseType, setCourseType] = useState<any>(null);
  const [nodes,      setNodes]      = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [progress,   setProgress]   = useState({ done: 0, total: 0 });

  useEffect(() => {
    console.log("useEffect fired, typeSlug =", typeSlug, "params =", params);
  if (!typeSlug) {
    setIsLoading(false);
    return;
  }
    console.log("load() fired, typeSlug =", typeSlug);
  async function load() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      const { data: ct, error: ctError } = await supabase
        .from("course_types").select("*").eq("slug", typeSlug).single();
        
      setCourseType(ct);
      console.log("ct:", ct, "ctError:", ctError)
      if (!ct) {
          setNodes([]);
          return;
        }

      const { data: courses, error } = await supabase
      .from("courses")
      .select(`
        id, slug, title, icon, xp_reward, lesson_count,
        modules ( id, lessons ( id, subsections ( id ) ) )
      `)
      .ilike("category", ct.slug)
      .order("id");

    console.log("ct.slug:", ct.slug);
    console.log("courses:", courses);
    console.log("error:", error);

      if (!courses?.length) {
        console.log("❌ No courses found for ilike match:", typeSlug.replace(/-/g, " "));
        setNodes([]);
        return;
      }

      const completedIds = new Set<number>();
      if (userId) {
        const { data: progressData } = await supabase
          .from("user_progress")
          .select("subsection_id")
          .eq("user_id", userId)
          .eq("completed", true);
        progressData?.forEach((p: any) => completedIds.add(p.subsection_id));
      }

      let firstActiveSet = false;
      const shaped = courses.map((course: any, i: number) => {
        const allSubs = course.modules?.flatMap((m: any) =>
          m.lessons?.flatMap((l: any) => l.subsections ?? []) ?? []
        ) ?? [];
        const total = allSubs.length;
        const done  = allSubs.filter((s: any) => completedIds.has(s.id)).length;
        const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
        const isDone = total > 0 && done === total;
        const isInProgress = !isDone && done > 0;

        let state = "locked";
        if (isDone)                          state = "done";
        else if (isInProgress)               state = "active";
        else if (i === 0 && !firstActiveSet) state = "active";

        if (state === "active" || state === "done") firstActiveSet = true;

        return {
          id:           course.id,
          label:        course.title,
          slug:         course.slug,
          icon:         course.icon ?? "dna",
          xp_reward:    course.xp_reward,
          lesson_count: course.lesson_count,
          moduleCount:  course.modules?.length ?? 0,
          progressPct:  pct,
          state,
          ...NODE_POSITIONS[i],
        };
      });

      setNodes(shaped);
      setMilestones(shaped.map(n => ({
        label:   n.label,
        done:    n.state === "done",
        current: n.state === "active",
      })));

      const totalSubs = courses.reduce((acc: number, course: any) => {
        return acc + (course.modules?.flatMap((m: any) =>
          m.lessons?.flatMap((l: any) => l.subsections ?? []) ?? []
        ).length ?? 0);
      }, 0);

      setProgress({ done: completedIds.size, total: totalSubs });

    } catch (err) {
      console.error("PathwayPage load error:", err);
      setNodes([]);
    } finally {
      setIsLoading(false);
    }
  }

  load();
}, [typeSlug]);

  const handleContinue = (node: any) => {
    router.push(`/lesson/${node.slug}`);
  };

  const pct = progress.total > 0 ? Math.round((progress.done/progress.total)*100) : 0;
  const doneCourses    = nodes.filter(n => n.state==="done").length;

  return (
    <div style={S.page}>
      <style>{`
        @keyframes nodeGlow {
          0%,100% { box-shadow: 0 0 0 4px rgba(123,97,217,0.15), 0 0 22px rgba(123,97,217,0.22); }
          50%      { box-shadow: 0 0 0 7px rgba(123,97,217,0.12), 0 0 36px rgba(123,97,217,0.32); }
        }
      `}</style>
      <div style={S.inner}>

        <TopNav activeTab="pathway" onNavigate={onNavigate} />

        {/* header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div>
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:"#9490a8", margin:"0 0 4px" }}>
              Learning Pathway
            </p>
            <h1 style={{ fontSize:22, fontWeight:800, color:"#1a1628", margin:0, letterSpacing:"-0.03em" }}>
              {courseType?.title ?? typeSlug}
            </h1>
            <p style={{ fontSize:14, color:"#6e687f", margin:"4px 0 0" }}>
              {courseType?.description}
            </p>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <div style={{ background:"#f0ecff", border:"1px solid #ddd6ff", borderRadius:12, padding:"10px 16px", textAlign:"center" }}>
              <div style={{ fontSize:20, fontWeight:800, color:"#7b61d9" }}>{doneCourses}/{nodes.length}</div>
              <div style={{ fontSize:11, color:"#9490a8" }}>courses done</div>
            </div>
            <div style={{ background:"#f0ecff", border:"1px solid #ddd6ff", borderRadius:12, padding:"10px 16px", textAlign:"center" }}>
              <div style={{ fontSize:20, fontWeight:800, color:"#7b61d9" }}>{pct}%</div>
              <div style={{ fontSize:11, color:"#9490a8" }}>complete</div>
            </div>
          </div>
        </div>

        {/* progress bar + milestones */}
        <div style={S.progressSection}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <span style={{ fontSize:13, fontWeight:700, color:"#4d4766" }}>Pathway progress</span>
            <span style={{ fontSize:13, fontWeight:700, color:"#6b4fcf" }}>
              {doneCourses} of {nodes.length} courses · {pct}%
            </span>
          </div>
          <div style={{ height:6, background:"#f0ecff", borderRadius:50, overflow:"hidden" }}>
            <div style={{ height:"100%", background:"#6b4fcf", borderRadius:50, width:`${pct}%`, transition:"width 0.8s cubic-bezier(.4,0,.2,1)" }} />
          </div>
          <div style={{ display:"flex", gap:7, marginTop:12, flexWrap:"wrap" }}>
            {milestones.map(m => (
              <span key={m.label} style={{
                fontSize:11, fontWeight:600, padding:"4px 11px", borderRadius:50,
                border:"1px solid #e8e4f0", color:"#9490a8", background:"#fff",
                ...(m.current ? { background:"#6b4fcf", color:"#fff", borderColor:"#6b4fcf" }
                  : m.done   ? { background:"#f0ecff", color:"#6b4fcf", borderColor:"#ddd6ff" }
                  : {}),
              }}>
                {m.label}{m.current ? " ←" : ""}
              </span>
            ))}
          </div>
        </div>

        {/* map */}
        <div style={S.mainPanel}>
          {isLoading
  ? <div style={{ height:520, display:"flex", alignItems:"center", justifyContent:"center", color:"#9490a8" }}>
      Loading pathway…
    </div>
  : nodes.length === 0
  ? <div style={{ height:520, display:"flex", alignItems:"center", justifyContent:"center", color:"#9490a8" }}>
      No courses found. Check the category name matches your URL.
    </div>
  : <PathwayMap nodes={nodes} onContinue={handleContinue} />
}
          <div style={S.mapLegend}>
            <div style={S.legendItem}><div style={{ ...S.legendDot, background:"#fff", border:"2px solid #7b61d9", boxShadow:"0 0 8px rgba(123,97,217,0.4)" }} /> Active</div>
            <div style={S.legendItem}><div style={{ ...S.legendDot, background:"#3d2a7a" }} /> Completed</div>
            <div style={S.legendItem}><div style={{ ...S.legendDot, background:"#ddd8e8" }} /> Upcoming</div>
          </div>
        </div>

      </div>
    </div>
  );
}