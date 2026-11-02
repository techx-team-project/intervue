'use client';

import React from 'react';
import { useSupportChat } from '@/hooks/useSupportChat';
import { ChatPanel } from './ChatPanel';
import { FloatingChatButton } from './FloatingChatButton';

export function SupportChatbot() {
  const { isOpen, setIsOpen, messages, isLoading, robotState, remainingQuota, error, sendMessage, resetSession } =
    useSupportChat();

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
        error={error}
        onSendMessage={sendMessage}
        onResetSession={resetSession}
      />
    </>
  );
}
