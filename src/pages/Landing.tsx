import React from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowRight, Layers, Brain, Timer, BarChart3, Sparkles, BookOpen, ChevronRight } from 'lucide-react';
import { WORD_PARTS } from '../data/wordParts';
import { Logo } from '../components/AppShell';
import { TypeBadge } from '../components/common';

/** Interactive flip card demo on the hero */
function SampleCard() {
  const [flipped, setFlipped] = React.useState(false);
  const part = WORD_PARTS.find((p) => p.id === 'rt-port')!;
  return (
    <button
      onClick={() => setFlipped((v) => !v)}
      aria-pressed={flipped}
      aria-label="Flip the sample word-part card"
      className="relative block w-full max-w-sm select-none rounded-3xl border border-violet/30 bg-surface-1 p-6 text-left shadow-[0_20px_60px_-20px_rgb(var(--violet)/0.4)] transition-transform hover:-translate-y-1 [perspective:800px]"
    >
      <div className="flex items-center justify-between">
        <TypeBadge type={part.type} />
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Tap to flip</span>
      </div>
      {!flipped ? (
        <div key="front" className="animate-flip-in pt-8 pb-4 text-center">
          <p className="font-display text-6xl font-bold tracking-tight text-gradient-violet">{part.part}</p>
          <p className="mt-4 text-sm text-muted-foreground">What does this root mean?</p>
        </div>
      ) : (
        <div key="back" className="animate-flip-in pt-6 pb-2">
          <p className="font-display text-2xl font-bold">port = “{part.meaning}”</p>
          <p className="mt-1 text-sm text-muted-foreground">Origin: {part.origin}</p>
          <div className="mt-4 space-y-2 border-t border-border/60 pt-4 text-sm">
            {part.examples.map((e) => (
              <p key={e.word}>
                <span className="font-semibold text-teal">{e.word}</span> — {e.definition}
              </p>
            ))}
          </div>
        </div>
      )}
    </button>
  );
}

