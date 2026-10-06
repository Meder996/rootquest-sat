import { Link } from 'react-router';
import { Trophy, Bookmark } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import AppShell from '../components/AppShell';
import { SectionHeading, WordPartCard, EmptyState } from '../components/common';
import { ACHIEVEMENTS } from '../data/achievements';
import { getPart, useStore } from '../lib/store';
import { STATUS_META } from '../lib/srs';
import type { PartStatus } from '../lib/types';

const STATUS_ORDER: PartStatus[] = ['new', 'learning', 'familiar', 'strong', 'mastered'];
const STATUS_COLORS: Record<PartStatus, string> = {
  new: 'hsl(var(--surface-3))',
  learning: 'rgb(var(--coral))',
  familiar: 'rgb(var(--amber))',
  strong: 'rgb(var(--teal))',
  mastered: 'rgb(var(--violet))',
};

export default function Progress() {
  const { state, stats } = useStore();

  const statusData = STATUS_ORDER.map((s) => ({
    name: STATUS_META[s].label,
    value: s === 'new' ? 0 : Object.values(state.progress).filter((p) => p.status === s).length,
  })).filter((d) => d.value > 0);

  const savedParts = state.savedWords.map(getPart).filter(Boolean);
  const attempts = [...state.quizAttempts].reverse().slice(0, 8);

  return (
    <AppShell>
      <div className="animate-fade-up">
        <SectionHeading eyebrow="Mastery Museum" title="Your progress, preserved" />

        {/* Headline stats */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            ['Total XP', stats.xp.toLocaleString(), 'text-teal'],
            ['Correct answers', String(stats.correctAnswers), 'text-violet-2'],
            ['Quizzes completed', String(stats.quizzesCompleted), 'text-amber'],
            ['Mistakes fixed', String(stats.mistakesFixed), 'text-coral'],
          ].map(([label, value, color]) => (
            <div key={label} className="rounded-2xl border border-border/60 bg-surface-1 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
              <p className={`mt-1 font-display text-3xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-5">
          {/* Status donut */}
          <div className="rounded-2xl border border-border/60 bg-surface-1 p-5 lg:col-span-2">
            <SectionHeading eyebrow="Memory states" title="Word-part mastery" />
            {statusData.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">Study a card to start the chart.</p>
            ) : (
              <>
                <div className="h-52" role="img" aria-label="Donut chart of word parts by mastery status">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3} strokeWidth={0} isAnimationActive={false}>
                        {statusData.map((d) => {
                          const key = STATUS_ORDER.find((s) => STATUS_META[s].label === d.name)!;
                          return <Cell key={d.name} fill={STATUS_COLORS[key]} />;
                        })}
                      </Pie>
                      <Tooltip contentStyle={{ background: 'hsl(var(--surface-2))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <ul className="mt-2 flex flex-wrap justify-center gap-3 text-xs">
                  {statusData.map((d) => {
                    const key = STATUS_ORDER.find((s) => STATUS_META[s].label === d.name)!;
                    return (
                      <li key={d.name} className="flex items-center gap-1.5 text-muted-foreground">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_COLORS[key] }} aria-hidden="true" />
                        {d.name} ({d.value})
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>

          {/* Quiz history */}
          <div className="rounded-2xl border border-border/60 bg-surface-1 p-5 lg:col-span-3">
            <SectionHeading eyebrow="History" title="Recent quizzes" />
            {attempts.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">No quizzes yet. <Link to="/quiz" className="text-violet-2 underline">Take one now.</Link></p>
            ) : (
              <ul className="space-y-2">
                {attempts.map((a) => {
                  const pct = a.total ? Math.round((a.score / a.total) * 100) : 0;
                  return (
                    <li key={a.id} className="flex items-center gap-3 rounded-xl bg-surface-2 px-4 py-3 text-sm">
                      <span className={`font-display text-lg font-bold ${pct >= 70 ? 'text-teal' : 'text-coral'}`}>{pct}%</span>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium capitalize">{a.mode === 'arena' ? 'SAT Arena' : `${a.category} quiz`}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(a.date).toLocaleDateString()} · {a.score}/{a.total} · {Math.round(a.durationMs / 1000)}s
                        </p>
                      </div>
                      {a.mode === 'arena' && <span className="rounded-full bg-amber/15 px-2 py-0.5 text-xs font-semibold text-amber">Arena</span>}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Achievements */}
        <section className="mt-10">
          <SectionHeading eyebrow="Trophy hall" title={`Achievements · ${state.achievements.length}/${ACHIEVEMENTS.length}`} />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {ACHIEVEMENTS.map((a) => {
              const unlocked = state.achievements.includes(a.id);
              return (
                <div
                  key={a.id}
                  className={`rounded-2xl border p-4 text-center transition-all ${
                    unlocked ? 'border-amber/40 bg-amber/5' : 'border-border/60 bg-surface-1 opacity-45 grayscale'
                  }`}
                >
                  <span className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${unlocked ? 'bg-amber/15' : 'bg-surface-2'}`}>
                    {unlocked ? <a.icon className="h-6 w-6 text-amber" aria-hidden="true" /> : <Trophy className="h-6 w-6 text-muted-foreground" aria-hidden="true" />}
                  </span>
                  <p className="mt-3 text-sm font-semibold">{a.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{a.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Saved words */}
        <section className="mt-10">
          <SectionHeading
            eyebrow="Collection"
            title={`Saved words · ${savedParts.length}`}
            action={<span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Bookmark className="h-3.5 w-3.5" aria-hidden="true" /> Star difficult items</span>}
          />
          {savedParts.length === 0 ? (
            <EmptyState title="No saved words yet" body="Tap “Save for later” on any word part to pin it here." />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {savedParts.map((p) => p && <WordPartCard key={p.id} part={p} />)}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
