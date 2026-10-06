import { Link } from 'react-router';
import { Orbit, TreePine, Building2, Swords, Sprout, Landmark, ArrowRight } from 'lucide-react';
import AppShell from '../components/AppShell';
import { SectionHeading } from '../components/common';
import { WORD_PARTS } from '../data/wordParts';
import { useStore } from '../lib/store';
import { LESSONS } from '../data/achievements';

export default function Worlds() {
  const { state } = useStore();

  const worldStats = (world: 'planet' | 'forest' | 'city') => {
    const parts = WORD_PARTS.filter((p) => p.world === world);
    const studied = parts.filter((p) => state.progress[p.id]).length;
    const mastered = parts.filter((p) => state.progress[p.id]?.status === 'mastered').length;
    return { total: parts.length, studied, mastered };
  };

  const worlds = [
    {
      id: 'planet', name: 'Prefix Planet', desc: 'Directional and modifying prefixes — pre-, post-, hyper-, hypo-.',
      icon: Orbit, iconCls: 'text-violet-2', barCls: 'bg-violet-2', btnCls: 'bg-violet text-white', border: 'hover:border-violet/50', bg: 'from-violet/15',
      to: '/library', flash: '/flashcards?world=planet', stats: worldStats('planet'),
    },
    {
      id: 'forest', name: 'Root Forest', desc: 'Classical roots and word families — port, dict, spec, vert.',
      icon: TreePine, iconCls: 'text-teal', barCls: 'bg-teal', btnCls: 'bg-teal text-background', border: 'hover:border-teal/50', bg: 'from-teal/15',
      to: '/library', flash: '/flashcards?world=forest', stats: worldStats('forest'),
    },
    {
      id: 'city', name: 'Suffix City', desc: 'Endings that change meaning or grammar — -tion, -ity, -ous.',
      icon: Building2, iconCls: 'text-coral', barCls: 'bg-coral', btnCls: 'bg-coral text-background', border: 'hover:border-coral/50', bg: 'from-coral/15',
      to: '/library', flash: '/flashcards?world=city', stats: worldStats('city'),
    },
  ];

  return (
    <AppShell>
      <div className="animate-fade-up">
        <SectionHeading eyebrow="The learning world" title="Choose your destination" />

        <div className="grid gap-4 md:grid-cols-3">
          {worlds.map((w) => (
            <div key={w.id} className={`rounded-3xl border border-border/60 bg-gradient-to-b ${w.bg} to-surface-1 p-6 transition-all hover:-translate-y-1 ${w.border}`}>
              <w.icon className={`h-8 w-8 ${w.iconCls}`} aria-hidden="true" />
              <h2 className="mt-4 font-display text-xl font-bold">{w.name}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{w.desc}</p>
              <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                <span>{w.stats.studied}/{w.stats.total} studied</span>
                <span aria-hidden="true">·</span>
                <span>{w.stats.mastered} mastered</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-surface-3" aria-hidden="true">
                <div className={`h-full rounded-full ${w.barCls}`} style={{ width: `${w.stats.total ? (w.stats.studied / w.stats.total) * 100 : 0}%` }} />
              </div>
              <div className="mt-5 flex gap-2">
                <Link to={w.flash} className={`flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl px-4 text-sm font-semibold ${w.btnCls}`}>
                  Flashcards <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
                <Link to={`/learn/${w.id === 'planet' ? 'lesson-direction' : w.id === 'forest' ? 'lesson-speak' : 'lesson-builders'}`} className="flex min-h-11 items-center justify-center rounded-xl border border-border px-4 text-sm font-semibold hover:text-foreground">
                  Lesson
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Link to="/quiz?mode=arena" className="group rounded-3xl border border-amber/30 bg-gradient-to-b from-amber/10 to-surface-1 p-6 transition-all hover:-translate-y-1 hover:border-amber/60">
            <Swords className="h-8 w-8 text-amber" aria-hidden="true" />
            <h2 className="mt-4 font-display text-xl font-bold">SAT Arena</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">60-second timed practice under real test pressure.</p>
            <p className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-amber">
              Enter the Arena <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </p>
          </Link>

          <Link to="/review" className="group rounded-3xl border border-teal/30 bg-gradient-to-b from-teal/10 to-surface-1 p-6 transition-all hover:-translate-y-1 hover:border-teal/60">
            <Sprout className="h-8 w-8 text-teal" aria-hidden="true" />
            <h2 className="mt-4 font-display text-xl font-bold">Memory Garden</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">Everything due for review, watered by spaced repetition.</p>
            <p className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-teal">
              Tend the garden <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </p>
          </Link>

          <Link to="/progress" className="group rounded-3xl border border-violet/30 bg-gradient-to-b from-violet/10 to-surface-1 p-6 transition-all hover:-translate-y-1 hover:border-violet/60">
            <Landmark className="h-8 w-8 text-violet-2" aria-hidden="true" />
            <h2 className="mt-4 font-display text-xl font-bold">Mastery Museum</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">Achievements, analytics, and the trophies you’ve earned.</p>
            <p className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-violet-2">
              Visit the museum <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </p>
          </Link>
        </div>

        <section className="mt-12">
          <SectionHeading eyebrow="Guided paths" title="Lessons" />
          <div className="grid gap-3 sm:grid-cols-2">
            {LESSONS.map((l) => {
              const studied = l.partIds.filter((id) => state.progress[id]).length;
              return (
                <Link key={l.id} to={`/learn/${l.id}`} className="group rounded-2xl border border-border/60 bg-surface-1 p-5 transition-colors hover:border-violet/50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-semibold group-hover:text-violet-2">{l.title}</h3>
                    <span className="font-mono2 text-xs text-muted-foreground">{studied}/{l.partIds.length}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{l.description}</p>
                  <div className="mt-3 h-1.5 rounded-full bg-surface-3" aria-hidden="true">
                    <div className="h-full rounded-full bg-violet" style={{ width: `${(studied / l.partIds.length) * 100}%` }} />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
