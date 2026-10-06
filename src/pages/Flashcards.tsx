import React from 'react';
import { Link, useSearchParams } from 'react-router';
import { Star, Keyboard, PartyPopper } from 'lucide-react';
import AppShell from '../components/AppShell';
import { ConfettiBurst, TypeBadge, EmptyState } from '../components/common';
import { WORD_PARTS } from '../data/wordParts';
import type { WordPart } from '../data/wordParts';
import { useStore } from '../lib/store';
import { XP } from '../lib/srs';
import type { Rating as RatingType } from '../lib/types';

const RATINGS: { key: RatingType; label: string; hint: string; cls: string }[] = [
  { key: 'again', label: 'Again', hint: '1', cls: 'border-coral/50 text-coral hover:bg-coral/10' },
  { key: 'hard', label: 'Hard', hint: '2', cls: 'border-amber/50 text-amber hover:bg-amber/10' },
  { key: 'good', label: 'Good', hint: '3', cls: 'border-teal/50 text-teal hover:bg-teal/10' },
  { key: 'easy', label: 'Easy', hint: '4', cls: 'border-violet/50 text-violet-2 hover:bg-violet/10' },
];

export default function Flashcards() {
  const [params] = useSearchParams();
  const { dispatch } = useStore();

  const deck: WordPart[] = React.useMemo(() => {
    const single = params.get('part');
    if (single) {
      const p = WORD_PARTS.find((w) => w.id === single);
      return p ? [p] : [];
    }
    const world = params.get('world');
    const ids = params.get('parts')?.split(',');
    if (ids?.length) return WORD_PARTS.filter((p) => ids.includes(p.id));
    let pool = world ? WORD_PARTS.filter((p) => p.world === world) : WORD_PARTS;
    // shuffle deterministically-ish per load
    return [...pool].sort(() => Math.random() - 0.5).slice(0, 15);
  }, [params]);

  const [index, setIndex] = React.useState(0);
  const [flipped, setFlipped] = React.useState(false);
  const [starred, setStarred] = React.useState<Set<string>>(new Set());
  const [done, setDone] = React.useState(false);
  const [celebrate, setCelebrate] = React.useState(0);

  const card = deck[index];

  const rate = React.useCallback(
    (rating: RatingType) => {
      if (!card) return;
      dispatch({ type: 'RATE_PART', partId: card.id, rating });
      if (rating !== 'again') setCelebrate((c) => c + 1);
      setFlipped(false);
      if (index + 1 >= deck.length) setDone(true);
      else setIndex((i) => i + 1);
    },
    [card, dispatch, index, deck.length],
  );

  // keyboard shortcuts
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setFlipped((f) => !f);
      }
      if (flipped) {
        const r = RATINGS.find((r) => r.hint === e.key);
        if (r) rate(r.key);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flipped, rate]);

  if (deck.length === 0) {
    return (
      <AppShell>
        <EmptyState
          title="No cards in this deck"
          body="Pick word parts from the library to study."
          action={<Link to="/library" className="min-h-11 rounded-full bg-violet px-6 py-3 text-sm font-semibold text-white">Open library</Link>}
        />
      </AppShell>
    );
  }

  if (done) {
    return (
      <AppShell>
        <div className="relative mx-auto max-w-md animate-fade-up rounded-3xl border border-border/60 bg-surface-1 p-8 text-center">
          <ConfettiBurst show />
          <PartyPopper className="mx-auto h-10 w-10 text-amber" aria-hidden="true" />
          <h1 className="mt-4 font-display text-2xl font-bold">Deck complete</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You studied {deck.length} word part{deck.length === 1 ? '' : 's'} and earned at least {deck.length * XP.flashcardCorrect} XP.
            The spaced-repetition engine scheduled each card’s next review.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Link to="/dashboard" className="min-h-12 rounded-xl bg-violet px-6 py-3 font-semibold text-white">Back to dashboard</Link>
            <Link to="/quiz" className="min-h-12 rounded-xl border border-border px-6 py-3 font-semibold hover:border-teal/50 hover:text-teal">Test yourself with a quiz</Link>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-xl animate-fade-up">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="font-mono2 text-xs uppercase tracking-widest">Flashcard mode</span>
          <span className="font-mono2 text-xs">{index + 1} / {deck.length}</span>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-surface-3" aria-hidden="true">
          <div className="h-full rounded-full bg-violet transition-all" style={{ width: `${((index + 1) / deck.length) * 100}%` }} />
        </div>

        <div className="relative mt-6">
          <ConfettiBurst show={celebrate > 0 && !flipped} key={celebrate} />
          <button
            onClick={() => setFlipped((f) => !f)}
            aria-pressed={flipped}
            aria-label="Flip flashcard"
            className="relative block min-h-[340px] w-full rounded-3xl border border-border/60 bg-surface-1 p-6 text-left shadow-[0_24px_60px_-24px_rgb(var(--violet)/0.35)] transition-transform hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <TypeBadge type={card.type} />
              <span className="flex items-center gap-2">
                <span
                  role="button"
                  tabIndex={0}
                  aria-label="Star this card"
                  onClick={(e) => {
                    e.stopPropagation();
                    setStarred((s) => {
                      const n = new Set(s);
                      if (n.has(card.id)) n.delete(card.id);
                      else n.add(card.id);
                      return n;
                    });
                  }}
                  onKeyDown={(e) => e.stopPropagation()}
                  className={`rounded-full p-1.5 ${starred.has(card.id) ? 'text-amber' : 'text-muted-foreground hover:text-amber'}`}
                >
                  <Star className="h-5 w-5" fill={starred.has(card.id) ? 'currentColor' : 'none'} aria-hidden="true" />
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{flipped ? 'Back' : 'Tap to flip'}</span>
              </span>
            </div>

            {!flipped ? (
              <div key="front" className="animate-flip-in pt-14 text-center">
                <p className="font-display text-6xl font-bold tracking-tight text-gradient-violet sm:text-7xl">{card.part}</p>
                <p className="mt-6 text-sm text-muted-foreground">What does this {card.type} mean?</p>
              </div>
            ) : (
              <div key="back" className="animate-flip-in pt-6">
                <p className="font-display text-3xl font-bold">{card.part} = “{card.meaning}”</p>
                <p className="mt-1 text-sm text-muted-foreground">Origin: {card.origin}</p>
                <div className="mt-5 space-y-3 border-t border-border/60 pt-5">
                  {card.examples.map((e) => (
                    <div key={e.word}>
                      <p className="font-semibold text-teal">{e.word} <span className="font-normal text-muted-foreground">— {e.definition}</span></p>
                      <p className="mt-0.5 text-sm italic text-muted-foreground">“{e.sentence}”</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 rounded-xl bg-surface-2 p-3 text-xs text-muted-foreground">
                  <span className="font-semibold text-amber">Clue:</span> {card.clue}
                </p>
              </div>
            )}
          </button>
        </div>

        {/* Rating buttons */}
        <div className="mt-5 grid grid-cols-4 gap-2">
          {RATINGS.map((r) => (
            <button
              key={r.key}
              onClick={() => (flipped ? rate(r.key) : setFlipped(true))}
              className={`flex min-h-12 flex-col items-center justify-center rounded-xl border bg-surface-1 text-sm font-semibold transition-colors ${r.cls}`}
            >
              {r.label}
              <span className="font-mono2 text-[10px] opacity-60">{r.hint}</span>
            </button>
          ))}
        </div>

        <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
          <Keyboard className="h-3.5 w-3.5" aria-hidden="true" />
          Space to flip · 1–4 to rate
        </p>
      </div>
    </AppShell>
  );
}
