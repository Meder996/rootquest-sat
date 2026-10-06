import { Link, useParams } from 'react-router';
import { ArrowLeft, Bookmark, BookmarkCheck, Layers, Quote, Lightbulb, GraduationCap } from 'lucide-react';
import AppShell from '../components/AppShell';
import { TypeBadge, DifficultyDots, StatusPill, SectionHeading, WordPartCard } from '../components/common';
import { getPart, useStore } from '../lib/store';
import { STATUS_META, dueLabel } from '../lib/srs';
import { newProgress } from '../lib/srs';

export default function WordPartDetail() {
  const { id } = useParams();
  const { state, dispatch } = useStore();
  const part = id ? getPart(id) : undefined;

  if (!part) {
    return (
      <AppShell>
        <p className="py-20 text-center text-muted-foreground">Word part not found. <Link to="/library" className="text-violet-2 underline">Back to library</Link></p>
      </AppShell>
    );
  }

  const prog = state.progress[part.id] ?? newProgress(part.id);
  const saved = state.savedWords.includes(part.id);
  const related = (part.related ?? []).map(getPart).filter(Boolean);

  return (
    <AppShell>
      <div className="animate-fade-up">
        <Link to="/library" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Library
        </Link>

        <div className="mt-2 grid gap-4 lg:grid-cols-5">
          {/* Main card */}
          <div className="rounded-3xl border border-border/60 bg-surface-1 p-6 sm:p-8 lg:col-span-3">
            <div className="flex flex-wrap items-center gap-3">
              <TypeBadge type={part.type} />
              <DifficultyDots level={part.difficulty} />
              <StatusPill status={prog.status} />
            </div>
            <h1 className="mt-4 font-display text-5xl font-bold tracking-tight text-gradient-violet sm:text-6xl">{part.part}</h1>
            <p className="mt-3 font-display text-2xl font-semibold">“{part.meaning}”</p>
            <p className="mt-1 text-sm text-muted-foreground">Origin: {part.origin}</p>

            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-surface-2 p-4">
              <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold">Memory clue</p>
                <p className="text-sm text-muted-foreground">{part.clue}</p>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-2xl bg-surface-2 p-4">
              <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-teal" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold">Why it matters on the SAT</p>
                <p className="text-sm text-muted-foreground">{part.satNote}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to={`/flashcards?part=${part.id}`} className="flex min-h-11 items-center gap-2 rounded-full bg-violet px-6 text-sm font-semibold text-white glow-violet">
                <Layers className="h-4 w-4" aria-hidden="true" /> Study this part
              </Link>
              <button
                onClick={() => dispatch({ type: saved ? 'UNSAVE_WORD' : 'SAVE_WORD', partId: part.id })}
                aria-pressed={saved}
                className={`flex min-h-11 items-center gap-2 rounded-full border px-6 text-sm font-semibold transition-colors ${
                  saved ? 'border-amber/50 bg-amber/10 text-amber' : 'border-border bg-surface-1 hover:border-amber/50 hover:text-amber'
                }`}
              >
                {saved ? <BookmarkCheck className="h-4 w-4" aria-hidden="true" /> : <Bookmark className="h-4 w-4" aria-hidden="true" />}
                {saved ? 'Saved' : 'Save for later'}
              </button>
            </div>
          </div>

          {/* Progress + examples */}
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-2xl border border-border/60 bg-surface-1 p-5">
              <SectionHeading eyebrow="Your memory" title="Review state" />
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-surface-2 p-3">
                  <dt className="text-xs text-muted-foreground">Status</dt>
                  <dd className={`mt-0.5 font-semibold ${STATUS_META[prog.status].color}`}>{STATUS_META[prog.status].label}</dd>
                </div>
                <div className="rounded-xl bg-surface-2 p-3">
                  <dt className="text-xs text-muted-foreground">Next review</dt>
                  <dd className="mt-0.5 font-semibold">{dueLabel(prog)}</dd>
                </div>
                <div className="rounded-xl bg-surface-2 p-3">
                  <dt className="text-xs text-muted-foreground">Correct</dt>
                  <dd className="mt-0.5 font-semibold text-teal">{prog.correct}</dd>
                </div>
                <div className="rounded-xl bg-surface-2 p-3">
                  <dt className="text-xs text-muted-foreground">Missed</dt>
                  <dd className="mt-0.5 font-semibold text-coral">{prog.incorrect}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-border/60 bg-surface-1 p-5">
              <SectionHeading eyebrow="Examples" title="Words in the wild" />
              <ul className="space-y-4">
                {part.examples.map((e) => (
                  <li key={e.word}>
                    <p className="font-display text-lg font-bold text-teal">{e.word}</p>
                    <p className="text-sm text-muted-foreground">{e.definition}</p>
                    <p className="mt-1.5 flex gap-2 text-sm italic text-muted-foreground">
                      <Quote className="h-3.5 w-3.5 shrink-0 translate-y-1 opacity-50" aria-hidden="true" />
                      {e.sentence}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-10">
            <SectionHeading eyebrow="Keep going" title="Related word parts" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => p && <WordPartCard key={p.id} part={p} />)}
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}
