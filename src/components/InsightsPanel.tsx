"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/useAuth";

export function InsightsPanel() {
  const { user } = useAuth();
  const [insights, setInsights] = useState([]);
  const [nextTopic, setNextTopic] = useState(null);

    useEffect(() => {
    if (!user) return;
    supabase
        .from("learning_profiles")
        .select("topics")
        .eq("user_id", user.id)
        .single()
        .then(({ data }) => {
        if (!data?.topics?.length) return;
        // topics are already ranked by the engine — first one is next recommended
        const next = data.topics.sort(
            (a, b) => b.forgettingProbability - a.forgettingProbability
        )[0];
        setNextTopic(next);
        });
    }, [user]);

  const struggles = insights.filter(i => i.type === "struggle");
  const report    = insights.find(i => i.type === "weekly_report");

  if (!insights.length) return null;

  return (
    <div className="bg-white border border-[#e8e4f0] rounded-[18px] p-5 flex flex-col gap-4">
      <p className="text-[13px] font-bold text-[#4d4766] m-0">Learning insights</p>

      {/* weekly report */}
      {report && (
        <div className="bg-[#f8f5ff] rounded-[14px] p-4 border border-[#e8e4f0]">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9490a8] m-0 mb-2">
            This week
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-[20px] font-extrabold text-[#7b61d9] m-0">
                {report.payload.subsections_done}
              </p>
              <p className="text-[11px] text-[#9490a8] m-0">lessons done</p>
            </div>
            <div>
              <p className="text-[20px] font-extrabold text-[#7b61d9] m-0">
                {report.payload.quiz_accuracy != null
                  ? `${report.payload.quiz_accuracy}%`
                  : "—"}
              </p>
              <p className="text-[11px] text-[#9490a8] m-0">quiz accuracy</p>
            </div>
            <div>
              <p className="text-[20px] font-extrabold text-[#7b61d9] m-0">
                {report.payload.streak}🔥
              </p>
              <p className="text-[11px] text-[#9490a8] m-0">day streak</p>
            </div>
          </div>
        </div>
      )}

      {/* struggle topics */}
      {struggles.length > 0 && (
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9490a8] m-0 mb-2">
            Topics to revisit
          </p>
          <div className="flex flex-col gap-2">
            {struggles.map(s => (
              <div key={s.id}
                className="flex items-center justify-between px-3 py-2.5 rounded-[10px] bg-[#fff5f5] border border-[#fde8e8]">
                <span className="text-[13px] font-semibold text-[#1a1628]">
                  {s.payload.subsection_title}
                </span>
                <span className="text-[12px] font-bold text-[#e05c5c]">
                  {s.payload.fail_rate}% missed
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {nextTopic && (
        <div className="bg-[#f0ecff] border border-[#ddd6ff] rounded-[14px] p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9490a8] m-0 mb-1">
            Recommended next
            </p>
            <p className="text-[15px] font-extrabold text-[#1a1628] m-0 mb-1">
            {nextTopic.topicId.replace(/-/g, " ")}
            </p>
            <div className="flex gap-3 mt-2">
            <span className="text-[12px] text-[#7b61d9] font-semibold">
                Mastery {Math.round(nextTopic.mastery * 100)}%
            </span>
            <span className="text-[12px] text-[#e05c5c] font-semibold">
                Forgetting {Math.round(nextTopic.forgettingProbability * 100)}%
            </span>
            </div>
        </div>
        )}
    </div>
  );
}