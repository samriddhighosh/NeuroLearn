"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Icon } from "../../../components/Shared";
import { useParams,useRouter } from "next/navigation";
import { completeSubsection, logStreak } from "../../../../lib/progress";
import { useAuth } from "../../../../lib/useAuth";
import { useProfile } from "../../../../lib/useProfile";
import { supabase } from "../../../../lib/supabase";

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

function buildLessons(course) {
  const templates = {
    "neural-networks": [
      { title: "Foundations of Neural Networks", subsections: ["What is a neuron?", "Biological vs artificial neurons", "Activation functions"] },
      { title: "Network Architecture",           subsections: ["Layers and depth", "Weights and biases", "Forward propagation"] },
      { title: "Learning & Optimisation",        subsections: ["Loss functions", "Gradient descent", "Backpropagation"] },
      { title: "Modern Applications",            subsections: ["Computer vision basics", "Natural language processing", "Reinforcement learning intro"] },
    ],
    "synaptic-transmission": [
      { title: "The Synapse",               subsections: ["Anatomy of a synapse", "Chemical vs electrical synapses", "Neurotransmitter release"] },
      { title: "Signal Propagation",        subsections: ["Action potentials", "Synaptic vesicles", "Reuptake mechanisms"] },
      { title: "Modulation & Plasticity",   subsections: ["Short-term plasticity", "Long-term potentiation", "Hebbian learning"] },
    ],
  };
  const data = templates[course.slug] || [
    { title: "Introduction",     subsections: ["Overview", "Key concepts", "Why it matters"] },
    { title: "Core Principles",  subsections: ["Foundational theory", "Models and frameworks", "Practical examples"] },
    { title: "Advanced Topics",  subsections: ["Current research", "Open questions", "Future directions"] },
  ];
  return data.map((lesson, li) => ({
    id: li + 1,
    title: lesson.title,
    expanded: li === 0,
    subsections: lesson.subsections.map((title, si) => ({
      id: `${li + 1}-${si + 1}`,
      title,
      completed: li === 0 && si === 0 && course.progress > 0,
      selected:  li === 0 && si === (course.progress > 0 ? 1 : 0),
    })),
  }));
}

const LESSON_BODY = {
  "What is a neuron?": {
    intro: "Neurons are the fundamental computational units of the nervous system. Each neuron receives inputs, processes them, and transmits an output signal.",
    sections: [
      { heading: "Structure",          body: "A neuron consists of a cell body (soma), dendrites that receive incoming signals, and an axon that transmits signals to other neurons." },
      { heading: "Signal integration", body: "The cell body integrates thousands of synaptic inputs. When the summed potential crosses a threshold at the axon hillock, an action potential fires." },
      { heading: "Types of neurons",   body: "Sensory neurons carry signals from the body to the brain, motor neurons carry signals to muscles, and interneurons handle communication within the brain." },
    ],
    quiz: { q: "What triggers an action potential?", options: ["High temperature", "Threshold voltage at the axon hillock", "Presence of glucose", "Calcium influx"], answer: 1 },
  },
};

function getLessonBody(title) {
  return LESSON_BODY[title] || {
    intro: `This section covers ${title.toLowerCase()}. Work through the content below before moving to the next lesson.`,
    sections: [
      { heading: "Key concepts",  body: "Neuroscience blends biology, chemistry, physics, and computation to understand how the brain processes information, stores memories, and generates behaviour." },
      { heading: "Why it matters",body: "Understanding these principles underpins advances in medicine (treating disorders), technology (brain-computer interfaces), and AI (neuromorphic computing)." },
    ],
    quiz: null,
  };
}

