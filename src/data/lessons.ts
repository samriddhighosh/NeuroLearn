export interface Subsection {
  id: string;
  title: string;
  completed: boolean;
  selected?: boolean;
}

export interface Lesson {
  id: number;
  title: string;
  subsections: Subsection[];
  expanded: boolean;
}

export const initialLessons: Lesson[] = [
  {
    id: 1,
    title: "Neural Encoding & Decoding",
    expanded: true,
    subsections: [
      { id: "3.1", title: "Neural code: rate coding vs. temporal coding", completed: false },
      { id: "3.1.2", title: "Receptive fields & tuning curves", completed: false },
      {
        id: "3.1.3",
        title: "Decoding methods: linear classifiers, correlation-based decoding",
        completed: false,
      },
      { id: "Project", title: "Build a Simple Tuning Curve Model", completed: false },
    ],
  },
  {
    id: 2,
    title: "Neural Population Models",
    expanded: false,
    subsections: [
      { id: "3.2.1", title: "Wilson–Cowan equations", completed: false },
      {
        id: "3.2.2",
        title: "Emergent behavior: oscillations, synchronization, and stability analysis",
        completed: false,
      },
      {
        id: "3.2.3",
        title: "Applications to disorders such as epilepsy and Parkinson's disease",
        completed: false,
      },
      { id: "Project", title: "Wilson–Cowan Model Simulation Project in Python", completed: false },
    ],
  },
  {
    id: 3,
    title: "Brain-Computer Interfaces (BCI's)",
    expanded: false,
    subsections: [
      { id: "3.3.1", title: "Introduction to BCIs: invasive vs. non-invasive approaches", completed: false },
      { id: "3.3.2", title: "Feature extraction from neural signals", completed: false },
      {
        id: "3.3.3",
        title: "Machine Learning for Motor Imagery Neural Activity Classification",
        completed: false,
      },
      { id: "Project", title: "Develop an EEG Motor Imagery Pipeline", completed: false },
    ],
  },
  {
    id: 4,
    title: "Deep Learning in Neuroscience",
    expanded: true,
    subsections: [
      {
        id: "3.4.1",
        title: "How Deep Learning Models Work (Layers and Computation)",
        completed: false,
        selected: true,
      },
    ],
  },
];
