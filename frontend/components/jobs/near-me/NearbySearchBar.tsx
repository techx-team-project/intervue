'use client';

import { Button } from '@/components/ui/Button';
import { LocateFixed, MapPin, Search } from 'lucide-react';
import type { FormEvent } from 'react';

const MAX_ADDRESS_LENGTH = 200;

type NearbySearchBarProps = {
  address: string;
  isSearching: boolean;
  isLocating: boolean;
  onAddressChange: (address: string) => void;
  onSearch: () => void;
  onLocate: () => void;
};

export default function NearbySearchBar({
  address,
  isSearching,
  isLocating,
  onAddressChange,
  onSearch,
  onLocate,
}: NearbySearchBarProps) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSearch();
  };

  return (
    <section aria-label="Search by location" className="bg-primary-deeper relative overflow-hidden py-5">
      <div aria-hidden className="bg-grid mask-fade-b absolute inset-0 opacity-60" />
      <div className="container-page relative">
        <h1 className="sr-only">Jobs near me</h1>
        <form
          role="search"
          onSubmit={handleSubmit}
          className="bg-surface shadow-float medium:flex-row medium:items-center medium:rounded-full flex max-w-4xl flex-col gap-2 rounded-2xl p-2"
        >
          <label className="flex h-12 min-w-0 flex-1 items-center gap-3 pl-5">
            <MapPin className="text-on-surface-variant h-5 w-5 shrink-0" aria-hidden />
            <input
              type="search"
              value={address}
              onChange={(event) => onAddressChange(event.target.value)}
              maxLength={MAX_ADDRESS_LENGTH}
              placeholder="Enter an address, district or city"
              aria-label="Address to search around"
              autoComplete="off"
              className="text-body-lg text-on-surface placeholder:text-on-surface-variant caret-primary min-w-0 flex-1 bg-transparent outline-none"
            />
          </label>
          <button
            type="button"
            onClick={onLocate}
            disabled={isLocating}
            className="text-body-md text-on-surface hover:text-primary medium:border-outline-variant medium:border-l flex h-12 cursor-pointer items-center justify-center gap-2 px-5 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LocateFixed className="h-4 w-4" aria-hidden />
            {isLocating ? 'Locating…' : 'Use my location'}
          </button>
          <Button
            type="submit"
            size="xl"
            disabled={isSearching || !address.trim()}
            leftIcon={<Search className="h-4 w-4" aria-hidden />}
          >
            {isSearching ? 'Searching…' : 'Search'}
          </Button>
        </form>
      </div>
    </section>
  );
}
