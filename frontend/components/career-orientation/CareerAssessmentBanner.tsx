'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { CAREER_ORIENTATION_MESSAGES } from '@/constants/career-orientation';

export default function CareerAssessmentBanner() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const {
    badge,
    title,
    description,
    progressLabel,
    backBtn,
    completedBadge,
    completedTitle,
    completedDesc,
    seeGuideCta,
    retakeCta,
    quizSteps,
  } = CAREER_ORIENTATION_MESSAGES.assessment;

  const handleSelectOption = (optionIndex: number) => {
    const updated = [...selectedAnswers];
    updated[currentStep] = optionIndex;
    setSelectedAnswers(updated);

    if (currentStep < quizSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedAnswers([]);
    setIsCompleted(false);
  };

  const currentQuestion = quizSteps[currentStep];
  const finalRecommendation = quizSteps[0].options[selectedAnswers[0] || 0];

  return (
    <div className="border-primary/30 bg-primary-deeper shadow-elevation-2 relative my-8 overflow-hidden rounded-3xl border text-white">
      <div className="relative p-6 sm:p-8 lg:p-10">
        <div className="mb-6 flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center">
          <div>
            <div className="text-primary-bright mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{badge}</span>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-white sm:text-2xl">{title}</h3>
            <p className="mt-1 text-xs text-emerald-100/80 sm:text-sm">{description}</p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-emerald-200">
            <span>{progressLabel}</span>
            <div className="flex items-center gap-1.5">
              {quizSteps.map((step, idx) => (
                <div
                  key={step.id}
                  className={`h-2 rounded-full transition duration-300 ${
                    isCompleted || idx <= currentStep ? 'bg-primary w-8' : 'w-4 bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {!isCompleted ? (
          <div>
            <h4 className="mb-4 text-base font-semibold text-emerald-100 sm:text-lg">{currentQuestion.question}</h4>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              {currentQuestion.options.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  className="group hover:border-primary flex flex-col rounded-2xl border border-white/15 bg-white/10 p-4 text-left transition duration-200 hover:bg-white/20"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="group-hover:text-primary-bright text-sm font-bold text-white transition-colors">
                      {opt.label}
                    </span>
                    <span className="group-hover:border-primary group-hover:bg-primary flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/30 text-white">
                      <ArrowRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    </span>
                  </div>
                  <span className="mt-2 text-xs text-emerald-100/70">{opt.sublabel}</span>
                </button>
              ))}
            </div>

            {currentStep > 0 && (
              <div className="mt-4 flex justify-start">
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="text-xs text-emerald-200/80 underline hover:text-white"
                >
                  {backBtn}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-emerald-400/30 bg-white/10 p-6">
            <div className="text-primary-bright mb-3 flex items-center gap-3">
              <CheckCircle2 className="text-primary h-6 w-6" />
              <span className="text-sm font-semibold tracking-wider uppercase">{completedBadge}</span>
            </div>

            <h4 className="mb-2 text-xl font-bold text-white sm:text-2xl">
              {completedTitle(finalRecommendation.recommendedField)}
            </h4>
            <p className="mb-5 max-w-2xl text-sm leading-relaxed text-emerald-100/90">{completedDesc}</p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/blog/dinh-huong-nghe-nghiep/${finalRecommendation.slug}`}
                className="bg-primary shadow-elevation-2 hover:bg-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition hover:shadow-emerald-500/20"
              >
                <span>{seeGuideCta}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 px-4 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-white/10 hover:text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>{retakeCta}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
