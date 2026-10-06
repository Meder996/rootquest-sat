import { WORD_PARTS } from './wordParts';
import type { WordPart } from './wordParts';

export type QuestionType =
  | 'meaning'
  | 'infer'
  | 'example'
  | 'context'
  | 'complete'
  | 'compare';

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  passage?: string;
  choices: string[];
  answer: number; // index into choices
  explanation: string;
  partId: string;
  category: 'prefix' | 'root' | 'suffix' | 'mixed';
  difficulty: 1 | 2 | 3;
}

// Deterministic PRNG so the bank is stable across loads
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20261006);
const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];

function shuffleWithAnswer(choices: string[], correctIdx: number): { choices: string[]; answer: number } {
  const idx = choices.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return { choices: idx.map((i) => choices[i]), answer: idx.indexOf(correctIdx) };
}

function distractorMeanings(part: WordPart, count: number): string[] {
  const pool = WORD_PARTS.filter((p) => p.id !== part.id && p.type === part.type && p.meaning !== part.meaning);
  const out: string[] = [];
  while (out.length < count && pool.length) {
    const c = pick(pool);
    if (!out.includes(c.meaning)) out.push(c.meaning);
    pool.splice(pool.indexOf(c), 1);
  }
  return out;
}

function distractorWords(part: WordPart, count: number): string[] {
  const all = WORD_PARTS.flatMap((p) => p.examples.map((e) => e.word));
  const own = new Set(part.examples.map((e) => e.word));
  const pool = [...new Set(all.filter((w) => !own.has(w)))];
  const out: string[] = [];
  while (out.length < count && pool.length) {
    const c = pick(pool);
    out.push(c);
    pool.splice(pool.indexOf(c), 1);
  }
  return out;
}

function distractorDefs(part: WordPart, wordIdx: number, count: number): string[] {
  const target = part.examples[wordIdx];
  const pool: { word: string; def: string }[] = [];
  for (const p of WORD_PARTS) {
    for (const e of p.examples) {
      if (e.word !== target.word && e.definition !== target.definition) pool.push({ word: e.word, def: e.definition });
    }
  }
  const out: string[] = [];
  while (out.length < count && pool.length) {
    const c = pick(pool);
    if (!out.includes(c.def)) out.push(c.def);
    pool.splice(pool.indexOf(c), 1);
  }
  return out;
}

const QUESTIONS: Question[] = [];
let qn = 0;
const qid = () => `q${++qn}`;

for (const part of WORD_PARTS) {
  const typeLabel = part.type;
  const display = part.part;

  // 1. Meaning
  {
    const choices = [part.meaning, ...distractorMeanings(part, 3)];
    const { choices: shuffled, answer } = shuffleWithAnswer(choices, 0);
    QUESTIONS.push({
      id: qid(),
      type: 'meaning',
      prompt: `What does the ${typeLabel} “${display}” mean?`,
      choices: shuffled,
      answer,
      explanation: `“${display}” comes from ${part.origin} and means “${part.meaning}.” ${part.clue}`,
      partId: part.id,
      category: part.type,
      difficulty: part.difficulty,
    });
  }

  // 2. Infer meaning of example word
  for (let w = 0; w < part.examples.length; w++) {
    const ex = part.examples[w];
    const choices = [ex.definition, ...distractorDefs(part, w, 3)];
    const { choices: shuffled, answer } = shuffleWithAnswer(choices, 0);
    QUESTIONS.push({
      id: qid(),
      type: 'infer',
      prompt: `Knowing that “${display}” means “${part.meaning},” what does “${ex.word}” most nearly mean?`,
      choices: shuffled,
      answer,
      explanation: `“${ex.word}” builds on “${display}” (${part.meaning}): it means “${ex.definition}.”`,
      partId: part.id,
      category: part.type,
      difficulty: part.difficulty,
    });
  }

  // 3. Which word uses the part
  {
    const choices = [part.examples[0].word, ...distractorWords(part, 3)];
    const { choices: shuffled, answer } = shuffleWithAnswer(choices, 0);
    QUESTIONS.push({
      id: qid(),
      type: 'example',
      prompt: `Which word is built from the ${typeLabel} “${display}” (${part.meaning})?`,
      choices: shuffled,
      answer,
      explanation: `“${part.examples[0].word}” contains “${display}.” ${part.clue}`,
      partId: part.id,
      category: part.type,
      difficulty: part.difficulty,
    });
  }

  // 4. Vocabulary in context
  {
    const ex = part.examples[part.examples.length - 1];
    const choices = [ex.definition, ...distractorDefs(part, part.examples.length - 1, 3)];
    const { choices: shuffled, answer } = shuffleWithAnswer(choices, 0);
    QUESTIONS.push({
      id: qid(),
      type: 'context',
      prompt: `In this sentence, “${ex.word}” most nearly means…`,
      passage: ex.sentence,
      choices: shuffled,
      answer,
      explanation: `Here “${ex.word}” means “${ex.definition}.” The context clue is in how the sentence uses it.`,
      partId: part.id,
      category: part.type,
      difficulty: part.difficulty,
    });
  }

  // 5. Complete the sentence
  {
    const ex = part.examples[0];
    const blanked = ex.sentence.replace(new RegExp(ex.word, 'i'), '_____');
    if (blanked !== ex.sentence) {
      const choices = [ex.word, ...distractorWords(part, 3)];
      const { choices: shuffled, answer } = shuffleWithAnswer(choices, 0);
      QUESTIONS.push({
        id: qid(),
        type: 'complete',
        prompt: 'Choose the word that best completes the sentence.',
        passage: blanked,
        choices: shuffled,
        answer,
        explanation: `“${ex.word}” means “${ex.definition},” which fits the sentence.`,
        partId: part.id,
        category: part.type,
        difficulty: part.difficulty,
      });
    }
  }
}

