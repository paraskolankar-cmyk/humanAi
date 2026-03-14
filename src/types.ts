export interface UserProgress {
  id: number;
  date: string;
  score: number;
  tasksCompleted: number;
  level: string;
}

export interface LearningTask {
  id: string;
  type: 'sentence' | 'quiz' | 'vocabulary';
  content: string;
  options?: string[];
  correctAnswer?: string;
  translation?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: number;
  correction?: {
    original: string;
    corrected: string;
    explanation: string;
    translation: string;
  };
}
