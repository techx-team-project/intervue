'use client';

import { useConnectUiStore } from '@/store/connect-ui.store';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';

export default function ConnectRightPanelToggle() {
  const rightPanelOpen = useConnectUiStore((s) => s.rightPanelOpen);
  const toggleRightPanel = useConnectUiStore((s) => s.toggleRightPanel);

  return (
    <button
      type="button"
      onClick={toggleRightPanel}
      aria-label={rightPanelOpen ? 'Hide side panel' : 'Show side panel'}
      title={rightPanelOpen ? 'Hide side panel' : 'Show side panel'}
      aria-expanded={rightPanelOpen}
      className="text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface hidden h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors lg:inline-flex"
    >
      {rightPanelOpen ? <PanelRightClose className="h-4.5 w-4.5" /> : <PanelRightOpen className="h-4.5 w-4.5" />}
    </button>
  );
}
