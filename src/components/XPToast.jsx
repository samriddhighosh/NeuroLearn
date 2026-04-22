"use client";
import React, { useEffect, useState } from "react";

export function XPToast({ amount, reason, onDone }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 300);
    }, 2200);
    return () => clearTimeout(t);
  }, []);

  const labels = {
    subsection_complete: "Subsection complete",
    lesson_complete:     "Lesson complete!",
    course_complete:     "Course complete!",
    daily_streak:        "Daily streak bonus",
  };

  return (
    <div style={{
      position: "fixed", bottom: 32, right: 32, zIndex: 999,
      transition: "opacity 0.3s, transform 0.3s",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(12px)",
    }}>
      <div style={{
        background: "#1a1628", color: "#fff",
        borderRadius: 16, padding: "14px 20px",
        display: "flex", alignItems: "center", gap: 12,
        boxShadow: "0 8px 32px rgba(40,20,80,0.22)",
        minWidth: 220,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: "rgba(123,97,217,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20,
        }}>
          {reason === "course_complete" ? "🏆" : reason === "lesson_complete" ? "⭐" : "✨"}
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#9490a8", fontWeight: 600 }}>
            {labels[reason] ?? "XP earned"}
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#c4b5ff", letterSpacing: "-0.02em" }}>
            +{amount} XP
          </div>
        </div>
      </div>
    </div>
  );
}