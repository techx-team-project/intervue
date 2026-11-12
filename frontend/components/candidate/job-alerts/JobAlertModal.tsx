'use client';

import React, { useState } from 'react';
import { AlertCircle, Bell, Check, Loader2, X } from 'lucide-react';
import { jobAlertApi } from '@/apiRequest/job-alert';
import type { AlertFrequency, CreateJobAlertInput, JobAlert, UpdateJobAlertInput } from '@/types/job-alert';

interface JobAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (alert: JobAlert) => void;
  initialData?: JobAlert | null;
  defaultValues?: { keyword?: string; city?: string } | null;
}

const MAX_ALERT_SALARY = 250_000_000;
const VIETNAM_CITIES = ['All locations', 'Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Can Tho', 'Hai Phong', 'Remote'];

const CAREER_LEVELS = [
  { value: '', label: 'All Levels' },
  { value: 'Intern', label: 'Intern' },
  { value: 'Fresher', label: 'Fresher' },
  { value: 'Junior', label: 'Junior' },
  { value: 'Mid', label: 'Mid-Level' },
  { value: 'Senior', label: 'Senior' },
  { value: 'Lead', label: 'Lead / Principal' },
  { value: 'Manager', label: 'Manager / Director' },
];

const WORK_MODES = [
  { value: '', label: 'All Work Modes' },
  { value: 'ONSITE', label: 'Onsite' },
  { value: 'HYBRID', label: 'Hybrid' },
  { value: 'REMOTE', label: 'Remote' },
];

