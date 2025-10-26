
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { ChatState, Folder } from './types';

export const createFolderActions = (set: any) => ({
  createFolder: async (name: string, description?: string, color?: string): Promise<string> => {
    try {
      const id = uuidv4();
      const now = new Date();
      
      // Create locally (no Supabase for now)
      const folder: Folder = {
        id,
        name,
        description,
        color,
        createdAt: now.getTime(),
        attachments: [],
        timeline: [],
        documents: [],
        deadlines: [],
      };

      set((state: ChatState) => ({
        folders: [folder, ...state.folders],
      }));

      return folder.id;
    } catch (error) {
      console.error('Error creating folder:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du dossier.",
        variant: "destructive"
      });
      return '';
    }
  },

  updateFolderName: async (id: string, name: string): Promise<void> => {
    try {
      // Update local state directly (no Supabase for now)
      set((state: ChatState) => ({
        folders: state.folders.map((folder) => {
          if (folder.id === id) {
            return { ...folder, name };
          }
          return folder;
        }),
      }));
    } catch (error) {
      console.error('Error updating folder name:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du nom du dossier.",
        variant: "destructive"
      });
    }
  },

  deleteFolder: async (id: string): Promise<void> => {
    try {
      // Delete locally (no Supabase for now)
      set((state: ChatState) => {
        // Update conversations that were in the deleted folder
        const updatedConversations = state.conversations.map((convo) => {
          if (convo.folderId === id) {
            return { ...convo, folderId: null };
          }
          return convo;
        });

        return {
          folders: state.folders.filter((f) => f.id !== id),
          conversations: updatedConversations,
        };
      });
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du dossier.",
        variant: "destructive"
      });
    }
  },
});
