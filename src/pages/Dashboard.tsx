import React from 'react';
import { Link } from 'react-router';
import { Flame, CalendarClock, Target, TrendingUp, Play, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import AppShell, { useRequireOnboarding } from '../components/AppShell';
import { SectionHeading, EmptyState, TypeBadge } from '../components/common';
import { useStore, useDueParts, getPart } from '../lib/store';
import { LESSONS, ACHIEVEMENTS } from '../data/achievements';
import { WORD_PARTS } from '../data/wordParts';
import { dueLabel, todayISO } from '../lib/srs';

function WeeklyChart() {
  const { state } = useStore();
  const data = React.useMemo(() => {
    const days: { day: string; xp: number; reviews: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const act = state.activity[iso];
      days.push({
        day: d.toLocaleDateString(undefined, { weekday: 'short' }),
        xp: act?.xp ?? 0,
        reviews: act?.reviews ?? 0,
      });
    }
    return days;
  }, [state.activity]);

  return (
    <div className="h-44 w-full" role="img" aria-label="Weekly study activity chart showing XP earned per day">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <XAxis dataKey="day" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: 'hsl(var(--surface-2))' }}
            contentStyle={{ background: 'hsl(var(--surface-2))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }}
            formatter={(value: number) => [`${value} XP`, 'XP']}
          />
          <Bar dataKey="xp" radius={[6, 6, 0, 0]} isAnimationActive={false}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.day === new Date().toLocaleDateString(undefined, { weekday: 'short' }) ? 'rgb(var(--violet))' : 'rgb(var(--teal) / 0.55)'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function Dashboard() {
  useRequireOnboarding();
  const { state } = useStore();
  const { due, upcoming } = useDueParts();

  const reviewed = Object.keys(state.progress).length;
  const mastered = Object.values(state.progress).filter((p) => p.status === 'mastered').length;
  const masteryPct = Math.round((mastered / WORD_PARTS.length) * 100);
  const todayActivity = state.activity[todayISO()];
  const todayReviews = todayActivity?.reviews ?? 0;
  const goalPct = Math.min(100, Math.round((todayReviews / state.profile.dailyGoal) * 100));

  // Weakest categories: type with worst accuracy (min 5 answered)
  const weakest = React.useMemo(() => {
    const byType: Record<string, { c: number; t: number }> = {};
    for (const p of Object.values(state.progress)) {
      const part = getPart(p.partId);
      if (!part) continue;
      const t = byType[part.type] ?? { c: 0, t: 0 };
      t.c += p.correct;
      t.t += p.correct + p.incorrect;
      byType[part.type] = t;
    }
    return Object.entries(byType)
      .filter(([, v]) => v.t >= 5)
      .map(([type, v]) => ({ type, acc: Math.round((v.c / v.t) * 100) }))
      .sort((a, b) => a.acc - b.acc)
      .slice(0, 3);
  }, [state.progress]);

  const recentAchievements = [...state.achievements].slice(-3).reverse();
  const nextLesson = LESSONS.find((l) => l.partIds.some((id) => !state.progress[id])) ?? LESSONS[0];
  const continuePart = due[0] ?? null;

  return (
    <AppShell>
      <div className="animate-fade-up">
        {/* Welcome + goal */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-2">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold tracking-tight">
              Welcome back, {state.profile.name || 'Scholar'}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="flex h-11 items-center gap-1.5 rounded-full border border-amber/30 bg-amber/10 px-4 font-semibold text-amber">
              <Flame className="h-4 w-4" aria-hidden="true" /> {state.streak}-day streak
            </span>
          </div>
        </div>

        {/* Stat row */}
        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-2xl border border-border/60 bg-surface-1 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Due reviews</p>
            <p className="mt-1 font-display text-3xl font-bold text-coral">{due.length}</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-surface-1 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Daily goal</p>
            <p className="mt-1 font-display text-3xl font-bold text-teal">
              {todayReviews}<span className="text-lg text-muted-foreground">/{state.profile.dailyGoal}</span>
            </p>
            <div className="mt-2 h-1.5 rounded-full bg-surface-3">
              <div className="h-full rounded-full bg-teal transition-all" style={{ width: `${goalPct}%` }} />
            </div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-surface-1 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Mastery</p>
            <p className="mt-1 font-display text-3xl font-bold text-violet-2">{masteryPct}%</p>
            <div className="mt-2 h-1.5 rounded-full bg-surface-3">
              <div className="h-full rounded-full bg-violet transition-all" style={{ width: `${masteryPct}%` }} />
            </div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-surface-1 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Parts studied</p>
            <p className="mt-1 font-display text-3xl font-bold text-amber">
              {reviewed}<span className="text-lg text-muted-foreground">/{WORD_PARTS.length}</span>
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-5">
          {/* Continue + weekly chart */}
          <div className="space-y-4 lg:col-span-3">
            <div className="relative overflow-hidden rounded-2xl border border-violet/30 bg-gradient-to-br from-violet/15 via-surface-1 to-surface-1 p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-2">Continue learning</p>
              <h2 className="mt-2 font-display text-2xl font-bold">
                {due.length > 0 ? `${due.length} card${due.length === 1 ? ' is' : 's are'} due in your Memory Garden` : 'Garden is clear — learn something new'}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {due.length > 0 && continuePart
                  ? `Next up: ${getPart(continuePart.partId)?.part} — ${getPart(continuePart.partId)?.meaning}`
                  : 'Pick a fresh word part from the library and grow your garden.'}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {due.length > 0 ? (
                  <Link to="/review" className="flex min-h-11 items-center gap-2 rounded-full bg-violet px-6 text-sm font-semibold text-white glow-violet">
                    <Play className="h-4 w-4" aria-hidden="true" /> Review now
                  </Link>
                ) : (
                  <Link to="/library" className="flex min-h-11 items-center gap-2 rounded-full bg-violet px-6 text-sm font-semibold text-white glow-violet">
                    <Play className="h-4 w-4" aria-hidden="true" /> Browse library
                  </Link>
                )}
                <Link to="/quiz" className="flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface-1 px-6 text-sm font-semibold hover:border-teal/50 hover:text-teal">
                  Take a quiz
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-surface-1 p-5">
              <SectionHeading eyebrow="This week" title="Study activity" />
              <WeeklyChart />
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-2xl border border-border/60 bg-surface-1 p-5">
              <SectionHeading eyebrow="Recommended" title="Next lesson" />
              <Link to={`/learn/${nextLesson.id}`} className="group block rounded-xl border border-border/60 bg-surface-2 p-4 transition-colors hover:border-teal/50">
                <p className="font-display font-semibold group-hover:text-teal">{nextLesson.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{nextLesson.description}</p>
                <p className="mt-3 flex items-center gap-1 text-xs font-semibold text-teal">
                  {nextLesson.partIds.length} word parts <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </p>
              </Link>
            </div>

            <div className="rounded-2xl border border-border/60 bg-surface-1 p-5">
              <SectionHeading eyebrow="Focus areas" title="Weakest categories" />
              {weakest.length === 0 ? (
                <p className="text-sm text-muted-foreground">Answer a few questions and we’ll pinpoint your weak spots.</p>
              ) : (
                <ul className="space-y-3">
                  {weakest.map((w) => (
                    <li key={w.type} className="flex items-center justify-between gap-3">
                      <TypeBadge type={w.type as 'prefix' | 'root' | 'suffix'} />
                      <div className="flex flex-1 items-center gap-2">
                        <div className="h-1.5 flex-1 rounded-full bg-surface-3">
                          <div className="h-full rounded-full bg-coral" style={{ width: `${w.acc}%` }} />
                        </div>
                        <span className="w-10 text-right text-xs font-semibold">{w.acc}%</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-2xl border border-border/60 bg-surface-1 p-5">
              <SectionHeading
                eyebrow="Trophies"
                title="Recent achievements"
                action={<Link to="/progress" className="text-xs font-semibold text-violet-2 hover:underline">View all</Link>}
              />
              {recentAchievements.length === 0 ? (
                <p className="text-sm text-muted-foreground">Complete your first review to earn “First Root Learned.”</p>
              ) : (
                <ul className="space-y-2.5">
                  {recentAchievements.map((id) => {
                    const a = ACHIEVEMENTS.find((x) => x.id === id)!;
                    return (
                      <li key={id} className="flex items-center gap-3 rounded-xl bg-surface-2 p-3">
                        <a.icon className="h-5 w-5 text-amber" aria-hidden="true" />
                        <div>
                          <p className="text-sm font-semibold">{a.name}</p>
                          <p className="text-xs text-muted-foreground">{a.description}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="rounded-2xl border border-border/60 bg-surface-1 p-5">
              <SectionHeading eyebrow="Coming up" title="Upcoming reviews" />
              {upcoming.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nothing scheduled yet — your future reviews will appear here.</p>
              ) : (
                <ul className="space-y-2">
                  {upcoming.slice(0, 4).map((p) => {
                    const part = getPart(p.partId);
                    return (
                      <li key={p.partId} className="flex items-center justify-between rounded-xl bg-surface-2 px-3 py-2.5 text-sm">
                        <span className="font-medium">{part?.part}</span>
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" /> {dueLabel(p)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>

        {reviewed === 0 && (
          <div className="mt-6">
            <EmptyState
              title="Your garden is waiting for its first seed"
              body="Study your first word part to start growing."
              action={
                <Link to="/library" className="flex min-h-11 items-center gap-2 rounded-full bg-teal px-6 text-sm font-semibold text-background">
                  <Target className="h-4 w-4" aria-hidden="true" /> Pick your first word part
                </Link>
              }
            />
          </div>
        )}

        <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
          <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
          SAT date: {state.profile.satDate === 'not-sure' ? 'not set yet' : state.profile.satDate}
          <Link to="/profile" className="ml-1 font-semibold text-violet-2 hover:underline">Change</Link>
        </div>
      </div>
    </AppShell>
  );
}
