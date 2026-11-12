'use client';

import { MAX_SKILL_FILTERS, SKILL_GROUP_FILTER_LABELS } from '@/constants/job-filters';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useSkillSuggestions } from '@/hooks/useRecruiterJobs';
import type { SkillFilter } from '@/types/job-filters';
import { Search, X } from 'lucide-react';
import { useState } from 'react';

const SEARCH_DEBOUNCE_MS = 250;

type JobSkillFilterProps = {
  selected: SkillFilter[];
  onChange: (next: SkillFilter[]) => void;
};

export default function JobSkillFilter({ selected, onChange }: JobSkillFilterProps) {
  const [query, setQuery] = useState('');
  const suggestions = useSkillSuggestions(useDebouncedValue(query, SEARCH_DEBOUNCE_MS));
  const selectedIds = new Set(selected.map((skill) => skill.id));
  const isLimitReached = selected.length >= MAX_SKILL_FILTERS;
  const options = suggestions.data ?? [];

  const toggle = (skill: SkillFilter) => {
    if (selectedIds.has(skill.id)) onChange(selected.filter((item) => item.id !== skill.id));
    else if (!isLimitReached) onChange([...selected, { id: skill.id, name: skill.name }]);
  };

  return (
    <div className="space-y-3">
      <label className="relative block">
        <Search
          className="text-on-surface-variant pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
          aria-hidden
        />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search skills, e.g. Java, React"
          aria-label="Search skills"
          autoComplete="off"
          className="text-body-md text-on-surface placeholder:text-on-surface-variant border-outline hover:border-on-surface-variant/60 focus:border-primary h-10 w-full rounded-xl border bg-white pr-3 pl-9 transition-colors outline-none focus:ring-2 focus:ring-emerald-600/15"
        />
      </label>

      {selected.length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label="Selected skills">
          {selected.map((skill) => (
            <li key={skill.id}>
              <button
                type="button"
                onClick={() => toggle(skill)}
                aria-label={`Remove ${skill.name}`}
                className="bg-primary-light text-primary text-label-lg flex h-7 cursor-pointer items-center gap-1 rounded-full pr-2 pl-3 font-semibold"
              >
                {skill.name}
                <X className="h-3 w-3" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      <ul className="scrollbar-on-hover -mr-2 max-h-56 space-y-0.5 overflow-y-auto pr-2">
        {suggestions.isLoading && <li className="text-body-md text-on-surface-variant py-2">Loading skills…</li>}
        {!suggestions.isLoading && options.length === 0 && (
          <li className="text-body-md text-on-surface-variant py-2">No skills found</li>
        )}
        {options.map((skill) => {
          const isChecked = selectedIds.has(skill.id);
          const isDisabled = !isChecked && isLimitReached;
          return (
            <li key={skill.id}>
              <label
                className={`hover:bg-surface-container-low flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 ${
                  isDisabled ? 'cursor-not-allowed opacity-50' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  disabled={isDisabled}
                  onChange={() => toggle(skill)}
                  className="accent-primary h-4 w-4 cursor-pointer"
                />
                <span className="text-body-md text-on-surface flex-1">{skill.name}</span>
                <span className="text-label-sm text-on-surface-variant">{SKILL_GROUP_FILTER_LABELS[skill.group]}</span>
              </label>
            </li>
          );
        })}
      </ul>

      <p className="text-label-md text-on-surface-variant">
        {selected.length}/{MAX_SKILL_FILTERS} selected · shows jobs that need any of them
      </p>
    </div>
  );
}
