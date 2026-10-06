import React from 'react';
import { Link } from 'react-router';
import type { WordPart } from '../data/wordParts';
import { STATUS_META } from '../lib/srs';
import { useStore } from '../lib/store';
import type { PartStatus } from '../lib/types';

export function TypeBadge({ type }: { type: WordPart['type'] }) {
  const map = {
    prefix: 'bg-violet/15 text-violet-2 border-violet/30',
    root: 'bg-teal/15 text-teal border-teal/30',
    suffix: 'bg-coral/15 text-coral border-coral/30',
  } as const;
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${map[type]}`}>
      {type}
    </span>
  );
}

export function DifficultyDots({ level }: { level: 1 | 2 | 3 }) {
  return (
    <span className="inline-flex items-center gap-1" aria-label={`Difficulty ${level} of 3`}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={`h-1.5 w-1.5 rounded-full ${i <= level ? 'bg-amber' : 'bg-surface-3'}`} />
      ))}
    </span>
  );
}

export function StatusPill({ status }: { status: PartStatus }) {
  const meta = STATUS_META[status];
  return <span className={`text-xs font-semibold ${meta.color}`}>{meta.label}</span>;
}

export function WordPartCard({ part }: { part: WordPart }) {
  const { state } = useStore();
  const prog = state.progress[part.id];
  return (
    <Link
      to={`/part/${part.id}`}
      className="group flex min-h-[120px] flex-col justify-between rounded-2xl border border-border/60 bg-surface-1 p-4 transition-all hover:-translate-y-0.5 hover:border-violet/40 hover:shadow-[0_8px_30px_-12px_rgb(var(--violet)/0.35)] focus-visible:border-violet"
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <span className="font-display text-xl font-bold tracking-tight">{part.part}</span>
          <TypeBadge type={part.type} />
        </div>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{part.meaning}</p>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <DifficultyDots level={part.difficulty} />
        <StatusPill status={prog?.status ?? 'new'} />
      </div>
    </Link>
  );
}

export function SectionHeading({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-2">{eyebrow}</p>
        )}
        <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function ConfettiBurst({ show }: { show: boolean }) {
  if (!show) return null;
  const colors = ['rgb(var(--violet))', 'rgb(var(--teal))', 'rgb(var(--coral))', 'rgb(var(--amber))'];
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-0 overflow-visible" aria-hidden="true">
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${8 + (i * 84) / 17}%`,
            background: colors[i % colors.length],
            animationDelay: `${(i % 6) * 0.05}s`,
          }}
        />
      ))}
    </div>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-surface-1/50 px-6 py-12 text-center">
      <p className="font-display text-lg font-semibold">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
