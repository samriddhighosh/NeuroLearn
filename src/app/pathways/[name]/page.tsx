"use client";

import React, { useEffect, useRef, useState } from "react";
import { TopNav } from "../../../components/Shared";
import { useRouter } from "next/navigation"; 

/* ─── Data ──────────────────────────────────────────────────────────── */
const NODES = [
  { id: "neurobiology",            label: "Neurobiology",             x: 9,  y: 22, state: "done",  icon: "dna",     slug: "synaptic-transmission" },
  { id: "neuropsychology",         label: "Neuropsychology",          x: 30, y: 38, state: "done",  icon: "head",    slug: "neuropsychology" },
  { id: "neuro-engineering",       label: "Neuro-engineering",        x: 55, y: 18, state: "active",  icon: "chip",  slug: "neural-networks" },
  { id: "neuro-economics",         label: "Neuro-economics",          x: 78, y: 34, state: "locked",  icon: "bars",   slug: "neuro-economics" },
  { id: "computational",           label: "Computational Neuroscience", x: 93, y: 60, state: "locked", icon: "network", slug: "computational" },
  { id: "brain-states",            label: "Brain States",             x: 20, y: 82, state: "locked",    icon: "pulse",   slug: "brain-states" },
  { id: "signal-processing",       label: "Signal Processing",        x: 44, y: 88, state: "locked",    icon: "wave",    slug: "signal-processing" },
  { id: "hutchinsons",             label: "Hutchinson's",             x: 74, y: 90, state: "locked",  icon: "flask",   slug: "hutchinsons" },
];

const CONNECTIONS = [
  { from: "neurobiology",      to: "neuropsychology",   strong: true  },
  { from: "neuropsychology",   to: "neuro-engineering", strong: true  },
  { from: "neuro-engineering", to: "neuro-economics",   strong: false },
  { from: "neuro-economics",   to: "computational",     strong: false  },
  { from: "brain-states",      to: "signal-processing", strong: false  },
  { from: "signal-processing", to: "hutchinsons",       strong: false },
  { from: "hutchinsons",       to: "computational",     strong: false  },
];

const ACTIVITY = [
  { name: "Signal Processing — Lesson 8: Fourier Transforms", meta: "2 days ago · 24 min", status: "done"    },
  { name: "Neurobiology — Lesson 3: Synaptic Transmission",   meta: "Today · in progress",  status: "active"  },
  { name: "Neuropsychology — Overview",                       meta: "Unlocks after Neurobiology", status: "locked" },
];

const MILESTONES = [
  { label: "Foundations",       done: true  },
  { label: "Brain States",      done: true  },
  { label: "Signal Processing", done: true  },
  { label: "Neurobiology",      current: true },
  { label: "Neuropsychology",   done: false },
  { label: "Neuro-engineering", done: false },
  { label: "Neuro-economics",   done: false },
  { label: "Computational NS",  done: false },
];

const NODE_HINTS = {
  "neurobiology":      "Currently active",
  "neuropsychology":   "Unlocks next",
  "neuro-engineering": "Active pathway",
  "neuro-economics":   "Upcoming",
  "computational":     "Final module",
  "brain-states":      "Completed",
  "signal-processing": "Completed",
  "hutchinsons":       "Upcoming",
};

