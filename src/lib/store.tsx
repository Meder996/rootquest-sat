import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import type { AppState, PartProgress, QuizAttempt, Rating, Profile, DayActivity } from './types';
import { applyRating, newProgress, todayISO, XP } from './srs';
import { WORD_PARTS } from '../data/wordParts';
import { ACHIEVEMENTS } from '../data/achievements';
import type { AchievementStats } from '../data/achievements';
import { QUESTION_BANK } from '../data/questions';

const STORAGE_KEY = 'rootquest-sat-v1';

const initialState: AppState = {
  profile: { name: '', dailyGoal: 15, satDate: 'not-sure', onboarded: false, theme: 'dark' },
  progress: {},
  savedWords: [],
  quizAttempts: [],
  achievements: [],
  xp: 0,
  activity: {},
  mistakes: {},
  mistakesFixed: 0,
  lastActiveDate: null,
  streak: 0,
};

type Action =
  | { type: 'ONBOARD'; profile: Profile }
  | { type: 'UPDATE_PROFILE'; profile: Partial<Profile> }
  | { type: 'RATE_PART'; partId: string; rating: Rating }
  | { type: 'RECORD_QUIZ'; attempt: QuizAttempt }
  | { type: 'SAVE_WORD'; partId: string }
  | { type: 'UNSAVE_WORD'; partId: string }
  | { type: 'ADD_XP'; amount: number }
  | { type: 'UNLOCK'; ids: string[] }
  | { type: 'RESET' };

function bumpActivity(state: AppState, xp: number, correct: number, total: number, reviews: number): AppState {
  const today = todayISO();
  const prev: DayActivity = state.activity[today] ?? { date: today, xp: 0, reviews: 0, correct: 0, total: 0 };
  const activity = {
    ...state.activity,
    [today]: { date: today, xp: prev.xp + xp, reviews: prev.reviews + reviews, correct: prev.correct + correct, total: prev.total + total },
  };

  // streak
  let streak = state.streak;
  let lastActiveDate = state.lastActiveDate;
  if (lastActiveDate !== today) {
    const yesterday = new Date(Date.now() - 86400000);
    const yISO = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
    streak = lastActiveDate === yISO ? streak + 1 : 1;
    lastActiveDate = today;
  }
  return { ...state, activity, streak, lastActiveDate, xp: state.xp + xp };
}

function computeStats(state: AppState): AchievementStats {
  const parts = Object.values(state.progress);
  const correctAnswers = parts.reduce((a, p) => a + p.correct, 0);
  const rootsMastered = parts.filter((p) => p.status === 'mastered' && WORD_PARTS.find((w) => w.id === p.partId)?.type === 'root').length;
  return {
    partsReviewed: parts.length,
    prefixesStudied: parts.filter((p) => WORD_PARTS.find((w) => w.id === p.partId)?.type === 'prefix').length,
    rootsMastered,
    streakDays: state.streak,
    correctAnswers,
    quizzesCompleted: state.quizAttempts.filter((q) => q.completed).length,
    perfectQuizzes: state.quizAttempts.filter((q) => q.completed && q.score === q.total && q.total > 0).length,
    mistakesFixed: state.mistakesFixed,
    savedWords: state.savedWords.length,
    arenaRuns: state.quizAttempts.filter((q) => q.mode === 'arena' && q.completed).length,
    xp: state.xp,
  };
}

function checkAchievements(state: AppState): AppState {
  const stats = computeStats(state);
  const newly = ACHIEVEMENTS.filter((a) => !state.achievements.includes(a.id) && a.check(stats)).map((a) => a.id);
  if (newly.length === 0) return state;
  return { ...state, achievements: [...state.achievements, ...newly], xp: state.xp + newly.length * 20 };
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ONBOARD': {
      return { ...state, profile: action.profile };
    }
    case 'UPDATE_PROFILE': {
      return { ...state, profile: { ...state.profile, ...action.profile } };
    }
    case 'RATE_PART': {
      const prev: PartProgress = state.progress[action.partId] ?? newProgress(action.partId);
      const next = applyRating(prev, action.rating);
      const xpGain = action.rating === 'again' ? XP.flashcardAgain : action.rating === 'hard' ? XP.reviewDifficult : XP.flashcardCorrect;
      let s: AppState = {
        ...state,
        progress: { ...state.progress, [action.partId]: next },
      };
      s = bumpActivity(s, xpGain, action.rating === 'again' ? 0 : 1, 1, 1);
      return checkAchievements(s);
    }
    case 'RECORD_QUIZ': {
      let mistakes = { ...state.mistakes };
      let mistakesFixed = state.mistakesFixed;
      for (const ans of action.attempt.answers) {
        const key = ans.questionId;
        if (!ans.correct) {
          mistakes[key] = (mistakes[key] ?? 0) + 1;
        } else if (mistakes[key]) {
          // previously missed, now correct
          delete mistakes[key];
          mistakesFixed += 1;
        }
      }
      // update per-part progress from quiz answers
      const progress = { ...state.progress };
      for (const ans of action.attempt.answers) {
        if (!ans.partId || !WORD_PARTS.some((w) => w.id === ans.partId)) continue;
        const prev: PartProgress = progress[ans.partId] ?? newProgress(ans.partId);
        progress[ans.partId] = applyRating(prev, ans.correct ? 'good' : 'again');
      }
      let s: AppState = { ...state, progress, mistakes, mistakesFixed, quizAttempts: [...state.quizAttempts, action.attempt] };
      const correct = action.attempt.answers.filter((a) => a.correct).length;
      s = bumpActivity(s, action.attempt.completed ? XP.quizComplete : 0, correct, action.attempt.answers.length, 0);
      return checkAchievements(s);
    }
    case 'SAVE_WORD': {
      if (state.savedWords.includes(action.partId)) return state;
      return checkAchievements({ ...state, savedWords: [...state.savedWords, action.partId] });
    }
    case 'UNSAVE_WORD': {
      return { ...state, savedWords: state.savedWords.filter((id) => id !== action.partId) };
    }
    case 'ADD_XP': {
      let s: AppState = { ...state };
      s = bumpActivity(s, action.amount, 0, 0, 0);
      return checkAchievements(s);
    }
    case 'UNLOCK': {
      const newly = action.ids.filter((id) => !state.achievements.includes(id));
      return { ...state, achievements: [...state.achievements, ...newly] };
    }
    case 'RESET': {
      return { ...initialState };
    }
    default:
      return state;
  }
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as AppState;
    return { ...initialState, ...parsed, profile: { ...initialState.profile, ...parsed.profile } };
  } catch {
    return initialState;
  }
}

interface StoreCtx {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  stats: AchievementStats;
}

const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    document.documentElement.classList.toggle('light', state.profile.theme === 'light');
    document.documentElement.classList.toggle('dark', state.profile.theme !== 'light');
  }, [state.profile.theme]);

  const stats = useMemo(() => computeStats(state), [state]);

  return <Ctx.Provider value={{ state, dispatch, stats }}>{children}</Ctx.Provider>;
}

export function useStore(): StoreCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}

export function useDueParts(): { due: PartProgress[]; upcoming: PartProgress[] } {
  const { state } = useStore();
  return useMemo(() => {
    const all = Object.values(state.progress);
    const due = all.filter((p) => new Date(p.dueDate).getTime() <= Date.now()).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    const upcoming = all.filter((p) => new Date(p.dueDate).getTime() > Date.now()).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    return { due, upcoming };
  }, [state.progress]);
}

export function getPart(id: string) {
  return WORD_PARTS.find((p) => p.id === id);
}

export { QUESTION_BANK };