/** Scroll-drawn learning path (stroke-dashoffset tied to scroll) */
function LearningPath() {
  const pathRef = React.useRef<SVGPathElement>(null);
  const dotRef = React.useRef<SVGCircleElement>(null);
  const [progress, setProgress] = React.useState(0);
  const sectionRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;

    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.85 - rect.top) / (rect.height + vh * 0.3)));
      setProgress(p);
      path.style.strokeDashoffset = `${length * (1 - p)}`;
      const point = path.getPointAtLength(length * p);
      dotRef.current?.setAttribute('cx', `${point.x}`);
      dotRef.current?.setAttribute('cy', `${point.y}`);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const stops = [
    { x: 60, y: 40, label: 'Prefix Planet', color: 'rgb(var(--violet))' },
    { x: 380, y: 120, label: 'Root Forest', color: 'rgb(var(--teal))' },
    { x: 120, y: 220, label: 'Suffix City', color: 'rgb(var(--coral))' },
    { x: 400, y: 300, label: 'SAT Arena', color: 'rgb(var(--amber))' },
    { x: 180, y: 390, label: 'Mastery Museum', color: 'rgb(var(--violet-2))' },
  ];

  return (
    <div ref={sectionRef} className="relative mx-auto max-w-2xl">
      <svg viewBox="0 0 480 440" className="w-full" role="img" aria-label="Animated preview of the RootQuest learning path through five worlds">
        <defs>
          <linearGradient id="pathGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgb(var(--violet))" />
            <stop offset="50%" stopColor="rgb(var(--teal))" />
            <stop offset="100%" stopColor="rgb(var(--coral))" />
          </linearGradient>
        </defs>
        <path
          d="M60 40 C 200 20, 320 60, 380 120 S 200 200, 120 220 S 340 280, 400 300 S 260 380, 180 390"
          fill="none"
          stroke="hsl(var(--surface-3))"
          strokeWidth="3"
          strokeDasharray="6 8"
        />
        <path
          ref={pathRef}
          d="M60 40 C 200 20, 320 60, 380 120 S 200 200, 120 220 S 340 280, 400 300 S 260 380, 180 390"
          fill="none"
          stroke="url(#pathGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <circle ref={dotRef} cx="60" cy="40" r="8" fill="rgb(var(--teal))" className="drop-shadow-[0_0_10px_rgb(var(--teal))]" />
        {stops.map((s, i) => {
          const thresholds = [0, 0.28, 0.5, 0.74, 0.97];
          const active = progress >= thresholds[i];
          return (
            <g key={s.label} opacity={active ? 1 : 0.35} style={{ transition: 'opacity 0.4s ease' }}>
              <circle cx={s.x} cy={s.y} r="16" fill="hsl(var(--surface-2))" stroke={s.color} strokeWidth="2.5" />
              <circle cx={s.x} cy={s.y} r="6" fill={s.color} />
              <text
                x={s.x + (s.x > 300 ? -170 : 26)}
                y={s.y + 5}
                className="fill-foreground font-display text-[15px] font-semibold"
              >
                {s.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Word parts, not word lists',
    body: 'Learn the 130+ prefixes, roots, and suffixes that unlock thousands of SAT words at once.',
  },
  {
    icon: Brain,
    title: 'Spaced repetition',
    body: 'Rate each card Again, Hard, Good, or Easy. The algorithm schedules the next review at the perfect moment.',
  },
  {
    icon: Layers,
    title: 'Flashcards with feedback',
    body: 'Flip cards, use keyboard shortcuts, star the hard ones, and watch weak spots become strengths.',
  },
  {
    icon: Timer,
    title: 'SAT Arena speed rounds',
    body: '60-second timed challenges that train you to decode words under real test pressure.',
  },
  {
    icon: BarChart3,
    title: 'Progress you can see',
    body: 'Mastery percentages, weekly activity charts, and your weakest categories — always one tap away.',
  },
  {
    icon: Sparkles,
    title: 'A world that grows with you',
    body: 'Prefix Planet, Root Forest, Suffix City: every study session grows your personal word garden.',
  },
];

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="grain min-h-dvh bg-background text-foreground">
      {/* Nav */}
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <span className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
          <Logo /> RootQuest <span className="text-gradient-violet">SAT</span>
        </span>
        <nav className="flex items-center gap-2" aria-label="Landing">
          <Link to="/library" className="hidden rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground sm:block">
            Sample lesson
          </Link>
          <button
            onClick={() => navigate('/onboarding')}
            className="min-h-11 rounded-full bg-violet px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
          >
            Start Learning
          </button>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-20 pt-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pt-20">
        <div className="animate-fade-up">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-teal">A word garden for the SAT</p>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            Decode difficult words. <span className="text-gradient-violet">Unlock your SAT potential.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            RootQuest teaches the roots, prefixes, and suffixes behind academic vocabulary — through flashcards,
            quizzes, spaced repetition, and a world that grows every time you study.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/onboarding')}
              className="group flex min-h-12 items-center gap-2 rounded-full bg-violet px-7 text-base font-semibold text-white glow-violet transition-transform hover:scale-[1.03]"
            >
              Start Learning
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </button>
            <button
              onClick={() => navigate('/quiz')}
              className="flex min-h-12 items-center gap-2 rounded-full border border-border bg-surface-1 px-7 text-base font-semibold transition-colors hover:border-teal/50 hover:text-teal"
            >
              Try a Sample Quiz
            </button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Free to try · No account needed · Works offline in your browser</p>
        </div>
        <div className="animate-fade-up [animation-delay:150ms] flex justify-center lg:justify-end">
          <div className="animate-float-slow">
            <SampleCard />
          </div>
        </div>
      </section>

      {/* Learning path */}
      <section className="border-t border-border/50 bg-surface-1/40 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto mb-10 max-w-xl text-center">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-2">The journey</p>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">One path. Five worlds.</h2>
            <p className="mt-3 text-muted-foreground">
              Scroll and watch the path draw itself — that’s exactly how your progress grows, one review at a time.
            </p>
          </div>
          <LearningPath />
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto mb-12 max-w-xl text-center">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-coral">Why it works</p>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Built like a game. Rigorous like a tutor.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="animate-fade-up rounded-2xl border border-border/60 bg-surface-1 p-6 transition-colors hover:border-violet/40"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <f.icon className="h-6 w-6 text-teal" aria-hidden="true" />
                <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border/50 bg-surface-1/40 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto mb-12 max-w-xl text-center">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber">How it works</p>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Three steps to a bigger vocabulary</h2>
          </div>
          <ol className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
            {[
              ['01', 'Learn the part', 'Each word part comes with a meaning, origin, visual clue, and real example words.'],
              ['02', 'Review on schedule', 'Spaced repetition brings cards back exactly when you’re about to forget them.'],
              ['03', 'Prove it in the Arena', 'Quizzes and timed rounds turn recognition into test-day reflexes.'],
            ].map(([n, t, b]) => (
              <li key={n} className="relative rounded-2xl border border-border/60 bg-surface-1 p-6">
                <span className="font-mono2 text-sm font-semibold text-violet-2">{n}</span>
                <h3 className="mt-3 font-display text-lg font-semibold">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b}</p>
                <ChevronRight className="absolute right-5 top-6 h-5 w-5 text-muted-foreground/40" aria-hidden="true" />
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">
            Your word garden is <span className="text-gradient-violet">waiting to grow.</span>
          </h2>
          <button
            onClick={() => navigate('/onboarding')}
            className="mt-8 min-h-12 rounded-full bg-violet px-8 text-base font-semibold text-white glow-violet transition-transform hover:scale-[1.03]"
          >
            Start Learning — it’s free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <span className="flex items-center gap-2">
            <Logo size={20} /> RootQuest SAT
          </span>
          <nav className="flex gap-6" aria-label="Footer">
            <Link to="/library" className="hover:text-foreground">Library</Link>
            <Link to="/quiz" className="hover:text-foreground">Sample quiz</Link>
            <Link to="/progress" className="hover:text-foreground">Progress</Link>
          </nav>
          <p>Built for students, by word nerds.</p>
        </div>
      </footer>
    </div>
  );
}