function Sidebar({ lessons, onToggle, onSelect, onClose }) {
  return (
    <aside className="w-[280px] flex-shrink-0 border-r border-[rgba(34,25,60,0.1)] bg-white flex flex-col overflow-y-auto">
      <div className="px-5 py-4 border-b border-[rgba(34,25,60,0.08)] flex items-center justify-between">
        <span className="text-[13px] font-bold text-[#16151b]">Course content</span>
        <button onClick={onClose} className="bg-none border-none cursor-pointer text-[#9490a8] p-1 flex items-center">
          <Icon type="chevL" size={16} color="#9490a8" />
        </button>
      </div>
      <div className="flex-1 py-2">
        {lessons.map(lesson => (
          <div key={lesson.id}>
            <button
              onClick={() => onToggle(lesson.id)}
              className="w-full px-5 py-2.5 bg-transparent border-none cursor-pointer flex items-center justify-between text-left"
            >
              <span className="text-[13px] font-bold text-[#1a1628]">{lesson.title}</span>
              <Icon type="chevR" size={14} color="#9490a8"
                className={`transition-transform duration-150 ${lesson.expanded ? "rotate-90" : ""}`} />
            </button>
            {lesson.expanded && (
              <div className="pb-1">
                {lesson.subsections.map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => onSelect(lesson.id, sub.id)}
                    className={[
                      "w-full pl-8 pr-5 py-2 border-l-[3px] border-none text-left flex items-center gap-2.5 cursor-pointer",
                      sub.selected ? "bg-[rgba(123,97,217,0.08)] border-l-[#7b61d9]" : "bg-transparent border-l-transparent",
                    ].join(" ")}
                  >
                    <span className={[
                      "w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center",
                      sub.completed ? "bg-[#7257B1]"
                      : sub.selected ? "bg-[rgba(123,97,217,0.15)] border-2 border-[#7257B1]"
                      : "bg-[#e8e4f0]",
                    ].join(" ")}>
                      {sub.completed && (
                        <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M2 6l3 3 5-5"/></svg>
                      )}
                    </span>
                    <span className={`text-[13px] leading-snug ${sub.selected ? "font-semibold text-[#1a1628]" : "font-normal text-[#4d4766]"}`}>
                      {sub.title}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}

function LessonContent({ selectedLesson, hasNext, hasPrev, onNext, onPrev }) {
  const [quizAnswer, setQuizAnswer] = useState(null);
  const { user } = useAuth();

  useEffect(() => { setQuizAnswer(null); }, [selectedLesson?.subsectionId]);

  if (!selectedLesson) {
    return (
      <div className="flex-1 flex items-center justify-center text-[#9490a8] text-[15px]">
        Select a lesson from the sidebar to begin.
      </div>
    );
  }

  const body = getLessonBody(selectedLesson.subsectionTitle);

  const handleQuizAnswer = async (i) => {
  if (quizAnswer !== null) return;
  setQuizAnswer(i);
  const correct = i === body.quiz.answer;

  if (user) {
    await supabase.from("quiz_attempts").insert({
      user_id:       user.id,
      subsection_id: selectedLesson.subsectionId,
      course_id:     selectedLesson.courseId,
      question:      body.quiz.q,
      correct,
    });

    await fetch("/api/inngest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "quiz/attempt.created",
        data: {
          user_id:       user.id,
          subsection_id: selectedLesson.subsectionId,
          course_id:     selectedLesson.courseId,
          correct,
          question:      body.quiz.q,
        },
      }),
    });
  }
};

  return (
    <main className="flex-1 overflow-y-auto px-12 py-10 max-w-[760px] mx-auto w-full">
      <p className="text-[12px] font-semibold text-[#9490a8] mb-1.5 m-0 tracking-[0.02em]">
        {selectedLesson.lessonTitle} <span className="text-[#c8c4d8]">›</span> {selectedLesson.subsectionTitle}
      </p>
      <h1 className="text-[28px] font-extrabold text-[#1a1628] tracking-[-0.04em] mb-5 mt-0 leading-tight">
        {selectedLesson.subsectionTitle}
      </h1>
      <p className="text-base text-[#3e3657] leading-[1.75] mb-8 m-0">{body.intro}</p>

      {body.sections.map((s, i) => (
        <div key={i} className="mb-7">
          <h2 className="text-[18px] font-bold text-[#1a1628] mb-2.5 mt-0 tracking-[-0.02em]">{s.heading}</h2>
          <p className="text-[15px] text-[#3e3657] leading-[1.75] m-0">{s.body}</p>
        </div>
      ))}

      {body.quiz && (
        <div className="bg-[rgba(123,97,217,0.05)] border-[1.5px] border-[rgba(123,97,217,0.15)] rounded-2xl p-6 my-8">
          <p className="text-[13px] font-bold text-[#7b61d9] uppercase tracking-[0.08em] mb-3 m-0">Quick check</p>
          <p className="text-base font-bold text-[#1a1628] mb-4 m-0">{body.quiz.q}</p>
          <div className="flex flex-col gap-2">
            {body.quiz.options.map((opt, i) => {
              const chosen   = quizAnswer === i;
              const correct  = i === body.quiz.answer;
              const revealed = quizAnswer !== null;
              return (
                <button
                  key={i}
                  onClick={() => quizAnswer === null && setQuizAnswer(i)}
                  className={[
                    "px-4 py-[11px] rounded-[10px] text-left text-[14px] font-medium border-[1.5px] transition-all",
                    revealed ? "cursor-default" : "cursor-pointer",
                    revealed
                      ? correct ? "border-[#7b61d9] bg-[rgba(123,97,217,0.08)] text-[#6b4fcf]"
                      : chosen  ? "border-[#e96a7b] bg-[rgba(233,106,123,0.07)] text-[#1a1628]"
                      : "border-[rgba(34,25,60,0.1)] bg-white text-[#1a1628]"
                      : "border-[rgba(34,25,60,0.12)] bg-white text-[#1a1628] hover:border-[rgba(123,97,217,0.3)]",
                  ].join(" ")}
                >
                  {opt}{revealed && correct && " ✓"}
                </button>
              );
            })}
          </div>
          {quizAnswer !== null && (
            <p className={`text-[13px] font-semibold mt-3 m-0 ${quizAnswer === body.quiz.answer ? "text-[#6b4fcf]" : "text-[#b82040]"}`}>
              {quizAnswer === body.quiz.answer ? "Correct! Well done." : `Not quite — the correct answer is: ${body.quiz.options[body.quiz.answer]}`}
            </p>
          )}
        </div>
      )}

      <div className="flex justify-between mt-10 pt-6 border-t border-[rgba(34,25,60,0.08)]">
        <button
          onClick={onPrev} disabled={!hasPrev}
          className={[
            "px-5 py-[11px] rounded-[10px] text-[14px] font-bold border-[1.5px] border-[rgba(34,25,60,0.15)] bg-white flex items-center gap-1.5",
            hasPrev ? "text-[#3e3657] cursor-pointer hover:bg-[#f5f4f7]" : "text-[#c8c4d8] cursor-default",
          ].join(" ")}
        >
          <Icon type="chevL" size={14} color={hasPrev ? "#3e3657" : "#c8c4d8"} /> Previous
        </button>
        <button
          onClick={onNext} disabled={!hasNext}
          className={[
            "px-5 py-[11px] rounded-[10px] text-[14px] font-bold border-none flex items-center gap-1.5",
            hasNext
              ? "bg-[#7257B1] text-white cursor-pointer hover:opacity-90 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
              : "bg-[#e8e4f0] text-[#b0a8c0] cursor-default",
          ].join(" ")}
        >
          Next lesson <Icon type="chevR" size={14} color={hasNext ? "#fff" : "#b0a8c0"} />
        </button>
      </div>
    </main>
  );
}

export default function LessonPage({ onNavigate }) {
  const { user } = useAuth();
  const { awardXP } = useProfile();
  const params = useParams();
  const slug = params?.slug;

  const courseNode = useMemo(() => NODES.find(n => n.slug === slug), [slug]);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [lessons, setLessons] = useState(() => {
    if (!courseNode) return null;
    return buildLessons({ title: courseNode.label, slug: courseNode.slug, progress: 10 });
  });

  useEffect(() => {
    if (courseNode) {
      setLessons(buildLessons({ title: courseNode.label, slug: courseNode.slug, progress: 10 }));
    }
  }, [courseNode]);

  const flatOrder = useMemo(() => {
    if (!Array.isArray(lessons)) return [];
    return lessons.flatMap(l =>
      l.subsections.map(s => ({ lessonId: l.id, subsectionId: s.id }))
    );
  }, [lessons]);

  const selectedIndex = useMemo(() => {
    if (!Array.isArray(lessons)) return -1;
    let idx = 0, found = -1;
    lessons.forEach(l => l.subsections.forEach(s => { if (s.selected) found = idx; idx++; }));
    return found;
  }, [lessons]);
  // const { data: courseData } = await supabase
  //   .from("courses").select("id").eq("slug", courseNode.slug).single();
  // setCourseDbId(courseData?.id);

  const selectedLesson = useMemo(() => {
  if (!Array.isArray(lessons)) return undefined;
  for (const l of lessons) {
    const sub = l.subsections.find(s => s.selected);
    if (sub) return {
      lessonTitle:      l.title,
      subsectionId:     sub.id,
      subsectionTitle:  sub.title,
      body:             sub.body,
      courseId:         courseNode?.dbId,  // add dbId when fetching
    };
  }
  return undefined;
}, [lessons, courseNode]);

  const course = { title: courseNode.label, progress: 10 };

  const handleToggle = id =>
    setLessons(prev => prev.map(l => l.id === id ? { ...l, expanded: !l.expanded } : l));

  const handleSelect = (lessonId, subsectionId) =>
    setLessons(prev => prev.map(l => ({
      ...l,
      subsections: l.subsections.map(s => ({
        ...s,
        selected: l.id === lessonId && s.id === subsectionId
      })),
    })));


  const handleNext = async () => {
  if (selectedIndex < 0 || selectedIndex >= flatOrder.length - 1) return;
  const cur  = flatOrder[selectedIndex];
  const next = flatOrder[selectedIndex + 1];

  if (user) {
    // find courseId from courseNode
    const { data: courseData } = await supabase
      .from("courses").select("id").eq("slug", courseNode.slug).single();

    const result = await completeSubsection(
      user.id,
      cur.subsectionId,
      cur.lessonId,
      courseData.id
    );
    awardXP(result); 
  }

  // existing local state update...
  setLessons(prev => prev.map(l => ({
    ...l,
    expanded: l.id === next.lessonId ? true : l.expanded,
    subsections: l.subsections.map(s => ({
      ...s,
      selected:  l.id === next.lessonId && s.id === next.subsectionId,
      completed: l.id === cur.lessonId  && s.id === cur.subsectionId ? true : s.completed,
    })),
  })));
};

  const handlePrev = () => {
    if (selectedIndex <= 0) return;
    const prev = flatOrder[selectedIndex - 1];
    setLessons(p => p.map(l => ({
      ...l,
      expanded: l.id === prev.lessonId ? true : l.expanded,
      subsections: l.subsections.map(s => ({
        ...s,
        selected: l.id === prev.lessonId && s.id === prev.subsectionId
      })),
    })));
  };

  return (
    <div className="bg-white min-h-screen flex flex-col text-[#191919]"
      style={{ fontFamily: '"Avenir Next","Poppins","Segoe UI",sans-serif' }}>
      <header className="sticky top-0 z-50 bg-white border-b border-[rgba(34,25,60,0.1)] px-6 flex-shrink-0">
        <div className="flex items-center justify-between h-[60px] gap-4">

          {/* ✅ Use onNavigate instead of undefined onBack */}
          <button
            onClick={() => onNavigate?.("pathways/neuroscience")}
            className="flex items-center gap-2 bg-transparent border-none cursor-pointer text-[#4d4766] text-[14px] font-bold py-1.5 flex-shrink-0"
          >
            <Icon type="chevL" size={16} color="#4d4766" /> All courses
          </button>

          <div className="flex-1 min-w-0 text-center">
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9490a8]">NeuroAcademy</div>
            {/* ✅ Use course.title (defined above) */}
            <div className="text-[15px] font-extrabold text-[#1a1628] tracking-[-0.02em] truncate">{course.title}</div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-[120px] h-1.5 bg-[#e9e7e8] rounded-full overflow-hidden">
              {/* ✅ Use course.progress */}
              <div className="h-full bg-[#7b61d9] rounded-full" style={{ width: `${course.progress}%` }} />
            </div>
            <span className="text-[12px] font-bold text-[#7b61d9]">{course.progress}%</span>
          </div>

          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="bg-transparent border border-[rgba(34,25,60,0.15)] rounded-lg cursor-pointer text-[#9490a8] p-1.5 flex items-center"
            >
              <Icon type="chevR" size={16} color="#9490a8" />
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {sidebarOpen && (
          <Sidebar
            lessons={lessons}
            onToggle={handleToggle}
            onSelect={handleSelect}
            onClose={() => setSidebarOpen(false)}
          />
        )}
        <LessonContent
          selectedLesson={selectedLesson}
          hasNext={selectedIndex >= 0 && selectedIndex < flatOrder.length - 1}
          hasPrev={selectedIndex > 0}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      </div>
    </div>
  );
}