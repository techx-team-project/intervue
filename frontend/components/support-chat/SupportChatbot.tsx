'use client';

import { hasBottomBar } from '@/constants/ai-chat';
import { useSupportChat } from '@/hooks/useSupportChat';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';
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
        jobTitle: `Job Opening #${jobId}`,
      });
    } else {
      setChatContext(undefined);
    }
  }, [pathname, setChatContext]);

  if (hasBottomBar(pathname)) {
    return null;
  }

  return (
    <>
      <FloatingChatButton isOpen={isOpen} onToggle={() => setIsOpen((prev) => !prev)} robotState={robotState} />
      <ChatPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        messages={messages}
        isLoading={isLoading}
        context={chatContext}
        error={error}
        onSendMessage={sendMessage}
        onResetSession={resetSession}
      />
    </>
  );
}
