'use client';

import { JOB_MAX_SKILLS, SKILL_GROUP_LABELS } from '@/constants/recruiter-job';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useSkillSuggestions } from '@/hooks/useRecruiterJobs';
import { cn } from '@/lib/utils';
import type { SkillOption } from '@/schemas/job.schema';
import { Search, X } from 'lucide-react';
import { KeyboardEvent, useEffect, useId, useRef, useState } from 'react';

const SEARCH_DEBOUNCE_MS = 250;

interface SkillPickerProps {
  value: SkillOption[];
  onChange: (skills: SkillOption[]) => void;
  error?: string;
}

export default function SkillPicker({ value, onChange, error }: SkillPickerProps) {
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebouncedValue(query, SEARCH_DEBOUNCE_MS);
  const { data: suggestions = [], isFetching } = useSkillSuggestions(debouncedQuery);

  const selectedIds = new Set(value.map((skill) => skill.id));
  const options = suggestions.filter((skill) => !selectedIds.has(skill.id));
  const isFull = value.length >= JOB_MAX_SKILLS;

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  const addSkill = (skill: SkillOption) => {
    if (isFull || selectedIds.has(skill.id)) return;
    onChange([...value, { id: skill.id, name: skill.name }]);
    setQuery('');
  };

  const removeSkill = (id: number) => onChange(value.filter((skill) => skill.id !== id));

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (options[0]) addSkill(options[0]);
    } else if (event.key === 'Backspace' && query === '' && value.length > 0) {
      removeSkill(value[value.length - 1].id);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="w-full space-y-1.5">
      <div className="flex items-baseline justify-between">
        <label htmlFor={`${listId}-input`} className="block text-sm font-semibold text-slate-800">
          Kỹ năng yêu cầu
        </label>
        <span className="text-xs text-slate-400">
          {value.length}/{JOB_MAX_SKILLS}
        </span>
      </div>

      {value.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {value.map((skill) => (
            <li
              key={skill.id}
              className="inline-flex items-center gap-1 rounded-full bg-emerald-50 py-1 pr-1.5 pl-3 text-xs font-medium text-emerald-700"
            >
              {skill.name}
              <button
                type="button"
                onClick={() => removeSkill(skill.id)}
                aria-label={`Bỏ kỹ năng ${skill.name}`}
                className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-emerald-100"
              >
                <X className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          id={`${listId}-input`}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          value={query}
          disabled={isFull}
          placeholder={isFull ? 'Đã đạt số kỹ năng tối đa' : 'Gõ để tìm kỹ năng, ví dụ: Java, React…'}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className={cn(
            'w-full rounded-xl border bg-white py-2.5 pr-3.5 pl-10 text-sm text-slate-800 placeholder-slate-400 transition-colors',
            'focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 focus:outline-none disabled:bg-slate-50',
            error ? 'border-rose-400' : 'border-slate-300',
          )}
        />

        {open && !isFull && (
          <ul
            id={listId}
            role="listbox"
            className="absolute z-20 mt-1.5 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
          >
            {options.length === 0 ? (
              <li className="px-3.5 py-3 text-sm text-slate-500">
                {isFetching ? 'Đang tìm…' : 'Không có kỹ năng phù hợp.'}
              </li>
            ) : (
              options.map((skill) => (
                <li key={skill.id} role="option" aria-selected={false}>
                  <button
                    type="button"
                    onClick={() => addSkill(skill)}
                    className="flex w-full items-center justify-between gap-3 px-3.5 py-2 text-left text-sm hover:bg-emerald-50"
                  >
                    <span className="font-medium text-slate-800">{skill.name}</span>
                    <span className="text-[11px] text-slate-400">{SKILL_GROUP_LABELS[skill.group]}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      {error && <p className="text-xs font-medium text-rose-500">{error}</p>}
    </div>
  );
}
