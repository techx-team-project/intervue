'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { useSubmitMockAnswer, useSubmitMockFollowUp } from '@/hooks/useAiMockInterview';
import type {
  MockInterviewDetailResource,
  MockInterviewQuestionResource,
  SubmitAnswerResultResource,
} from '@/types/ai-mock-interview';
import { Sparkles, Send, HelpCircle, ChevronRight, Lightbulb, MessageSquare, Award } from 'lucide-react';
import { toast } from 'sonner';

interface MockInterviewRoomProps {
  session: MockInterviewDetailResource;
  onSessionUpdated: (session: MockInterviewDetailResource) => void;
  onFinish: (completedSession: MockInterviewDetailResource) => void;
}

export default function MockInterviewRoom({ session, onSessionUpdated, onFinish }: MockInterviewRoomProps) {
  const submitAnswerMutation = useSubmitMockAnswer(session.id);
  const submitFollowUpMutation = useSubmitMockFollowUp(session.id);

  const [currentAnswer, setCurrentAnswer] = useState('');
  const [currentFollowUpAnswer, setCurrentFollowUpAnswer] = useState('');
  const [activeResult, setActiveResult] = useState<SubmitAnswerResultResource | null>(null);

  const currentIdx = session.currentQuestionIndex;
  const currentQuestion: MockInterviewQuestionResource | undefined =
    session.questions[currentIdx] || session.questions[session.questions.length - 1];

  const handleSendAnswer = async () => {
    if (!currentAnswer.trim() || !currentQuestion) {
      toast.error('Please enter your answer.');
      return;
    }

    try {
      const res = await submitAnswerMutation.mutateAsync({
        questionId: currentQuestion.id,
        payload: { answer: currentAnswer.trim() },
      });

      setActiveResult(res);

      if (res.sessionCompleted && res.completedSession) {
        onFinish(res.completedSession);
      }
    } catch {
      toast.error('Failed to submit answer. Please try again.');
    }
  };

  const handleSendFollowUp = async () => {
    if (!currentFollowUpAnswer.trim() || !currentQuestion) {
      toast.error('Please enter your follow-up explanation.');
      return;
    }

    try {
      const res = await submitFollowUpMutation.mutateAsync({
        questionId: currentQuestion.id,
        payload: { followUpAnswer: currentFollowUpAnswer.trim() },
      });

      setActiveResult(res);

      if (res.sessionCompleted && res.completedSession) {
        onFinish(res.completedSession);
      }
    } catch {
      toast.error('Failed to submit follow-up response. Please try again.');
    }
  };

  const handleNextQuestion = () => {
    if (!activeResult) return;

    if (activeResult.sessionCompleted && activeResult.completedSession) {
      onFinish(activeResult.completedSession);
      return;
    }

    const updatedQuestions = [...session.questions];
    const answeredIdx = updatedQuestions.findIndex((q) => q.id === activeResult.questionId);
    if (answeredIdx !== -1) {
      updatedQuestions[answeredIdx] = {
        ...updatedQuestions[answeredIdx],
        feedback: activeResult.feedback,
        score: activeResult.score,
        idealAnswer: activeResult.idealAnswer,
      };
    }

    const nextIndex = session.currentQuestionIndex + 1;
    onSessionUpdated({
      ...session,
      currentQuestionIndex: nextIndex,
      questions: updatedQuestions,
    });

    setActiveResult(null);
    setCurrentAnswer('');
    setCurrentFollowUpAnswer('');
  };

  if (!currentQuestion) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-sm text-slate-600">No questions found for this interview session.</p>
      </div>
    );
  }

  const progressPercent = Math.min(100, Math.round(((session.currentQuestionIndex + 1) / session.questionCount) * 100));

  return (
    <div className="space-y-6">
      {/* Session Header & Progress */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-primary/10 text-primary rounded-md px-2 py-0.5 text-xs font-bold">
                {session.targetRole}
              </span>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                {session.seniorityLevel}
              </span>
            </div>
            <h2 className="text-navy mt-1 text-base font-bold">Interactive AI Interview Room</h2>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-500">
              Question {session.currentQuestionIndex + 1} of {session.questionCount}
            </span>
            <div className="mt-1 h-2 w-36 overflow-hidden rounded-full bg-slate-100">
              <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold tracking-wider text-slate-400 uppercase">
            <HelpCircle className="text-primary h-4 w-4" />
            <span>
              Question {currentQuestion.questionOrder} • Category: {currentQuestion.category}
            </span>
          </div>
          <h3 className="text-navy text-lg leading-relaxed font-bold sm:text-xl">{currentQuestion.questionText}</h3>
        </div>

        {/* Answer Input Section (if not yet submitted) */}
        {!activeResult && (
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-navy mb-1.5 block text-xs font-bold">Your Answer:</label>
              <textarea
                rows={5}
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Explain your approach, technical solution, or practical experience..."
                className="text-navy focus:border-primary focus:ring-primary w-full rounded-2xl border border-slate-200 p-4 text-sm focus:ring-1 focus:outline-none"
              />
              <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                <span>
                  Tip: Structure your response using the STAR method (Situation, Task, Action, Result) for clarity.
                </span>
                <span>{currentAnswer.length} characters</span>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                variant="primary"
                onClick={handleSendAnswer}
                isLoading={submitAnswerMutation.isPending}
                leftIcon={<Send className="h-4 w-4" />}
                disabled={!currentAnswer.trim()}
              >
                Submit Answer
              </Button>
            </div>
          </div>
        )}

        {/* Evaluation Feedback and Follow-Up Section */}
        {activeResult && (
          <div className="space-y-5 border-t border-slate-100 pt-4">
            {/* Candidate Answer Display */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="mb-1 flex items-center gap-1.5 text-xs font-bold text-slate-500">
                <MessageSquare className="h-3.5 w-3.5" />
                Your Answer:
              </p>
              <p className="text-navy text-xs leading-relaxed whitespace-pre-wrap">{currentAnswer}</p>
            </div>

            {/* AI Feedback & Score Card */}
            <div className="bg-primary/5 border-primary/20 space-y-3 rounded-2xl border p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-primary h-4 w-4" />
                  <span className="text-navy text-xs font-bold">AI Feedback & Assessment:</span>
                </div>
                {activeResult.score !== null && activeResult.score !== undefined && (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800">
                    <Award className="h-3.5 w-3.5" />
                    {activeResult.score}/100 pts
                  </span>
                )}
              </div>

              <p className="text-navy text-xs leading-relaxed">{activeResult.feedback}</p>

              {activeResult.idealAnswer && (
                <div className="border-primary/10 border-t pt-2">
                  <p className="mb-1 flex items-center gap-1 text-xs font-bold text-emerald-800">
                    <Lightbulb className="h-3.5 w-3.5" />
                    Model Answer / Recommendation:
                  </p>
                  <p className="text-xs leading-relaxed text-slate-600 italic">{activeResult.idealAnswer}</p>
                </div>
              )}
            </div>

            {/* Follow-up question section (at most 1 follow-up) */}
            {activeResult.needsFollowUp && activeResult.followUpQuestion && (
              <div className="space-y-4 rounded-2xl border-2 border-amber-300 bg-amber-50/50 p-5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                  <HelpCircle className="h-4 w-4" />
                  <span>AI Follow-Up Clarification (Max 1 follow-up question):</span>
                </div>
                <p className="text-navy text-sm leading-relaxed font-semibold">{activeResult.followUpQuestion}</p>

                <div className="space-y-3">
                  <textarea
                    rows={4}
                    value={currentFollowUpAnswer}
                    onChange={(e) => setCurrentFollowUpAnswer(e.target.value)}
                    placeholder="Enter your additional explanation to clarify this question..."
                    className="text-navy w-full rounded-xl border border-amber-200 bg-white p-3 text-xs focus:border-amber-400 focus:outline-none"
                  />
                  <div className="flex justify-end">
                    <Button
                      variant="primary"
                      onClick={handleSendFollowUp}
                      isLoading={submitFollowUpMutation.isPending}
                      leftIcon={<Send className="h-4 w-4" />}
                      disabled={!currentFollowUpAnswer.trim()}
                    >
                      Submit Clarification
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Action button to proceed when no pending follow-up */}
            {!activeResult.needsFollowUp && (
              <div className="flex items-center justify-end pt-3">
                <Button variant="primary" onClick={handleNextQuestion} rightIcon={<ChevronRight className="h-4 w-4" />}>
                  {activeResult.sessionCompleted ? 'View Full Interview Report' : 'Proceed to Next Question'}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
