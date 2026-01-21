"use client";

import { ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Header } from "../components/Header";
import { LessonSidebar } from "../components/LessonSidebar";
import { LessonContent } from "../components/LessonContent";
import { initialLessons, type Lesson } from "../data/lessons";

export default function Page() {
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const flatLessonOrder = useMemo(
    () =>
      lessons.flatMap((lesson) =>
        lesson.subsections.map((subsection) => ({
          lessonId: lesson.id,
          subsectionId: subsection.id,
        }))
      ),
    [lessons]
  );

  const selectedIndex = useMemo(() => {
    let index = 0;
    let foundIndex = -1;
    lessons.forEach((lesson) => {
      lesson.subsections.forEach((subsection) => {
        if (subsection.selected) {
          foundIndex = index;
        }
        index += 1;
      });
    });
    return foundIndex;
  }, [lessons]);

  const selectedLesson = useMemo(() => {
    for (const lesson of lessons) {
      const selectedSubsection = lesson.subsections.find((subsection) => subsection.selected);
      if (selectedSubsection) {
        return {
          lessonTitle: lesson.title,
          subsectionId: selectedSubsection.id,
          subsectionTitle: selectedSubsection.title,
        };
      }
    }
    return undefined;
  }, [lessons]);

  const handleToggleLesson = (lessonId: number) => {
    setLessons((prevLessons) =>
      prevLessons.map((lesson) =>
        lesson.id === lessonId ? { ...lesson, expanded: !lesson.expanded } : lesson
      )
    );
  };

  const handleSelectSubsection = (lessonId: number, subsectionId: string) => {
    setLessons((prevLessons) =>
      prevLessons.map((lesson) => ({
        ...lesson,
        subsections: lesson.subsections.map((subsection) => ({
          ...subsection,
          selected: lesson.id === lessonId && subsection.id === subsectionId,
        })),
      }))
    );
  };

  const handleNextLesson = () => {
    setLessons((prevLessons) => {
      const order: { lessonId: number; subsectionId: string }[] = [];
      let currentIndex = -1;

      prevLessons.forEach((lesson) => {
        lesson.subsections.forEach((subsection) => {
          if (subsection.selected) {
            currentIndex = order.length;
          }
          order.push({ lessonId: lesson.id, subsectionId: subsection.id });
        });
      });

      if (currentIndex === -1 || currentIndex >= order.length - 1) {
        return prevLessons;
      }

      const current = order[currentIndex];
      const next = order[currentIndex + 1];

      return prevLessons.map((lesson) => {
        const shouldExpand = lesson.id === next.lessonId ? true : lesson.expanded;
        return {
          ...lesson,
          expanded: shouldExpand,
          subsections: lesson.subsections.map((subsection) => {
            const isCurrent = lesson.id === current.lessonId && subsection.id === current.subsectionId;
            const isNext = lesson.id === next.lessonId && subsection.id === next.subsectionId;
            return {
              ...subsection,
              selected: isNext,
              completed: isCurrent ? true : subsection.completed,
            };
          }),
        };
      });
    });
  };

  const handlePreviousLesson = () => {
    setLessons((prevLessons) => {
      const order: { lessonId: number; subsectionId: string }[] = [];
      let currentIndex = -1;

      prevLessons.forEach((lesson) => {
        lesson.subsections.forEach((subsection) => {
          if (subsection.selected) {
            currentIndex = order.length;
          }
          order.push({ lessonId: lesson.id, subsectionId: subsection.id });
        });
      });

      if (currentIndex <= 0) {
        return prevLessons;
      }

      const previous = order[currentIndex - 1];

      return prevLessons.map((lesson) => {
        const shouldExpand = lesson.id === previous.lessonId ? true : lesson.expanded;
        return {
          ...lesson,
          expanded: shouldExpand,
          subsections: lesson.subsections.map((subsection) => ({
            ...subsection,
            selected: lesson.id === previous.lessonId && subsection.id === previous.subsectionId,
          })),
        };
      });
    });
  };

  return (
    <div className="min-h-screen bg-background-primary flex flex-col">
      <Header />
      <div className="relative flex flex-1 overflow-hidden">
        {isSidebarVisible ? (
          <LessonSidebar
            lessons={lessons}
            onToggleLesson={handleToggleLesson}
            onSelectSubsection={handleSelectSubsection}
            onToggleSidebar={() => setIsSidebarVisible((prev) => !prev)}
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsSidebarVisible(true)}
            aria-label="Show sidebar"
            className="absolute left-0 top-24 -translate-y-1/2 rounded-full border border-border-primary bg-background-secondary p-2 text-text-secondary shadow-sm hover:text-text-primary transition-colors z-10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
        <LessonContent
          selectedLesson={selectedLesson}
          onNextLesson={handleNextLesson}
          onPreviousLesson={handlePreviousLesson}
          hasNextLesson={selectedIndex >= 0 && selectedIndex < flatLessonOrder.length - 1}
          hasPreviousLesson={selectedIndex > 0}
        />
      </div>
    </div>
  );
}
