import React from 'react';
import { Moon, Sun, Trash2 } from 'lucide-react';
import AppShell from '../components/AppShell';
import { SectionHeading } from '../components/common';
import { useStore } from '../lib/store';

export default function Profile() {
  const { state, dispatch } = useStore();
  const [name, setName] = React.useState(state.profile.name);
  const [satDate, setSatDate] = React.useState(state.profile.satDate);
  const [goal, setGoal] = React.useState(state.profile.dailyGoal);
  const [confirmReset, setConfirmReset] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const save = () => {
    dispatch({ type: 'UPDATE_PROFILE', profile: { name: name.trim() || 'Scholar', satDate: satDate || 'not-sure', dailyGoal: goal } });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-lg animate-fade-up">
        <SectionHeading eyebrow="Profile & settings" title={state.profile.name || 'Scholar'} />

        <div className="rounded-3xl border border-border/60 bg-surface-1 p-6 sm:p-8">
          <label className="block text-sm font-medium" htmlFor="pf-name">Display name</label>
          <input
            id="pf-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 h-12 w-full rounded-xl border border-input bg-surface-2 px-4 outline-none focus:border-violet"
          />

          <label className="mt-5 block text-sm font-medium" htmlFor="pf-date">SAT date</label>
          <input
            id="pf-date"
            type="date"
            value={satDate === 'not-sure' ? '' : satDate}
            onChange={(e) => setSatDate(e.target.value || 'not-sure')}
            className="mt-2 h-12 w-full rounded-xl border border-input bg-surface-2 px-4 outline-none focus:border-violet"
          />
          <label className="mt-3 flex min-h-11 items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={satDate === 'not-sure'}
              onChange={(e) => setSatDate(e.target.checked ? 'not-sure' : '')}
              className="h-5 w-5 accent-[rgb(var(--violet))]"
            />
            Not sure yet
          </label>

          <label className="mt-5 block text-sm font-medium" htmlFor="pf-goal">Daily goal: <span className="text-violet-2">{goal} reviews</span></label>
          <input
            id="pf-goal"
            type="range"
            min={5}
            max={40}
            step={5}
            value={goal}
            onChange={(e) => setGoal(Number(e.target.value))}
            className="mt-2 w-full accent-[rgb(var(--violet))]"
          />

          <button onClick={save} className="mt-6 flex min-h-12 w-full items-center justify-center rounded-xl bg-violet font-semibold text-white">
            {saved ? 'Saved' : 'Save changes'}
          </button>
        </div>

        {/* Theme */}
        <div className="mt-4 rounded-3xl border border-border/60 bg-surface-1 p-6">
          <p className="text-sm font-semibold">Theme</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {(['dark', 'light'] as const).map((t) => (
              <button
                key={t}
                onClick={() => dispatch({ type: 'UPDATE_PROFILE', profile: { theme: t } })}
                aria-pressed={state.profile.theme === t}
                className={`flex min-h-12 items-center justify-center gap-2 rounded-xl border text-sm font-semibold capitalize transition-colors ${
                  state.profile.theme === t ? 'border-violet bg-violet/15 text-violet-2' : 'border-border bg-surface-2 text-muted-foreground'
                }`}
              >
                {t === 'dark' ? <Moon className="h-4 w-4" aria-hidden="true" /> : <Sun className="h-4 w-4" aria-hidden="true" />}
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Privacy note + reset */}
        <div className="mt-4 rounded-3xl border border-border/60 bg-surface-1 p-6">
          <p className="text-sm font-semibold">Your data</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            This MVP stores everything — progress, streaks, quiz history — only in this browser’s local storage. Nothing is uploaded or shared. Clearing your browser data will erase it.
          </p>
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="mt-4 flex min-h-11 items-center gap-2 rounded-xl border border-coral/40 px-5 text-sm font-semibold text-coral hover:bg-coral/10"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" /> Reset all progress
            </button>
          ) : (
            <div className="mt-4 rounded-xl border border-coral/40 bg-coral/10 p-4">
              <p className="text-sm font-semibold text-coral">Delete everything?</p>
              <p className="mt-1 text-xs text-muted-foreground">Progress, achievements, streaks and saved words will be erased permanently.</p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => { dispatch({ type: 'RESET' }); setConfirmReset(false); }}
                  className="min-h-11 rounded-xl bg-coral px-5 text-sm font-semibold text-white"
                >
                  Yes, reset
                </button>
                <button onClick={() => setConfirmReset(false)} className="min-h-11 rounded-xl border border-border px-5 text-sm font-semibold">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