// 6. Confusing-pair comparisons (hand-built from the study guide's confusing pairs)
const OPPOSITE_PAIRS: [string, string][] = [
  ['pre-hyper', 'pre-hypo'],
  ['pre-bene', 'pre-mal'],
  ['pre-ante', 'pre-post'],
  ['pre-eu', 'pre-dys'],
  ['pre-inter', 'pre-intra'],
  ['pre-anti', 'pre-pro'],
  ['pre-micro', 'pre-multi'],
  ['pre-mono', 'pre-poly'],
];
const SIMILAR_PAIRS: [string, string][] = [
  ['pre-con', 'pre-syn'],
  ['rt-vid', 'rt-spec'],
  ['rt-loqu', 'rt-dict'],
  ['rt-sci', 'rt-cogn'],
  ['pre-circum', 'pre-peri'],
  ['rt-port', 'rt-fer'],
  ['rt-son', 'rt-phon'],
  ['rt-terr', 'rt-corp'],
];

const byId = new Map(WORD_PARTS.map((p) => [p.id, p]));
for (const [a, b] of OPPOSITE_PAIRS) {
  const pa = byId.get(a);
  const pb = byId.get(b);
  if (!pa || !pb) continue;
  const correct = `${pa.part} ${pa.meaning} vs ${pb.part} ${pb.meaning}`;
  const wrongs: string[] = [];
  const others = OPPOSITE_PAIRS.filter(([x, y]) => x !== a && y !== b);
  while (wrongs.length < 3 && others.length) {
    const [x, y] = others.splice(Math.floor(rand() * others.length), 1)[0];
    const px = byId.get(x)!;
    const py = byId.get(y)!;
    wrongs.push(`${px.part} ${px.meaning} vs ${py.part} ${py.meaning}`);
  }
  const { choices, answer } = shuffleWithAnswer([correct, ...wrongs], 0);
  QUESTIONS.push({
    id: qid(),
    type: 'compare',
    prompt: 'Which pair of word parts has OPPOSITE meanings, matching the descriptions given?',
    choices,
    answer,
    explanation: `${pa.part} means “${pa.meaning}” while ${pb.part} means “${pb.meaning}” — a classic confusing pair.`,
    partId: a,
    category: 'mixed',
    difficulty: 3,
  });
}
for (const [a, b] of SIMILAR_PAIRS.slice(0, 6)) {
  const pa = byId.get(a);
  const pb = byId.get(b);
  if (!pa || !pb) continue;
  const correct = `${pa.part} (${pa.meaning}) and ${pb.part} (${pb.meaning})`;
  const wrongs = [
    `${pa.part} (${pb.meaning}) and ${pb.part} (${pa.meaning})`,
    `${pa.part} (${pa.meaning}) and ${pb.part} (${pa.meaning})`,
    `${pa.part} (${pb.meaning}) and ${pb.part} (${pb.meaning})`,
  ];
  const { choices, answer } = shuffleWithAnswer([correct, ...wrongs], 0);
  QUESTIONS.push({
    id: qid(),
    type: 'compare',
    prompt: `Which option correctly states the meanings of BOTH word parts?`,
    choices,
    answer,
    explanation: `${pa.part} means “${pa.meaning}” and ${pb.part} means “${pb.meaning}.” They look alike but differ.`,
    partId: a,
    category: 'mixed',
    difficulty: 3,
  });
}

export const QUESTION_BANK: Question[] = QUESTIONS;

export function getQuestions(opts: {
  category?: 'prefix' | 'root' | 'suffix' | 'mixed';
  difficulty?: 1 | 2 | 3;
  count: number;
  seed?: number;
}): Question[] {
  const r = mulberry32(opts.seed ?? Date.now());
  let pool = QUESTION_BANK;
  if (opts.category && opts.category !== 'mixed') pool = pool.filter((q) => q.category === opts.category);
  if (opts.difficulty) pool = pool.filter((q) => q.difficulty === opts.difficulty);
  const arr = [...pool];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, Math.min(opts.count, arr.length));
}

export function getQuestionById(id: string): Question | undefined {
  return QUESTION_BANK.find((q) => q.id === id);
}
