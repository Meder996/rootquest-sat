import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router';
import { LayoutDashboard, Library, Globe2, TrendingUp, User, Flame, Zap, Menu, X } from 'lucide-react';
import { useStore } from '../lib/store';

export function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="15" className="fill-surface-2" />
      <path d="M16 24c0-6 2-9 6-12-1 5-2 8-6 12zm0 0c0-5-2-8-5-10 0 4 1 7 5 10zm0 0v-9" stroke="rgb(var(--teal))" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/library', label: 'Library', icon: Library },
  { to: '/worlds', label: 'Worlds', icon: Globe2 },
  { to: '/progress', label: 'Progress', icon: TrendingUp },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { state } = useStore();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="grain min-h-dvh bg-background">
      {/* Skip link for keyboard users */}
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-[80] focus:m-2 focus:rounded-lg focus:bg-violet focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>

      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
          <Link to="/dashboard" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight" aria-label="RootQuest SAT home">
            <Logo />
            <span className="hidden sm:inline">RootQuest <span className="text-gradient-violet">SAT</span></span>
          </Link>

          <nav className="ml-6 hidden items-center gap-1 lg:flex" aria-label="Primary">
            {NAV.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'bg-violet/15 text-violet-2' : 'text-muted-foreground hover:text-foreground hover:bg-surface-2'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <span className="flex h-9 items-center gap-1.5 rounded-full border border-amber/30 bg-amber/10 px-3 text-sm font-semibold text-amber" title="Daily streak">
              <Flame className="h-4 w-4" aria-hidden="true" /> {state.streak}
            </span>
            <span className="flex h-9 items-center gap-1.5 rounded-full border border-teal/30 bg-teal/10 px-3 text-sm font-semibold text-teal" title="Experience points">
              <Zap className="h-4 w-4" aria-hidden="true" /> {state.xp.toLocaleString()} XP
            </span>
            <button
              className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground hover:bg-surface-2 lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="border-t border-border/60 px-4 py-2 lg:hidden" aria-label="Mobile">
            {NAV.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                    isActive ? 'bg-violet/15 text-violet-2' : 'text-muted-foreground hover:text-foreground'
                  }`
                }
              >
                <Icon className="h-4.5 w-4.5 h-5 w-5" aria-hidden="true" /> {label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      <main id="main" className="mx-auto w-full max-w-6xl px-4 pb-24 pt-6 sm:px-6 lg:pb-12">
        {children}
      </main>

      {/* Mobile bottom tab bar */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-background/90 backdrop-blur-md lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        aria-label="Bottom navigation"
      >
        <div className="grid grid-cols-5">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${
                  isActive ? 'text-violet-2' : 'text-muted-foreground'
                }`
              }
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}

export function useRequireOnboarding() {
  const { state } = useStore();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!state.profile.onboarded) navigate('/onboarding', { replace: true });
  }, [state.profile.onboarded, navigate]);
}