/* ─── Icons ──────────────────────────────────────────────────────────── */
function Icon({ type, size = 22 }) {
  const s = { width: size, height: size, strokeWidth: 1.8, stroke: "currentColor", fill: "none", flexShrink: 0 };
  switch (type) {
    case "dna":     return <svg viewBox="0 0 24 24" style={s}><path d="M8 4c6 3 6 13 0 16M16 4c-6 3-6 13 0 16M9 7h6M8 12h8M9 17h6" strokeLinecap="round"/></svg>;
    case "head":    return <svg viewBox="0 0 24 24" style={s}><path d="M12 4a6 6 0 0 0-6 6v2.3c0 1.8.9 3.4 2.4 4.4V20h6.2a3.4 3.4 0 0 0 3.4-3.4V10A6 6 0 0 0 12 4z" strokeLinecap="round" strokeLinejoin="round"/><path d="M10.2 10.2c.7-.9 2.7-.9 3.4 0" strokeLinecap="round"/></svg>;
    case "chip":    return <svg viewBox="0 0 24 24" style={s}><rect x="7" y="7" width="10" height="10" rx="2"/><path d="M9 2.8v2.4M15 2.8v2.4M9 18.8v2.4M15 18.8v2.4M2.8 9h2.4M18.8 9h2.4M2.8 15h2.4M18.8 15h2.4" strokeLinecap="round"/></svg>;
    case "bars":    return <svg viewBox="0 0 24 24" style={s}><path d="M5 18V9M12 18V6M19 18v-4" strokeLinecap="round"/></svg>;
    case "network": return <svg viewBox="0 0 24 24" style={s}><circle cx="6" cy="12" r="2.2"/><circle cx="18" cy="7" r="2.2"/><circle cx="18" cy="17" r="2.2"/><path d="M8.2 11l7.4-3M8.2 13l7.4 3" strokeLinecap="round"/></svg>;
    case "pulse":   return <svg viewBox="0 0 24 24" style={s}><path d="M3 12h4l2-4 4 8 2-4h6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case "wave":    return <svg viewBox="0 0 24 24" style={s}><path d="M3 14c2.2 0 2.2-4 4.4-4s2.2 4 4.4 4 2.2-4 4.4-4 2.2 4 4.4 4" strokeLinecap="round"/></svg>;
    case "flask":   return <svg viewBox="0 0 24 24" style={s}><path d="M10 3.75h4M10.75 3.75v5.1l-4.9 7.5A3 3 0 0 0 8.35 21h7.3a3 3 0 0 0 2.5-4.65l-4.9-7.5v-5.1" strokeLinecap="round" strokeLinejoin="round"/><path d="M8.5 14.5h7" strokeLinecap="round"/></svg>;
    case "spark":   return <svg viewBox="0 0 24 24" style={{...s, fill:"currentColor", stroke:"none"}}><path d="M12 3.75l1.5 4.05 4.05 1.5-4.05 1.5L12 14.85l-1.5-4.05-4.05-1.5 4.05-1.5L12 3.75zm6.15 8.4l.825 2.175 2.175.825-2.175.825-.825 2.175-.825-2.175-2.175-.825 2.175-.825.825-2.175z"/></svg>;
    case "star":    return <svg viewBox="0 0 24 24" style={s}><path d="M12 3.75l2.5 5.05 5.575.8-4.037 3.938.953 5.563L12 16.5l-4.99 2.6.953-5.563L3.925 9.6l5.575-.8z" strokeLinejoin="round"/></svg>;
    case "check":   return <svg viewBox="0 0 24 24" style={s}><circle cx="12" cy="12" r="8"/><path d="M8.8 12.2l2.1 2.2 4.3-4.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case "clock":   return <svg viewBox="0 0 24 24" style={s}><circle cx="12" cy="12" r="7.25"/><path d="M12 8.6v4.1l2.8 1.6" strokeLinecap="round"/></svg>;
    default:        return null;
  }
}

