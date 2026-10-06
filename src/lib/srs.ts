import type { PartProgress, Rating, PartStatus } from './types';

export const MS_PER_DAY = 86_400_000;

export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function newProgress(partId: string): PartProgress {
  return {
    partId,
    status: 'new',
    correct: 0,
    incorrect: 0,
    streak: 0,
    easeFactor: 2.5,
    intervalDays: 0,
    dueDate: todayISO(),
    lastReviewed: null,
    lastRating: null,
  };
}

/**
 * SM-2-inspired scheduling.
 * Again → relearn today (10 min). Hard → sooner than Good. Easy → far future.
 * Mastered items return every ~3 weeks for maintenance.
 */
export function applyRating(p: PartProgress, rating: Rating): PartProgress {
  const now = new Date();
  let { easeFactor, intervalDays, streak, correct, incorrect } = p;
  let status: PartStatus = p.status;

  if (rating === 'again') {
    incorrect += 1;
    streak = 0;
    easeFactor = Math.max(1.3, easeFactor - 0.2);
    intervalDays = 0;
    status = 'learning';
    const due = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes
    return { ...p, easeFactor, intervalDays, streak, correct, incorrect, status, dueDate: due.toISOString(), lastReviewed: now.toISOString(), lastRating: rating };
  }

  correct += 1;
  streak += 1;

  if (rating === 'hard') {
    easeFactor = Math.max(1.3, easeFactor - 0.15);
    intervalDays = Math.max(1, Math.round((intervalDays || 1) * 1.2));
  } else if (rating === 'good') {
    intervalDays = intervalDays === 0 ? 1 : Math.round(intervalDays * easeFactor);
  } else {
    // easy
    easeFactor = Math.min(3.0, easeFactor + 0.15);
    intervalDays = Math.max(1, Math.round((intervalDays || 1) * easeFactor * 1.4));
  }

  // Status ladder driven by consecutive correct + ease
  if (streak >= 5 && easeFactor >= 2.3) status = 'mastered';
  else if (streak >= 3) status = 'strong';
  else if (streak >= 1) status = 'familiar';

  if (status === 'mastered') intervalDays = Math.max(intervalDays, 21); // maintenance cadence

  const due = new Date(now.getTime() + intervalDays * MS_PER_DAY);
  return { ...p, easeFactor, intervalDays, streak, correct, incorrect, status, dueDate: due.toISOString(), lastReviewed: now.toISOString(), lastRating: rating };
}

export function isDue(p: PartProgress): boolean {
  return new Date(p.dueDate).getTime() <= Date.now();
}

export function dueLabel(p: PartProgress): string {
  const diff = new Date(p.dueDate).getTime() - Date.now();
  if (diff <= 0) return 'Due now';
  const mins = Math.round(diff / 60000);
  if (mins < 60) return `Due in ${mins} min`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `Due in ${hours} h`;
  const days = Math.round(hours / 24);
  return `Due in ${days} day${days === 1 ? '' : 's'}`;
}

export function whyDue(p: PartProgress): string {
  if (p.lastRating === 'again') return 'You rated this “Again” — it comes back quickly.';
  if (p.lastRating === 'hard') return 'Rated “Hard” — scheduled sooner to reinforce it.';
  if (p.status === 'mastered') return 'Mastered items return occasionally for maintenance.';
  if (p.status === 'learning') return 'Still in the learning stage — short intervals build memory.';
  return 'The spaced-repetition schedule says it’s time to refresh this memory.';
}

export const STATUS_META: Record<PartStatus, { label: string; color: string }> = {
  new: { label: 'New', color: 'text-muted-foreground' },
  learning: { label: 'Learning', color: 'text-coral' },
  familiar: { label: 'Familiar', color: 'text-amber' },
  strong: { label: 'Strong', color: 'text-teal' },
  mastered: { label: 'Mastered', color: 'text-violet-2' },
};

export const XP = {
  flashcardCorrect: 5,
  flashcardAgain: 1,
  quizComplete: 25,
  lessonComplete: 50,
  reviewDifficult: 8,
  streakDay: 10,
};
