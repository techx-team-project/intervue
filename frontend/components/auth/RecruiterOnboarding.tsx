'use client';

import type { RecruiterOnboardingStep } from '@/types/recruiter-onboarding';
import { useEffect, useRef, useState } from 'react';
import RecruiterNeedsStep from './RecruiterNeedsStep';
import RecruiterOnboardingStepper from './RecruiterOnboardingStepper';
import RecruiterProfileStep from './RecruiterProfileStep';

type RecruiterOnboardingProps = {
  startStep: RecruiterOnboardingStep;
  name: string;
  onFinish: () => void;
};

export default function RecruiterOnboarding({ startStep, name, onFinish }: RecruiterOnboardingProps) {
  const [step, setStep] = useState<RecruiterOnboardingStep>(startStep);
  const [displayName, setDisplayName] = useState(name);
  const isProfileStep = step === 'profile';
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  return (
    <div className="w-full space-y-8">
      <div>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-2xl font-extrabold tracking-tight text-slate-900 outline-none sm:text-3xl"
        >
          {isProfileStep ? 'Welcome, ' : 'Hi, '}
          <span className="text-primary">{displayName}</span>
        </h1>
        {isProfileStep && <p className="text-primary mt-1 text-lg font-bold sm:text-xl">to InterVue for Employers</p>}
        <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
          {isProfileStep
            ? 'Fill in your recruiter information so we can set up your employer account.'
            : 'Tell us about your next hiring round so InterVue can support you better.'}
        </p>
      </div>

      <RecruiterOnboardingStepper current={step} />

      {isProfileStep ? (
        <RecruiterProfileStep
          name={displayName}
          onSubmit={(values) => {
            setDisplayName(values.name);
            setStep('needs');
          }}
        />
      ) : (
        <RecruiterNeedsStep onSubmit={onFinish} onSkip={onFinish} />
      )}
    </div>
  );
}
