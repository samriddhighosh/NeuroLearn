import { Clock, BookOpen, ArrowLeft, ArrowRight } from 'lucide-react';
import { contentById } from "../data/lesson-content";

interface SelectedLesson {
  lessonTitle: string;
  subsectionId: string;
  subsectionTitle: string;
}

interface LessonContentProps {
  selectedLesson?: SelectedLesson;
  onNextLesson?: () => void;
  onPreviousLesson?: () => void;
  hasNextLesson?: boolean;
  hasPreviousLesson?: boolean;
}

export function LessonContent({
  selectedLesson,
  onNextLesson,
  onPreviousLesson,
  hasNextLesson = false,
  hasPreviousLesson = false,
}: LessonContentProps) {
  const lessonIdLabel = selectedLesson ? `Lesson ${selectedLesson.subsectionId}` : "Lesson";
  const lessonTitle = selectedLesson?.subsectionTitle ?? "Select a lesson";
  const lessonSubtitle = selectedLesson?.lessonTitle ?? "Information content TBD";
  const selectedId = selectedLesson?.subsectionId;

  const contentEntry = selectedId ? contentById[selectedId] : undefined;
  const meta = contentEntry?.meta;

  return (
    /* Main Content Container */
    <main className="flex-1 overflow-y-auto bg-background-primary">
      {/* Content Wrapper with Max Width */}
      <div className="max-w-5xl mx-auto p-6 lg:p-8 xl:p-12">
        {/* Lesson Header Section */}
        <div className="mb-8">
          {/* Lesson Number Badge */}
          <div 
            className="text-sm font-medium mb-2"
            style={{ 
              background: 'linear-gradient(to right, var(--brand-color-start), var(--brand-color-end))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {lessonIdLabel}
          </div>
          {/* Lesson Title */}
          <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mb-2">{lessonTitle}</h2>
          <p className="text-text-secondary text-body-md">{lessonSubtitle}</p>
          {meta ? (
            <div className="flex items-center gap-6 text-text-secondary text-body-sm mt-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{meta.readingTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{meta.difficulty}</span>
              </div>
            </div>
          ) : null}
        </div>

        {/* Lesson Content Section */}
        {contentEntry ? (
          <>{contentEntry.body}</>
        ) : (
          <div className="bg-background-secondary rounded-lg border border-border-primary p-6 lg:p-8">
            <p className="text-text-secondary text-body-md">Information content TBD</p>
          </div>
        )}

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border-primary">
          <button
            className="flex items-center gap-2 px-4 py-2 text-text-secondary hover:text-text-primary transition-colors text-body-md disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onPreviousLesson}
            disabled={!hasPreviousLesson}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Previous Lesson</span>
          </button>
          <button
            className="flex items-center gap-2 px-6 py-3 text-text-on-color rounded-lg transition-all text-body-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: '#6f2bae' }}
            onClick={onNextLesson}
            disabled={!hasNextLesson}
          >
            <span>Next Lesson</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </main>
  );
}