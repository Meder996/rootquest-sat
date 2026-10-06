import { Sprout, Compass, Flame, Target, BookOpenCheck, Eraser, TreePine, Zap, BookmarkCheck, Award, Timer, Swords } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  check: (s: AchievementStats) => boolean;
}

export interface AchievementStats {
  partsReviewed: number;
  prefixesStudied: number;
  rootsMastered: number;
  streakDays: number;
  correctAnswers: number;
  quizzesCompleted: number;
  perfectQuizzes: number;
  mistakesFixed: number;
  savedWords: number;
  arenaRuns: number;
  xp: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-root',
    name: 'First Root Learned',
    description: 'Review your very first word part',
    icon: Sprout,
    check: (s) => s.partsReviewed >= 1,
  },
  {
    id: 'prefix-explorer',
    name: 'Prefix Explorer',
    description: 'Study 10 different prefixes',
    icon: Compass,
    check: (s) => s.prefixesStudied >= 10,
  },
  {
    id: 'seven-day-streak',
    name: 'Seven-Day Streak',
    description: 'Study 7 days in a row',
    icon: Flame,
    check: (s) => s.streakDays >= 7,
  },
  {
    id: 'hundred-correct',
    name: '100 Correct Answers',
    description: 'Answer 100 questions correctly',
    icon: Target,
    check: (s) => s.correctAnswers >= 100,
  },
  {
    id: 'quiz-starter',
    name: 'Quiz Starter',
    description: 'Complete your first quiz',
    icon: BookOpenCheck,
    check: (s) => s.quizzesCompleted >= 1,
  },
  {
    id: 'perfect-quiz',
    name: 'Flawless Round',
    description: 'Score 100% on a quiz',
    icon: Award,
    check: (s) => s.perfectQuizzes >= 1,
  },
  {
    id: 'error-fixer',
    name: 'Error Fixer',
    description: 'Correct 10 questions you once missed',
    icon: Eraser,
    check: (s) => s.mistakesFixed >= 10,
  },
  {
    id: 'root-ranger',
    name: 'Root Forest Complete',
    description: 'Master 15 roots',
    icon: TreePine,
    check: (s) => s.rootsMastered >= 15,
  },
  {
    id: 'word-collector',
    name: 'Word Collector',
    description: 'Save 10 words to your collection',
    icon: BookmarkCheck,
    check: (s) => s.savedWords >= 10,
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Finish a Speed Round in the SAT Arena',
    icon: Timer,
    check: (s) => s.arenaRuns >= 1,
  },
  {
    id: 'xp-veteran',
    name: 'Arena Veteran',
    description: 'Earn 1,000 XP',
    icon: Swords,
    check: (s) => s.xp >= 1000,
  },
  {
    id: 'power-scholar',
    name: 'Power Scholar',
    description: 'Earn 5,000 XP',
    icon: Zap,
    check: (s) => s.xp >= 5000,
  },
];

export interface Lesson {
  id: string;
  title: string;
  description: string;
  partIds: string[];
}

export const LESSONS: Lesson[] = [
  {
    id: 'lesson-direction',
    title: 'Directions & Position',
    description: 'Pre-, post-, sub-, super-, trans-: learn where words point.',
    partIds: ['pre-pre', 'pre-post', 'pre-sub', 'pre-super', 'pre-trans', 'pre-inter', 'pre-intra', 'pre-circum'],
  },
  {
    id: 'lesson-good-evil',
    title: 'Good vs. Evil',
    description: 'Bene-, mal-, eu-, dys-: the moral compass of vocabulary.',
    partIds: ['pre-bene', 'pre-mal', 'pre-eu', 'pre-dys', 'rt-pac', 'rt-bell'],
  },
  {
    id: 'lesson-speak',
    title: 'Speaking & Writing',
    description: 'Dict, scrib/script, loqu, voc: the language of language.',
    partIds: ['rt-dict', 'rt-scrib', 'rt-loqu', 'rt-voc', 'rt-verb', 'rt-graph', 'rt-log'],
  },
  {
    id: 'lesson-mind',
    title: 'Mind & Knowledge',
    description: 'Sci, cogn, cred, mem: how words think.',
    partIds: ['rt-sci', 'rt-cogn', 'rt-cred', 'rt-mem', 'rt-anim'],
  },
  {
    id: 'lesson-time',
    title: 'Time & Sequence',
    description: 'Chron, sequ, fin: words on a timeline.',
    partIds: ['rt-chron', 'rt-sequ', 'rt-fin', 'pre-ante', 'pre-retro', 'pre-fore'],
  },
  {
    id: 'lesson-senses',
    title: 'The Senses',
    description: 'Aud, spec/spic, vid/vis, tact, phon: see, hear, touch.',
    partIds: ['rt-aud', 'rt-spec', 'rt-vid', 'rt-tact', 'rt-phon', 'rt-son'],
  },
  {
    id: 'lesson-power',
    title: 'Power & Law',
    description: 'Arch, jur, pot: ruling words.',
    partIds: ['rt-arch', 'rt-jur', 'rt-pot', 'pre-omni'],
  },
  {
    id: 'lesson-body-earth',
    title: 'Body & Earth',
    description: 'Corp, ped, man, terr, bio: the physical world.',
    partIds: ['rt-corp', 'rt-ped', 'rt-man', 'rt-terr', 'rt-bio', 'rt-mort', 'rt-viv'],
  },
  {
    id: 'lesson-change',
    title: 'Change & Movement',
    description: 'Vert/vers, mob/mot, tract, grad/gress: words in motion.',
    partIds: ['rt-vert', 'rt-mob', 'rt-tract', 'rt-grad', 'rt-rupt', 'rt-fract', 'rt-flect'],
  },
  {
    id: 'lesson-builders',
    title: 'Word Builders',
    description: 'The suffixes that reshape grammar: -ion, -ity, -ize, -ous.',
    partIds: ['suf-ion', 'suf-ity', 'suf-ize', 'suf-ous', 'suf-able', 'suf-ive', 'suf-fy', 'suf-less'],
  },
];
