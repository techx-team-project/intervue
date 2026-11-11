import type { ConnectActorType, ConnectPortal } from '@/types/connect';
import { create } from 'zustand';

const TYPING_EXPIRY_MS = 4500;

export type TypingActorEntry = {
  actorId: number;
  actorType: ConnectActorType;
  actorName: string;
  expiresAt: number;
};

export type CandidateSidebarTab = 'ALL' | 'UNREAD' | 'INVITATIONS';

type ConnectUiState = {
  typingByThread: Record<string, Record<string, TypingActorEntry>>;
  activeThreadByPortal: Record<ConnectPortal, number | null>;
  atBottomByPortal: Record<ConnectPortal, boolean>;
  candidateTab: CandidateSidebarTab;
  mobileEligibleOpen: boolean;
  rightPanelOpen: boolean;
  setActiveThread: (portal: ConnectPortal, connectionId: number | null) => void;
  setAtBottom: (portal: ConnectPortal, atBottom: boolean) => void;
  setCandidateTab: (tab: CandidateSidebarTab) => void;
  setMobileEligibleOpen: (open: boolean) => void;
  setRightPanelOpen: (open: boolean) => void;
  toggleRightPanel: () => void;
  setTyping: (
    portal: ConnectPortal,
    connectionId: number,
    entry: Omit<TypingActorEntry, 'expiresAt'>,
    typing: boolean,
  ) => void;
  pruneExpiredTyping: (portal: ConnectPortal, connectionId: number) => void;
};

const typingTimers = new Map<string, ReturnType<typeof setTimeout>>();

function threadKey(portal: ConnectPortal, connectionId: number): string {
  return `${portal}:${connectionId}`;
}

function actorKey(actorType: ConnectActorType, actorId: number): string {
  return `${actorType}:${actorId}`;
}

export const useConnectUiStore = create<ConnectUiState>((set) => ({
  typingByThread: {},
  activeThreadByPortal: { candidate: null, recruiter: null },
  atBottomByPortal: { candidate: true, recruiter: true },
  candidateTab: 'ALL',
  mobileEligibleOpen: false,
  rightPanelOpen: true,

  setActiveThread: (portal, connectionId) =>
    set((state) => ({
      activeThreadByPortal: { ...state.activeThreadByPortal, [portal]: connectionId },
    })),

  setAtBottom: (portal, atBottom) =>
    set((state) => ({
      atBottomByPortal: { ...state.atBottomByPortal, [portal]: atBottom },
    })),

  setCandidateTab: (candidateTab) => set({ candidateTab }),
  setMobileEligibleOpen: (mobileEligibleOpen) => set({ mobileEligibleOpen }),
  setRightPanelOpen: (rightPanelOpen) => set({ rightPanelOpen }),
  toggleRightPanel: () => set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),

  setTyping: (portal, connectionId, entry, typing) => {
    const tKey = threadKey(portal, connectionId);
    const aKey = actorKey(entry.actorType, entry.actorId);
    const timerKey = `${tKey}:${aKey}`;

    const existingTimer = typingTimers.get(timerKey);
    if (existingTimer) {
      clearTimeout(existingTimer);
      typingTimers.delete(timerKey);
    }

    set((state) => {
      const currentThread = { ...(state.typingByThread[tKey] ?? {}) };
      if (!typing) {
        delete currentThread[aKey];
      } else {
        currentThread[aKey] = { ...entry, expiresAt: Date.now() + TYPING_EXPIRY_MS };
      }
      return {
        typingByThread: { ...state.typingByThread, [tKey]: currentThread },
      };
    });

    if (typing) {
      typingTimers.set(
        timerKey,
        setTimeout(() => {
          typingTimers.delete(timerKey);
          useConnectUiStore.getState().pruneExpiredTyping(portal, connectionId);
        }, TYPING_EXPIRY_MS + 100),
      );
    }
  },

  pruneExpiredTyping: (portal, connectionId) =>
    set((state) => {
      const tKey = threadKey(portal, connectionId);
      const current = state.typingByThread[tKey];
      if (!current) return state;

      const now = Date.now();
      const next: Record<string, TypingActorEntry> = {};
      let changed = false;
      for (const [k, v] of Object.entries(current)) {
        if (v.expiresAt > now) {
          next[k] = v;
        } else {
          changed = true;
        }
      }
      if (!changed) return state;
      return { typingByThread: { ...state.typingByThread, [tKey]: next } };
    }),
}));
