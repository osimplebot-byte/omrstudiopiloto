import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export type ViewId = 'dados' | 'simulador' | 'conexoes' | 'ajuda';

export interface ImportStatus extends Record<string, unknown> {
  id: string;
  fileName: string;
  receivedAt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message?: string;
}

export interface InstanceState {
  view: ViewId;
  lastSessionId?: string;
  importHistory: ImportStatus[];
  theme: 'light' | 'dark';
}

interface InstanceActions {
  setView: (view: ViewId) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  registerImport: (status: ImportStatus) => void;
  updateImportStatus: (id: string, status: Partial<ImportStatus>) => void;
  setSessionId: (sessionId?: string) => void;
}

export const useAppStore = create<InstanceState & InstanceActions>()(
  persist(
    immer((set) => ({
      view: 'dados',
      lastSessionId: undefined,
      theme: 'light',
      importHistory: [],
      setView: (view) => {
        console.info(`[OMR:STATE] view -> ${view}`);
        set((draft) => {
          draft.view = view;
        });
      },
      setTheme: (theme) => {
        console.info(`[OMR:STATE] theme -> ${theme}`);
        set((draft) => {
          draft.theme = theme;
        });
      },
      registerImport: (status) => {
        console.info('[OMR:STATE] registrando importação', status.id);
        set((draft) => {
          draft.importHistory.unshift(status);
          draft.importHistory = draft.importHistory.slice(0, 20);
        });
      },
      updateImportStatus: (id, status) => {
        console.info('[OMR:STATE] atualizando importação', id, status.status);
        set((draft) => {
          const target = draft.importHistory.find((item) => item.id === id);
          if (target) {
            Object.assign(target, status);
          }
        });
      },
      setSessionId: (sessionId) => {
        console.info('[OMR:STATE] sessionId atualizado');
        set((draft) => {
          draft.lastSessionId = sessionId;
        });
      }
    })),
    {
      name: 'omr-app-store',
      partialize: ({ view, theme, lastSessionId, importHistory }) => ({
        view,
        theme,
        lastSessionId,
        importHistory
      })
    }
  )
);
