
import { ChatState } from './types';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

export const createConversationActions = (set: any, get: any) => ({
  addMessage: async (conversationId: string, role: 'user' | 'assistant', content: string): Promise<void> => {
    try {
      const timestamp = new Date();
      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Check if this is the first user message BEFORE adding it
      const conversation = get().conversations.find((c: any) => c.id === conversationId);
      const isFirstUserMessage = role === 'user' && conversation && conversation.messages.length === 0;
      
      // Update local state directly (no Supabase for now)
      set((state: ChatState) => ({
        conversations: state.conversations.map((convo) => {
          if (convo.id === conversationId) {
            return {
              ...convo,
              lastUpdated: timestamp.getTime(),
              messages: [...convo.messages, {
                id: messageId,
                content,
                role,
                timestamp: timestamp.getTime(),
              }],
            };
          }
          return convo;
        }),
      }));

      // Auto-rename conversation if this is the first user message
      if (isFirstUserMessage) {
        // Generate a title from the first message (truncate to 50 chars if needed)
        const newTitle = content.length > 50 
          ? `${content.substring(0, 50)}...` 
          : content;
        
        // Update conversation title
        get().updateConversationTitle(conversationId, newTitle);
      }
    } catch (error) {
      console.error('Error adding message:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du message.",
        variant: "destructive"
      });
    }
  },

  createConversation: async (folderId = null): Promise<string> => {
    try {
      const now = new Date();
      const id = uuidv4();
      
      // Create conversation locally (no Supabase for now)
      const conversation = {
        id,
        title: 'Nouvelle conversation',
        messages: [],
        folderId,
        lastUpdated: now.getTime(),
        createdAt: now.getTime(),
      };

      set((state: ChatState) => ({
        conversations: [conversation, ...state.conversations],
        activeConversationId: conversation.id,
      }));

      return conversation.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la conversation.",
        variant: "destructive"
      });
      return '';
    }
  },

  updateConversationTitle: async (id: string, title: string): Promise<void> => {
    try {
      // Update local state directly (no Supabase for now)
      set((state: ChatState) => ({
        conversations: state.conversations.map((convo) => {
          if (convo.id === id) {
            return { ...convo, title };
          }
          return convo;
        }),
      }));
    } catch (error) {
      console.error('Error updating conversation title:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du titre.",
        variant: "destructive"
      });
    }
  },

  deleteConversation: async (id: string): Promise<void> => {
    try {
      // Delete locally (no Supabase for now)
      set((state: ChatState) => {
        const newConversations = state.conversations.filter((c) => c.id !== id);
        const newActiveId = state.activeConversationId === id
          ? (newConversations[0]?.id || null)
          : state.activeConversationId;
          
        return {
          conversations: newConversations,
          activeConversationId: newActiveId,
        };
      });
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de la conversation.",
        variant: "destructive"
      });
    }
  },

  moveConversationToFolder: async (conversationId: string, folderId: string | null): Promise<void> => {
    try {
      // Update local state directly (no Supabase for now)
      set((state: ChatState) => ({
        conversations: state.conversations.map((convo) => {
          if (convo.id === conversationId) {
            return { ...convo, folderId };
          }
          return convo;
        }),
      }));

      // Show a success message
      const folder = folderId 
        ? get().folders.find((f: { id: string }) => f.id === folderId)?.name 
        : 'Conversations';
      
      if (folder) {
        toast({
          title: "Succès",
          description: `Conversation déplacée dans "${folder}"`
        });
      }
    } catch (error) {
      console.error('Error moving conversation to folder:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du déplacement de la conversation.",
        variant: "destructive"
      });
    }
  },
});
