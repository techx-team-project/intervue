'use client';

import { Modal } from '@/components/ui/Modal';
import { SERVICE_NEED_MODAL_COPY, SERVICE_NEED_OPTIONS } from '@/constants/service-package';
import { cn } from '@/lib/utils';
import type { ServiceNeedKey } from '@/types/service-package';
import Image from 'next/image';
import { useState } from 'react';

interface ServiceNeedSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (need: ServiceNeedKey) => void;
  onDismissForever: () => void;
}

export default function ServiceNeedSuggestionModal({
  isOpen,
  onClose,
  onConfirm,
  onDismissForever,
}: ServiceNeedSuggestionModalProps) {
  const [selected, setSelected] = useState<ServiceNeedKey | null>(null);
  const [neverShowAgain, setNeverShowAgain] = useState(false);

  const handleConfirm = () => {
    if (!selected) return;
    if (neverShowAgain) onDismissForever();
    onConfirm(selected);
  };

  const handleClose = () => {
    if (neverShowAgain) onDismissForever();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={SERVICE_NEED_MODAL_COPY.title} maxWidth="2xl">
      <p className="text-on-surface-variant text-sm leading-relaxed">{SERVICE_NEED_MODAL_COPY.description}</p>

      <div className="mt-5 grid items-center gap-6 sm:grid-cols-[minmax(0,1fr)_200px]">
        <fieldset className="space-y-1">
          <legend className="sr-only">{SERVICE_NEED_MODAL_COPY.title}</legend>
          {SERVICE_NEED_OPTIONS.map((option) => (
            <label
              key={option.key}
              className="hover:bg-surface-container-low flex cursor-pointer items-start gap-3 rounded-lg p-2.5 transition"
            >
              <input
                type="radio"
                name="service-need"
                value={option.key}
                checked={selected === option.key}
                onChange={() => setSelected(option.key)}
                className="accent-primary mt-0.5 h-4.5 w-4.5 cursor-pointer"
              />
              <span className="text-on-surface text-sm leading-relaxed">{option.label}</span>
            </label>
          ))}
        </fieldset>

        <Image
          src="/superior-tool-center.png"
          alt=""
          width={200}
          height={226}
          className="mx-auto hidden h-auto w-full max-w-[200px] object-contain sm:block"
        />
      </div>

      <div className="border-outline-variant mt-5 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            checked={neverShowAgain}
            onChange={(event) => setNeverShowAgain(event.target.checked)}
            className="accent-primary h-4 w-4 cursor-pointer"
          />
          <span className="text-on-surface text-sm">{SERVICE_NEED_MODAL_COPY.dismissLabel}</span>
        </label>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={!selected}
          className={cn(
            'inline-flex h-10 cursor-pointer items-center justify-center rounded-lg px-7 text-sm font-semibold text-white transition',
            selected ? 'bg-primary hover:brightness-95 active:scale-[0.98]' : 'cursor-not-allowed bg-emerald-300',
          )}
        >
          {SERVICE_NEED_MODAL_COPY.confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
