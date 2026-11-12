'use client';

import React, { useState } from 'react';
import { Send, FileText, Upload, Sparkles, CheckCircle2, Bot, Check, HelpCircle } from 'lucide-react';
import type { JobDetail } from '@/types/job';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { toast } from 'sonner';
import { generateCoverLetter } from '@/apiRequest/ai';
import { useAiPersonalDataConsent } from '@/hooks/useAiPersonalDataConsent';

interface JobApplyModalProps {
  job: JobDetail;
  isOpen: boolean;
  onClose: () => void;
  isPreviewMode?: boolean;
}

export default function JobApplyModal({ job, isOpen, onClose, isPreviewMode = false }: JobApplyModalProps) {
  const [selectedCv, setSelectedCv] = useState<'profile' | 'upload'>('profile');
  const [fullName, setFullName] = useState('Le Minh Tri');
  const [email, setEmail] = useState('minhtri.le@gmail.com');
  const [phone, setPhone] = useState('0912 345 678');
  const [coverLetter, setCoverLetter] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { requestConsent, consentDialog } = useAiPersonalDataConsent();

  const handleGenerateAiCoverLetter = () => {
    requestConsent(async () => {
      setIsGeneratingAi(true);
      try {
        const response = await generateCoverLetter({
          jobTitle: job.title,
          companyName: job.company.name,
          jobRequirements: job.requirements || [],
          jobDescription: Array.isArray(job.jobDescription) ? job.jobDescription.join('\n') : '',
          candidateName: fullName,
          cvText:
            selectedCv === 'profile'
              ? `Candidate: ${fullName}. Skills and experience relevant to the ${job.title} position.`
              : '',
        });

        if (response?.coverLetter) {
          setCoverLetter(response.coverLetter);
          toast.success('Cover letter draft created! Please review and edit it before sending.');
        }
      } catch {
        setCoverLetter(
          `Dear ${job.company.name} Hiring Team,\n\nI am writing to express my interest in the ${job.title} position at your company. Based on the requirements outlined in the job posting and my hands-on experience, I believe my professional skills are a strong match for the goals of the project.\n\nI would welcome the opportunity to interview and discuss in more detail the contributions I can make to ${job.company.name}.\n\nThank you for your time and consideration,\n${fullName}`,
        );
        toast.info('Cover letter draft created from the job details. Please edit it before submitting.');
      } finally {
        setIsGeneratingAi(false);
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (isPreviewMode) {
        toast.success(
          'Application submission simulated successfully! This is the completion screen candidates will see.',
        );
      }
    }, 700);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetAndClose}
      maxWidth="2xl"
      title="Apply for this job"
      description={`${job.title} - ${job.company.name}`}
    >
      {consentDialog}
      {isSubmitted ? (
        <div className="space-y-4 py-6 text-center">
          <div className="bg-primary-container text-primary mx-auto flex h-16 w-16 items-center justify-center rounded-full">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <h4 className="text-on-surface text-xl font-bold">Application submitted successfully!</h4>

          <p className="text-on-surface-variant mx-auto max-w-md text-sm leading-relaxed">
            Your application has been sent directly to the HR team at{' '}
            <strong className="text-on-surface">{job.company.name}</strong>. The recruiter will review it and respond
            within 24-48 business hours.
          </p>

          <div className="border-primary/30 text-on-surface mx-auto max-w-md rounded-xl border bg-emerald-50/70 p-4 text-left text-xs">
            <div className="text-on-primary-container mb-1 flex items-center gap-1.5 font-bold">
              <Sparkles className="text-primary h-4 w-4" />
              <span>A tip for you:</span>
            </div>
            <div>
              While you wait for the result, you can join InterVue&apos;s <strong>AI Interview Practice Room</strong> to
              prepare your answers for this position!
            </div>
          </div>

          {isPreviewMode && (
            <div className="mx-auto max-w-md rounded-xl border border-amber-300 bg-amber-50 p-3.5 text-left text-xs text-amber-900">
              <div className="mb-1 flex items-center gap-1.5 font-bold text-amber-950">
                <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                <span>Preview Mode note:</span>
              </div>
              <p className="leading-relaxed text-amber-800">
                Simulation complete. Real applications are saved to the <strong>Applications</strong> section of your
                Recruiter Panel for AI ATS scoring and screening.
              </p>
            </div>
          )}

          <div className="flex justify-center gap-3 pt-4">
            <Button onClick={handleResetAndClose} className="px-6">
              Done & Close
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {isPreviewMode && (
            <div className="flex items-start gap-2.5 rounded-xl border border-amber-300 bg-amber-50/90 p-3 text-xs text-amber-900 shadow-2xs">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <div>
                <p className="font-bold">Candidate Preview Mode:</p>
                <p className="mt-0.5 text-amber-800">
                  This is the CV submission and screening question form candidates see. Test submissions will not be
                  recorded in the system.
                </p>
              </div>
            </div>
          )}

          <div className="border-primary/30 bg-primary-light flex items-center justify-between rounded-xl border px-4 py-2.5 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="text-primary h-4 w-4" />
              <span className="text-on-surface font-medium">Profile match for this position:</span>
            </div>
            <span className="border-primary/30 text-primary rounded-full border bg-white px-2 py-0.5 font-extrabold">
              {job.atsMatchScore}% Strong match
            </span>
          </div>

          <div>
            <label className="text-on-surface mb-2 block text-xs font-bold tracking-wider uppercase">
              Select CV to apply with <span className="text-error">*</span>
            </label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div
                onClick={() => setSelectedCv('profile')}
                className={`cursor-pointer rounded-xl border p-3.5 transition ${
                  selectedCv === 'profile'
                    ? 'border-primary bg-emerald-50/50 shadow-xs'
                    : 'border-outline-variant hover:border-outline'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="text-primary h-5 w-5" />
                    <span className="text-on-surface text-xs font-bold">Chief Accountant ATS CV</span>
                  </div>
                  {selectedCv === 'profile' && <Check className="text-primary h-4 w-4" />}
                </div>
                <p className="text-on-surface-variant mt-1.5 text-xs">Updated 2 days ago • ATS score 92</p>
              </div>

              <div
                onClick={() => setSelectedCv('upload')}
                className={`cursor-pointer rounded-xl border p-3.5 transition ${
                  selectedCv === 'upload'
                    ? 'border-primary bg-emerald-50/50 shadow-xs'
                    : 'border-outline border-dashed hover:border-slate-400'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Upload className="text-on-surface-variant h-5 w-5" />
                    <span className="text-on-surface text-xs font-bold">Upload a new CV</span>
                  </div>
                  {selectedCv === 'upload' && <Check className="text-primary h-4 w-4" />}
                </div>
                <p className="text-on-surface-variant mt-1.5 text-xs">PDF, DOCX supported (max 5MB)</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="text-on-surface mb-1 block text-xs font-bold">
                Full name <span className="text-error">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="border-outline text-on-surface focus:border-primary w-full rounded-xl border px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-on-surface mb-1 block text-xs font-bold">
                Contact email <span className="text-error">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-outline text-on-surface focus:border-primary w-full rounded-xl border px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-on-surface mb-1 block text-xs font-bold">
                Phone number <span className="text-error">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border-outline text-on-surface focus:border-primary w-full rounded-xl border px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-on-surface text-xs font-bold">Cover Letter</label>

              <button
                type="button"
                onClick={handleGenerateAiCoverLetter}
                disabled={isGeneratingAi}
                className="border-primary/30 bg-primary-light text-primary hover:bg-primary-container inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold transition-colors disabled:opacity-50"
              >
                <Bot className="text-primary h-3.5 w-3.5" />
                <span>{isGeneratingAi ? 'Generating letter...' : 'Generate with AI'}</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Briefly describe your experience, key skills and why you are a good fit for this position..."
              className="border-outline text-on-surface focus:border-primary w-full rounded-xl border p-3 text-xs placeholder-slate-400 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
            />
            <p className="text-label-sm text-on-surface-variant mt-1 flex items-center gap-1">
              <Sparkles className="text-primary h-3 w-3 shrink-0" />
              <span>
                Uses only facts from your CV and the job post. You can freely edit it before submitting; the letter is
                never sent automatically.
              </span>
            </p>
          </div>

          {/* Screening Questions from Recruiter */}
          {job.screeningQuestions && job.screeningQuestions.length > 0 && (
            <div className="border-outline-variant bg-surface-container-low/70 space-y-3 rounded-xl border p-4">
              <div className="text-on-surface flex items-center gap-2 text-xs font-bold tracking-wide uppercase">
                <HelpCircle className="text-primary h-4 w-4" />
                <span>Screening questions ({job.screeningQuestions.length})</span>
              </div>

              <div className="space-y-3.5">
                {job.screeningQuestions.map((q, idx) => (
                  <div key={q.id || idx} className="space-y-1.5">
                    <label className="text-on-surface block text-xs font-semibold">
                      <span className="text-primary mr-1 font-bold">Q{idx + 1}.</span>
                      {q.question} {q.required && <span className="text-error">*</span>}
                    </label>

                    {q.type === 'YES_NO' ? (
                      <div className="flex items-center gap-4">
                        {['Yes', 'No'].map((opt) => (
                          <label key={opt} className="text-on-surface flex cursor-pointer items-center gap-1.5 text-xs">
                            <input
                              type="radio"
                              name={`sq-${q.id}`}
                              checked={answers[q.id] === opt}
                              onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                              className="text-primary focus:ring-primary"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    ) : q.type === 'MULTIPLE_CHOICE' && q.options && q.options.length > 0 ? (
                      <div className="space-y-1.5">
                        {q.options.map((opt) => (
                          <label key={opt} className="text-on-surface flex cursor-pointer items-center gap-2 text-xs">
                            <input
                              type="radio"
                              name={`sq-${q.id}`}
                              checked={answers[q.id] === opt}
                              onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                              className="text-primary focus:ring-primary"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <input
                        type="text"
                        placeholder="Enter your answer..."
                        value={answers[q.id] || ''}
                        onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                        className="border-outline text-on-surface focus:border-primary w-full rounded-xl border px-3 py-1.5 text-xs placeholder-slate-400 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-on-surface-variant text-xs leading-relaxed">
            By clicking &quot;Submit application&quot;, you agree to InterVue&apos;s Terms of Service and Privacy
            Policy.
          </div>

          <div className="border-outline-variant flex items-center justify-end gap-3 border-t pt-3">
            <Button variant="secondary" size="sm" onClick={handleResetAndClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmitting} leftIcon={<Send className="h-3.5 w-3.5" />}>
              {isPreviewMode ? 'Test submit (Simulation)' : 'Submit application'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
