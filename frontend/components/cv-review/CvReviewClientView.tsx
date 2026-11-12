'use client';

import { getCvReviewQuota, requestCvReview, uploadCvForReview } from '@/apiRequest/ai';
import { candidateCvApi } from '@/apiRequest/candidate-cv';
import { publicJobApi } from '@/apiRequest/public-job';
import { buttonClassName } from '@/components/ui/Button';
import {
  BYTES_PER_KB,
  MAX_CV_FILE_BYTES,
  PAID_LEVEL,
  POPULAR_POSITIONS,
  type CvSource,
  type ReviewLevel,
} from '@/constants/cv-review';
import { useAiPersonalDataConsent } from '@/hooks/useAiPersonalDataConsent';
import { useCandidateCredits } from '@/hooks/useCandidateCredits';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import type { CandidateResume } from '@/types/candidate-application';
import type { CvReviewQuota, CvReviewResult } from '@/types/cv-review';
import type { PublicJobSummaryResource } from '@/types/public-job';
import { AlertCircle, Lock } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition, type ChangeEvent, type DragEvent } from 'react';
import { toast } from 'sonner';
import { CreditHistoryModal } from './CreditHistoryModal';
import { JobFitResultView } from './JobFitResultView';
import ReviewCvSource from './ReviewCvSource';
import ReviewJobPicker from './ReviewJobPicker';
import ReviewLevelPicker from './ReviewLevelPicker';
import ReviewReport from './ReviewReport';
import ReviewSidebar from './ReviewSidebar';
import ReviewStep from './ReviewStep';
import { TopupCreditModal } from './TopupCreditModal';

const JOB_SAMPLE_SIZE = 30;

const INPUT_CLASS =
  'text-body-md text-on-surface placeholder:text-on-surface-variant border-outline hover:border-on-surface-variant/60 focus:border-primary h-11 w-full rounded-xl border bg-white px-4 transition-colors outline-none focus:ring-2 focus:ring-emerald-600/15';

