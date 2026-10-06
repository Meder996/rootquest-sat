import React from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeft, ArrowRight, Check, Lightbulb } from 'lucide-react';
import AppShell from '../components/AppShell';
import { TypeBadge, ConfettiBurst, EmptyState } from '../components/common';
import { LESSONS } from '../data/achievements';
import { getPart, useStore } from '../lib/store';
import { XP } from '../lib/srs';
import { getQuestions } from '../data/questions';
import type { Question } from '../data/questions';

/** Learn mode: introduce each part, then a mini-check question, then completion */
export default function Learn() {
  const { lessonId } = useParams();
  const { dispatch } = useStore();
  const lesson = LESSONS.find((l) => l.id === lessonId);
  const [index, setIndex] = React.useState(0);
  const [phase, setPhase] = React.useState<'intro' | 'check'>('intro');
  const [done, setDone] = React.useState(false);

  const parts = React.useMemo(() => lesson?.partIds.map(getPart).filter(Boolean) ?? [], [lesson]);
  const part = parts[index];

  const checks: Record<string, Question> = React.useMemo(() => {
    const out: Record<string, Question> = {};
    for (const p of parts) {
      if (!p) continue;
      const qs = getQuestions({ count: 1, seed: p.id.length * 7919 + p.part.length });
      const match = getQuestions({ count: 50, seed: 1 }).find((q) => q.partId === p.id && q.type === 'meaning');
      out[p.id] = match ?? qs[0];
    }
    return out;
  }, [parts]);

  if (!lesson || parts.length === 0) {
    return (
      <AppShell>
        <EmptyState title="Lesson not found" body="Pick a lesson from the dashboard or a world." action={<Link to="/dashboard" className="min-h-11 rounded-full bg-violet px-6 py-3 text-sm font-semibold text-white">Dashboard</Link>} />
      </AppShell>
    );
  }

  if (done) {
    return (
      <AppShell>
        <div className="relative mx-auto max-w-md animate-fade-up rounded-3xl border border-border/60 bg-surface-1 p-8 text-center">
          <ConfettiBurst show />
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal/15">
            <Check className="h-8 w-8 text-teal" aria-hidden="true" />
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold">Lesson complete</h1>
          <p className="mt-2 text-sm text-muted-foreground">“{lesson.title}” — {parts.length} word parts learned. +{XP.lessonComplete} XP bonus earned.</p>
          <div className="mt-6 flex flex-col gap-2">
            <Link to={`/flashcards?parts=${lesson.partIds.join(',')}`} className="min-h-12 rounded-xl bg-violet px-6 py-3 font-semibold text-white">Practice with flashcards</Link>
            <Link to="/dashboard" className="min-h-12 rounded-xl border border-border px-6 py-3 font-semibold hover:border-teal/50 hover:text-teal">Dashboard</Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const current = part!;
  const checkQ = checks[current.id];

  const next = () => {
    if (index + 1 >= parts.length) {
      dispatch({ type: 'ADD_XP', amount: XP.lessonComplete });
      setDone(true);
    } else {
      setIndex((i) => i + 1);
      setPhase('intro');
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-xl animate-fade-up">
        <Link to="/worlds" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Lessons
        </Link>
        <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
          <span className="font-display font-semibold text-foreground">{lesson.title}</span>
          <span className="font-mono2 text-xs">{index + 1} / {parts.length}</span>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-surface-3" aria-hidden="true">
          <div className="h-full rounded-full bg-teal transition-all" style={{ width: `${((index + 1) / parts.length) * 100}%` }} />
        </div>

        {phase === 'intro' ? (
          <div className="mt-6 animate-fade-up rounded-3xl border border-border/60 bg-surface-1 p-6 sm:p-8" key={`intro-${current.id}`}>
            <TypeBadge type={current.type} />
            <h1 className="mt-4 font-display text-5xl font-bold tracking-tight text-gradient-violet">{current.part}</h1>
            <p className="mt-2 font-display text-xl font-semibold">“{current.meaning}”</p>
            <p className="mt-1 text-sm text-muted-foreground">Origin: {current.origin}</p>
            <div className="mt-5 space-y-3 border-t border-border/60 pt-5">
              {current.examples.map((e) => (
                <div key={e.word}>
                  <p className="font-semibold text-teal">{e.word} <span className="font-normal text-muted-foreground">— {e.definition}</span></p>
                  <p className="mt-0.5 text-sm italic text-muted-foreground">“{e.sentence}”</p>
                </div>
              ))}
            </div>
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-surface-2 p-3 text-xs text-muted-foreground">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber" aria-hidden="true" /> {current.clue}
            </p>
            <button onClick={() => setPhase('check')} className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet font-semibold text-white">
              Mini-check <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <MiniCheck key={`check-${current.id}`} q={checkQ} partText={current.part} onPass={(correct) => {
            dispatch({ type: 'RATE_PART', partId: current.id, rating: correct ? 'good' : 'again' });
            next();
          }} />
        )}
      </div>
    </AppShell>
  );
}

function MiniCheck({ q, partText, onPass }: { q: Question; partText: string; onPass: (correct: boolean) => void }) {
  const [picked, setPicked] = React.useState<number | null>(null);
  const correct = picked === q.answer;
  return (
    <div className="mt-6 animate-fade-up rounded-3xl border border-border/60 bg-surface-1 p-6 sm:p-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-2">Mini-check · {partText}</p>
      {q.passage && <p className="mt-3 rounded-xl bg-surface-2 p-3 text-sm italic text-muted-foreground">“{q.passage}”</p>}
      <p className="mt-3 font-medium">{q.prompt}</p>
      <div className="mt-4 space-y-2">
        {q.choices.map((c, i) => {
          const cls =
            picked === null
              ? 'border-border bg-surface-2 hover:border-violet/50'
              : i === q.answer
                ? 'border-teal bg-teal/10 text-teal'
                : i === picked
                  ? 'border-coral bg-coral/10 text-coral'
                  : 'opacity-50';
          return (
            <button
              key={i}
              disabled={picked !== null}
              onClick={() => setPicked(i)}
              className={`min-h-11 w-full rounded-xl border px-4 py-2.5 text-left text-sm transition-all ${cls}`}
            >
              {c}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div className="mt-4 animate-fade-up">
          <p className={`text-sm font-semibold ${correct ? 'text-teal' : 'text-coral'}`}>{correct ? 'Correct' : 'Not quite'}</p>
          <p className="mt-1 text-sm text-muted-foreground">{q.explanation}</p>
          <button onClick={() => onPass(correct)} className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet font-semibold text-white">
            Continue <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
