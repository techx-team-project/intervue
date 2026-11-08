'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSupportChat } from '@/hooks/useSupportChat';
import type { ChatContext } from '@/types/ai-chat';
import { ChatPanel } from './ChatPanel';
import { FloatingChatButton } from './FloatingChatButton';

export function SupportChatbot() {
  const pathname = usePathname();
  const {
    isOpen,
    setIsOpen,
    messages,
    isLoading,
    robotState,
    remainingQuota,
    error,
    chatContext,
    setChatContext,
    sendMessage,
    resetSession,
  } = useSupportChat();

  useEffect(() => {
    if (!pathname) return;
    const jobMatch = pathname.match(/^\/jobs\/(\d+)/);
    if (jobMatch) {
      const jobId = Number(jobMatch[1]);
      setChatContext({
        pageType: 'JOB_DETAIL',
        entityId: jobId,
        jobTitle: `Tin tuyển dụng #${jobId}`,
      });
    } else {
      setChatContext(undefined);
    }
  }, [pathname, setChatContext]);

  return (
    <>
      <FloatingChatButton
        isOpen={isOpen}
        onToggle={() => setIsOpen((prev) => !prev)}
        remainingQuota={remainingQuota}
        robotState={robotState}
      />
      <ChatPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        messages={messages}
        isLoading={isLoading}
        remainingQuota={remainingQuota}
        context={chatContext}
        error={error}
        onSendMessage={sendMessage}
        onResetSession={resetSession}
      />
    </>
  );
}