function JobAlertForm({ onClose, onSuccess, initialData, defaultValues }: Omit<JobAlertModalProps, 'isOpen'>) {
  const isEditing = Boolean(initialData);

  const initKw = initialData ? initialData.keyword || '' : defaultValues?.keyword || '';
  const initCity = initialData ? initialData.city || 'All locations' : defaultValues?.city || 'All locations';

  const computeInitTitle = () => {
    if (initialData?.title) return initialData.title;
    if (initKw) {
      return initCity && initCity !== 'All locations' ? `${initKw} in ${initCity}` : `${initKw} Developer`;
    }
    return 'New IT Job Matches';
  };

  const [title, setTitle] = useState<string>(computeInitTitle);
  const [keyword, setKeyword] = useState<string>(initKw);
  const [city, setCity] = useState<string>(initCity);
  const [careerLevel, setCareerLevel] = useState<string>(initialData?.careerLevel || '');
  const [workMode, setWorkMode] = useState<string>(initialData?.workMode || '');
  const [salaryMin, setSalaryMin] = useState<string>(
    initialData?.salaryMin ? Number(initialData.salaryMin).toLocaleString('en-US') : '',
  );
  const [frequency, setFrequency] = useState<AlertFrequency>(initialData?.frequency || 'DAILY');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleKeywordChange = (val: string) => {
    setKeyword(val);
    if (
      !isEditing &&
      (!title || title.includes('Matches') || title.includes('Developer') || title.includes('Opportunities'))
    ) {
      const locText = city && city !== 'All locations' ? ` in ${city}` : '';
      setTitle(val.trim() ? `${val.trim()} Opportunities${locText}` : 'New IT Job Matches');
    }
  };

  const handleCityChange = (val: string) => {
    setCity(val);
    if (!isEditing && keyword.trim()) {
      const locText = val && val !== 'All locations' ? ` in ${val}` : '';
      setTitle(`${keyword.trim()} Opportunities${locText}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a name for this job alert.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const parsedSalary = salaryMin ? parseInt(salaryMin.replace(/\D/g, ''), 10) : undefined;
    const finalCity = city === 'All locations' ? undefined : city;

    try {
      if (isEditing && initialData) {
        const body: UpdateJobAlertInput = {
          title: title.trim(),
          keyword: keyword.trim() || undefined,
          city: finalCity,
          careerLevel: careerLevel || undefined,
          workMode: workMode || undefined,
          salaryMin: Number.isFinite(parsedSalary) ? parsedSalary : undefined,
          currency: 'VND',
          frequency,
          isActive: initialData.isActive,
        };
        const updated = await jobAlertApi.updateAlert(initialData.id, body);
        onSuccess(updated);
      } else {
        const body: CreateJobAlertInput = {
          title: title.trim(),
          keyword: keyword.trim() || undefined,
          city: finalCity,
          careerLevel: careerLevel || undefined,
          workMode: workMode || undefined,
          salaryMin: Number.isFinite(parsedSalary) ? parsedSalary : undefined,
          currency: 'VND',
          frequency,
        };
        const created = await jobAlertApi.createAlert(body);
        onSuccess(created);
      }
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred while saving the job alert.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="shadow-elevation-2 relative w-full max-w-lg rounded-2xl bg-white p-6 transition-all sm:p-7">
      {/* Header */}
      <div className="border-outline-variant flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary-light text-primary flex h-10 w-10 items-center justify-center rounded-xl">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-on-surface text-lg font-bold">{isEditing ? 'Edit Job Alert' : 'Create Job Alert'}</h3>
            <p className="text-on-surface-variant text-xs">Receive fresh matching jobs directly to your inbox.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-outline hover:bg-surface-container-high hover:text-on-surface-variant rounded-lg p-1.5 transition"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {error && (
        <div className="bg-error/10 text-error mt-4 flex items-center gap-2 rounded-xl p-3 text-xs">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        {/* Alert Name */}
        <div>
          <label className="text-on-surface block text-xs font-bold tracking-wider uppercase">
            Alert Name <span className="text-error">*</span>
          </label>
          <input
            type="text"
            required
            maxLength={150}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Senior Frontend React in HCMC"
            className="border-outline-variant text-on-surface focus:border-primary mt-1.5 w-full rounded-xl border px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden"
          />
        </div>

        {/* Keyword & Location row */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div>
            <label className="text-on-surface block text-xs font-bold tracking-wider uppercase">Keywords / Skill</label>
            <input
              type="text"
              maxLength={255}
              value={keyword}
              onChange={(e) => handleKeywordChange(e.target.value)}
              placeholder="e.g. React, Java, Golang"
              className="border-outline-variant text-on-surface focus:border-primary mt-1.5 w-full rounded-xl border px-3.5 py-2 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden"
            />
          </div>
          <div>
            <label className="text-on-surface block text-xs font-bold tracking-wider uppercase">Location</label>
            <select
              value={city}
              onChange={(e) => handleCityChange(e.target.value)}
              className="border-outline-variant text-on-surface focus:border-primary mt-1.5 w-full rounded-xl border bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden"
            >
              {VIETNAM_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Level & Work Mode row */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div>
            <label className="text-on-surface block text-xs font-bold tracking-wider uppercase">Experience Level</label>
            <select
              value={careerLevel}
              onChange={(e) => setCareerLevel(e.target.value)}
              className="border-outline-variant text-on-surface focus:border-primary mt-1.5 w-full rounded-xl border bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden"
            >
              {CAREER_LEVELS.map((lvl) => (
                <option key={lvl.value} value={lvl.value}>
                  {lvl.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-on-surface block text-xs font-bold tracking-wider uppercase">Work Mode</label>
            <select
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
              className="border-outline-variant text-on-surface focus:border-primary mt-1.5 w-full rounded-xl border bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden"
            >
              {WORK_MODES.map((mode) => (
                <option key={mode.value} value={mode.value}>
                  {mode.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Expected Min Salary */}
        <div>
          <label className="text-on-surface block text-xs font-bold tracking-wider uppercase">
            Minimum Salary (VND / month)
          </label>
          <input
            type="text"
            value={salaryMin}
            onChange={(e) => {
              const numericOnly = e.target.value.replace(/\D/g, '');
              setSalaryMin(numericOnly ? Math.min(Number(numericOnly), MAX_ALERT_SALARY).toLocaleString('en-US') : '');
            }}
            placeholder="e.g. 25,000,000"
            className="border-outline-variant text-on-surface focus:border-primary mt-1.5 w-full rounded-xl border px-3.5 py-2 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden"
          />
        </div>

        {/* Frequency selector */}
        <div>
          <label className="text-on-surface mb-2 block text-xs font-bold tracking-wider uppercase">
            Delivery Frequency
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label
              className={`relative flex cursor-pointer flex-col rounded-xl border p-3 text-left transition ${
                frequency === 'DAILY'
                  ? 'border-primary bg-emerald-50/40 text-emerald-950'
                  : 'border-outline-variant hover:border-outline'
              }`}
            >
              <input
                type="radio"
                name="frequency"
                value="DAILY"
                checked={frequency === 'DAILY'}
                onChange={() => setFrequency('DAILY')}
                className="sr-only"
              />
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">Daily Digest</span>
                {frequency === 'DAILY' && <Check className="text-primary h-4 w-4" />}
              </div>
              <span className="text-on-surface-variant mt-1 text-xs">Every morning at 08:00 AM</span>
              <span className="bg-primary-container text-label-sm text-primary mt-1.5 inline-block self-start rounded-full px-2 py-0.5 font-bold">
                Recommended
              </span>
            </label>

            <label
              className={`relative flex cursor-pointer flex-col rounded-xl border p-3 text-left transition ${
                frequency === 'WEEKLY'
                  ? 'border-primary bg-emerald-50/40 text-emerald-950'
                  : 'border-outline-variant hover:border-outline'
              }`}
            >
              <input
                type="radio"
                name="frequency"
                value="WEEKLY"
                checked={frequency === 'WEEKLY'}
                onChange={() => setFrequency('WEEKLY')}
                className="sr-only"
              />
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">Weekly Digest</span>
                {frequency === 'WEEKLY' && <Check className="text-primary h-4 w-4" />}
              </div>
              <span className="text-on-surface-variant mt-1 text-xs">Every Monday at 08:00 AM</span>
            </label>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="border-outline-variant flex items-center justify-end gap-3 border-t pt-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-on-surface-variant hover:bg-surface-container-high rounded-xl px-4 py-2 text-sm font-semibold transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary-hover inline-flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-bold text-white shadow-sm transition disabled:opacity-60"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEditing ? 'Save Changes' : 'Create Job Alert'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function JobAlertModal(props: JobAlertModalProps) {
  if (!props.isOpen) return null;

  const formKey = props.initialData ? `edit-${props.initialData.id}` : 'new';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={props.onClose}
        aria-hidden="true"
      />

      <JobAlertForm key={formKey} {...props} />
    </div>
  );
}
