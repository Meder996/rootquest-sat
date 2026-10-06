import React from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router';
import { Timer, Flag, X, Trophy, RotateCcw, ArrowRight } from 'lucide-react';
import AppShell from '../components/AppShell';
import { ConfettiBurst, SectionHeading } from '../components/common';
import { getQuestions } from '../data/questions';
import type { Question } from '../data/questions';
import { useStore } from '../lib/store';
import type { QuizAttempt } from '../lib/types';

type Stage = 'setup' | 'run' | 'results';

export default function Quiz() {
  const [params] = useSearchParams();
  const isArena = params.get('mode') === 'arena';
  const navigate = useNavigate();
  const { dispatch } = useStore();

  const [stage, setStage] = React.useState<Stage>('setup');
  const [category, setCategory] = React.useState<'mixed' | 'prefix' | 'root' | 'suffix'>('mixed');
  const [difficulty, setDifficulty] = React.useState<0 | 1 | 2 | 3>(0);
  const [count, setCount] = React.useState(10);
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [qIndex, setQIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<{ q: Question; chosen: number; ms: number }[]>([]);
  const [secondsLeft, setSecondsLeft] = React.useState(60);

  const start = () => {
    const qs = getQuestions({ category: category === 'mixed' ? undefined : category, difficulty: difficulty || undefined, count: isArena ? 30 : count });
    setQuestions(qs);
    setQIndex(0);
    setAnswers([]);
    setSecondsLeft(isArena ? 60 : 0);
    setStage('run');
  };

  // Arena countdown
  React.useEffect(() => {
    if (stage !== 'run' || !isArena) return;
    if (secondsLeft <= 0) {
      finish(answers);
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, secondsLeft, isArena]);

  const finish = (finalAnswers: typeof answers) => {
    const score = finalAnswers.filter((a) => a.chosen === a.q.answer).length;
    const durationMs = finalAnswers.reduce((a, b) => a + b.ms, 0);
    const attempt: QuizAttempt = {
      id: `quiz-${Date.now()}`,
      mode: isArena ? 'arena' : 'standard',
      category,
      score,
      total: finalAnswers.length,
      durationMs,
      date: new Date().toISOString(),
      completed: true,
      answers: finalAnswers.map((a) => ({
        questionId: a.q.id,
        partId: a.q.partId,
        chosen: a.chosen,
        correct: a.chosen === a.q.answer,
        responseMs: a.ms,
      })),
    };
    dispatch({ type: 'RECORD_QUIZ', attempt });
    setStage('results');
  };

  // ---------------- SETUP ----------------
  if (stage === 'setup') {
    return (
      <AppShell>
        <div className="mx-auto max-w-lg animate-fade-up">
          <SectionHeading eyebrow={isArena ? 'SAT Arena' : 'Quiz setup'} title={isArena ? '60-second Speed Round' : 'Build your quiz'} />
          <div className="rounded-3xl border border-border/60 bg-surface-1 p-6 sm:p-8">
            {isArena && (
              <p className="mb-6 flex items-start gap-3 rounded-2xl bg-amber/10 p-4 text-sm text-amber">
                <Timer className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                Answer as many as you can in 60 seconds. Correct answers push your streak; wrong ones feed your Memory Garden.
              </p>
            )}
            {!isArena && (
              <>
                <p className="text-sm font-semibold">Category</p>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="Quiz category">
                  {(['mixed', 'prefix', 'root', 'suffix'] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      aria-pressed={category === c}
                      className={`min-h-11 rounded-xl border px-3 text-sm font-medium capitalize transition-colors ${
                        category === c ? 'border-violet bg-violet/15 text-violet-2' : 'border-border bg-surface-2 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <p className="mt-5 text-sm font-semibold">Difficulty</p>
                <div className="mt-2 grid grid-cols-4 gap-2" role="group" aria-label="Quiz difficulty">
                  {([0, 1, 2, 3] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      aria-pressed={difficulty === d}
                      className={`min-h-11 rounded-xl border px-3 text-sm font-medium transition-colors ${
                        difficulty === d ? 'border-amber bg-amber/15 text-amber' : 'border-border bg-surface-2 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {d === 0 ? 'Any' : `L${d}`}
                    </button>
                  ))}
                </div>
                <p className="mt-5 text-sm font-semibold">Questions: <span className="text-violet-2">{count}</span></p>
                <input
                  type="range"
                  min={5}
                  max={25}
                  step={5}
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  aria-label="Number of questions"
                  className="mt-2 w-full accent-[rgb(var(--violet))]"
                />
              </>
            )}
            <button onClick={start} className="mt-7 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet font-semibold text-white glow-violet">
              {isArena ? 'Enter the Arena' : 'Start quiz'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <Link to="/dashboard" className="mt-3 flex min-h-11 w-full items-center justify-center text-sm font-medium text-muted-foreground hover:text-foreground">
              Cancel
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  // ---------------- RESULTS ----------------
  if (stage === 'results') {
    const score = answers.filter((a) => a.chosen === a.q.answer).length;
    const pct = answers.length ? Math.round((score / answers.length) * 100) : 0;
    const missed = answers.filter((a) => a.chosen !== a.q.answer);
    return (
      <AppShell>
        <div className="relative mx-auto max-w-lg animate-fade-up">
          <ConfettiBurst show={pct >= 60} />
          <div className="rounded-3xl border border-border/60 bg-surface-1 p-6 text-center sm:p-8">
            <Trophy className={`mx-auto h-10 w-10 ${pct >= 60 ? 'text-amber' : 'text-muted-foreground'}`} aria-hidden="true" />
            <h1 className="mt-3 font-display text-3xl font-bold">{isArena ? 'Arena run over' : 'Quiz complete'}</h1>
            <p className="mt-4 font-display text-6xl font-bold text-gradient-violet">{pct}%</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {score} of {answers.length} correct {isArena && `in ${60 - secondsLeft}s`}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              {pct === 100 ? 'Flawless. The Mastery Museum noticed.' : pct >= 70 ? 'Strong round — the weak spots are now in your review queue.' : 'Every miss just joined your Memory Garden. That’s how the garden grows.'}
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <button onClick={() => setStage('setup')} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-violet font-semibold text-white">
                <RotateCcw className="h-4 w-4" aria-hidden="true" /> {isArena ? 'Run it back' : 'New quiz'}
              </button>
              {missed.length > 0 && (
                <Link to="/review" className="min-h-12 rounded-xl border border-border px-6 py-3 font-semibold hover:border-coral/50 hover:text-coral">
                  Review {missed.length} mistake{missed.length === 1 ? '' : 's'}
                </Link>
              )}
              <Link to="/dashboard" className="min-h-12 rounded-xl px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground">Dashboard</Link>
            </div>
          </div>

          {/* Explanations */}
          <div className="mt-6 space-y-3">
            <SectionHeading eyebrow="Breakdown" title="Question review" />
            {answers.map((a, i) => {
              const ok = a.chosen === a.q.answer;
              return (
                <div key={a.q.id} className={`rounded-2xl border p-4 ${ok ? 'border-teal/30 bg-teal/5' : 'border-coral/30 bg-coral/5'}`}>
                  <p className="text-sm font-semibold">
                    <span className={`mr-2 font-mono2 text-xs ${ok ? 'text-teal' : 'text-coral'}`}>{ok ? '✓' : '✗'}</span>
                    {i + 1}. {a.q.prompt}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Correct answer: <span className="font-medium text-foreground">{a.q.choices[a.q.answer]}</span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{a.q.explanation}</p>
                </div>
              );
            })}
          </div>
        </div>
      </AppShell>
    );
  }

  // ---------------- RUN ----------------
  const q = questions[qIndex];
  return (
    <AppShell>
      <QuizRunner
        key={q.id}
        q={q}
        index={qIndex}
        total={questions.length}
        isArena={isArena}
        secondsLeft={secondsLeft}
        onAnswer={(chosen, ms) => {
          const next = [...answers, { q, chosen, ms }];
          setAnswers(next);
          if (qIndex + 1 >= questions.length) finish(next);
          else setQIndex((i) => i + 1);
        }}
        onExit={() => {
          if (answers.length > 0) finish(answers);
          else navigate('/dashboard');
        }}
      />
    </AppShell>
  );
}

function QuizRunner({
  q, index, total, isArena, secondsLeft, onAnswer, onExit,
}: {
  q: Question;
  index: number;
  total: number;
  isArena: boolean;
  secondsLeft: number;
  onAnswer: (chosen: number, ms: number) => void;
  onExit: () => void;
}) {
  const [picked, setPicked] = React.useState<number | null>(null);
  const [reported, setReported] = React.useState(false);
  const startRef = React.useRef(Date.now());

  const pick = React.useCallback(
    (i: number) => {
      if (picked !== null) return;
      setPicked(i);
    },
    [picked],
  );

  // Keyboard: 1-4 to choose, Enter to continue
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (picked === null && n >= 1 && n <= 4) pick(n - 1);
      else if (picked !== null && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onAnswer(picked, Date.now() - startRef.current);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [picked, pick, onAnswer]);

  const correct = picked === q.answer;

  return (
    <div className="mx-auto max-w-xl animate-fade-up">
      <div className="flex items-center justify-between gap-3">
        <button onClick={onExit} className="flex min-h-11 items-center gap-1.5 rounded-full border border-border px-4 text-sm font-medium text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" aria-hidden="true" /> Exit &amp; save
        </button>
        <span className="font-mono2 text-xs text-muted-foreground">{index + 1} / {total}</span>
        {isArena && (
          <span
            role="timer"
            aria-live="polite"
            className={`flex min-h-11 items-center gap-1.5 rounded-full border px-4 font-mono2 text-sm font-bold ${
              secondsLeft <= 10 ? 'animate-pulse-ring border-coral/50 text-coral' : 'border-amber/40 text-amber'
            }`}
          >
            <Timer className="h-4 w-4" aria-hidden="true" /> {secondsLeft}s
          </span>
        )}
      </div>
      <div className="mt-3 h-1.5 rounded-full bg-surface-3" aria-hidden="true">
        <div className="h-full rounded-full bg-violet transition-all" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>

      <div className="mt-6 rounded-3xl border border-border/60 bg-surface-1 p-6 sm:p-8">
        <p className="font-mono2 text-[11px] uppercase tracking-[0.2em] text-violet-2">{q.type.replace('-', ' ')} · {q.category}</p>
        {q.passage && (
          <p className="mt-4 rounded-xl border-l-2 border-teal bg-surface-2 p-4 text-sm italic leading-relaxed text-muted-foreground">“{q.passage}”</p>
        )}
        <h2 className="mt-4 font-display text-xl font-semibold leading-snug">{q.prompt}</h2>

        <div className="mt-5 space-y-2" role="radiogroup" aria-label="Answer choices">
          {q.choices.map((c, i) => {
            const cls =
              picked === null
                ? 'border-border bg-surface-2 hover:border-violet/60 hover:-translate-y-0.5'
                : i === q.answer
                  ? 'border-teal bg-teal/10 text-teal'
                  : i === picked
                    ? 'border-coral bg-coral/10 text-coral'
                    : 'opacity-50';
            return (
              <button
                key={i}
                role="radio"
                aria-checked={picked === i}
                disabled={picked !== null}
                onClick={() => pick(i)}
                className={`flex min-h-12 w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${cls}`}
              >
                <span className="font-mono2 text-xs text-muted-foreground">{i + 1}</span>
                {c}
              </button>
            );
          })}
        </div>

        {picked !== null && (
          <div className="mt-5 animate-fade-up">
            <p className={`text-sm font-bold ${correct ? 'text-teal' : 'text-coral'}`}>{correct ? 'Correct — nicely decoded.' : 'Not quite — this one goes to your Memory Garden.'}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{q.explanation}</p>
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => onAnswer(picked, Date.now() - startRef.current)}
                className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-violet font-semibold text-white"
              >
                Continue <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                onClick={() => setReported(true)}
                disabled={reported}
                className="flex min-h-12 items-center gap-1.5 rounded-xl border border-border px-4 text-sm font-medium text-muted-foreground hover:text-amber disabled:opacity-50"
              >
                <Flag className="h-4 w-4" aria-hidden="true" /> {reported ? 'Reported' : 'Report'}
              </button>
            </div>
          </div>
        )}
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">Keys 1–4 to answer · Enter to continue</p>
    </div>
  );
}
