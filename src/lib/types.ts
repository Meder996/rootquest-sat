export type PartStatus = 'new' | 'learning' | 'familiar' | 'strong' | 'mastered';
export type Rating = 'again' | 'hard' | 'good' | 'easy';

export interface PartProgress {
  partId: string;
  status: PartStatus;
  correct: number;
  incorrect: number;
  streak: number; // consecutive correct
  easeFactor: number; // SM-2 style, starts 2.5
  intervalDays: number;
  dueDate: string; // ISO date
  lastReviewed: string | null;
  lastRating: Rating | null;
}

export interface QuizAnswerRecord {
  questionId: string;
  partId: string;
  chosen: number;
  correct: boolean;
  responseMs: number;
}

export interface QuizAttempt {
  id: string;
  mode: 'standard' | 'arena';
  category: string;
  score: number;
  total: number;
  durationMs: number;
  date: string; // ISO
  answers: QuizAnswerRecord[];
  completed: boolean;
}

export interface Profile {
  name: string;
  dailyGoal: number; // reviews per day
  satDate: string | 'not-sure';
  onboarded: boolean;
  theme: 'dark' | 'light';
}

export interface DayActivity {
  date: string; // YYYY-MM-DD
  xp: number;
  reviews: number;
  correct: number;
  total: number;
}

export interface AppState {
  profile: Profile;
  progress: Record<string, PartProgress>;
  savedWords: string[];
  quizAttempts: QuizAttempt[];
  achievements: string[];
  xp: number;
  activity: Record<string, DayActivity>;
  mistakes: Record<string, number>; // questionId -> times missed
  mistakesFixed: number;
  lastActiveDate: string | null;
  streak: number;
}