/* ─── Styles (object map) ────────────────────────────────────────────── */
const S = {
  page: {
    fontFamily: '"DM Sans", "Helvetica Neue", sans-serif',
    background: "#ffffff",
    minHeight: "100vh",
    padding: "24px",
    color: "#1a1628",
  },
  inner: { maxWidth: 1140, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 },

  // Nav
  nav: {
    background: "#fff",
    border: "1px solid #e8e4f0",
    borderRadius: 18,
    padding: "14px 22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navEyebrow: { fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9490a8" },
  navTitle:   { fontSize: 15, fontWeight: 700, color: "#1a1628", marginTop: 2, letterSpacing: "-0.02em" },
  navLinks:   { display: "flex", gap: 6 },
  navLink:    { fontSize: 13, fontWeight: 600, padding: "8px 16px", borderRadius: 50, color: "#4d4766", textDecoration: "none", border: "1px solid transparent", cursor: "pointer" },
  navLinkActive: { background: "#f0ecff", color: "#6b4fcf", border: "1px solid #ddd6ff" },

  // Top grid
  topGrid: { display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "start" },
  greeting: { fontSize: 20, fontWeight: 700, color: "#1a1628", marginBottom: 14, letterSpacing: "-0.03em" },

  // Course card
  courseCard: {
    border: "1px solid #e8e4f0",
    borderRadius: 14,
    padding: "14px 18px",
    display: "flex",
    alignItems: "center",
    gap: 14,
    maxWidth: 460,
    background: "#fff",
  },
  courseIconWrap: {
    width: 48, height: 48, borderRadius: 12,
    background: "#f0ecff",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#6b4fcf", flexShrink: 0,
    border: "1px solid #ddd6ff",
  },
  courseName: { fontSize: 17, fontWeight: 700, color: "#1a1628", letterSpacing: "-0.02em" },
  courseSub:  { fontSize: 13, color: "#9490a8", marginTop: 3 },

  // Stats sidebar
  statsSidebar: { display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-end" },
  pillRow: { display: "flex", gap: 8 },
  pill: { display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 13px", borderRadius: 50, fontSize: 13, fontWeight: 700, border: "1px solid transparent" },
  pillMuted:  { background: "#f5f4f8", color: "#9490a8", borderColor: "#ede9f5" },
  pillAccent: { background: "#f0ecff", color: "#6b4fcf", borderColor: "#ddd6ff" },
  pillGold:   { background: "#fef6e4", color: "#b8820a", borderColor: "#fce9a8" },
  statCards:  { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  statCard:   { background: "#fff", border: "1px solid #e8e4f0", borderRadius: 12, padding: "12px 16px" },
  statNum:    { fontSize: 22, fontWeight: 700, color: "#1a1628", letterSpacing: "-0.03em" },
  statLabel:  { fontSize: 12, color: "#9490a8", marginTop: 2 },

  // Progress
  progressSection: { background: "#fff", border: "1px solid #e8e4f0", borderRadius: 14, padding: "18px 22px" },
  progressHeader:  { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  progressTitle:   { fontSize: 13, fontWeight: 700, color: "#4d4766" },
  progressPct:     { fontSize: 13, fontWeight: 700, color: "#6b4fcf" },
  progressTrack:   { height: 6, background: "#f0ecff", borderRadius: 50, overflow: "hidden" },
  progressFill:    { height: "100%", background: "#6b4fcf", borderRadius: 50, width: "35%", transition: "width 0.8s cubic-bezier(.4,0,.2,1)" },
  milestoneRow:    { display: "flex", gap: 7, marginTop: 12, flexWrap: "wrap" },
  milestone:       { fontSize: 11, fontWeight: 600, padding: "4px 11px", borderRadius: 50, border: "1px solid #e8e4f0", color: "#9490a8", background: "#fff" },
  milestoneDone:   { background: "#f0ecff", color: "#6b4fcf", borderColor: "#ddd6ff" },
  milestoneCurrent:{ background: "#6b4fcf", color: "#fff", borderColor: "#6b4fcf" },

  // Main panel
  mainPanel: { background: "#fff", border: "1px solid #e8e4f0", borderRadius: 18, padding: "24px 28px" },
  panelHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 },
  panelTitle:  { fontSize: 14, fontWeight: 700, color: "#4d4766", letterSpacing: "-0.01em" },
  filterTabs:  { display: "flex", gap: 5 },
  tab:         { fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 50, border: "1px solid #e8e4f0", background: "#fff", color: "#9490a8", cursor: "pointer", transition: "all .15s" },
  tabActive:   { background: "#f0ecff", color: "#6b4fcf", borderColor: "#ddd6ff" },

  // Map
  mapWrap: { position: "relative", width: "100%", height: 520, borderRadius: 14, border: "1px solid #f0ecf8", background: "#fdfcff", overflow: "visible" },
  mapSvg:  { position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" },

  // Nodes
  nodeWrap:  { position: "absolute", transform: "translate(-50%,-50%)", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 9, transition: "opacity .2s, transform .2s" },
  nodeRing:  { position: "relative", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform .2s cubic-bezier(.34,1.56,.64,1), box-shadow .2s" },
  nodeLg:    { width: 92, height: 92 },
  nodeMd:    { width: 80, height: 80 },
  nodeDefault: { background: "#ede9f5", border: "1.5px solid #d8d2e8", boxShadow: "0 1px 4px rgba(40,20,80,0.05)" },
  nodeActive:  { background: "#ffffff", border: "2px solid #7b61d9", boxShadow: "0 0 0 4px rgba(123,97,217,0.15), 0 0 22px rgba(123,97,217,0.22), 0 6px 20px rgba(60,30,120,0.12)" },
  nodeDone:    { background: "#3d2a7a", border: "2px solid #2e1f60", boxShadow: "0 2px 12px rgba(40,20,80,0.18)" },
  nodeInner:   { width: "40%", height: "40%", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.15)", position: "relative", zIndex: 2 },
  nodeInnerAccent: { background: "#f0ecff", color: "#6b4fcf", border: "1.5px solid #ddd6ff" },
  nodeInnerDone:   { background: "rgba(255,255,255,0.15)", color: "#e8deff", border: "1px solid rgba(255,255,255,0.2)" },
  nodeInnerPlain:  { background: "#e8e2f2", color: "#a099b8", border: "1px solid #d8d0ea" },
  nodeLabel: { fontSize: 12, fontWeight: 600, color: "#1a1628", textAlign: "center", maxWidth: 110, lineHeight: 1.25, letterSpacing: "-0.01em" },
  nodeLabelDone: { color: "#3d2a7a", fontWeight: 700 },

  // Tooltip
  tooltip: {
    position: "absolute", background: "#1a1628", color: "#fff",
    fontSize: 11, fontWeight: 600, padding: "5px 10px", borderRadius: 7,
    pointerEvents: "none", whiteSpace: "nowrap", zIndex: 20,
    transform: "translate(-50%, -130%)",
    transition: "opacity .15s",
  },

  // Legend
  mapLegend: { display: "flex", gap: 18, marginTop: 14, paddingTop: 12, borderTop: "1px solid #f0ecf8" },
  legendItem: { display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#9490a8" },
  legendDot:  { width: 9, height: 9, borderRadius: "50%", flexShrink: 0 },

  // Activity
  activitySection: { background: "#fff", border: "1px solid #e8e4f0", borderRadius: 14, padding: "18px 22px" },
  sectionTitle:    { fontSize: 13, fontWeight: 700, color: "#4d4766", marginBottom: 14 },
  activityList:    { display: "flex", flexDirection: "column", gap: 8 },
  activityItem:    { display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 10, background: "#fdfcff", border: "1px solid #f0ecf8" },
  activityDot:     { width: 7, height: 7, borderRadius: "50%", flexShrink: 0 },
  activityBody:    { flex: 1 },
  activityName:    { fontSize: 13, fontWeight: 600, color: "#1a1628" },
  activityMeta:    { fontSize: 12, color: "#b0acbe", marginTop: 2 },
  badge:           { fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 50 },
  badgeDone:       { background: "#e9f7ef", color: "#2a8c5a" },
  badgeActive:     { background: "#f0ecff", color: "#6b4fcf" },
  badgeLocked:     { background: "#f5f4f8", color: "#9490a8" },
};

const P = {
  wrapper: { position: "absolute", bottom: "110%", left: "50%", transform: "translateX(-50%)", width: "220px", background: "#fff", borderRadius: "18px", padding: "20px", boxShadow: "0 16px 40px rgba(47,40,79,0.14)", border: "1px solid rgba(34,25,60,0.14)", zIndex: 100, animation: "nodePopIn 0.16s ease both" },
  arrow: { position: "absolute", bottom: "-6px", left: "50%", transform: "translateX(-50%) rotate(45deg)", width: "12px", height: "12px", background: "#fff", borderRight: "1px solid rgba(34,25,60,0.14)", borderBottom: "1px solid rgba(34,25,60,0.14)" },
  iconBox: { width: "56px", height: "56px", margin: "0 auto 10px", borderRadius: "16px", background: "rgba(123,97,217,0.09)", border: "1px solid rgba(123,97,217,0.15)", display: "flex", alignItems: "center", justifyContent: "center" },
  title: { fontSize: "15px", fontWeight: "800", margin: "0", color: "#1f1c1c" },
  subtitle: { fontSize: "12px", color: "#6e687f", margin: "2px 0 10px" },
  statsRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid rgba(34,25,60,0.07)", borderBottom: "1px solid rgba(34,25,60,0.07)", marginBottom: "15px" },
  statVal: { fontSize: "15px", fontWeight: "800", color: "#7b61d9", margin: 0 },
  statLab: { fontSize: "10px", fontWeight: "600", color: "#a5a0b7", margin: 0 },
  divider: { width: "1px", height: "24px", background: "rgba(34,25,60,0.1)" },
  btn: { width: "100%", background: "#7257B1", color: "#fff", border: "none", borderRadius: "12px", padding: "11px", fontWeight: "700", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }
};
function NodePopup({ node, onContinue }) {
  const isDone = node.state === "done";
  const isActive = node.state === "active";
  const progress = isDone ? 100 : isActive ? 40 : 0;

  return (
    <div style={P.wrapper} onClick={(e) => e.stopPropagation()}>
      <div style={P.arrow} />
      <div style={P.iconBox}>
        <Icon type={node.icon} size={28} color="#7b61d9" />
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={P.title}>{node.label}</p>
        <p style={P.subtitle}>Neuroscience module</p>
      </div>
      <div style={P.statsRow}>
        <div style={{ textAlign: "center" }}>
          <p style={P.statVal}>{isDone ? "240" : "120"}</p>
          <p style={P.statLab}>XP</p>
        </div>
        <div style={P.divider} />
        <div style={{ textAlign: "center" }}>
           <p style={{...P.statVal, color: '#3e3657'}}>8</p>
           <p style={P.statLab}>LESSONS</p>
        </div>
        <div style={P.divider} />
        <svg width="34" height="34" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="14" fill="none" stroke="#ede8f5" strokeWidth="4"/>
          <circle cx="18" cy="18" r="14" fill="none" stroke="#7b61d9" strokeWidth="4"
            strokeDasharray={`${(progress / 100) * 88} 88`}
            strokeDashoffset="22" strokeLinecap="round"/>
          <text x="18" y="21" textAnchor="middle" fontSize="9" fontWeight="800" fill="#7b61d9">{progress}%</text>
        </svg>
      </div>
      <button style={P.btn} onClick={() => onContinue(node)}>
        <Icon type="play" size={12} color="#fff" />
        {isDone ? "Review Lesson" : "Continue"}
      </button>
    </div>
  );
}

/* ─── PathwayMap ─────────────────────────────────────────────────────── */
function PathwayMap({ onContinueLesson }) {
  const svgRef = useRef(null);
  const [hoveredId, setHoveredId] = useState(null);
  const nodeMap = Object.fromEntries(NODES.map(n => [n.id, n]));

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    svg.querySelectorAll(".conn").forEach(e => e.remove());
    const VW = 1000, VH = 520;

    CONNECTIONS.forEach(c => {
      const f = nodeMap[c.from], t = nodeMap[c.to];
      if (!f || !t) return;
      const x1 = f.x / 100 * VW, y1 = f.y / 100 * VH;
      const x2 = t.x / 100 * VW, y2 = t.y / 100 * VH;

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("class", "conn");
      line.setAttribute("x1", x1); line.setAttribute("y1", y1);
      line.setAttribute("x2", x2); line.setAttribute("y2", y2);
      const bothDone = f.state === "done" && t.state === "done";
      line.setAttribute("stroke", bothDone ? "#3d2a7a" : "#ddd6f0");
      line.setAttribute("stroke-width", bothDone ? "3" : "1.5");
      line.setAttribute("stroke-linecap", "round");
      svg.prepend(line);
    });
  }, [nodeMap]);

  return (
    <div style={S.mapWrap}>
      <svg ref={svgRef} style={S.mapSvg} viewBox="0 0 1000 520" preserveAspectRatio="none" />

      {NODES.map(node => {
        const isLg = node.state === "active";
        const isLocked = node.state === "locked";
        const ringStyle = node.state === "done" ? S.nodeDone : node.state === "active" ? S.nodeActive : S.nodeDefault;
        const innerStyle = node.state === "done" ? S.nodeInnerDone : node.state === "active" ? S.nodeInnerAccent : S.nodeInnerPlain;

        return (
          <div
            key={node.id}
            style={{ ...S.nodeWrap, left: `${node.x}%`, top: `${node.y}%` }}
            onMouseEnter={() => !isLocked && setHoveredId(node.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div
              className="ring"
              style={{
                ...S.nodeRing, 
                ...(isLg ? S.nodeLg : S.nodeMd), 
                ...ringStyle,
                ...(node.state === "active" ? { animation: "nodeGlow 2.4s ease-in-out infinite" } : {}),
                transform: hoveredId === node.id ? "scale(1.08)" : "scale(1)",
                cursor: isLocked ? "default" : "pointer",
              }}
            >
              <div style={{ ...S.nodeInner, ...innerStyle }}>
                <Icon type={node.icon} size={20} color={node.state === "done" ? "#c8b8ff" : undefined} />
              </div>
            </div>
            <span style={{ 
              ...S.nodeLabel, 
              ...(node.state === "done" ? S.nodeLabelDone : {}),
              opacity: isLocked ? 0.5 : 1
            }}>
              {node.label}
            </span>

            {hoveredId === node.id && (
              <NodePopup node={node} onContinue={onContinueLesson} />
            )}
          </div>
        );
      })}
    </div>
  );
}
/* ─── Main Page ──────────────────────────────────────────────────────── */
export default function PathwayPage({onNavigate}) {
  const router = useRouter(); // 3. Initialize the router
  const [activeTab, setActiveTab] = useState("all");

  const handleContinueLesson = (node) => {
    // 4. Instead of onNavigate, we push to a dynamic URL
    // This will lead to /lesson/neural-networks (or whatever your slug is)
    if (node.slug) {
    
    router.push(`/lesson/${node.slug}`); 
  } else {
    // Fallback to ID if slug is missing
    router.push(`/lesson/${node.id}`);
  }
  };

  // const [activeTab, setActiveTab] = useState("all");
  // const tabs = ["all", "done", "active", "locked"];
  // const tabLabels = { all: "All", done: "Completed", active: "In Progress", locked: "Upcoming" };

  return (
    <div style={S.page}>
      <style>{`
        @keyframes nodeGlow {
          0%,100% { box-shadow: 0 0 0 4px rgba(123,97,217,0.15), 0 0 22px rgba(123,97,217,0.22), 0 6px 20px rgba(60,30,120,0.12); }
          50%      { box-shadow: 0 0 0 7px rgba(123,97,217,0.12), 0 0 36px rgba(123,97,217,0.32), 0 8px 28px rgba(60,30,120,0.18); }
        }
        .ring { transition: transform 0.2s cubic-bezier(.34,1.56,.64,1); }
      `}</style>
      <div style={S.inner}>

        {/* NAV */}
    <TopNav activeTab="dashboard" onNavigate={onNavigate} />

        {/* TOP GRID */}
        <div style={S.topGrid}>
          <div>
            <p style={S.greeting}>
              Hi, <span style={{ color: "#6b4fcf" }}>Alex</span> — keep going!
            </p>
            <div style={S.courseCard}>
              <div style={S.courseIconWrap}>
                <Icon type="flask" size={24} />
              </div>
              <div>
                <div style={S.courseName}>Neuroscience</div>
                <div style={S.courseSub}>Brain functions &amp; body systems overview</div>
              </div>
            </div>
          </div>

          <div style={S.statsSidebar}>
            <div style={S.pillRow}>
              <span style={{ ...S.pill, ...S.pillMuted }}>
                <Icon type="spark" size={14} /> 0
              </span>
              <span style={{ ...S.pill, ...S.pillAccent }}>
                <Icon type="spark" size={14} /> 24
              </span>
              <span style={{ ...S.pill, ...S.pillGold }}>
                <Icon type="star" size={14} /> Gold
              </span>
            </div>
            <div style={S.statCards}>
              <div style={S.statCard}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3, color: "#e86a4a" }}>
                  <Icon type="check" size={15} />
                  <span style={S.statNum}>23</span>
                </div>
                <div style={S.statLabel}>Lessons done</div>
              </div>
              <div style={S.statCard}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3, color: "#6b4fcf" }}>
                  <Icon type="clock" size={15} />
                  <span style={S.statNum}>4h</span>
                </div>
                <div style={S.statLabel}>Time this week</div>
              </div>
            </div>
          </div>
        </div>

        {/* PROGRESS */}
        <div style={S.progressSection}>
          <div style={S.progressHeader}>
            <span style={S.progressTitle}>Pathway progress</span>
            <span style={S.progressPct}>3 of 8 modules · 35%</span>
          </div>
          <div style={S.progressTrack}>
            <div style={S.progressFill} />
          </div>
          <div style={S.milestoneRow}>
            {MILESTONES.map(m => (
              <span
                key={m.label}
                style={{
                  ...S.milestone,
                  ...(m.current ? S.milestoneCurrent : m.done ? S.milestoneDone : {}),
                }}
              >
                {m.label}{m.current ? " ←" : ""}
              </span>
            ))}
          </div>
        </div>

        {/* MAP PANEL */}
        <div style={S.mainPanel}>
          {/* <div style={S.panelHeader}>
            <span style={S.panelTitle}>Pathway map</span>
            <div style={S.filterTabs}>
              {tabs.map(t => (
                <button
                  key={t}
                  style={{ ...S.tab, ...(activeTab === t ? S.tabActive : {}) }}
                  onClick={() => setActiveTab(t)}
                >
                  {tabLabels[t]}
                </button>
              ))}
            </div>
          </div> */}

          <PathwayMap onContinueLesson={handleContinueLesson} />

          <div style={S.mapLegend}>
            <div style={S.legendItem}>
              <div style={{ ...S.legendDot, background: "#fff", border: "2px solid #7b61d9", boxShadow: "0 0 8px rgba(123,97,217,0.4)" }} />
              Active
            </div>
            <div style={S.legendItem}>
              <div style={{ ...S.legendDot, background: "#3d2a7a" }} />
              Completed
            </div>
            <div style={S.legendItem}>
              <div style={{ ...S.legendDot, background: "#ddd8e8" }} />
              Upcoming
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}