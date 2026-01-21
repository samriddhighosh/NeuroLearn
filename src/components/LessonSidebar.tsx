import { CheckCircle, Circle, ChevronDown, ChevronRight, PanelLeft } from 'lucide-react';
import type { Lesson, Subsection } from "../data/lessons";

const brainIcon = "/assets/Brain Circuit.png";

interface LessonSidebarProps {
  lessons: Lesson[];
  onToggleLesson: (lessonId: number) => void;
  onSelectSubsection: (lessonId: number, subsectionId: string) => void;
  onToggleSidebar: () => void;
}

export function LessonSidebar({
  lessons,
  onToggleLesson,
  onSelectSubsection,
  onToggleSidebar,
}: LessonSidebarProps) {
  const calculateProgress = (subsections: Subsection[]) => {
    const completed = subsections.filter(s => s.completed).length;
    return Math.round((completed / subsections.length) * 100);
  };

  return (
    /* Sidebar Container */
    <aside className="relative w-80 lg:w-96 bg-background-secondary border-r border-border-primary overflow-y-auto flex-shrink-0">
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label="Hide sidebar"
        className="absolute -right-4 top-24 -translate-y-1/2 rounded-full border border-border-primary bg-background-secondary p-2 text-text-secondary shadow-sm hover:text-text-primary transition-colors"
      >
        <PanelLeft className="w-4 h-4" />
      </button>
      {/* Sidebar Content Wrapper */}
      <div className="p-4 lg:p-6">
      {/* Course Subject Header */}
      <div className="mb-6 border border-border-primary rounded-lg p-4 bg-background-primary">
        {/* Course Title Section */}
        <div className="flex items-start gap-3">
          {/* Course Icon */}
          <img src={brainIcon} alt="Brain Circuit" className="w-10 h-10" />
          {/* Course Title and Level */}
          <div>
            <h2 className="text-heading-md text-text-primary">Computational Neuroscience</h2>
            <p className="text-body-sm text-text-secondary">Level 3: Advanced Topics</p>
          </div>
        </div>
      </div>
      
      {/* Lessons List Container */}
      <div className="space-y-4">
        {lessons.map((lesson) => {
          const progress = calculateProgress(lesson.subsections);
          
          return (
            /* Lesson Card */
            <div key={lesson.id} className="border border-border-primary rounded-lg overflow-hidden">
              {/* Lesson Header Button */}
              <button
                onClick={() => onToggleLesson(lesson.id)}
                className="w-full px-4 py-3 bg-background-primary hover:bg-gray-100 transition-colors"
              >
                {/* Lesson Title Row */}
                <div className="flex items-center justify-between mb-2">
                  {/* Lesson Number and Title */}
                  <div className="flex items-center gap-3">
                    {/* Lesson Number Badge */}
                    <span 
                      className="flex items-center justify-center w-8 h-8 text-text-on-color rounded-full text-sm font-semibold"
                      style={{ background: '#6f2bae' }}
                    >
                      {lesson.id}
                    </span>
                    {/* Lesson Title */}
                    <span className="font-medium text-text-primary text-left text-body-md">{lesson.title}</span>
                  </div>
                  {/* Expand/Collapse Icon */}
                  {lesson.expanded ? (
                    <ChevronDown className="w-5 h-5 text-text-secondary flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-text-secondary flex-shrink-0" />
                  )}
                </div>
                
                {/* Progress Bar Section */}
                <div className="ml-11">
                  <div className="flex items-center gap-2">
                    {/* Progress Bar Track */}
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      {/* Progress Bar Fill */}
                      <div 
                        className="h-full transition-all duration-300 rounded-full"
                        style={{ 
                          width: `${progress}%`,
                          background: progress === 100 
                            ? '#53dde4' 
                            : 'linear-gradient(to right, var(--brand-color-start), var(--brand-color-end))'
                        }}
                      />
                    </div>
                    {/* Progress Percentage Text */}
                    <span className="text-text-secondary w-10 text-right text-body-sm">
                      {progress}%
                    </span>
                  </div>
                </div>
              </button>
            
              {/* Subsections List (Expandable) */}
              {lesson.expanded && (
                <div className="bg-background-secondary">
                  {lesson.subsections.map((subsection) => (
                    /* Subsection Item */
                    <button
                      key={subsection.id}
                      onClick={() => onSelectSubsection(lesson.id, subsection.id)}
                      className={`w-full px-4 py-3 flex items-center gap-3 transition-colors border-t border-gray-100 ${
                        subsection.selected 
                          ? 'border-l-4' 
                          : 'hover:bg-background-primary'
                      }`}
                      style={subsection.selected ? { borderLeftColor: 'var(--brand-color-end)', backgroundColor: '#f5f5f5' } : {}}
                    >
                      {/* Completion Status Icon */}
                      {subsection.completed ? (
                        <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--brand-color-end)' }} />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                      )}
                      {/* Subsection Details */}
                      <div className="text-left flex-1">
                        {/* Subsection ID */}
                        <div 
                          className="text-body-sm font-medium"
                          style={subsection.selected ? {
                            background: 'linear-gradient(to right, var(--brand-color-start), var(--brand-color-end))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                          } : { color: '#0b0214' }}
                        >
                          {subsection.id}
                        </div>
                        {/* Subsection Title */}
                        <div 
                          className={`text-body-sm ${subsection.selected ? 'font-semibold' : ''}`}
                          style={{ color: '#0b0214' }}
                        >
                          {subsection.title}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      </div>
    </aside>
  );
}