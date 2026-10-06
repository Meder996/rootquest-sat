import React from 'react';
import { Search, Bookmark } from 'lucide-react';
import AppShell from '../components/AppShell';
import { WordPartCard, SectionHeading, EmptyState } from '../components/common';
import { WORD_PARTS, WORLD_META } from '../data/wordParts';
import type { WorldId, PartType } from '../data/wordParts';
import { useStore } from '../lib/store';

type Filter = 'all' | PartType | 'saved';

export default function Library() {
  const { state } = useStore();
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState<Filter>('all');
  const [difficulty, setDifficulty] = React.useState<0 | 1 | 2 | 3>(0);

  const filtered = WORD_PARTS.filter((p) => {
    if (filter === 'saved' && !state.savedWords.includes(p.id)) return false;
    if (filter !== 'all' && filter !== 'saved' && p.type !== filter) return false;
    if (difficulty && p.difficulty !== difficulty) return false;
    if (query) {
      const q = query.toLowerCase();
      const hay = `${p.part} ${p.meaning} ${p.origin} ${p.examples.map((e) => e.word).join(' ')}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const counts = {
    all: WORD_PARTS.length,
    prefix: WORD_PARTS.filter((p) => p.type === 'prefix').length,
    root: WORD_PARTS.filter((p) => p.type === 'root').length,
    suffix: WORD_PARTS.filter((p) => p.type === 'suffix').length,
    saved: state.savedWords.length,
  };

  return (
    <AppShell>
      <div className="animate-fade-up">
        <SectionHeading eyebrow="Word-part library" title={`${filtered.length} parts to explore`} />

        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search parts, meanings, or example words…"
            aria-label="Search word parts"
            className="h-12 w-full rounded-2xl border border-input bg-surface-1 pl-11 pr-4 text-base outline-none focus:border-violet"
          />
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Filter by type">
          {(['all', 'prefix', 'root', 'suffix', 'saved'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-colors ${
                filter === f ? 'border-violet bg-violet/15 text-violet-2' : 'border-border bg-surface-1 text-muted-foreground hover:text-foreground'
              }`}
            >
              {f === 'saved' && <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />}
              {f === 'all' ? 'All' : f === 'saved' ? 'Saved' : f === 'root' ? 'Roots' : `${f[0].toUpperCase()}${f.slice(1)}es`}
              <span className="text-xs opacity-70">{counts[f]}</span>
            </button>
          ))}
          <span className="mx-1 hidden h-6 w-px bg-border sm:block" aria-hidden="true" />
          <div className="flex items-center gap-1" role="group" aria-label="Filter by difficulty">
            {[0, 1, 2, 3].map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d as 0 | 1 | 2 | 3)}
                aria-pressed={difficulty === d}
                className={`min-h-11 rounded-full border px-3.5 text-sm font-medium transition-colors ${
                  difficulty === d ? 'border-amber bg-amber/15 text-amber' : 'border-border bg-surface-1 text-muted-foreground hover:text-foreground'
                }`}
              >
                {d === 0 ? 'Any level' : `Level ${d}`}
              </button>
            ))}
          </div>
        </div>

        {/* Grid, grouped by world */}
        {filtered.length === 0 ? (
          <div className="mt-8">
            <EmptyState title="Nothing matches" body="Try clearing the search or picking a different filter." />
          </div>
        ) : (
          (['planet', 'forest', 'city'] as WorldId[]).map((world) => {
            const parts = filtered.filter((p) => p.world === world);
            if (parts.length === 0) return null;
            const meta = WORLD_META[world];
            const hueText: Record<string, string> = { violet: 'text-violet-2', teal: 'text-teal', coral: 'text-coral' };
            return (
              <section key={world} className="mt-10">
                <div className="mb-4">
                  <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${hueText[meta.hue]}`}>{meta.name}</p>
                  <h2 className="font-display text-xl font-bold">{meta.tagline}</h2>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {parts.map((p) => (
                    <WordPartCard key={p.id} part={p} />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>
    </AppShell>
  );
}
