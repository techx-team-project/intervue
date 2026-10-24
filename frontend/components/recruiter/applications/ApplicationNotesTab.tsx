'use client';

import { Button } from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import type { ApplicationInternalNote } from '@/types/recruiter-application';
import { formatDateTime } from '@/utils/datetime';
import { Lock, StickyNote } from 'lucide-react';
import { useState } from 'react';

interface ApplicationNotesTabProps {
  notes: ApplicationInternalNote[];
  onAddNote: (content: string) => void;
}

export default function ApplicationNotesTab({ notes, onAddNote }: ApplicationNotesTabProps) {
  const [draft, setDraft] = useState('');

  const submit = () => {
    const content = draft.trim();
    if (content.length === 0) return;
    onAddNote(content);
    setDraft('');
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[#e5e9ef] bg-white p-3.5">
        <Textarea
          rows={3}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Record feedback, interview outcomes or follow-up actions..."
        />
        <div className="mt-2.5 flex items-center justify-between gap-2">
          <p className="flex items-center gap-1.5 text-[11px] text-[#94a3b8]">
            <Lock className="h-3 w-3" />
            Visible only inside your company, never to the candidate
          </p>
          <Button size="sm" disabled={draft.trim().length === 0} onClick={submit}>
            Add note
          </Button>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#e2e8f0] bg-[#fafbfc] py-12 text-center">
          <StickyNote className="h-8 w-8 text-[#cbd5e1]" />
          <p className="text-navy text-[13px] font-bold">No internal notes yet</p>
          <p className="max-w-xs text-[11.5px] text-[#94a3b8]">
            Notes help colleagues pick up the context before they continue with this application.
          </p>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {[...notes].reverse().map((note) => (
            <li key={note.id} className="rounded-2xl border border-[#e5e9ef] bg-white p-3.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-navy text-[12.5px] font-bold">{note.authorName}</p>
                <p className="shrink-0 text-[11px] text-[#94a3b8]">{formatDateTime(note.createdAt)}</p>
              </div>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-700">{note.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