export default function CvReviewClientView() {
  const searchParams = useSearchParams();
  const urlJobId = searchParams.get('jobId');
  const urlLevel = searchParams.get('level');

  const user = useAuthStore((state) => state.user ?? state.candidate.user);
  const accessToken = useAuthStore((state) => state.accessToken ?? state.candidate.accessToken);
  const isAuthenticated = Boolean(accessToken || user);

  const [level, setLevel] = useState<ReviewLevel>(urlJobId || urlLevel === '3' ? PAID_LEVEL : 2);
  const [targetPosition, setTargetPosition] = useState(POPULAR_POSITIONS[0]);
  const [jobs, setJobs] = useState<PublicJobSummaryResource[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(urlJobId ? Number(urlJobId) : null);
  const [cvSource, setCvSource] = useState<CvSource>('resume');
  const [userResumes, setUserResumes] = useState<CandidateResume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState('');
  const [quota, setQuota] = useState<CvReviewQuota | null>(null);
  const [isTopupOpen, setIsTopupOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [reviewResult, setReviewResult] = useState<CvReviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const { data: creditSummary, refetch: refetchCredits } = useCandidateCredits(isAuthenticated);
  const { requestConsent, consentDialog } = useAiPersonalDataConsent();
  const credits = creditSummary?.currentBalance ?? 0;

  useEffect(() => {
    let active = true;
    if (isAuthenticated) {
      void getCvReviewQuota().then(
        (data) => {
          if (active && data) setQuota(data);
        },
        () => {},
      );
      void candidateCvApi.list().then(
        (list) => {
          if (active && list && list.length > 0) {
            setUserResumes(list);
            setSelectedResumeId((list.find((resume) => resume.isDefault) ?? list[0]).id);
          } else if (active) {
            setCvSource('upload');
          }
        },
        () => {
          if (active) setCvSource('upload');
        },
      );
    }
    void publicJobApi.search({ size: JOB_SAMPLE_SIZE }).then(
      (response) => {
        if (!active || !response?.items) return;
        setJobs(response.items);
        setSelectedJobId((current) => current ?? (urlJobId ? null : (response.items[0]?.id ?? null)));
      },
      () => {},
    );
    return () => {
      active = false;
    };
  }, [isAuthenticated, urlJobId]);

  const acceptFile = (file: File | undefined) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Please choose a PDF file (.pdf).');
      return;
    }
    if (file.size > MAX_CV_FILE_BYTES) {
      toast.error(`The CV file must be under ${MAX_CV_FILE_BYTES / BYTES_PER_KB / BYTES_PER_KB} MB.`);
      return;
    }
    setSelectedFile(file);
    setError(null);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => acceptFile(event.target.files?.[0]);

  const handleFileDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    acceptFile(event.dataTransfer.files?.[0]);
  };

  const validate = (): boolean => {
    if (level === 2 && !targetPosition.trim()) return fail('Enter the target job position.');
    if (level === PAID_LEVEL && !selectedJobId) return fail('Choose a job post to match against.');
    if (level === PAID_LEVEL && credits < 1) {
      toast.error('You do not have enough credits. Please top up to continue.');
      setIsTopupOpen(true);
      return false;
    }
    if (cvSource === 'resume' && !selectedResumeId) return fail('Choose a saved CV or upload a new file.');
    if (cvSource === 'upload' && !selectedFile) return fail('Choose a PDF CV to review.');
    if (cvSource === 'text' && !cvText.trim()) return fail('Paste the text of your CV.');
    return true;
  };

  const fail = (message: string) => {
    toast.error(message);
    return false;
  };

  const runReview = async () => {
    setError(null);
    try {
      const result =
        cvSource === 'upload' && selectedFile
          ? await uploadCvForReview(
              selectedFile,
              level === 2 ? targetPosition : undefined,
              level === PAID_LEVEL ? (selectedJobId ?? undefined) : undefined,
            )
          : await requestCvReview({
              resumeId: cvSource === 'resume' ? (selectedResumeId ?? undefined) : undefined,
              cvText: cvSource === 'text' ? cvText : undefined,
              targetPosition: level === 2 ? targetPosition : undefined,
              jobId: level === PAID_LEVEL ? (selectedJobId ?? undefined) : undefined,
              level,
            });

      setReviewResult(result);
      toast.success(level === PAID_LEVEL ? 'Your CV was matched with the job.' : 'Your CV was reviewed.');
      if (level === PAID_LEVEL) {
        void refetchCredits();
      } else {
        const updatedQuota = await getCvReviewQuota().catch(() => null);
        if (updatedQuota) setQuota(updatedQuota);
      }
    } catch (err: unknown) {
      const apiError = err as { message?: string; status?: number };
      if (apiError?.status === 402 || apiError?.message?.includes('INSUFFICIENT_CREDITS')) {
        setError('You do not have enough credits for a Level 3 review. Please top up.');
        setIsTopupOpen(true);
      } else if (apiError?.status === 401 || apiError?.message?.includes('UNAUTHENTICATED')) {
        setError('Sign in with a candidate account to review your CV.');
      } else {
        setError(
          apiError?.message || 'We could not review your CV right now. Any credit used is refunded automatically.',
        );
      }
    }
  };

  const handleSubmit = () => {
    if (!validate()) return;
    requestConsent(() => startTransition(runReview));
  };

  const handleReset = () => {
    setReviewResult(null);
    setError(null);
  };

  const isJobFitResult =
    reviewResult && (reviewResult.reviewLevel === PAID_LEVEL || (reviewResult.requirementMatches?.length ?? 0) > 0);

  return (
    <div className="container-page py-8">
      {consentDialog}
      <TopupCreditModal isOpen={isTopupOpen} onClose={() => setIsTopupOpen(false)} currentBalance={credits} />
      <CreditHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        transactions={creditSummary?.recentTransactions}
        currentBalance={credits}
      />

      <header className="mb-6 max-w-2xl space-y-2">
        <h1 className="font-display text-headline-md text-on-surface font-bold">AI CV review</h1>
        <p className="text-body-lg text-on-surface-variant">
          Get an ATS score and concrete rewrites for your CV, tailored to a target role or matched against a real job
          post.
        </p>
      </header>

      {!isAuthenticated && (
        <div className="bg-surface border-outline-variant mb-6 flex flex-col items-start justify-between gap-3 rounded-2xl border p-5 sm:flex-row sm:items-center">
          <p className="text-body-md text-on-surface flex items-center gap-2.5">
            <Lock className="text-primary h-4 w-4 shrink-0" aria-hidden />
            Sign in with a candidate account to save your history and manage credits.
          </p>
          <Link href="/login?redirect=/cv-review" className={buttonClassName({ size: 'md', className: 'px-5' })}>
            Sign in
          </Link>
        </div>
      )}

      {reviewResult ? (
        <div className="mx-auto max-w-4xl">
          {isJobFitResult ? (
            <JobFitResultView
              result={reviewResult}
              onReset={handleReset}
              onOpenCreditHistory={() => setIsHistoryOpen(true)}
            />
          ) : (
            <ReviewReport result={reviewResult} onReset={handleReset} />
          )}
        </div>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="min-w-0 space-y-4">
            <ReviewStep step="01" title="Choose a review level">
              <ReviewLevelPicker value={level} onChange={setLevel} />
            </ReviewStep>

            {level === 2 && (
              <ReviewStep step="02" title="Target position" hint="The role you want your CV to be optimized for.">
                <input
                  type="text"
                  value={targetPosition}
                  onChange={(event) => setTargetPosition(event.target.value)}
                  placeholder="e.g. Backend Java Developer"
                  aria-label="Target position"
                  className={INPUT_CLASS}
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {POPULAR_POSITIONS.map((position) => (
                    <button
                      key={position}
                      type="button"
                      aria-pressed={targetPosition === position}
                      onClick={() => setTargetPosition(position)}
                      className={cn(
                        'text-label-lg h-8 cursor-pointer rounded-full border px-3.5 font-medium transition-colors',
                        targetPosition === position
                          ? 'border-primary bg-primary text-on-primary'
                          : 'border-outline-variant text-on-surface hover:border-primary hover:text-primary',
                      )}
                    >
                      {position}
                    </button>
                  ))}
                </div>
              </ReviewStep>
            )}

            {level === PAID_LEVEL && (
              <ReviewStep step="02" title="Job to match" hint="Pick the job post your CV will be compared against.">
                <ReviewJobPicker jobs={jobs} selectedJobId={selectedJobId} onSelect={setSelectedJobId} />
              </ReviewStep>
            )}

            <ReviewStep step={level === 1 ? '02' : '03'} title="Your CV">
              <ReviewCvSource
                source={cvSource}
                onSourceChange={setCvSource}
                resumes={userResumes}
                selectedResumeId={selectedResumeId}
                onResumeSelect={setSelectedResumeId}
                file={selectedFile}
                onFileChange={handleFileChange}
                onFileDrop={handleFileDrop}
                text={cvText}
                onTextChange={setCvText}
              />
            </ReviewStep>

            {error && (
              <p
                role="alert"
                className="border-error/30 bg-error/10 text-body-md text-error flex items-start gap-2.5 rounded-xl border p-4"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                {error}
              </p>
            )}
          </div>

          <ReviewSidebar
            level={level}
            quota={quota}
            credits={credits}
            isAuthenticated={isAuthenticated}
            isPending={isPending}
            onSubmit={handleSubmit}
            onTopup={() => setIsTopupOpen(true)}
            onHistory={() => setIsHistoryOpen(true)}
          />
        </div>
      )}
    </div>
  );
}
