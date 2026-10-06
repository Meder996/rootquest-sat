import { Link } from 'react-router';
import { Sprout, ArrowRight, CalendarClock, Eraser } from 'lucide-react';
import AppShell from '../components/AppShell';
import { SectionHeading, EmptyState, TypeBadge } from '../components/common';
import { useDueParts, getPart, useStore } from '../lib/store';
import { dueLabel, whyDue } from '../lib/srs';
import { QUESTION_BANK } from '../data/questions';

/** Memory Garden: due reviews + mistake laboratory */
export default function Review() {
  const { due, upcoming } = useDueParts();
  const { state } = useStore();
  const mistakes = Object.entries(state.mistakes);

  return (
    <AppShell>
      <div className="animate-fade-up">
        <SectionHeading eyebrow="Memory Garden" title={`${due.length} item${due.length === 1 ? '' : 's'} due for review`} />

        {due.length === 0 ? (
          <EmptyState
            title="The garden is tidy"
            body="Nothing is due right now. Learn new word parts or take a quiz — mistakes will be planted here automatically."
            action={<Link to="/library" className="min-h-11 rounded-full bg-violet px-6 py-3 text-sm font-semibold text-white">Learn something new</Link>}
          />
        ) : (
          <>
            <Link
              to={`/flashcards?parts=${due.map((p) => p.partId).join(',')}`}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-violet font-semibold text-white glow-violet"
            >
              <Sprout className="h-5 w-5" aria-hidden="true" /> Review all {due.length} now
            </Link>
            <ul className="mt-5 space-y-2.5">
              {due.map((p) => {
                const part = getPart(p.partId);
                if (!part) return null;
                return (
                  <li key={p.partId} className="flex flex-wrap items-center gap-3 rounded-2xl border border-border/60 bg-surface-1 p-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-lg font-bold">{part.part}</span>
                        <TypeBadge type={part.type} />
                      </div>
                      <p className="mt-0.5 truncate text-sm text-muted-foreground">{part.meaning}</p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-coral">
                        <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" /> {whyDue(p)}
                      </p>
                    </div>
                    <Link
                      to={`/part/${part.id}`}
                      className="flex min-h-11 items-center gap-1.5 rounded-full border border-border px-4 text-sm font-medium hover:border-teal/50 hover:text-teal"
                    >
                      Study <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {/* Error Laboratory */}
        <section className="mt-12">
          <SectionHeading eyebrow="Error Laboratory" title="Questions you’ve missed" />
          {mistakes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No open mistakes. Miss a quiz question and it shows up here until you get it right.</p>
          ) : (
            <ul className="space-y-2.5">
              {mistakes.map(([qid, times]) => {
                const q = QUESTION_BANK.find((x) => x.id === qid);
                if (!q) return null;
                return (
                  <li key={qid} className="rounded-2xl border border-coral/30 bg-coral/5 p-4">
                    <p className="flex items-center gap-2 text-sm font-semibold">
                      <Eraser className="h-4 w-4 text-coral" aria-hidden="true" />
                      {q.prompt}
                      <span className="ml-auto rounded-full bg-coral/15 px-2 py-0.5 text-xs font-semibold text-coral">missed ×{times}</span>
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Answer: <span className="font-medium text-foreground">{q.choices[q.answer]}</span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{q.explanation}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <section className="mt-12">
            <SectionHeading eyebrow="Scheduled" title="Coming up" />
            <ul className="grid gap-2 sm:grid-cols-2">
              {upcoming.slice(0, 8).map((p) => {
                const part = getPart(p.partId);
                return (
                  <li key={p.partId} className="flex items-center justify-between rounded-xl border border-border/60 bg-surface-1 px-4 py-3 text-sm">
                    <span className="font-medium">{part?.part}</span>
                    <span className="text-xs text-muted-foreground">{dueLabel(p)}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
    </AppShell>
  );
}
