
import { toast } from '@/components/ui/sonner';
import { ChatState } from './types';

// Initialize the store - no demo folders anymore
export const initializeStore = (set: any, get: any) => async (): Promise<void> => {
  set({ isLoading: false });
};

// Basic state actions
export const createBasicActions = (set: any) => ({
  setActiveConversationId: (id: string | null) => {
    set({ activeConversationId: id });
  },
  
  setActiveFolderId: (id: string | null) => {
    set({ activeFolderId: id });
  },

  toggleSidebar: () => {
    set((state: ChatState) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  setIsTyping: (value: boolean) => {
    set({ isTyping: value });
  },
});
