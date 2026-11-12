'use client';

import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { useReviewMutations } from '@/hooks/useRecruiterApplications';
import { useAuthStore } from '@/store/auth.store';
import type { ReviewApplication } from '@/types/application-review';
import { formatDateTime } from '@/utils/datetime';
import { getErrorMessage } from '@/utils/error';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ReviewNotesPanel({ application }: { application: ReviewApplication }) {
  const { addNote, deleteNote } = useReviewMutations(application.id);
  const currentId = useAuthStore((state) => state.recruiter.user?.id);
  const [content, setContent] = useState('');

  const handleAdd = () => {
    const text = content.trim();
    if (!text) return;
    addNote.mutate(text, {
      onSuccess: () => setContent(''),
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  };

  return (
    <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
      <h3 className="text-sm font-bold text-slate-900">Internal notes</h3>

      {application.notes.length === 0 ? (
        <p className="text-xs text-slate-500">No notes yet. Candidates cannot see these notes.</p>
      ) : (
        <ul className="space-y-2.5">
          {application.notes.map((note) => (
            <li key={note.id} className="rounded-xl bg-slate-50 p-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-semibold text-slate-700">
                  {note.authorName}{' '}
                  <span className="font-normal text-slate-400">· {formatDateTime(note.createdAt)}</span>
                </p>
                {String(note.authorId) === String(currentId) && (
                  <button
                    type="button"
                    aria-label="Delete note"
                    onClick={() =>
                      deleteNote.mutate(note.id, { onError: (error) => toast.error(getErrorMessage(error)) })
                    }
                    className="cursor-pointer text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <p className="mt-1 text-[13px] whitespace-pre-line text-slate-700">{note.content}</p>
            </li>
          ))}
        </ul>
      )}

      <Textarea
        value={content}
        rows={2}
        maxLength={2000}
        aria-label="Add note"
        placeholder="Add a note for this application"
        onChange={(event) => setContent(event.target.value)}
      />
      <div className="flex justify-end">
        <Button size="sm" isLoading={addNote.isPending} disabled={!content.trim()} onClick={handleAdd}>
          Add note
        </Button>
      </div>
    </section>
  );
}
