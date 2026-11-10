'use client';

import { useSendAttachment, useSendMessage } from '@/hooks/useRecruiterConnect';
import { getErrorMessage } from '@/utils/error';
import { Paperclip, Send } from 'lucide-react';
import { useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { toast } from 'sonner';

const MAX_LENGTH = 2000;

type ConnectComposerProps = {
  connectionId: number;
  disabled: boolean;
  disabledReason?: string;
};

export default function ConnectComposer({ connectionId, disabled, disabledReason }: ConnectComposerProps) {
  const [body, setBody] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sendMessage = useSendMessage(connectionId);
  const sendAttachment = useSendAttachment(connectionId);
  const isBusy = sendMessage.isPending || sendAttachment.isPending;

  const handleSend = () => {
    const trimmed = body.trim();
    if (!trimmed || isBusy) return;
    sendMessage.mutate(trimmed, {
      onSuccess: () => setBody(''),
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    sendAttachment.mutate({ file }, { onError: (error) => toast.error(getErrorMessage(error)) });
  };

  if (disabled) {
    return (
      <div className="border-outline-variant text-on-surface-variant border-t bg-white px-5 py-4 text-center text-sm">
        {disabledReason ?? 'Không thể gửi tin nhắn trong cuộc trò chuyện này.'}
      </div>
    );
  }

  return (
    <div className="border-outline-variant flex items-end gap-2.5 border-t bg-white px-4 py-3">
      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
      <button
        type="button"
        disabled={isBusy}
        onClick={() => fileInputRef.current?.click()}
        aria-label="Đính kèm tệp"
        className="text-on-surface-variant hover:bg-surface-container-high flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors disabled:opacity-50"
      >
        <Paperclip className="h-4.5 w-4.5" />
      </button>

      <textarea
        value={body}
        maxLength={MAX_LENGTH}
        onChange={(event) => setBody(event.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        placeholder="Nhập tin nhắn..."
        className="border-outline-variant text-on-surface placeholder:text-outline max-h-32 min-h-10 flex-1 resize-none rounded-2xl border bg-white px-3.5 py-2.5 text-sm focus:outline-none"
      />

      <button
        type="button"
        disabled={isBusy || !body.trim()}
        onClick={handleSend}
        aria-label="Gửi"
        className="bg-primary text-on-primary flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Send className="h-4 w-4" />
      </button>
    </div>
  );
}
