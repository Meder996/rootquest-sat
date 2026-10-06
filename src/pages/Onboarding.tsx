import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { useStore } from '../lib/store';
import { getQuestions } from '../data/questions';
import type { Question } from '../data/questions';
import { Logo } from '../components/AppShell';
import { ConfettiBurst } from '../components/common';
import type { QuizAttempt } from '../lib/types';

type Step = 'name' | 'goal' | 'placement' | 'plan';

export default function Onboarding() {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = React.useState<Step>('name');
  const [name, setName] = React.useState(state.profile.name);
  const [satDate, setSatDate] = React.useState<string | 'not-sure'>(state.profile.satDate);
  const [goal, setGoal] = React.useState(state.profile.dailyGoal);

  // placement quiz state
  const [questions] = React.useState<Question[]>(() => getQuestions({ count: 5, seed: 42 }));
  const [qIndex, setQIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<{ q: Question; chosen: number }[]>([]);
  const placementScore = answers.filter((a) => a.chosen === a.q.answer).length;

  const finish = () => {
    dispatch({ type: 'ONBOARD', profile: { name: name.trim() || 'Scholar', dailyGoal: goal, satDate, onboarded: true, theme: state.profile.theme } });
    if (answers.length === questions.length) {
      const attempt: QuizAttempt = {
        id: `placement-${Date.now()}`,
        mode: 'standard',
        category: 'placement',
        score: placementScore,
        total: questions.length,
        durationMs: 0,
        date: new Date().toISOString(),
        completed: true,
        answers: answers.map((a) => ({
          questionId: a.q.id,
          partId: a.q.partId,
          chosen: a.chosen,
          correct: a.chosen === a.q.answer,
          responseMs: 0,
        })),
      };
      dispatch({ type: 'RECORD_QUIZ', attempt });
    }
    navigate('/dashboard');
  };

  const stepIndex = ['name', 'goal', 'placement', 'plan'].indexOf(step);

  return (
    <div className="grain flex min-h-dvh flex-col items-center bg-background px-4 py-8">
      <div className="flex items-center gap-2 font-display text-lg font-bold">
        <Logo /> RootQuest <span className="text-gradient-violet">SAT</span>
      </div>

      {/* progress */}
      <div className="mt-6 flex w-full max-w-md gap-1.5" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= stepIndex ? 'bg-violet' : 'bg-surface-3'}`} />
        ))}
      </div>

      <div className="mt-8 w-full max-w-md animate-fade-up rounded-3xl border border-border/60 bg-surface-1 p-6 sm:p-8" key={step}>
        {step === 'name' && (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-2">Step 1 of 4</p>
            <h1 className="mt-2 font-display text-2xl font-bold">Welcome to your word garden</h1>
            <label className="mt-6 block text-sm font-medium" htmlFor="ob-name">
              What should we call you?
            </label>
            <input
              id="ob-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="mt-2 h-12 w-full rounded-xl border border-input bg-surface-2 px-4 text-base outline-none focus:border-violet"
            />
            <label className="mt-5 block text-sm font-medium" htmlFor="ob-date">
              When is your SAT?
            </label>
            <input
              id="ob-date"
              type="date"
              value={satDate === 'not-sure' ? '' : satDate}
              onChange={(e) => setSatDate(e.target.value || 'not-sure')}
              className="mt-2 h-12 w-full rounded-xl border border-input bg-surface-2 px-4 text-base outline-none focus:border-violet"
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
            <button
              onClick={() => setStep('goal')}
              className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet font-semibold text-white"
            >
              Continue <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}

        {step === 'goal' && (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-2">Step 2 of 4</p>
            <h1 className="mt-2 font-display text-2xl font-bold">Set your daily goal</h1>
            <p className="mt-2 text-sm text-muted-foreground">How many reviews will you plant each day?</p>
            <div className="mt-8 text-center">
              <span className="font-display text-7xl font-bold text-gradient-violet">{goal}</span>
              <p className="mt-1 text-sm text-muted-foreground">reviews per day</p>
            </div>
            <input
              type="range"
              min={5}
              max={40}
              step={5}
              value={goal}
              onChange={(e) => setGoal(Number(e.target.value))}
              aria-label="Daily review goal"
              className="mt-6 w-full accent-[rgb(var(--violet))]"
            />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>5 — gentle</span>
              <span>20 — steady</span>
              <span>40 — intense</span>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setStep('name')} className="flex min-h-12 items-center gap-2 rounded-xl border border-border px-5 font-semibold">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
              </button>
              <button onClick={() => setStep('placement')} className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-violet font-semibold text-white">
                Continue <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {step === 'placement' && (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-2">Step 3 of 4</p>
            <h1 className="mt-2 font-display text-2xl font-bold">Quick placement quiz</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Five questions, so we can recommend a starting lesson. Question {qIndex + 1} of {questions.length}.
            </p>
            {qIndex < questions.length ? (
              <PlacementQuestion
                key={questions[qIndex].id}
                q={questions[qIndex]}
                onAnswer={(chosen) => {
                  setAnswers((a) => [...a, { q: questions[qIndex], chosen }]);
                  setQIndex((i) => i + 1);
                }}
              />
            ) : (
              <div className="mt-6 text-center">
                <p className="font-display text-4xl font-bold text-gradient-violet">
                  {placementScore}/{questions.length}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {placementScore >= 4 ? 'Impressive! We’ll start you on advanced paths.' : placementScore >= 2 ? 'Solid foundation — steady progress ahead.' : 'Perfect starting point — the garden grows from here.'}
                </p>
                <button onClick={() => setStep('plan')} className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet font-semibold text-white">
                  See my plan <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            )}
            {qIndex === 0 && (
              <button onClick={() => setStep('plan')} className="mt-4 w-full min-h-11 text-sm font-medium text-muted-foreground hover:text-foreground">
                Skip placement quiz
              </button>
            )}
          </div>
        )}

        {step === 'plan' && (
          <div className="relative text-center">
            <ConfettiBurst show />
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal/15">
              <Check className="h-8 w-8 text-teal" aria-hidden="true" />
            </span>
            <h1 className="mt-4 font-display text-2xl font-bold">Your plan is ready, {name.trim() || 'Scholar'}</h1>
            <ul className="mx-auto mt-6 max-w-xs space-y-3 text-left text-sm">
              <li className="flex gap-3 rounded-xl bg-surface-2 p-3">
                <span className="font-mono2 font-semibold text-violet-2">01</span>
                Start with the “Word Builders” lesson in Suffix City
              </li>
              <li className="flex gap-3 rounded-xl bg-surface-2 p-3">
                <span className="font-mono2 font-semibold text-violet-2">02</span>
                Review {goal} cards a day with spaced repetition
              </li>
              <li className="flex gap-3 rounded-xl bg-surface-2 p-3">
                <span className="font-mono2 font-semibold text-violet-2">03</span>
                Test yourself weekly in the SAT Arena
              </li>
            </ul>
            <button onClick={finish} className="mt-8 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet font-semibold text-white glow-violet">
              Enter my garden <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function PlacementQuestion({ q, onAnswer }: { q: Question; onAnswer: (chosen: number) => void }) {
  const [picked, setPicked] = React.useState<number | null>(null);
  return (
    <div className="mt-5">
      {q.passage && <p className="mb-3 rounded-xl bg-surface-2 p-3 text-sm italic text-muted-foreground">“{q.passage}”</p>}
      <p className="font-medium">{q.prompt}</p>
      <div className="mt-3 space-y-2">
        {q.choices.map((c, i) => {
          const state = picked === null ? '' : i === q.answer ? 'border-teal bg-teal/10 text-teal' : i === picked ? 'border-coral bg-coral/10 text-coral' : 'opacity-50';
          return (
            <button
              key={i}
              disabled={picked !== null}
              onClick={() => {
                setPicked(i);
                setTimeout(() => onAnswer(i), 650);
              }}
              className={`min-h-11 w-full rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-left text-sm transition-all ${state}`}
            >
              {c}
            </button>
          );
        })}
      </div>
    </div>
  );
}
